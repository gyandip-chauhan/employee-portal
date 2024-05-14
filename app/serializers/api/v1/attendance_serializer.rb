module Api::V1
  class AttendanceSerializer < ApplicationSerializer
    attributes :id, :date, :gross_hours, :effective_hours, :arrival

    attribute :attendance_logs do |object, params|
      AttendanceLogSerializer.new(object.attendance_logs) if !params[:disable_attendance_logs]
    end

    attribute :shift_duration do |object|
      object.organization.shift_duration
    end
  end
end
