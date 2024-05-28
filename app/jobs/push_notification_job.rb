class PushNotificationJob < ApplicationJob
  queue_as :default

  def perform
    # devices = Device.where(receive_notifications: true)
    # devices.each do |device|
    #   send_notification(device.token)
    # end
    send_notification
  end

  private

  def send_notification(token = '6c267f26b173cd9595ae2f6702b1ab560371a60e7c8a9e27419bd0fa4a42e58f')
    connection = Apnotic::Connection.new(
      auth_method: :token,
      cert_path: Rails.root.join("config", "certs", "ios", "apns.p8"),
      key_id: "",
      team_id: "",
      url: Rails.env.development? ? "https://api.sandbox.push.apple.com:443" : "https://api.push.apple.com:443"
    )

    notification = Apnotic::Notification.new(token)
    notification.alert = { body: "Test Notification", title: "Alert TEST!!!!" }
    notification.custom_payload = { url: "?buttonPulse=true" }
    notification.sound = "default"
    notification.priority = '10'
    notification.expiration = Time.now.to_i + 2.days.to_i
    notification.topic = "co.flowmd.flowmd"

    response = connection.push(notification)
    
    if response.ok?
      Rails.logger.info "Sent successfully: #{response.body}"
    else
      Rails.logger.error "Error sending notification: #{response.status} - #{response.body}"
    end

  rescue => e
    Rails.logger.error "Exception sending notification: #{e.message}"
  end
end
