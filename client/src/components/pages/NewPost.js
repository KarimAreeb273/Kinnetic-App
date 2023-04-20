import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { Errors, Input, Label, Textarea } from "../styles";
import { Form, Button } from "semantic-ui-react";

function NewPost() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
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
        image,
        description,
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
        <Title>Create Post</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormTextarea
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="image">Add Image</FormLabel>
            <FormTextarea
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="description">Content</FormLabel>
            <FormTextarea
              type="text"
              id="title"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
          <FormButtonWrapper>
            <FormButton color="primary" type="submit">
              {isLoading ? "Loading..." : "Submit Post"}
            </FormButton>
            {errors.map((err) => (
              <Errors key={err}>{err}</Errors>
            ))}
          </FormButtonWrapper>
        </Form>
      </WrapperChild>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 1100px;
  margin: 40px auto;
  padding: 24px;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 24px;
`;

const WrapperChild = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 16px;
`;

const FormGroup = styled(Form.Field)`
  margin-bottom: 24px;
`;

const FormLabel = styled(Label)`
  display: block;
  margin-bottom: 8px;
`;

const FormInput = styled(Input)`
  width: 900px;
`;

const FormTextarea = styled(Textarea)`
  width: 90%;
`;

const FormButtonWrapper = styled(Form.Field)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FormButton = styled(Button)`
  flex-shrink: 0;
`;

export default NewPost;
