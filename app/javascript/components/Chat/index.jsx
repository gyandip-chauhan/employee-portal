import React, { useEffect, useRef, useState } from 'react';
import roomsApi from '../common/apis/roomsApi';
import messagesApi from '../common/apis/messagesApi';
import ActionCable from 'actioncable';
import { toast } from 'react-toastify';
import ListView from './ListView';
import MessageListView from './MessageListView';
import { UserProvider } from '../contexts/UserContext';

const Chat = () => {
  const [roomField, setRoomField] = useState("");
  const [messageField, setMessageField] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [params, setParams] = useState({ item: 15 });
  const [userStatus, setUserStatus] = useState({ online: false, onlineAt: null })
  const [selectedUser, setSelectedUser] = useState({ user: 0, for: 0, typing: false })
  const [selectedUserId, setSelectedUserId] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [broadcast, setBroadcast] = useState({})
  const [msgCount, setMsgCount] = useState(0)

  const typingTimeoutRef = useRef(null);
  const queryParams = () => new URLSearchParams(params).toString();
  const { currentUser } = UserProvider();

  useEffect(() => {
    const initializeChat = async () => {
      await fetchRooms();
      setupWebSocket();
    };

    initializeChat();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.get();
      setUsersList(response.data.users.map(user => ({ ...user, unread_messages_count: user.unread_messages_count || 0 })));
      setRoomsList(response.data.rooms.map(room => ({ ...room, unread_messages_count: room.unread_messages_count || 0 })));
    } catch (error) {
      const errorMessage = error.response?.data?.error || `${error}`;
      toast.error(errorMessage);
    }
  };

  const setupWebSocket = () => {
    const cable = ActionCable.createConsumer('/cable');
    const chatChannel = cable.subscriptions.create('MessagesChannel', {
      received: (response) => {
        setBroadcast(response)
      }
    });

    return () => {
      if (chatChannel) {
        chatChannel.unsubscribe();
      }
    };
  };

  useEffect(() => {
    broadCastedMessage(broadcast.type, broadcast.data)
  }, [broadcast]);

  const broadCastedMessage = (type, data) => {
    switch (type) {
      case "new_message": {
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
        setRoomsList(updatedRoomsList);

        if (data.room_id === selectedRoomId && data.content) {
          setMessagesList(list => [...list, newMessage]);
        }

        if (data.msg_for === selectedRoomId) {
          toast.info('You have new messages');
        }
        break;
      }

      case "update_status":
        setUsersList(prevUsersList => prevUsersList.map(user =>
          user.id === data.user_id ? { ...user, online: data.online, online_at: data.online_at } : user
        ));
        break;

      case "typing":
        if (currentUser && data.typing_for && currentUser.id === data.typing_for.id) {
          setSelectedUser({ user: data.user_id, for: data.typing_for.id, typing: data.is_typing });
        }
        setUsersList(prevUsersList => prevUsersList.map(user =>
          user.id === data.user_id && data.typing_for.id === currentUser.id
            ? { ...user, is_typing: data.is_typing }
            : user
        ));
        break;

      default:
        break;
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await messagesApi.getMessages(queryParams());
      setMessagesList(response.data.messages);
      setUserStatus({ online: response.data.user.online, onlineAt: response.data.user.online_at });
      setSelectedRoomId(response.data.single_room.id);
      setMsgCount(response.data.count)

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
  const handleTyping = (isUserTyping) => {
    currentUser && messagesApi.typing({ room_id: selectedRoomId, is_typing: isUserTyping })
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
      await messagesApi.create({ message: { content: messageField, room_id: selectedRoomId, user_id: currentUser?.id }, is_private: isPrivate });
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
    setSelectedRoomId(id);
    setParams({ ...params, id: id, msg_of: msgFor, item: 15, reset_unread: true });
    setSelectedRoom(roomName);
  };

  useEffect(() => {
    if (params.id) {
      fetchMessages();
    }
  }, [params]);

  const isUserOnlineRecently = (online, at) => {
    if (!online || !at) return false

    const diffInMinutes = Math.round((new Date() - new Date(at)) / 60000);
    const diffInSeconds = Math.round((new Date() - new Date(at)) / 1000);

    return diffInMinutes <= 1;
  }

  const checkUserTyping = () => {
    return selectedUser.user === selectedUserId &&
      selectedUser.for === currentUser?.id &&
      selectedUser.typing;
  };

  const handleTypingStatus = (status) => {
    setIsTyping(status);
  };

  const handleKeyDown = () => {
    handleTypingStatus(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStatus(false);
    }, 2000);
  };

  const handleBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    handleTypingStatus(false);
  };

  useEffect(() => {
    handleTyping(isTyping)
  }, [isTyping])


  useEffect(() => {
    setMessageField("")
  }, [selectedRoomId])

  return (
    <main className="d-flex flex-column flex-grow-1">
      <div className="container-fluid my-3">
        <div className="chat-page">
          <div className="sidebar">
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
              <ListView
                roomsList={roomsList}
                selectedRoom={selectedRoom}
                usersList={usersList}
                handleSelected={handleSelected}
                setSelectedUserId={setSelectedUserId}
                isUserOnlineRecently={isUserOnlineRecently}
              />
            </div>
          </div>

          <div className="main-content">
            {selectedRoom ? (
              <>
                <MessageListView
                  isUserOnlineRecently={isUserOnlineRecently}
                  checkUserTyping={checkUserTyping}
                  userStatus={userStatus}
                  selectedRoom={selectedRoom}
                  messagesList={messagesList}
                  setParams={setParams}
                  params={params}
                  msgCount={msgCount}
                />
                <div className="message-input">
                  <form onSubmit={handleSendMessage}>
                    <input type="text"
                      value={messageField}
                      onChange={(e) => setMessageField(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                      placeholder="Type a message..."
                      rows="3"
                    />
                    <button type="submit" disabled={messageField.trim() === ''}>Send</button>
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
      </div>
    </main>
  );
};

export default Chat;
