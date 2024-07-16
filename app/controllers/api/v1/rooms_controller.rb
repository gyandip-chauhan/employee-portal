module Api::V1
  class RoomsController < ApplicationController
    include ActiveUser
    before_action :authenticate_user!
    
    def index
      room = Room.new
      rooms = Room.public_rooms.map{ |r| r.serialize }
      users = User.all_except(current_user)
      last_messages = users.map{|user| Room.where(name: get_name(user, current_user)).last&.messages&.last&.content}
      if @single_room.present?
        messages = single_room.messages
      else
        messages = current_user&.messages || []
      end
      render json: { current_user: , room: , rooms:, users: users.map.with_index{ |u,i| u.serialize.merge!(message: last_messages[i]) }, 
      messages: , last_messages:, notice: :success }, status: :ok
    end
    
    def create
      @room = Room.create(name: params["room"]["name"])
      if @room.valid?
        render json: { notice: "Room created success" }, status: :ok
      else
        render json: { error: @room.errors.messages }, unprocessable_entity: :ok
      end
    end
    
    def show
     single_room = Room.find(params[:id])
     rooms = Room.public_rooms
     users = User.all_except(current_user)
     room = Room.new
     message = Message.new
     messages = single_room.messages.map{|m| m.serialize }
      render json: { current_user: , single_room:, rooms:, users:, room:, message:, messages: }
    end
    private
  
    def get_name(user1, user2)
      users = [user1, user2].sort
      "private_#{users[0].id}_#{users[1].id}"
    end
  end
end
