import React, { useEffect, useRef } from 'react';
import { chatFormattedDateTime } from '../common/helpers/chatFormattedDateTime.jsx';
import { UserProvider } from '../contexts/UserContext';

const MessageListView = ({ isUserOnlineRecently, checkUserTyping, userStatus, selectedRoom, messagesList, }) => {
  const messageListRef = useRef(null);
  const { currentUser } = UserProvider();

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom()
  }, [messagesList]);

  return (
    <div className="message-board">
      <div className="chat-room-header">
        <div className="room-info">
          {isUserOnlineRecently(userStatus.online, userStatus.onlineAt) && <div className="online-status" />}
          <h5 className="mb-0 pl-5">{selectedRoom}</h5>
        </div>
        {checkUserTyping() && " Typing..."}
        {!isUserOnlineRecently(userStatus.online, userStatus.onlineAt) && userStatus.onlineAt && (
          <div className="last-seen">
            Last seen: {chatFormattedDateTime(userStatus.onlineAt)}
          </div>
        )}
      </div>
      <div className="message-list" ref={messageListRef}>
        {messagesList.length > 0 ? (
          <>
            {messagesList.map(message => (
              <div key={message.id} className={`message ${message.user_id === currentUser?.id ? 'sent' : 'received'}`}>
                <span className="message-username">{message.username}</span>
                <p className="message-content">{message.content}</p>
                <span className="sent-at-placeholder"></span>
                <span className={`date-at-hover ${message.user_id === currentUser?.id ? 'sent' : 'received'} `}>{chatFormattedDateTime(message.created_at)}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="empty-message">No messages yet. Start the conversation!</div>
        )}
      </div>
    </div>
  );
};

export default MessageListView;
