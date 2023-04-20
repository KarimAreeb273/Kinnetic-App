import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Chat({ profile, user, currentUser, recipientUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);
  
    // Join the chat room with the current user and recipient user IDs
    const chatRoomId = createChatRoomId(user.id, profile.id);
    newSocket.emit('joinRoom', { roomId: chatRoomId });
  
    newSocket.on('newMessage', (message) => {
      console.log('Received new message:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });
  
    return () => {
      newSocket.disconnect();
    };
  }, [user, profile]);
  
  const createChatRoomId = (userId1, userId2) => {
    const smallerUserId = userId1 < userId2 ? userId1 : userId2;
    const largerUserId = userId1 < userId2 ? userId2 : userId1;
    return `${smallerUserId}_${largerUserId}`;
  };

  const handleNewMessage = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const chatRoomId = createChatRoomId(user.id, profile.id);
    const newMsg = {
      fromUser: user,
      toUser: profile.user,
      message: newMessage
    };
    socket.emit('sendMessage', {
      roomId: chatRoomId,
      ...newMsg
    });
    // setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  return (
    <div>
      <h2>Private Chat with {profile.name}</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.fromUser.username}: {message.message}
          </li>
        ))}
      </ul>
      <input type="text" value={newMessage} onChange={handleNewMessage} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Chat;
