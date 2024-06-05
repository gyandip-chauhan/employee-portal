module Api::V1
  class DepartmentSerializer < ApplicationSerializer
    attributes :id, :name

    attribute :team_leads do |department|
      UserSerializer.new(department.team_leads).serializable_hash[:data]
    end
  
    attribute :team_members do |department|
      UserSerializer.new(department.team_members).serializable_hash[:data]
    end
  
    attribute :who_is_off_today do |department|
      UserSerializer.new(department.who_is_off_today).serializable_hash[:data]
    end
  
    attribute :late_arrivals_today do |department|
      UserSerializer.new(department.late_arrivals_today).serializable_hash[:data]
    end
  
    attribute :employees_on_time_today do |department|
      UserSerializer.new(department.employees_on_time_today).serializable_hash[:data]
    end
  end
end
