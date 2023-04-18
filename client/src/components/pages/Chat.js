import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Chat({ user, currentUser, recipientUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);
  
    // Join the chat room with the current user and recipient user IDs
    const chatRoomId = createChatRoomId(currentUser, recipientUser);
    newSocket.emit('joinRoom', { roomId: chatRoomId });
  
    // Listen for new messages in the chat room
    newSocket.on('newMessage', (message) => {
      console.log('Received new message:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });
  
    // Clean up the effect by disconnecting from the Socket.IO server
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, recipientUser]);
  
  const createChatRoomId = (userId1, userId2) => {
    const smallerUserId = userId1 < userId2 ? userId1 : userId2;
    const largerUserId = userId1 < userId2 ? userId2 : userId1;
    return `${smallerUserId}_${largerUserId}`;
  };

  const handleNewMessage = (event) => {
    setNewMessage(event.target.value);
  };

  console.log(newMessage, messages);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const chatRoomId = createChatRoomId(currentUser, recipientUser);
    console.log(chatRoomId);
    const newMsg = {
      fromUser: currentUser,
      toUser: recipientUser,
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
      <h2>Private Chat with {recipientUser}</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.fromUser}: {message.message}
          </li>
        ))}
      </ul>
      <input type="text" value={newMessage} onChange={handleNewMessage} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Chat;
