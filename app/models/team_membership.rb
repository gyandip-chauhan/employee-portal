class TeamMembership < ApplicationRecord
  belongs_to :user
  belongs_to :department

  enum role: { member: 0, team_lead: 1 }

  validates :role, presence: true
end
