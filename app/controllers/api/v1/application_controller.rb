module Api::V1
  class ApplicationController < ActionController::Base
  private
    def authenticate_user!
      render json: { error: "You must be logged in to do that." }, status: :unprocessable_entity unless user_signed_in?
    end
    
    def current_user
      Current.user ||= authenticate_user_from_session
    end
    helper_method :current_user

    def authenticate_user_from_session
      User.find_by(id: session[:user_id])
    end

    def user_signed_in?
      current_user.present?
    end
    helper_method :user_signed_in?

    def login(user)
      Current.user = user
      reset_session
      session[:user_id] = user.id
    end

    def logout(user)
      Current.user = nil
      reset_session
    end
  end
end
