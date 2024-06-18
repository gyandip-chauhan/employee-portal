class Participant < ApplicationRecord
  belongs_to :user
  belongs_to :room
  # New field for keeping track of unread messages count
  attribute :unread_messages_count, :integer, default: 0
  scope :other_user, ->(user_id, room_id) { where(room_id: ).where.not(user_id:).last }

end
