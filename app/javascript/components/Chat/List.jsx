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
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [params, setParams] = useState({ item: 15 });
  const queryParams = () => new URLSearchParams(params).toString();

  useEffect(() => {
    const cable = ActionCable.createConsumer('/cable');
    const chatChannel = cable.subscriptions.create('MessagesChannel', {
      received: (data) => {
        const user = usersList.find((u) => data.user_id === u.id) || currentUser;
        const newMessage = { id: data.id, user_id: user.id, username: user.name, content: data.content };
        setMessagesList(list => [...list, newMessage]);
      }
    });
    return () => {
      chatChannel.unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.get();
      setUsersList(response.data.users);
      setRoomsList(response.data.rooms);
      setCurrentUser(response.data.current_user);
      setIsPrivate(response.data.room.is_private);
    } catch (error) {
      console.error("error:", error.message);
      toast.error(error);
    };
  };

  const fetchMessages = async () => {
    try {
      const response = await messagesApi.getMessages(queryParams());
      setMessagesList(response.data.messages);
      setRoomId(response.data.single_room.id);
    } catch (error) {
      const errorMessage = error.response?.data?.error || `${error}`;
      toast.error(errorMessage);
    };
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
    };
    setRoomField("");
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      await messagesApi.create({ message: { content: messageField, room_id: roomId, user_id: userData?.id }, is_private: isPrivate });
      setParams({ ...params, item: 15 });
      fetchMessages();
      setMessageField("");
    } catch (error) {
      const errorMessage = error.response?.data?.error || `${error}`;
      toast.error(errorMessage);
    };
  };

  const handleSelected = (id, msgFor, roomName) => {
    setSelectedRoom(roomName);
    setParams({ ...params, id: id, msg_of: msgFor, item: 15 });
  };

  useEffect(() => {
    if (params.id) {
      fetchMessages();
    }
  }, [params]);

  const ListView = () => (
    <div className="user-list">
      {roomsList.map(room => (
        <div key={room.id} onClick={() => handleSelected(room.id, "room", room.name)} className={`user-item ${selectedRoom === room.name ? 'active' : ''}`}>
          {room.name}
        </div>
      ))}
      {usersList.map(user => (
        <div key={user.id} onClick={() => handleSelected(user.id, "user", user.username)} className={`user-item ${selectedRoom === user.username ? 'active' : ''}`}>
          {user.username}
        </div>
      ))}
    </div>
  );

  const MessageListView = () => (
    <div className="message-board">
      <h3>{selectedRoom}</h3>
      <div className="message-list">
        {messagesList.length > 0 ? (<>
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
          <><MessageListView /><div className="message-input">
            <form onSubmit={handleSendMessage}>
              <input type="text" value={messageField} onChange={(e) => setMessageField(e.target.value)} placeholder="Type a message..." />
              <button type="submit" disabled={messageField === ''}>Send</button>
            </form>
          </div></>) : (<div className="message-board"><div className="default-view text-center">
                <h1>Welcome to ChatApp</h1>
                <p>Select a room to start chatting.</p>
              </div></div>)}
      </div>
    </div>
  );
};

export default List;
