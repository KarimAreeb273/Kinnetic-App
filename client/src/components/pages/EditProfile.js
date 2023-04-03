import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Errors, Input, Label } from "../styles";
import { Form, Button } from "semantic-ui-react";


function EditProfile() {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [bio, setBio] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
  
    function handleSubmit(e) {
      e.preventDefault();
      setIsLoading(true);
      fetch("/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image,
          bio
        }),
      }).then((r) => {
        setIsLoading(false);
        if (r.ok) {
          history.push("/");
        } else {
          r.json().then((err) => setErrors(err.errors));
        }
      });
    }
  
    return (
      <Wrapper>
        <WrapperChild>
          <h2>Edit your profile</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Label htmlFor="image">Profile Picture</Label>
              <Input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Label htmlFor="bio">Bio</Label>
              <Input
                type="text"
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Button color="primary" type="submit" as={Link} to={`/profile`} >
                {isLoading ? "Loading..." : "Submit Post"}
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
  
  export default EditProfile;