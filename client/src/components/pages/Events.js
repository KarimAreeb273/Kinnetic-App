import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useParams, Link } from 'react-router-dom';
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import "../SearchResultsList.css";

function Events({ user }) {
  const [posts, setPosts] = useState([]);
  const [event, setEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isGoing, setIsGoing] = useState(false);
  const history = useHistory();
  // const { id } = useParams();


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
        setIsGoing(data[0].is_going);
  })
}, []);

console.log(event)

  function handleSubmit(){
    setIsLoading(true);
    fetch("/userevents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        is_going: true
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
    <Wrapper className="results-list" >
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id}>
            <Box>
              <h2>{post.name}</h2>
              <Button onClick={!isGoing ? handleSubmit : handleDelete}>
                {isGoing ? "Cancel" : "Going"}
              </Button>
            </Box>
            <Button as={Link} to={`/events/${post.id}`}>
            See Events
          </Button>
          <Button as={Link} to="/newevent">
            Start a new event
          </Button>
          </Post>
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

const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto;
`;

const Post = styled.article`
  margin-bottom: 24px;
`;

export default Events;