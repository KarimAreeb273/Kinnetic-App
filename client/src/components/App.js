import React, { useEffect, useState, useContext } from "react";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Posts from "./pages/Posts";
import PostPage from "./pages/PostPage";
import Profile from "./pages/Profile";
import AddProfile from "./pages/AddProfile";
import EditProfile from "./pages/EditProfile";
import ClickedProfile from "./pages/ClickedProfile";
import Chat from "./pages/Chat";
import Contacts from "./Contacts";
import OpenConversation from "./OpenConversation";
import Events from "./pages/Events";
import EventsPage from "./pages/EventPage";
import NewEvents from "./pages/NewEvents";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import { ContactsContext } from '../ContactsProvider'
import { ConversationsContext } from '../ConversationsProvider'
import { SearchResultsList } from "./SearchResultsList";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { UserContext } from "../UserContext";


function App() {
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useContext(UserContext);
  const {contacts, createContact} = useContext(ContactsContext);
  const { sendMessage, selectedConversation } = useContext(ConversationsContext);

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

  useEffect(() => {
    fetch(`/profiles`)
      .then((r) => r.json())
      .then(prof => setProfile(prof))
  }, []);

  function onUpdateProfile(updatedProfile) {
    const updatedProfiles = profile.map(ogProf => {
        if (ogProf.id === updatedProfile.id)
            return updatedProfile;
        else
            return ogProf;
    });
    setProfile(updatedProfiles);
}

  if (!user) return <Login onLogin={setUser} />;


  return (
    <div>
      <NavBar setUser={setUser} user = {users} setResults={setResults} results={results}/>
      {/* <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />} */}
        <br/>
        <br/>
      <main >
        <Switch>
          <Route path="/new">
            <NewPost />
          </Route>
          <Route path="/posts/:id">
            <PostPage post = {posts} setPost = {setPosts} user = {user}/>
          </Route>
          <Route exact path="/profile/:id">
            <ClickedProfile />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route path="/addprofile">
            <AddProfile />
          </Route>
          <Route path="/editprofile">
            <EditProfile onUpdateProfile = {onUpdateProfile}/>
          </Route>
          <Route exact path="/events/:id">
            <EventsPage user = {user}/>
          </Route>
          <Route exact path="/events">
            <Events user = {user}/>
          </Route>
          <Route path="/newevent">
            <NewEvents />
          </Route>
          <Route path="/sidebar">
            <SideBar />
          </Route>
          <Route path="/">
            <Posts  setResults={setResults} results={results}/>
          </Route>
        </Switch>
      </main>  
    </div >
  )
}


export default App;