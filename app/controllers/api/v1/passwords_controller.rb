module Api::V1
  class PasswordsController < ApplicationController
    before_action :authenticate_user!
    
    def edit
    end

    def update
      if current_user.update(password_params)
        render json: { notice: "Your password has been updated successfully.", user: current_user }, status: :ok
      else
        render json: { error: current_user.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end
    
    private
    
    def password_params
      params.require(:user).permit(
      :password,
      :password_confirmation,
      :password_challenge
      ).with_defaults(password_challenge: "")
    end
  end
end
