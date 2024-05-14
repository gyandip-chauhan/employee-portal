class AttendanceLog < ApplicationRecord
  belongs_to :attendance, touch: true
  has_one :user, through: :attendance
  has_one :organization, through: :user

  default_scope { order(clock_in_time: :asc) }

  def format_time(time)
    hours = (time / 1.hour).to_i
    minutes = ((time % 1.hour) / 1.minute).to_i
    seconds = ((time % 1.minute) / 1.second).to_i
    "#{hours}h #{minutes}m #{seconds}s"
  end
end
