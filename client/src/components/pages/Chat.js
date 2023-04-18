import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io.connect('http://localhost:4000');
    newSocket.on('connect', () => {
      newSocket.emit('join-room', receiverId);
    });
    newSocket.on('receive_message', ({ message, sender_id }) => {
      setMessages(prevMessages => [...prevMessages, { message, sender_id }]);
    });
    setSocket(newSocket);
  }, [receiverId]);
  
  function handleSendMessage () {
    socket.emit('send_message', { message, receiver_id: receiverId });
    setMessages(prevMessages => [...prevMessages, { message, sender_id: 'me' }]);
    setMessage('');
  }
  

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.sender_id}: {msg.message}</div>
        ))}
      </div>
      <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
