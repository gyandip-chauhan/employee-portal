class MessagesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "MessagesChannel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def typing(data)
    ActionCable.server.broadcast("typing_status_channel_#{data['room_id']}", typing: true, user: data['user'])
  end

  def stop_typing(data)
    ActionCable.server.broadcast("typing_status_channel_#{data['room_id']}", typing: false, user: data['user'])
  end
end
