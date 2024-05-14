class CreateAttendances < ActiveRecord::Migration[7.1]
  def change
    create_table :attendances do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.string :gross_hours
      t.string :effective_hours
      t.string :arrival

      t.timestamps
    end

    create_table :attendance_logs do |t|
      t.references :attendance, null: false, foreign_key: true
      t.time :clock_in_time
      t.time :clock_out_time

      t.timestamps
    end
  end
end
