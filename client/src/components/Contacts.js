import React, { useState, useContext } from 'react';
import { ContactsContext } from '../ContactsProvider'

const Contacts = () => {
    const { contacts = [] } = useContext(ContactsContext);
    const { createContact } = useContext(ContactsContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      createContact(name, email, phone);
      setName('');
      setEmail('');
      setPhone('');
    };
  
    return (
      <div>
        <h2>Contacts</h2>
        <ul>
          {contacts && contacts.map((contact) => (
            <li key={contact.id}>{contact.name}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <input type="text" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="text" placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <button type="submit">Add Contact</button>
        </form>
      </div>
    );
  };
  

export default Contacts;
