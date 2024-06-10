class PasswordMailer < ApplicationMailer
  def password_reset
    mail to: params[:user].email
  end

  def set_password
    mail to: params[:user].email
  end
end
