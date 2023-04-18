import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [profile, setProfile] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  useEffect(() => {
    fetch("/events")
      .then((r) => r.json())
      .then(posts => setEvent(posts))
  }, []);

  useEffect(() => {
    fetch(`/profiles/${id}`)
      .then((r) => r.json())
      .then(prof => setProfile(prof))
  }, []);

  console.log(profile, id)

  return (
    <UserContext.Provider value={[user, setUser, event, setEvent, profile, setProfile]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;