import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import "../SearchResultsList.css";

function Profile() {
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/profiles`)
      .then((r) => r.json())
      .then(prof => setProfile(prof))
  }, []);

  useEffect(() => {
    fetch(`/postsbyuser`)
      .then((r) => r.json())
      .then(prof => setPosts(prof))
  }, []);
  
  return (
    <Wrapper>
      {profile.length > 0 ? (
        // profile.map((prof) => (
            <Post key={profile[profile.length-1].id}>
            <Box>
            <Button as={Link} to="/changeprofile">
            Change your profile
            </Button>
              <Boxchild>
                <img src={profile[profile.length-1].image_url}/>
              </Boxchild>
              <h2>{profile[profile.length-1].name}</h2>
              <h4>{profile[profile.length-1].bio}</h4>
            </Box>
          </Post>       
      ) : (
        <>
          <h2>No Profile information</h2>
          <Button as={Link} to="/addprofile">
            Edit your profile
          </Button>
        </>
      )}
      User Posts
      <div className="results-list">
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
      </div>
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

const Boxchild = styled.div`
  border-radius: 2px;
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%),
    0 0 0 1px rgb(10 10 10 / 2%);
  padding: 16px;
`;

export default Profile;