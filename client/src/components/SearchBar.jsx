import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./SearchBar.css";

const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const initialInput = ''


  const fetchData = (value) => {
    fetch("/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.username &&
            user.username.includes(value)
          );
        });
        setResults(results);
      });
  };

  // include ID here, pass through as a prop
  
  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <input
        placeholder="Type to search users..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
 
export default SearchBar