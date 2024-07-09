module Api::V1
  class MessagesController < ApplicationController
    include ActiveUser
    before_action :find_room, only: [:index, :create]

    def index
      @messages = @room.messages.last(params[:item] || 20).map(&:serialize)
      reset_unread_count if params[:reset_unread]
      render json: { single_room: @room.serialize, messages: @messages, user: message_for}, status: :ok
    end

    def create
      @message = Message.new(message_params)
      if @message.save
        serialized_message = @message.serialize
        sender_id = @message.user_id
        sender_type = params[:msg_of] == 'room' ? 'room' : 'user'
        serialized_message[:sender_id] = sender_id
        serialized_message[:msg_of] = sender_type
        serialized_message[:msg_for] = Participant.other_user(current_user, @message.room_id)&.user_id || nil

        ActionCable.server.broadcast('MessagesChannel', { type: "new_message", data: serialized_message.merge(unread_count: @message.room.participants.sum(:unread_messages_count))
          })
        render json: @message, status: :created
      else
        render json: @message.errors, status: :unprocessable_entity
      end
    end

    def typing
      @participant = Participant.find_by(user_id: current_user.id, room_id: params[:room_id])
      @participant.update(is_typing: params[:is_typing])
      ActionCable.server.broadcast("MessagesChannel", { type: "typing", data: {room_id: params[:room_id], user_id: current_user.id, is_typing: params[:is_typing], 
       typing_for: Participant.other_user(current_user, params[:room_id])&.user.serialize}
    })
      head :ok
    end

    private

    def find_room
      if params[:msg_of] == "room"
        @room = Room.find(params[:id])
      elsif params[:msg_of] == "user"
        user = User.find(params[:id])
        room_name = get_name(user, current_user)
        @room = Room.find_by(name: room_name) || Room.create_private_room([user, current_user], room_name)
      end
    end

    def reset_unread_count
      participant = @room.participants.find_by(user_id: current_user.id)
      participant.update(unread_messages_count: 0) if participant
    end

    def get_name(user1, user2)
      users = [user1, user2].sort
      "private_#{users[0].id}_#{users[1].id}"
    end

    def message_for
      Participant.other_user(current_user.id, find_room)&.user
    end

    def message_params
      params.require(:message).permit(:content, :user_id, :room_id)
    end
  end
end
