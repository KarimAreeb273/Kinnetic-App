import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import "../SearchResultsList.css";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/posts")
      .then((r) => r.json())
      .then(posts => setPosts(posts))
  }, []);

  return (
    <Wrapper className="results-list" >
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id}>
            <Box>
              <h2>{post.title}</h2>
              {/* <img src={post.image} /> */}
            </Box>
            <Button as={Link} to={`/posts/${post.id}`}>
            See Post
          </Button>
          </Post>
        ))
      ) : (
        <>
          <h2>No Posts in your feed</h2>
          <Button as={Link} to="/new">
            Make a New Post
          </Button>
        </>
      )}
      End of your feed!!!
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

export default Posts;