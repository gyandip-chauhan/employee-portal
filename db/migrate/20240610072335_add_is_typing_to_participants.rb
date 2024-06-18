class AddIsTypingToParticipants < ActiveRecord::Migration[7.1]
  def change
    add_column :participants, :is_typing, :boolean, default: false
  end
end
