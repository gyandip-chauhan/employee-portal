class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :password_digest
      t.integer :sign_in_count, default: 0
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string :current_sign_in_ip
      t.string :last_sign_in_ip
      t.datetime :discarded_at
      t.references :department, null: false, foreign_key: true
      t.string :personal_email
      t.date :date_of_birth
      t.string :phone
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, :discarded_at
  end
end
