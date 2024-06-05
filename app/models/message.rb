# app/models/message.rb
class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room

  after_create_commit :broadcast_message
  before_create :confirm_participant

  def serialize
    {
      id: id,
      user_id: user_id,
      username: user.username,
      room_id: room_id,
      content: content,
      created_at: created_at
    }
  end

  private

  def confirm_participant
    if room.present? && room.is_private
      is_participant = Participant.find_by(user_id: user_id, room_id: room_id)
      throw :abort unless is_participant
    end
  end

  def broadcast_message
    # ActionCable.server.broadcast('MessagesChannel', self.serialize.merge(unread_count: room.participants.sum(:unread_messages_count)))
    increment_unread_count
  end  

  def increment_unread_count
    room.participants.where.not(user_id: user_id).update_all("unread_messages_count = unread_messages_count + 1")
  end  
end
