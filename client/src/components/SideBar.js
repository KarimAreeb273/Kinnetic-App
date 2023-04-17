import React, { useState } from "react";
import "./Sidebar.css";
import FriendsTab from "./FriendsTab";
import ConversationsTab from "./ConversationsTab";

function SideBar({ isOpen }) {
  const [activeTab, setActiveTab] = useState("friends");

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <div className={`sidebar ${isOpen ? "show" : ""}`}>
      <div className="tab-titles">
        <div
          className={`tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => handleTabClick("friends")}
          style={{ color:"black" }}
        >
          Friends
        </div>
        <div
          className={`tab ${activeTab === "conversations" ? "active" : ""}`}
          onClick={() => handleTabClick("conversations")}
          style={{ color:"black" }}
        >
          Conversations
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "friends" && <FriendsTab />}
        {activeTab === "conversations" && <ConversationsTab />}
      </div>
    </div>
  );
}

export default SideBar;
