import React from 'react';
import { chatFormattedDateTime } from '../common/helpers/chatFormattedDateTime';
import { Avatar } from '@mui/material';

const ListView = ({ roomsList, selectedRoom, usersList, handleSelected, setSelectedUserId, isUserOnlineRecently, }) => {

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="user-list max-h-60 overflow-y-auto">
      {roomsList.map(room => (
        <div key={room.id} onClick={() => handleSelected(room.id, "room", room.name)} className={`user-item ${selectedRoom === room.name ? 'active' : ''}`}>
          {room.name}
          {room.unread_messages_count > 0 && (
            <span className="badge">({room.unread_messages_count})</span>
          )}
        </div>
      ))}
      {usersList.map((user) => {
        const isOnlineRecently = isUserOnlineRecently(user.online, user.online_at);
        return (
          <div
            key={user.id}
            onClick={() => { handleSelected(user.id, "user", user.username); setSelectedUserId(user.id); }}
            className={`user-item ${selectedRoom === user.username ? "active" : ""}`}
          >
            <div className="user-name">
              <div class="nav-item d-flex align-items-center">
                {/* {user.username} */}

                <Avatar>{getInitials(user.username)}</Avatar>
                <span className="ms-2 user-name">{user.username}</span>

              </div>
            </div>

            {user.unread_messages_count > 0 && (
              <span className="badge">({user.unread_messages_count})</span>
            )}
            {!isOnlineRecently && user.online_at && (
              <div className="last-seen">
                Last seen: {chatFormattedDateTime(user.online_at)}
              </div>
            )}
            {user.is_typing ? (
              <div className="mx-1">Typing...</div>
            ) : (
              isOnlineRecently && <div className="set-online" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListView;
