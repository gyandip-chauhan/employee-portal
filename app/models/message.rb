class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room

  after_create_commit { broadcast_message }
  before_create :confirm_participant
  
  def serialize
    {
      id:,
      user_id:,
      username: user.username,
      room_id:,
      content: 
    }
  end
  
  private
  
  def confirm_participant
    if room.present? && room.is_private
      is_participant = Participant.where(user_id: user_id, room_id: room_id).first
      throw :abort unless is_participant
    end
  end

  def broadcast_message
    ActionCable.server.broadcast('MessagesChannel', self.serialize)
  end
end
