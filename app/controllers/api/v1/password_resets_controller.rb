module Api::V1
  class PasswordResetsController < ApplicationController
    before_action :set_user_by_token, only: [:edit, :update]
    
    def new
    end
    
    def create
      if (user = User.find_by(email: params[:email]))
        PasswordMailer.with(
          user: user,
          token: user.generate_token_for(:password_reset)
        ).password_reset.deliver_later
      end
      render json: { notice: "Check your email to reset your password."}, status: :ok
    end

    def edit
    end

    def update
      if @user.update(password_params)
        render json: { notice: "Your password has been reset successfully. Please login.", user: @user}, status: :ok
      else
        render json: { error: @user.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end

    private
    
    def set_user_by_token
      @user = User.find_by_token_for(:password_reset, params[:token])
      render json: { error: "Invalid token. please try again." }, status: :unprocessable_entity unless @user.present?
    end

    def password_params
      params.require(:user).permit(
      :password,
      :password_confirmation
      )
    end
  end
end
