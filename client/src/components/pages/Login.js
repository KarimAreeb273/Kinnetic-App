import { useState } from "react";
import styled from "styled-components";
import LoginForm from "../LoginForm";
import SignUpForm from "../SignUpForm";
import "./Login.css";
import { Button } from "semantic-ui-react";

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Wrapper>
      <h1 className="title">
        <span class="letter">K</span>
        <span class="letter">I</span>
        <span class="letter">N</span>
        <span class="letter">N</span>
        <span class="letter">E</span>
        <span class="letter">T</span>
        <span class="letter">I</span>
        <span class="letter">C</span>
      </h1>
      <h5 className="subtitle">Stay Connected!</h5>
      {showLogin ? (
        <>
          <LoginForm onLogin={onLogin} />
          <div class="ui horizontal divider" />
          <p>
            Don't have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </Button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm onLogin={onLogin} />
          <div class="ui horizontal divider" />
          <p>
            Already a member? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(true)}>
              Log In
            </Button>
          </p>
        </>
      )}
    </Wrapper>
  );
}

const Logo = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 50px;

`;

const Wrapper = styled.section`
  max-width: 500px;
  margin: 40px auto;
  padding: 16px;
`;

export default Login;
