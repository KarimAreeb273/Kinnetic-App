import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Posts from "./pages/Posts";
import PostPage from "./pages/PostPage";
import Profile from "./pages/Profile";
import AddProfile from "./pages/AddProfile";
import ClickedProfile from "./pages/ClickedProfile";
import Events from "./pages/Events";
import NewEvents from "./pages/NewEvents";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import "./App.css";
import { SearchResultsList } from "./SearchResultsList";
import { Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState([]);
//   const [search, setSearch] = useState("");

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  useEffect(() => {
    fetch("/usersbyid").then((r) => {
      if (r.ok) {
        r.json().then((users) => setUsers(users));
      }
    });
  }, []);

  useEffect(() => {
    fetch("/posts").then((r) => {
      if (r.ok) {
        r.json().then((post) => setPosts(post));
      }
    });
  }, []);

  function onUpdatePost(updatedPost) {
    const updatedPosts = users.map(ogPost => {
        if (ogPost.id === updatedPost.id)
            return updatedPost;
        else
            return ogPost;
    });
    setUsers(updatedPosts);
}

//  const testing = (e) =>  {
//   console.log(results)
//  return (
//   <div className="results-list">
//     {results.map((result, id) => {
//       return (
//       <ClickedProfile result = {result} username={result.username} key={id} i={result.id} />
//       )
//     })}
//   </div>
// )
// }




//   let fetchusers = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));

  if (!user) return <Login onLogin={setUser} />;


  return (
    <div class="wav">
      <NavBar setUser={setUser} user = {users} />
      <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />}
      <main >
        <Switch>
          <Route path="/new">
            <NewPost />
          </Route>
          <Route path="/posts/:id">
            <PostPage post = {posts} setPost = {setPosts} user = {user}/>
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/profile/:id">
            <ClickedProfile />
          </Route>
          <Route path="/addprofile">
            <AddProfile />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/newevent">
            <NewEvents />
          </Route>
          <Route path="/">
            <Posts />
          </Route>
        </Switch>
      </main>  
    </div >
  )
}


export default App;