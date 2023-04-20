import "./SearchResult.css";
import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import ClickedProfile from "./pages/ClickedProfile";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export const SearchResult = ({ result, username, id }) => {
    const [profile, setProfile] = useState([]);
    const [user, setUser] = useContext(UserContext);
    // const { id } = useParams();
  
    useEffect(() => {
      fetch(`/profiles/${id}`)
        .then((r) => r.json())
        .then(prof => setProfile(prof))
    }, []);

  return (
    <div
      className="search-result" onClick={(e) => console.log(profile)}>
        {user.id == id ? (
      <Button as={Link} to={`/profile`}> {username} </Button> ):(
      <Button as={Link} to={`/profile/${id}`}> {username} </Button>
        )}
    </div>
  );
};