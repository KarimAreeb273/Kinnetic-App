import React from 'react';
import { Modal, Button, Image, Header } from 'semantic-ui-react';
import SearchBar from "./SearchBar";
import { SearchResultsList } from "./SearchResultsList";

function ModalPopup({ open, setOpen, results, setResults }) {

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className='highlight-btn' content='Search' icon='video play' />}
        >
            {/* <Modal.Header>
                <Image size='small' src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_Logo.svg/2560px-UFC_Logo.svg.png' wrapped />
                <Header>{name}</Header>
            </Modal.Header> */}
            <Modal.Content>
                <Modal.Description>
                    <Header>HIGHLIGHT REEL</Header>
                    <SearchBar setResults={setResults} />
                    {results && results.length > 0 && <SearchResultsList results={results} />}
                    {/* <iframe
                        width="858" height="470" src={video} title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                    <br /> */}
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

export default ModalPopup;