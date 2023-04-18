import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContactsContext } from './ContactsProvider';
import { useSocket } from './SocketProvider';
import { UserContext } from "./UserContext";

export const ConversationsContext = createContext();

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContext(ContactsContext);
  const [user, setUser] = useContext(UserContext);
  const socket = useSocket();

  const user1_id = 1;
  const user2_id = 2;

  useEffect(() => {
    fetch(`/chats/${user1_id}/${user2_id}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data);
      })
      .catch(error => console.log(error));
  }, []);

  function createConversation(recipients) {
    fetch('/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipients })
    })
      .then(res => res.json())
      .then(data => {
        setConversations(prevConversations => {
          return [...prevConversations, data];
        })
      })
      .catch(error => console.log(error));
  }

  function arrayEquality(a, b) {
    if (a.length !== b.length) return false;

    a.sort();
    b.sort();

    return a.every((element, index) => {
      return element === b[index];
    })
  }

  const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
    setConversations(prevConversations => {
      let madeChange = false;
      const newMessage = { sender, text };
      const newConversations = prevConversations.map(conversation => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true;
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage]
          }
        }

        return conversation;
      })

      if (madeChange) {
        return newConversations;
      } else {
        return [
          ...prevConversations,
          { recipients, messages: [newMessage] }
        ]
      }
    });
  }, [setConversations]);

  useEffect(() => {
    if (socket == null) return;

    socket.on('receive-message', addMessageToConversation);

    return () => socket.off('receive-message');
  }, [socket, addMessageToConversation]);

  function sendMessage(recipients, text) {
    socket.emit('send-message', { recipients, text });

    addMessageToConversation({ recipients, text, sender: id });
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map(recipient => {
      const contact = contacts.find(contact => {
        return contact.id === recipient
      });
      const name = (contact && contact.name) || recipient;
      return { id: recipient, name };
    });

    const messages = conversation.messages.map(message => {
      const contact = contacts.find(contact => {
        return contact.id === message.sender
      });
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: name, fromMe };
    });
    
    const selected = index === selectedConversationIndex;
    return { ...conversation, messages, recipients, selected };
  });

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation
  }

  console.log(conversations)

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}

