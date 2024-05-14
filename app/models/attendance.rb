class Attendance < ApplicationRecord
  belongs_to :user
  has_one :organization, through: :user
  has_many :attendance_logs, dependent: :destroy

  validates :date, uniqueness: { scope: :user_id, message: "Attendance already exists for this date" }

  after_create :build_attendance_log
  after_touch :calculate_metrics

  default_scope { order(date: :desc) }

  private

  def build_attendance_log
    attendance_logs.create!(clock_in_time: Time.now)
  end

  def calculate_metrics
    logs = attendance_logs.where.not(clock_out_time: nil).order(:clock_in_time)
    return unless logs.present?

    first_log_in = logs.first.clock_in_time
    last_log_out = logs.last.clock_out_time

    self.gross_hours = format_time(last_log_out - first_log_in)

    effective_logs_duration = logs.sum { |log| log.clock_out_time - log.clock_in_time }
    self.effective_hours = format_time(effective_logs_duration)

    shift_start_time = Time.parse(organization.shift_start_time.strftime("%H:%M:%S"))
    first_log_in_time = Time.parse(first_log_in.strftime("%H:%M:%S"))
  
    if first_log_in_time > shift_start_time
      late_duration = first_log_in_time - shift_start_time
      self.arrival = "#{format_time2(late_duration)} Late"
    else
      self.arrival = 'On Time'
    end

    save!
  end

  def format_time(time)
    hours = (time / 1.hour).to_i
    minutes = ((time % 1.hour) / 1.minute).to_i
    seconds = ((time % 1.minute) / 1.second).to_i
    "#{hours}h #{minutes}m #{seconds}s"
  end

  def format_time2(time)
    hours = (time / 1.hour).to_i
    minutes = ((time % 1.hour) / 1.minute).to_i
    seconds = ((time % 1.minute) / 1.second).to_i
    "#{hours}:#{minutes}:#{seconds}"
  end
end
