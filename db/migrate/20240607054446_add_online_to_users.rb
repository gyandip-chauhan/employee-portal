class AddOnlineToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :online, :boolean, default: false
    add_column :users, :online_at, :datetime
  end
end
