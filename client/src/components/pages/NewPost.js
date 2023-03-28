import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { Errors, Input, Label } from "../styles";
import { Form, Button } from "semantic-ui-react";


function NewPost() {
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
  
    function handleSubmit(e) {
      e.preventDefault();
      setIsLoading(true);
      fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
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
          <h2>Create Post</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Button color="primary" type="submit">
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
  
  export default NewPost;