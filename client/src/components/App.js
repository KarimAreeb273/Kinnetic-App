import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Posts from "./pages/Posts";
import PostPage from "./pages/PostPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangeProfile from "./pages/ChangeProfile";
import EditPost from "./pages/EditPost";
import Events from "./pages/Events";
import ClickedProfile from "./pages/ClickedProfile";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import "./App.css";
import { SearchResultsList } from "./SearchResultsList";
import { Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
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

  function onUpdatePost(updatedPost) {
    const updatedPosts = users.map(ogPost => {
        if (ogPost.id === updatedPost.id)
            return updatedPost;
        else
            return ogPost;
    });
    setUsers(updatedPosts);
}

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
            <PostPage />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path='/posts/:id/edit'>
            <EditPost onUpdatePost={onUpdatePost}/>
          </Route>
          <Route path="/editprofile">
            <EditProfile />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/changeprofile">
            <ChangeProfile onUpdatePost={onUpdatePost}/>
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