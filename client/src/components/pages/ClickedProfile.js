import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import "../SearchResultsList.css";

function ClickedProfile() {
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/profiles/${id}`)
      .then((r) => r.json())
      .then(pos => {
          setProfile(pos)
      })
  }, []);

  console.log(profile)

  useEffect(() => {
    fetch(`/postsbyuser`)
      .then((r) => r.json())
      .then(prof => setPosts(prof))
  }, []);

  
  return (
    <Wrapper>
      {!profile.length > 0 ? (
        // profile.map((prof) => (
            <Post key={profile.id}>
            <Box>
              <Boxchild>
                <img src={profile.image_url}/>
              </Boxchild>
              <h2>{profile.name}</h2>
              <h4>{profile.bio}</h4>
            </Box>
          </Post>       
      ) : (
        <>
          <h2>No Profile information</h2>
        </>
      )}
      User Posts
      <div className="results-list">
        {!posts.length > 0 ? (
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
          <h2>No Posts</h2>
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

export default ClickedProfile;