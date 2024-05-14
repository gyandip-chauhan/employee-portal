class Room < ApplicationRecord
  validates :name, presence: :true, uniqueness: true
  normalizes :name, with: -> name { name.titleize }
  has_many :messages, :dependent => :destroy
  
  scope :public_rooms, -> { where(is_private: false) }
  
  def self.create_private_room(users, room_name)
    single_room = Room.create(name: room_name, is_private: true)
    users.each do |user|
      Participant.create(user_id: user.id, room_id: single_room.id )
    end
    single_room
  end

  def serialize
    {
      id:,
      name:,
      is_private:,
      message: messages.last&.content || nil
    }
  end
end
