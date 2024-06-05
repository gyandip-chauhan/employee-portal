class Department < ApplicationRecord
  belongs_to :organization
  has_many :users
  has_many :attendances, through: :users
  has_many :team_memberships, dependent: :destroy

  def team_leads
    users.joins(:team_memberships).where(team_memberships: { role: :team_lead })
  end

  def team_members
    users.joins(:team_memberships).where(team_memberships: { role: :member })
  end

  # Users who are off today (no attendance record for today)
  def who_is_off_today
    user_ids_with_attendance_today = attendances.where(date: Date.today).pluck(:user_id)
    users.where.not(id: user_ids_with_attendance_today)
  end

  # Users who arrived late today (clock_in_time > shift_start_time)
  def late_arrivals_today
    users.joins(attendances: :attendance_logs)
        .where(attendances: { date: Date.today })
        .where('attendance_logs.clock_in_time > ?', organization.shift_start_time)
        .distinct
  end

  # Users who arrived on time today (clock_in_time <= shift_start_time)
  def employees_on_time_today
    users.joins(attendances: :attendance_logs)
        .where(attendances: { date: Date.today })
        .where('attendance_logs.clock_in_time <= ?', organization.shift_start_time)
        .distinct
  end
end
