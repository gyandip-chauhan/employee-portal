module Api::V1
  class AttendanceLogSerializer < ApplicationSerializer
    attributes :id, :clock_in_time, :clock_out_time, :attendance_id
  end
end