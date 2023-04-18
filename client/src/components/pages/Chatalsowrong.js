import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';


const socket = io.connect('http://localhost:4000');

function Chatalsowrong({receiverId, userId, recusername}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const inputRef = useRef(null);


  useEffect(() => {
    const username = userId;
    const recipient = recusername;
    const room = `${username}-${recipient}`;

    socket.emit('join', { username, room });

    socket.on('receive_message', data => {
      setMessages(messages => [...messages, data]);
    });

    socket.on('error_message', data => {
        alert(data.message);
      });

    return () => {
      socket.emit('leave', { username, room });
    };
  }, [userId, recusername]);

  const sendMessage = e => {
    e.preventDefault();
    const recipient = recusername;
    const sender = userId;
    const room = `${recipient}-${sender}`;

    if (recipient === sender) {
        alert('You cannot send a message to yourself.');
        return;
      }

    socket.emit('send_message', { message: text, recipient, sender });
    setMessages(messages => [...messages, { message: text, sender }]);
    setText('');
  };

  return (
    <div>
      <div>
        {messages.map((data, index) => (
          <div key={index}>
            {data.sender}: {data.message}
          </div>
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

export default Chatalsowrong;
