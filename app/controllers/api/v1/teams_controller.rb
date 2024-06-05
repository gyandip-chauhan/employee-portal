module Api::V1
  class TeamsController < ApplicationController
    def index
      @departments = Department.includes(:team_memberships, :users).all
      render json: DepartmentSerializer.new(@departments)
    end

    def show
      @department = Department.find(params[:id])
      render json: DepartmentSerializer.new(@department)
    end
  end
end
