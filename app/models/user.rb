class User < ApplicationRecord
  rolify
  has_secure_password
  
  belongs_to :department
  belongs_to :organization
  has_many :attendances, dependent: :destroy
  has_many :attendance_logs, through: :attendances
  has_many :messages, dependent: :destroy
  has_many :participants, dependent: :destroy
  has_many :rooms, through: :participants
  has_many :team_memberships, dependent: :destroy

  validates :email, presence: true
  normalizes :email, with: -> email { email.downcase.strip }
  
  scope :all_except, ->(user) { where.not(id: user) }

  generates_token_for :password_reset, expires_in: 15.minutes do
    password_salt&.last(10)
  end
  
  generates_token_for :email_confirmation, expires_in: 24.hours do
    email
  end

  def username
    return full_name#self.email.split('@').first.titleize
  end

  def name
    username
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def job_title
    roles.pluck(:name).join(', ')
  end

  def department_name
    department.name
  end

  def serialize
    { id:,
      name: full_name,
      username:,
      message: messages&.last&.content || nil,
      unread_messages_count: participants.sum(:unread_messages_count)
    }
  end
end
