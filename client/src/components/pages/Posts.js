import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import "../SearchResultsList.css";
import { UserContext } from "../../UserContext";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    fetch("/posts")
      .then((r) => r.json())
      .then(posts => setPosts(posts))
  }, []);

  console.log(user, posts)
  return (
    <Wrapper className="results-list" >
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id}>
            <Box>
              <h2>{post.title}</h2>
              <h5>By: {post.user.username}</h5>
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