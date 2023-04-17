import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Chat ({ open, setOpen }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socket = io.connect('http://localhost:4000');

  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    socket.emit('chat message', inputValue);
    setInputValue('');
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
