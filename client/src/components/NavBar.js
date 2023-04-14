import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Modal } from "semantic-ui-react";
import SearchModal from "./SearchModal";
import { UserContext } from "../UserContext";

function NavBar({results, setResults}) {
  const [user, setUser] = useContext(UserContext);
  const [open, setOpen] = useState(false)

  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
  }


  return (
    <nav>
    <div className="nav-wrapper white">
        <Link to="/" className="brand-logo left" style={{color:"black", fontFamily: "Arial"}}>Kinnetic</Link> 
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li style={{color:"black"}}> 
            Welcome, {user.username}!
        </li>
        {/* <li><SearchModal open={open} setOpen={setOpen} results = {results} setResults = {setResults} /></li> */}
        <li ><Link to="/" style={{color:"black"}}>Home</Link></li>
        <li ><Link to="/new" style={{color:"black"}}>Create Post</Link></li>
        <li ><Link to="/events" style={{color:"black"}}>Events</Link></li>
        <li><Link to="/profile" style={{color:"black"}}>Profile</Link></li>
        <li>
          <button className="btn #c62828 red darken-3" onClick={handleLogoutClick}>
          Logout
          </button>
        </li>
      </ul>
    </div>
    </nav>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 3rem;
  color: purple;
  margin: 0;
  line-height: 1;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const LogoMini = styled.h2`
    font-family: "Permanent Marker", cursive;
    font-size: 2rem;
    color: black;
    margin: 0;
    line-height: 1;

    a {
    color: inherit;
    text-decoration: none;
    }
`;


const Nav = styled.nav`
  display: flex;
  gap: 4px;
  position: absolute;
  right: 8px;
`;

export default NavBar;