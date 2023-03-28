import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Posts from "./pages/Posts";
import NavBar from "./NavBar";
import { Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  useEffect(() => {
    fetch("/users").then((r) => {
      if (r.ok) {
        r.json().then((users) => setUsers(users));
      }
    });
  }, []);

  let fetchusers = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <NavBar setUser={setUser} />
      <Users userList = {fetchusers} search = {search} setSearch = {setSearch}/>
      <main>
        <Switch>
          <Route path="/new">
            <NewPost user={user} />
          </Route>
          <Route path="/">
            <Posts />
          </Route>
        </Switch>
      </main>  
    </>
  );
}


export default App;