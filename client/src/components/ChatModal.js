import React from 'react';
import { Modal, Button, Image, Header } from 'semantic-ui-react';
import Chat from "./pages/Chat";
import OpenConversation from "./OpenConversation";
import "./ChatModal.css";
function ChatModal({ open, setOpen, id }) {
      

    return (
        <Modal className = "modal"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className='highlight-btn' content='Message'/>}
        >
            <Modal.Content>
                <Modal.Description>
                <Chat receiverId = {id}/>
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
    );
}

export default ChatModal;