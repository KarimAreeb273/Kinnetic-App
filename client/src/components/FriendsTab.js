import React, { useEffect, useState } from "react";
import { Modal, Button, Image, Header } from 'semantic-ui-react';
import Contacts from "./Contacts";
import "./FriendsTab.css";


const FriendsTab = () => {
  const [open, setOpen] = useState(false)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    fetch("/contacts").then((r) => {
      if (r.ok) {
        r.json().then((users) => setContacts(users));
      }
    });
  }, []);

  const name = contacts.map((cont) => cont.name);
  const key = contacts.map((cont) => cont.id);

  return (
    <>
    <Modal className = "modal"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button className='highlight-btn' content='Add Friend'/>}
    >
        <Modal.Content>
            <Modal.Description>
              <Contacts />
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
        <Button
            content="Close Window"
            labelPosition='right'
            icon='close'
            onClick={() => setOpen(false)}
            positive
        />
        </Modal.Actions>
    </Modal>
    <div>
      <h1 style={{ color:"black" }}>Friends Names:</h1>
      {contacts.length > 0 ? (
      <ul className="friends-list">
          {contacts && contacts.map((contact) => (
            <li style={{ color:"black" }} key={contact.id}>{contact.name}, </li>
          ))}
      </ul> ) : ( <h4 style={{ color:"black" }}>No Friends...</h4>)}
    </div>
    </>
);
};

export default FriendsTab;
