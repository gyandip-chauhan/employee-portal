# app/controllers/api/v1/messages_controller.rb
module Api::V1
  class MessagesController < ApplicationController
    before_action :find_room, only: [:index, :create]

    def index
      @messages = @room.messages.last(params[:item] || 20).map(&:serialize)
      reset_unread_count if params[:reset_unread]
      render json: { single_room: @room.serialize, messages: @messages }, status: :ok
    end

    def create
      @message = Message.new(message_params)
      if @message.save
        serialized_message = @message.serialize
        sender_id = @message.user_id
        sender_type = params[:msg_of] == 'room' ? 'room' : 'user'
        serialized_message[:sender_id] = sender_id
        serialized_message[:msg_of] = sender_type
    
        ActionCable.server.broadcast('MessagesChannel', serialized_message.merge(unread_count: @message.room.participants.sum(:unread_messages_count)))
        render json: @message, status: :created
      else
        render json: @message.errors, status: :unprocessable_entity
      end
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

    def message_params
      params.require(:message).permit(:content, :user_id, :room_id)
    end
  end
end
