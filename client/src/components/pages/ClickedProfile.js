import React, { useEffect, useState, useContext } from "react";
import ChatModal from "../ChatModal";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "../styles";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";
import "../SearchResultsList.css";

function ClickedProfile() {
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [following, setFollowing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false)
  const [user, setUser] = useContext(UserContext);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/profiles/${id}`)
      .then((r) => r.json())
      .then(pos => {
          setProfile(pos)
      })
  }, []);

  const recusername = profile.username

  useEffect(() => {
    fetch(`/postsbyothers/${id}`)
      .then((r) => r.json())
      .then(prof => setPosts(prof))
  }, []);

  useEffect(() => {
    fetch(`/followers/${id}`)
      .then((r) => r.json())
      .then(prof => setFollowers(prof))
  }, []);

  useEffect(() => {
    fetch(`/followed/${id}`)
      .then((r) => r.json())
      .then(prof => setFollowed(prof))
  }, []);

  function handleSubmit(){
    setIsLoading(true);
    fetch(`/followers/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower_id: user.id,
        profile_id: profile.id,
        is_following: true
      }),
    })
    .then((r) => {
      setIsLoading(false);
      if (r.ok) {
        setFollowing(true);
        // localStorage.setItem(`following:${profile.id}`, "true");
        history.push(`/profile/${profile.id}`);
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  } 

  function handleUnfollow() {
    setIsLoading(true);
    fetch(`/followers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        setIsLoading(false);
        if (r.ok) {
          setFollowing(false);
          // localStorage.setItem(`following:${profile.id}`, "false");
        } else {
          r.json().then((err) => setErrors(err.errors));
        }
      });
  }

  console.log(followed)
  useEffect(() => {
    // const followingState = localStorage.getItem(`following:${profile.id}`);
    if (followed.length > 0 && followed.is_following !== null) {
      setFollowing(true);
    } else {
      setFollowing(
        false
        // followed.length > 0 && followed.some((follower) => follower.id === user.id)
      );
    }
  }, [followers, followed, user.id, profile.id]);
  
  return (
    <div style={{maxWidth:"1750px",margin:"0px auto"}}>
      <br/>
    <div style={{
       margin:"18px 0px",
        borderBottom:"1px solid grey"
    }}>
  
  
    <div style={{
        display:"flex",
        justifyContent:"space-around",
       
    }}>
        <div>
            <img style={{width:"250px",height:"200px",borderRadius:"50%"}}
            src={profile.image_url}
            />
          
        </div>
        <div>
            <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                <h6>{posts.length > 0 ? posts.length : "0"} posts</h6>
                <h6>{followed.length > 0 ? followed.length : "0"} followers</h6>
                <h6>{followers.length > 0 ? followers.length : "0"} following</h6>
            </div>
            { !following ? (
            <button onClick={handleSubmit} 
                    style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    >
                        Follow
            </button>
            ) : (
              <button onClick={handleUnfollow}
              style={{
                margin:"10px"
            }} className="btn waves-effect waves-light #64b5f6 pink darken-1">
              Unfollow
            </button>
            ) }
  
        </div>
        <div >
          <h2>Name: {profile.name}</h2>
          <h5>Bio: {profile.bio}</h5>
          <h5><ChatModal profile = {profile} recusername = {recusername} id = {id} open={open} setOpen={setOpen}/></h5>
        </div>
    </div>
  
     <div style={{margin:"10px"}}>
     </div>
     </div>  
     <Wrapper >
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