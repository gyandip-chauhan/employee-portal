module Api::V1
  class UserSerializer < ApplicationSerializer
    include FastJsonapi::ObjectSerializer

    attributes :id, :first_name, :last_name, :email, :department_id

    attribute :full_name do |user|
      user.full_name
    end

    attribute :job_title do |user|
      user.job_title
    end

    attribute :department_name do |user|
      user.department_name
    end

    attributes :today_clock_in_time do |user|
      attendance = user.attendances.find_by(date: Date.today)
      attendance.attendance_logs.first.clock_in_time if attendance
    end
  end
end
