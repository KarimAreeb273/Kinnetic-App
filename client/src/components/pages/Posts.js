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

  return (
    <Wrapper className="results-list" >
      <div className="card input-filed"
            style={{
                margin:"30px auto",
                maxWidth:"1000px",
                padding:"20px",
                textAlign:"center"
            }}
            >
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="card home-card" key={post.id}>
            <Box>
              <h2>{post.title}</h2>
              <div className="card-image">
                <img style={{width:"250px",height:"200px",borderRadius:"100px"}} src={post.image}/>
              </div>
              <h5>By: {post.user.username}</h5>
            </Box>
            <Button as={Link} to={`/posts/${post.id}`}>
            See Post
          </Button>
          </div>
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
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 1000px;
  margin: 40px auto;
`;

const Post = styled.article`
  margin-bottom: 24px;
`;

export default Posts;