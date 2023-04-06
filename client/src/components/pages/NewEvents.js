import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Errors, Input, Label } from "../styles";
import { Form, Button } from "semantic-ui-react";


function NewEvents() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
  
    function handleSubmit(e) {
      e.preventDefault();
      setIsLoading(true);
      fetch("/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          location,
          date
        }),
      }).then((r) => {
        setIsLoading(false);
        if (r.ok) {
          history.push("/events");
        } else {
          r.json().then((err) => setErrors(err.errors));
        }
      });
    }
  
    return (
      <Wrapper>
        <WrapperChild>
          <h2>Add your event</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Label htmlFor="name">Event Title</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Label htmlFor="date">Date</Label>
              <Input
                type="text"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Button color="primary" type="submit" >
                {isLoading ? "Loading..." : "Submit Event"}
              </Button>
            </Form.Field>
            <Form.Field>
              {errors.map((err) => (
                <Errors key={err}>{err}</Errors>
              ))}
            </Form.Field>
          </Form>
        </WrapperChild>
      </Wrapper>
    );
  }
  
  const Wrapper = styled.section`
    max-width: 1000px;
    margin: 40px auto;
    padding: 16px;
    display: flex;
    gap: 24px;
  `;
  
  const WrapperChild = styled.div`
    flex: 1;
  `;
  
  export default NewEvents;