import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router";
import "./PostPage.css";
import { useParams } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { UserContext } from "../../UserContext";
import "./EventPage.css";

function EventPage() {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [event, setEvent] = useState([]);
    const [events, setEvents] = useState([]);
    const [userevent, setUserEvent] = useState([]);
    const [userevents, setUserEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isGoing, setIsGoing] = useState(false);
    const [user, setUser] = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
      fetch("/events")
        .then((r) => r.json())
        .then(posts => setPosts(posts))
    }, []);  

    useEffect(() => {
        fetch(`/events/${id}`)
          .then((r) => r.json())
          .then(pos => {
              setEvents(pos)
          })
      }, []);
  
  //   useEffect(() => {
  //     fetch(`/userevent/${id}`)
  //       .then((r) => r.json())
  //       .then((data) => {
  //         console.log(data[0])
  //         setEvent(data)
  //   })
  // }, []);

//   useEffect(() => {
//     fetch(`/userevents/${id}`)
//       .then((r) => r.json())
//       .then((data) => {
//         setUserEvents(data)
//   })
// }, []);

console.log(user.id)

useEffect(() => {
  fetch(`/events/${id}` + `/users/${user.id}`)
    .then(response => response.json())
    .then(data => {
      setUserEvents(data.result);
    })
    .catch(error => {
      console.error('Error fetching user event:', error);
      setErrors(true);
    });
}, []);

console.log(userevent)

useEffect(() => {
  fetch(`/userevents/${id}`)
    .then((r) => r.json())
    .then((data) => {
      setUserEvent(data)
})
}, []);
  
    function handleSubmit(id){
      setIsLoading(true);
      fetch("/userevents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          is_going: true,
          event_id: id
        }),
      })
      .then((r) => {
        if (r.ok) {
          setIsGoing(true);
        } else {
          r.json().then((err) => setErrors(err.errors));
        }
      });
    } 
  
    function handleDelete(id) {
        setIsLoading(true);
        fetch(`/userevent/${id}`, {
          method: "DELETE",
        })
        .then((r) => {
          if (r.ok) {
            setIsGoing(false);
            console.log(r.data)
            setEvent(r.data);
          } else {
            r.json().then((err) => setErrors(err.errors));
        }});
      }

      console.log(event, isGoing, user.id, event?.event_id)

      useEffect(() => {
        if (userevents === false) {
          setIsGoing(false);
        } else if ( userevents === true) {
          setIsGoing(true);
        }
      }, [event, userevents, user.id]);

      if (posts) {
        return (
          <div className="card"         
               style={{
            width: "1000px",
            height: "500px",
            padding: "50px",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "transparent",
          }}>
            <h1>{events.name}</h1>
            <p>{events.location}</p>
            <p>{events.date}</p>
            <button onClick={!isGoing ? () => handleSubmit(events.id) : () => handleDelete(events.id)} >
              {isGoing ? "Cancel" : "RSVP"}
            </button>
            <br/>
            <br/>
            <div style={{ borderBottom: '1px solid black' }}/>
            <br/>
            <div className = "attendees-list">
              <h2>Current Attendees</h2>
            {userevent.length > 0 ? (userevent.map((event) => (<div key = {event.id}> <h5>{event.user.username}</h5></div>))) :
            <h3>No Current Reserved Attendees</h3>}  
            </div>      
          </div> 
        )
      } else {
        return (
          <h2 className="loading">Loading...</h2>
        );
      }
    }
    

export default EventPage;