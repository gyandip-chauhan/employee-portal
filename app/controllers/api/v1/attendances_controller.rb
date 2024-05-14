module Api::V1
  class AttendancesController < ApplicationController
    before_action :authenticate_user!
  
    def index
      @attendances = current_user.attendances.includes(:attendance_logs).order("date DESC")
      render json: { attendances: AttendanceSerializer.new(@attendances), today_attendance: @attendances.where(date: Date.today)&.first, remote_attendance_log: @attendances.where(date: Date.today)&.first&.attendance_logs&.last, notice: 'Attendances retrieved successfully' }
    end
  
    def create
      @attendance = current_user.attendances.includes(:attendance_logs).find_or_create_by!(date: Date.today)
      @attendance_log = @attendance.attendance_logs.new(clock_in_time: Time.now)
      if @attendance_log.save
        render json: { attendance: @attendance, attendance_log: @attendance_log, notice: 'Clock-in successful' }, status: :created
      else
        render json: { error: @attendance_log.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end
  
    def update
      @attendance_log = AttendanceLog.includes(:attendance).find(params[:attendance_log_id])
      if @attendance_log.update(clock_out_time: Time.now)
        render json: { attendance: @attendance_log.attendance, attendance_log: @attendance_log, notice: 'Clock-out successful' }
      else
        render json: { error: @attendance_log.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end
  end
end
