import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);

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

  return (
    <UserContext.Provider value={[user, setUser, event, setEvent]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;