class CreateDepartments < ActiveRecord::Migration[7.1]
  def change
    create_table :departments do |t|
      t.string :name
      t.references :organization, null: false, foreign_key: true
      t.datetime :discarded_at

      t.timestamps
    end
    add_index :departments, :discarded_at
  end
end
