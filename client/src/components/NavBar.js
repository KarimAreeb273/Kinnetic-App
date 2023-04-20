import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Modal } from "semantic-ui-react";
import SearchModal from "./SearchModal";
import { UserContext } from "../UserContext";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import { SearchResultsList } from "./SearchResultsList";
import "./NavBar.css" 

function NavBar({results, setResults}) {
  const [user, setUser] = useContext(UserContext);
  const [open, setOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }


  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
  }

  return (
    <nav className="nav">
    <div className="nav-wrapper grey">
        <Link to="/" className="brand-logo left" >      
        <h1 className="titles">
        <span class="letter">KINNETIC   </span>
        <span class="letters">STAY CONNECTED, </span>
        <span class="letters">STAY KINNETIC</span>
      </h1>
      </Link> 
        <div>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li style={{color:"black"}}> 
            Welcome, {user.username}!
        </li>
        <li ><Link to="/" style={{color:"black"}}>Home</Link></li>
        <li ><Link to="/new" style={{color:"black"}}>Create Post</Link></li>
        <li ><Link to="/events" style={{color:"black"}}>Events</Link></li>
        <li><Link to="/profile" style={{color:"black"}}>Profile</Link></li>
        <li>
          <button style={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px", color: "#333", cursor: "pointer", fontSize: "1rem", marginRight: "8px", padding: "8px", transition: "all 0.3s ease" }} onClick={toggleSidebar}>
            Friends 
          </button>

          <button className="btn #c62828 red darken-3" onClick={handleLogoutClick}>
          Logout
          </button>
        </li>
      </ul>
      </div>
    </div>
    {/* <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />} */}
    <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;
export default NavBar;