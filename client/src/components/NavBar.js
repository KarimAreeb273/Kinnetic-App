import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "semantic-ui-react";

function NavBar({ setUser, user }) {

  const [profile, setProfile] = useState([]);
//   const [name, setName] = useState("");
  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
  }

  useEffect(() => {
    fetch(`/profiles`)
      .then((r) => r.json())
      .then(prof => setProfile(prof))
  }, []);

//   console.log(profile[0].id)

// const name = user[0].username    

//   const id = profile[0].id

  return (
    <Wrapper>
      <Logo>
        <Link to="/">Kinnetic</Link>
      </Logo>
      <Nav>
        <LogoMini>
            Welcome!
        </LogoMini>
        <Button as={Link} to="/new">
          New Post
        </Button>
        <Button as={Link} to="/events">
          Events
        </Button>
        <Button as={Link} to={`/profile`}>
          Check Profile
        </Button>
        <Button onClick={handleLogoutClick}>
          Logout
        </Button>
      </Nav>
    </Wrapper>
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