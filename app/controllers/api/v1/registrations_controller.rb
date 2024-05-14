module Api::V1
  class RegistrationsController < ApplicationController
    def new
      @user = User.new
    end
    
    def create
      user = User.new(registration_params)
      if user.save
        login(user)
        render json: { notice: "Login Successfully.", user: }, status: :ok
      else
        render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end
    
    private

    def registration_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end
