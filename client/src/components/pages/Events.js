import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import "../SearchResultsList.css";

function Events() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/events")
      .then((r) => r.json())
      .then(posts => setPosts(posts))
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    fetch("/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        location,
        date
      }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        history.push("/events");
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  }

  function handleDelete(id){
    fetch(`/cars/${id}`, { 
      method: 'DELETE' ,
      headers: { 'Content-Type': 'application/json'},
    })
    .then(() => setDeleted(!deleted))
    .then(() => history.push('/cars'))
  }
     

  return (
    <Wrapper className="results-list" >
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id}>
            <Box>
              <h2>{post.name}</h2>
            </Box>
            <Button as={Link} to={`/events/${post.id}`}>
            See Events
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