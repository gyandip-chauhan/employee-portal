class User < ApplicationRecord
  rolify
  has_secure_password
  
  belongs_to :department
  belongs_to :organization
  has_many :attendances, dependent: :destroy
  has_many :messages, dependent: :destroy

  validates :email, presence: true
  normalizes :email, with: -> email { email.downcase.strip }
  
  scope :all_except, ->(user) { where.not(id: user) }

  generates_token_for :password_reset, expires_in: 15.minutes do
    password_salt&.last(10)
  end
  
  generates_token_for :email_confirmation, expires_in: 24.hours do
    email
  end

  before_validation :assign_default_values

  def username
    return self.email.split('@').first.titleize
  end

  def name
    username
  end

  def serialize
    { id:,
      name:,
      username:,
      message: messages&.last&.content || nil
    }
  end 

  private

  def assign_default_values
    organization_id = self.organization_id
    unless organization_id
      organization_id = Organization.find_by(name: 'Atharva System')&.id
      self.organization_id = organization_id
    end
    self.department_id = Department.find_by(name: 'Unassigned', organization_id: organization_id)&.id
  end
end
