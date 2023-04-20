import React, { createContext, useEffect, useState } from 'react';

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([{ name: 'Bob', email: 'bob@example.com', phone: '555-555-5555' }])

  useEffect(() => {
    fetch('/contacts')
      .then(response => response.json())
      .then(data => {
        setContacts(data)
      })
      .catch(error => console.error(error));
  }, []);
  function createContact(name, email, phone) {
    fetch('/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, email, phone})
    })
    .then(response => response.json())
    .then(data => setContacts(prevContacts => [...prevContacts, data]))
    .catch(error => console.error(error))
  }


  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsProvider;
