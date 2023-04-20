import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useParams, Link } from 'react-router-dom';
import styled from "styled-components";
import { Box } from "../styles";
import { Button, Card } from "semantic-ui-react";
import "../SearchResultsList.css";
import "./Events.css";

function Events({ user }) {
  const [posts, setPosts] = useState([]);
  const [event, setEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isGoing, setIsGoing] = useState(false);
  const history = useHistory();


  useEffect(() => {
    fetch("/events")
      .then((r) => r.json())
      .then(posts => setPosts(posts))
  }, []);

  useEffect(() => {
    fetch("/userevents")
      .then((r) => r.json())
      .then((data) => {
        setEvent(data)
  })
}, []);

  function handleSubmit(id){
    setIsLoading(true);
    fetch("/userevents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        is_going: true,
        event_id: id
      }),
    })
    .then((r) => {
      if (r.ok) {
        setIsGoing(true);
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  } 

  console.log(posts)

  function handleDelete(id) {
      setIsLoading(true);
      fetch(`/userevent/${user.id}`, {
        method: "DELETE",
      })
      .then((r) => {
        if (r.ok) {
          setIsGoing(false);
          setEvent(event.filter((attendee) => attendee.id !== id));
        } else {
          r.json().then((err) => setErrors(err.errors));
      }});
    }

  return (
    <Wrapper className="result-list">
      <Button as={Link} to="/newevent">
        Start a new event
      </Button>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id}>
            <Card.Content>
              <Card.Header>{post.name}</Card.Header>
              <Card.Meta>{post.location}</Card.Meta>
              <Card.Description>{post.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button basic color="green" as={Link} to={`/events/${post.id}`}>
                  See Event
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))
      ) : (
        <>
          <h2>No Upcoming Events</h2>
          <Button as={Link} to="/newevent">
            Start a new event
          </Button>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: #f5f5f5;
  padding: 40px 0;
`;

const Post = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #F9F8F8;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
`;

export default Events;
