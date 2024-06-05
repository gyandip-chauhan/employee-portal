import React, { useEffect, useState } from 'react';
import roomsApi from '../common/apis/roomsApi';
import messagesApi from '../common/apis/messagesApi';
import ActionCable from 'actioncable';
import { toast } from 'react-toastify';

const List = ({ userData }) => {
  const [roomField, setRoomField] = useState("");
  const [messageField, setMessageField] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [params, setParams] = useState({ item: 15 });
  const queryParams = () => new URLSearchParams(params).toString();

  useEffect(() => {
    const cable = ActionCable.createConsumer('/cable');
    const chatChannel = cable.subscriptions.create('MessagesChannel', {
      received: (data) => {
        const senderName = data.msg_of === 'room' ? roomsList.find(room => room.id === data.sender_id)?.name : usersList.find(user => user.id === data.sender_id)?.username;
        const newMessage = { 
          id: data.id, 
          user_id: data.sender_id, 
          username: senderName, 
          content: data.content, 
          room_id: data.room_id 
        };
      
        const updatedRoomsList = roomsList.map(room => {
          if (room.id === data.room_id) {
            return { ...room, unread_messages_count: data.unread_count };
          }
          return room;
        });
      
        const updatedUsersList = usersList.map(user => {
          if (user.id === data.sender_id) {
            return { ...user, unread_messages_count: data.unread_count };
          }
          return user;
        });
      
        // Update UI with new message and unread count
        setRoomsList(updatedRoomsList);
        setUsersList(updatedUsersList);
      
        if (data.room_id === selectedRoomId) {
          setMessagesList(list => [...list, newMessage]);
        } else {
          // Increment unread count in the chat list
          toast.info('You have new messages');
        }
      }      
    });
    return () => {
      chatChannel.unsubscribe();
    };
  }, [selectedRoomId, roomsList]);
  

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.get();
      setUsersList(response.data.users.map(user => ({ ...user, unread_messages_count: user.unread_messages_count || 0 })));
      setRoomsList(response.data.rooms.map(room => ({ ...room, unread_messages_count: room.unread_messages_count || 0 })));
      setCurrentUser(response.data.current_user);
    } catch (error) {
      console.error("error:", error.message);
      toast.error(error.message);
    }
  };  

  const fetchMessages = async () => {
    try {
      const response = await messagesApi.getMessages(queryParams());
      setMessagesList(response.data.messages);
      setSelectedRoomId(response.data.single_room.id);

      // Reset unread count
      setRoomsList(roomsList.map(room => {
        if (room.id === response.data.single_room.id) {
          return { ...room, unread_messages_count: 0 };
        }
        return room;
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.error || `${error}`;
      toast.error(errorMessage);
    }
  };

  const handleRoomCreate = async (event) => {
    event.preventDefault();
    try {
      const response = await roomsApi.create({ room: { name: roomField } });
      fetchRooms();
      toast.success(response.data.notice);
    } catch (error) {
      const errorMessage = error.response?.data?.error || `${error}`;
      toast.error(errorMessage);
    }
    setRoomField("");
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      await messagesApi.create({ message: { content: messageField, room_id: selectedRoomId, user_id: userData?.id }, is_private: isPrivate });
      setParams({ ...params, item: 15, reset_unread: true }); // Reset unread count
      fetchMessages();
  
      // Update unread count in UI
      setRoomsList(roomsList.map(room => {
        if (room.id === selectedRoomId) {
          return { ...room, unread_messages_count: 0 };
        }
        return room;
      }));
      setUsersList(usersList.map(user => {
        if (user.id === selectedRoomId) {
          return { ...user, unread_messages_count: 0 };
        }
        return user;
      }));
      setMessageField("");
    } catch (error) {
      const errorMessage = error.response?.data?.error || `${error}`;
      toast.error(errorMessage);
    }
  };  

  const handleSelected = (id, msgFor, roomName) => {
    setSelectedRoom(roomName);
    setSelectedRoomId(id);
    setParams({ ...params, id: id, msg_of: msgFor, item: 15, reset_unread: true });
  };  

  useEffect(() => {
    if (params.id) {
      fetchMessages();
    }
  }, [params]);

  const ListView = () => (
    <div className="user-list max-h-60 overflow-y-auto">
      {roomsList.map(room => (
        <div key={room.id} onClick={() => handleSelected(room.id, "room", room.name)} className={`user-item ${selectedRoom === room.name ? 'active' : ''}`}>
          {room.name} 
          {room.unread_messages_count > 0 && (
            <span className="badge">({room.unread_messages_count})</span>
          )}
        </div>
      ))}
      {usersList.map(user => (
        <div key={user.id} onClick={() => handleSelected(user.id, "user", user.username)} className={`user-item ${selectedRoom === user.username ? 'active' : ''}`}>
          {user.username}
          {user.unread_messages_count > 0 && (
            <span className="badge">({user.unread_messages_count})</span>
          )}
        </div>
      ))}
    </div>
  );    

  const MessageListView = () => (
    <div className="message-board">
      <h3>{selectedRoom}</h3>
      <div className="message-list">
        {messagesList.length > 0 ? (
          <>
            {messagesList.map(message => (
              <div key={message.id} className={`message ${message.user_id === userData?.id ? 'sent' : 'received'}`}>
                <span className="message-username">{message.username}</span>
                <p className="message-content">{message.content}</p>
              </div>
            ))}
          </>
        ) : (
          <div className="empty-message">No messages yet. Start the conversation!</div>
        )}
      </div>
    </div>
  );  

  return (
    <div className="chat-page">
      <div className="sidebar" style={{ backgroundColor: '#128C7E', color: '#FFFFFF' }}>
        <div className="sidebar-header p-3">
          <h1>Chat</h1>
          <form onSubmit={handleRoomCreate}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={roomField}
                onChange={(e) => setRoomField(e.target.value)}
                placeholder="Create a room"
              />
              <button type="submit" className="btn btn-light">Create</button>
            </div>
          </form>
        </div>
        <div className="sidebar-body">
          <ListView />
        </div>
      </div>

      <div className="main-content">
        {selectedRoom ? (
          <>
            <MessageListView />
            <div className="message-input">
              <form onSubmit={handleSendMessage}>
                <input type="text" value={messageField} onChange={(e) => setMessageField(e.target.value)} placeholder="Type a message..." />
                <button type="submit" disabled={messageField === ''}>Send</button>
              </form>
            </div>
          </>
        ) : (
          <div className="message-board">
            <div className="default-view text-center">
              <h1>Welcome to ChatApp</h1>
              <p>Select a room to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
