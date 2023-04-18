import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });
  }, []);

  const sendMessage = e => {
    e.preventDefault();
    socket.emit('message', text);
    setText('');
    inputRef.current.focus();
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          ref={inputRef}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
