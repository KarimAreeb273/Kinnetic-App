import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import { UserContext } from "../../UserContext";
import SearchBar from "../SearchBar";
import { SearchResultsList } from "../SearchResultsList";


function Posts({results, setResults}) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    fetch("/posts")
      .then((r) => r.json())
      .then(posts => setPosts(posts))
  }, []);

  return (
    <Wrapper>
          <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />}
      {posts.length > 0 ? (
        <PostList>
          {posts.reverse().map((post) => (
            <PostCard key={post.id}>
              <h2>{post.title}</h2>
              <PostImage src={post.image} alt={post.title} />
              <h5>By: {post.user.username}</h5>
              <Button as={Link} to={`/posts/${post.id}`}>
                See Post
              </Button>
            </PostCard>
          ))}
        </PostList>
      ) : (
        <EmptyState>
          <h2>No Posts in your feed</h2>
          <Button as={Link} to="/new">
            Make a New Post
          </Button>
        </EmptyState>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: #f5f5f5;
  padding: 40px 0;
`;

const PostList = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`;

const PostCard = styled(Box)`
  margin: 20px;
  padding: 20px;
  width: calc(33.33% - 40px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h2 {
    margin-bottom: 10px;
    font-size: 24px;
  }

  h5 {
    margin-top: 20px;
    font-size: 16px;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    text-align: center;
  }
`;

export default Posts;
