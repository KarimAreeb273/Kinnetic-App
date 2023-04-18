import React from "react";
import GlobalChat from "./pages/GlobalChat";
import "./SearchResultsList.css";
import "./ConversationsTab.css";


const ConversationsTab = () => {


  return (
    <>
    <h1 style={{ color:"black" }}>Global Chat</h1>
    <div style={{ color:"black", maxHeight: "900px", overflowY: "scroll" }}>
    <GlobalChat />
    </div>
    </>
  );
};

export default ConversationsTab;