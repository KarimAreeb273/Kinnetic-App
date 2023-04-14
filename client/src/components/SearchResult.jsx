import "./SearchResult.css";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import ClickedProfile from "./pages/ClickedProfile";
import { useParams } from "react-router-dom";

export const SearchResult = ({ result, username, id }) => {
    const [profile, setProfile] = useState([]);
    // const { id } = useParams();
  
    useEffect(() => {
      fetch(`/profiles/${id}`)
        .then((r) => r.json())
        .then(prof => setProfile(prof))
    }, []);

  return (
    <div
      className="search-result" onClick={(e) => console.log(profile)}>
      <Button as={Link} to={`/profile/${id}`}> {username} </Button>
    </div>
  );
};