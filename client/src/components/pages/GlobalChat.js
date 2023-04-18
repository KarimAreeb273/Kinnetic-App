import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from "../../UserContext";

const socket = io.connect('http://localhost:4000');

function GlobalChat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useContext(UserContext);
  
    useEffect(() => {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }, []);
  
    const handleSendMessage = (event) => {
      event.preventDefault();
      socket.emit('message', message);
      setMessage('');
    };
  
    return (
      <div>
        <div>
          {messages.map((message, index) => (
            <div key={index}>{user.username}: {message}</div>
          ))}
        </div>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }

export default GlobalChat;
