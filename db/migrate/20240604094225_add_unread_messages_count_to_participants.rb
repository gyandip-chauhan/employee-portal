class AddUnreadMessagesCountToParticipants < ActiveRecord::Migration[7.1]
  def change
    add_column :participants, :unread_messages_count, :integer, default: 0
  end
end
