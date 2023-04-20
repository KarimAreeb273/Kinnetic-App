import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";
import "../SearchResultsList.css";
import "./Profile.css"

function Profile() {
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [user, setUser] = useContext(UserContext);
  const { id } = useParams();


  useEffect(() => {
    fetch(`/profiles`)
      .then((r) => r.json())
      .then(prof => setProfile(prof))
  }, []);

  const pic = profile.map(post => post.image_url);
  const name = profile.map(post => post.name);
  const bio = profile.map(post => post.bio);

  useEffect(() => {
    fetch(`/postsbyuser`)
      .then((r) => r.json())
      .then(prof => setPosts(prof))
  }, []);

  useEffect(() => {
    fetch(`/followers/${user.id}`)
      .then((r) => r.json())
      .then(prof => setFollowers(prof))
  }, []);

  useEffect(() => {
    fetch(`/followed/${id}`)
      .then((r) => r.json())
      .then(prof => setFollowed(prof))
  }, []);


  return (
    <div style={{maxWidth:"1750px",margin:"0px auto"}}>
      <br/>
      <br/>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "20px", color: "#333333"}}>
    {profile.length > 0 ? (
    <div style={{
       margin:"18px 0px",
        borderBottom:"1px solid grey"
    }}>
  
  
  <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <div>
            <img style={{width:"250px",height:"200px",borderRadius:"50%",objectfit: "cover", marginright: "50px"}}
            src={pic}
            />
          
        </div>
        <div>
            <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                <h6>{posts.length} posts</h6>
                <h6>{followed.length > 0 ? followed.length : "0"} followers</h6>
                <h6>{followers.length > 0 ? followers.length : "0"} following</h6>
            </div>
  
        </div>
        <div >
          <h2>Name: {name}</h2>
          <h5>Bio: {bio}</h5>
          <div style={{margin:"-15px"}}>
         <Button style={{ float: 'left',  
         border: 'none',
         color: 'purple',
         padding: '10px 20px',
         borderRadius: '20px',
         boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
         transition: 'all 0.3s ease 0s',
         cursor: 'pointer',
         outline: 'none',
         margin: '20px'}} as={Link} to="/editprofile">Edit Profile</Button>
     </div>
        </div>
    </div>
    
     </div> ) : (
      <Button className="results-list" style={{ display: 'block', margin: 'auto' }} as={Link} to={"/addprofile"}> Add a Profile </Button>
     ) }
     </div>
           <Wrapper>
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
         </div>
  
  );

}

const Wrapper = styled.div`
  background-color: #f5f5f5;
  padding: 40px 0;
  height: 1000px;
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


export default Profile;

// return (
//   <div style={{maxWidth:"1750px",margin:"0px auto"}}>
//   <div style={{
//      margin:"18px 0px",
//       borderBottom:"1px solid grey"
//   }}>


//   <div style={{
//       display:"flex",
//       justifyContent:"space-around",
     
//   }}>
//       <div>
//           <img style={{width:"250px",height:"200px",borderRadius:"100px"}}
//           src={profile.image_url}
//           />
        
//       </div>
//       <div>
//           <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
//               <h6> posts</h6>
//               <h6>followers</h6>
//               <h6>following</h6>
//           </div>
//           <button style={{
//                      margin:"10px"
//                  }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
//                   >
//                       Follow
//           </button>

//       </div>
//   </div>

//    <div className="file-field input-field" style={{margin:"10px"}}>
//    <div className="file-path-wrapper">
//        <input className="file-path validate" type="text" />
//    </div>
//    </div>
//    </div>  
//          <div className="results-list">
//          {posts.length > 0 ? (
//          posts.map((post) => (
//            <Post key={post.id}>
//              <Box>
//                <h2>{post.title}</h2>
//                {/* <img src={post.image} /> */}
//              </Box>
//              <Button as={Link} to={`/posts/${post.id}`}>
//              See Post
//            </Button>
//            </Post>
//          ))
//        ) : (
//          <>
//            <h2>No Posts in your feed</h2>
//            <Button as={Link} to="/new">
//              Make a New Post
//            </Button>
//          </>
//        )}
//        </div>
//        </div>

// );