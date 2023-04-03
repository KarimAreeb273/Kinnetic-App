
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import styled from "styled-components";
import { Errors, Input, Label } from "../styles";


function EditPost({ onUpdatePost }) {
    const initialInput = {
        title: ""
    }

    const [input, setInput] = useState(initialInput);

    const { title } = input;
    const history = useHistory();
    const { id } = useParams();
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetch(`/posts/${id}`)
            .then(r => r.json())
            .then(post => {
                setInput({
                    title: post.title
                });
            })
    }, [id])

    function handleChanges(e) {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    function handleSubmit(e) {
        e.preventDefault();

        fetch(`/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: input.title
            })
        })
            .then(r => r.json())
            .then(updatedPost => {
                onUpdatePost(updatedPost);
                history.push(`/posts/${id}`);
            });

    }

    return (
        <Wrapper>
          <WrapperChild>
            <h2>Edit Post</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Field>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleChanges}
                />
              </Form.Field>
              {/* <Form.Field>
                <Label htmlFor="image">Add Image</Label>
                <Input
                  type="text"
                  id="image"
                  value={image}
                  onChange={handleChanges}
                />
              </Form.Field>
              <Form.Field>
                <Label htmlFor="deescription">Content</Label>
                <Input
                  type="text"
                  id="title"
                  value={description}
                  onChange={handleChanges}
                />
              </Form.Field> */}
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


export default EditPost;