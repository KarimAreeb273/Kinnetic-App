import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chatwrong = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io.connect('http://localhost:4000');

    // Join the room for the current user
    newSocket.emit('join-room', receiverId);

    // Set up event listener for incoming messages
    newSocket.on('receive_message', ({ message, sender_id }) => {
      setMessages(prevMessages => [...prevMessages, { message, sender_id }]);
    });

    // Save the socket to state
    setSocket(newSocket);

    // Clean up function to disconnect socket on unmount
    return () => {
      if (socket) {
        socket.emit('leave-room', receiverId);
        socket.disconnect();
      }
    };
  }, [receiverId, socket]);

  function handleSendMessage() {
    // Send message to server
    socket.emit('send_message', { message, receiver_id: receiverId });

    // Add message to local state
    setMessages(prevMessages => [...prevMessages, { message, sender_id: 'me' }]);

    // Clear message input
    setMessage('');
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.sender_id}: {msg.message}
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chatwrong;
