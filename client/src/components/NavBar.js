import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Modal } from "semantic-ui-react";
import SearchModal from "./SearchModal";
import { UserContext } from "../UserContext";
import SideBar from "./SideBar";

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

  console.log(user)

  return (
    <nav>
    <div className="nav-wrapper white">
        <Link to="/" className="brand-logo left" style={{color:"black", fontFamily: "Arial"}}>Kinnetic</Link> 
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
  display: flex;
  gap: 4px;
  position: absolute;
  right: 8px;
`;

export default NavBar;