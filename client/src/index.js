import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { UserProvider } from "./UserContext";
import { ContactsProvider } from './ContactsProvider'
import { ConversationsProvider } from './ConversationsProvider'
import "semantic-ui-css/semantic.min.css";
import "./index.css";

const GlobalStyle = createGlobalStyle`
  *,
  *::before, 
  *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
  }

  body {
    font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
  }
`;

ReactDOM.render(
  <BrowserRouter>
    <GlobalStyle />
    <ContactsProvider>
    <UserProvider>
    <ConversationsProvider>
    <App />
    </ConversationsProvider>
    </UserProvider>
    </ContactsProvider>
  </BrowserRouter>,
  document.getElementById("root")
);