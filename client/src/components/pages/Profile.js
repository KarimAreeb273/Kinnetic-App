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
  const [followers, setFollowers] = useState([]);
  const [followees, setFollowees] = useState([]);
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
    fetch(`/followers/${id}`)
      .then((r) => r.json())
      .then(prof => setFollowers(prof))
  }, []);

  useEffect(() => {
    fetch(`/followees/${id}`)
      .then((r) => r.json())
      .then(prof => setFollowees(prof))
  }, []);

  return (
    <div style={{maxWidth:"1750px",margin:"0px auto"}}>
    <div>{profile.length > 0 ? (
    <div style={{
       margin:"18px 0px",
        borderBottom:"1px solid grey"
    }}>
  
  
    <div style={{
        display:"flex",
        justifyContent:"space-around",
       
    }}>
        <div>
            <img style={{width:"250px",height:"200px",borderRadius:"100px"}}
            src={pic}
            />
          
        </div>
        <div>
            <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                <h6>{posts.length} posts</h6>
                <h6>{followers.length} followers</h6>
                <h6>{followees.length} following</h6>
            </div>
        <div >
          <h2>Name: {name}</h2>
          <h5>Bio: {bio}</h5>
        </div>
  
        </div>
    </div>
    
     <div className="file-field input-field" style={{margin:"10px"}}>
     <div className="file-path-wrapper">
         <input className="file-path validate" type="text" />
         <Button style={{ float: 'right',  
         border: 'none',
         color: 'purple',
         padding: '10px 20px',
         borderRadius: '20px',
         boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
         transition: 'all 0.3s ease 0s',
         cursor: 'pointer',
         outline: 'none',
         margin: '10px'}} as={Link} to="/editprofile">Edit Profile</Button>
     </div>
     </div>
     </div> ) : (
      <Button className="results-list" style={{ display: 'block', margin: 'auto' }} as={Link} to={"/addprofile"}> Add a Profile </Button>
     ) }
     </div>
           <Wrapper className="results-list">
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
         </Wrapper>
         </div>
  
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