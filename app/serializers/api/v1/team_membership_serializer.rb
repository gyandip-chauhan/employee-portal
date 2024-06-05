module Api::V1
  class TeamMembershipSerializer < ApplicationSerializer
    include FastJsonapi::ObjectSerializer

    attributes :user_id, :department_id, :role
  end
end