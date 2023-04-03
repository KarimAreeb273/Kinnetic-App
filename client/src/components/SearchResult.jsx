import "./SearchResult.css";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";

export const SearchResult = ({ result, id }) => {
    const [profile, setProfile] = useState([]);
    // const { id } = useParams();
  
    // useEffect(() => {
    //   fetch(`/profiles/${id}`)
    //     .then((r) => r.json())
    //     .then(prof => setProfile(prof))
    // }, []);
  
   
    // console.log(profile);
  return (
    <div
      className="search-result"
    //   onClick={(e) => <Link to={`/profile/${id}`}/>}
    >
      <Button as={Link} to={`/profile/${id}`}> {result} </Button>
    </div>
  );
};