import { useContext } from "react";
import { Modal, Button, Image, Header } from 'semantic-ui-react';
import GlobalChat from "./pages/GlobalChat";
import Chat from "./pages/Chat";
import OpenConversation from "./OpenConversation";
import { UserContext } from "../UserContext";
import "./ChatModal.css";
function ChatModal({ recusername, open, setOpen, id }) {

    const [user, setUser] = useContext(UserContext);

    const userId = user.id;
    return (
        <Modal className = "modal"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className='highlight-btn' content='Message'/>}
        >
            <Modal.Content>
                <Modal.Description>
                <Chat user = {user} recipientUser = {id} currentUser = {userId} recusername = {recusername}/>
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