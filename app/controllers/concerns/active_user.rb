# frozen_string_literal: true

module ActiveUser
  extend ActiveSupport::Concern

  included do
    before_action :activate_user_status
  end

  private
    # to make user online with dateTime, so that we can show user online till certeain period of time even if he gets unavailaable
    def activate_user_status
      email = request.headers["X-Auth-Email"].presence
      user = User.find_by_email(email)
      if user
        user.update_columns(online: true, online_at: DateTime.now ) 
        msg = { user_id: user.id, online: user.online, online_at: user.online_at}
        ActionCable.server.broadcast( "MessagesChannel", { type: "update_status", data: msg}) if user.online_at > ENV['ONLINE_TIME'].to_i.seconds.ago
      end
    end
end
