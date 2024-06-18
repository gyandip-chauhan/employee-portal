module Api::V1
  class SessionsController < ApplicationController
    def new
    end

    def create
      return render json: { error: "Please fill up email and password."}, status: :unprocessable_entity unless (params[:email] && params[:password]).present?
      if user = User.authenticate_by(email: params[:email], password: params[:password])
        login user
        # user.update_column(:online, true)
        render json: { notice: "You have signed successfully.", user: }, status: :ok
      else
        render json: { error: user ? user.errors.full_messages.join(", ") : 'User not found.' }, status: :unprocessable_entity
      end
    end

    def destroy
      current_user.update_column(:online, false)
      logout current_user
      render json: { notice: "You have been logged out." }, status: :ok
    end
  end
end
