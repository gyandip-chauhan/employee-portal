class CreateOrganizations < ActiveRecord::Migration[7.1]
  def change
    create_table :organizations do |t|
      t.string :name
      t.text :address
      t.string :business_phone
      t.string :country
      t.string :timezone
      t.time :shift_start_time
      t.time :shift_end_time

      t.timestamps
    end
  end
end
