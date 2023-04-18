import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from "../UserContext";

const socket = io.connect('http://localhost:4000');

const OpenConversations = ({ id }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState([]);
  const [user] = useContext(UserContext);

  useEffect(() => {
    fetch(`/profiles/${id}`)
      .then((r) => r.json())
      .then(prof => setProfile(prof))
  }, []);

  const roomName = `${user.username}_${profile.username}_room`;

  useEffect(() => {
    socket.emit('join-room', roomName);
    socket.on('receive-message', (data) => {
        const sender = data.sender;
        const text = data.text;
      
        if (data.recipients.includes(user.username)) {
          setChats((chats) => [...chats, { sender: sender, text: text }]);
        }
      });
    return () => {
      socket.emit('leave-room', roomName);
    };
  }, [roomName, user.username]);

  const sendMessage = () => {
    const roomName = `${user.username}_${profile.username}_room`;
    socket.emit('send-message', { roomName, text: message });
    setChats([...chats, { sender: 'me', text: message }]);
    setMessage('');
  };
  
  
  return (
    <div>
      <h2>Conversation</h2>
      <div>
        {chats.map((chat, index) => (
          <p key={index}>
            {chat.sender}: {chat.text}
          </p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default OpenConversations;
