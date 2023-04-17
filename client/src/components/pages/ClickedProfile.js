import React, { useEffect, useState } from "react";
import ChatModal from "../ChatModal";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import "../SearchResultsList.css";

function ClickedProfile() {
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followees, setFollowees] = useState([]);
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false)
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/profiles/${id}`)
      .then((r) => r.json())
      .then(pos => {
          setProfile(pos)
      })
  }, []);

  useEffect(() => {
    fetch(`/posts/${id}`)
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

  function handleSubmit(){
    setIsLoading(true);
    fetch(`/followers/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followers_id: profile.id
      }),
    })
    .then((r) => {
      setIsLoading(false);
      if (r.ok) {
        history.push(`/profile/${profile.id}`);
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  } 
  function handleFollowing(){
    setIsLoading(true);
    fetch(`/followees/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        following_id: profile.id
      }),
    })
    .then((r) => {
      setIsLoading(false);
      if (r.ok) {
        history.push(`/profile/${profile.id}`);
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  } 

  return (
    <div style={{maxWidth:"1750px",margin:"0px auto"}}>
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
            src={profile.image_url}
            />
          
        </div>
        <div>
            <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                <h6>{posts.length} posts</h6>
                <h6>{followers.length} followers</h6>
                <h6>{followees.length} following</h6>
            </div>
            <button onClick={handleSubmit} 
                    style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    >
                        Follow
            </button>
        <div >
          <h2>Name: {profile.name}</h2>
          <h5>Bio: {profile.bio}</h5>
          <h5><ChatModal open={open} setOpen={setOpen}/></h5>
        </div>
  
        </div>
    </div>
  
     <div style={{margin:"10px"}}>
     </div>
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

export default ClickedProfile;

// return (
  // <div style={{maxWidth:"550px",margin:"0px auto"}}>
  //     <div style={{
  //        margin:"18px 0px",
  //         borderBottom:"1px solid grey"
  //     }}>

    
      // <div style={{
      //     display:"flex",
      //     justifyContent:"space-around",
         
      // }}>
//           <div>
//               <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
//               src={state?state.pic:"loading"}
//               />
            
//           </div>
//           <div>
//               <h4>{state?state.name:"loading"}</h4>
//               <h5>{state?state.email:"loading"}</h5>
//               <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
//                   <h6>{mypics.length} posts</h6>
//                   <h6>{state?state.followers.length:"0"} followers</h6>
//                   <h6>{state?state.following.length:"0"} following</h6>
//               </div>

//           </div>
//       </div>
   
      //  <div className="file-field input-field" style={{margin:"10px"}}>
      //  <div className="btn #64b5f6 blue darken-1">
      //      <span>Update pic</span>
      //      <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
      //  </div>
      //  <div className="file-path-wrapper">
      //      <input className="file-path validate" type="text" />
      //  </div>
      //  </div>
      //  </div>      
//       <div className="gallery">
//           {
//               mypics.map(item=>{
//                   return(
//                    <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
//                   )
//               })
//           }

      
//       </div>
//   </div>
// )