import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Errors, Input, Label } from "../styles";
import { Form, Button } from "semantic-ui-react";


function EditProfile({ onUpdateProfile }) {
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const initialInput = {
        name: "",
        image_url: "",
        bio: ""
    }
    const [input, setInput] = useState(initialInput);
    const { name, image_url, bio } = input;
    const history = useHistory();

    useEffect(() => {
        fetch(`/profiles`)
          .then((r) => r.json())
          .then(prof => setInput({
            name: prof.name,
            image_url: prof.image_url,
            bio: prof.bio
          }))
      }, []);

    console.log(input)

    function handleChanges(e) {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
  
    function handleSubmit(e) {
      e.preventDefault();
      setIsLoading(true);
      fetch("/profiles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: input.name,
            image_url: input.image_url,
            bio: input.bio
          }),
      }).then((r) => {
        setIsLoading(false);
        if (r.ok) {
          history.push("/profile");
        } else {
          r.json().then((err) => setErrors(err.errors));
        }
      }).then((updatedProfile) => onUpdateProfile(updatedProfile))
    }
  
    return (
      <Wrapper>
        <WrapperChild>
          <h2>Add your profile</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Label htmlFor="image">Profile Picture</Label>
              <Input
                type="text"
                id="image"
                value={image_url}
                onChange={handleChanges}
              />
            </Form.Field>
            <Form.Field>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={handleChanges}
              />
            </Form.Field>
            <Form.Field>
              <Label htmlFor="bio">Bio</Label>
              <Input
                type="text"
                id="bio"
                value={bio}
                onChange={handleChanges}
              />
            </Form.Field>
            <Form.Field>
              <Button color="primary" type="submit" >
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