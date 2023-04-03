import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/profiles`)
      .then((r) => r.json())
      .then(prof => setProfile(prof))
  }, []);

  console.log(profile);
  
  return (
    <Wrapper>
      {profile.length > 0 ? (
        // profile.map((prof) => (
            <Post key={profile[profile.length-1].id}>
            <Box>
            <Button as={Link} to="/editprofile">
            Edit your profile
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
          <Button as={Link} to="/editprofile">
            Edit your profile
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

const Boxchild = styled.div`
  border-radius: 2px;
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%),
    0 0 0 1px rgb(10 10 10 / 2%);
  padding: 16px;
`;

export default Profile;