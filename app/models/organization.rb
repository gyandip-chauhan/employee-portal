class Organization < ApplicationRecord
  has_many :deparments, dependent: :destroy
  has_many :users, dependent: :destroy

  def shift_duration
    return 0 if shift_start_time.blank? || shift_end_time.blank?
  
    start_time = Time.parse(shift_start_time.strftime("%H:%M:%S"))
    end_time = Time.parse(shift_end_time.strftime("%H:%M:%S"))
  
    end_time - start_time
  end  
end
