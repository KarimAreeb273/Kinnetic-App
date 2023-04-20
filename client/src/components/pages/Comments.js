
import React, {useEffect, useState} from 'react';
import { Comment, Header, Form, Button } from 'semantic-ui-react';
import "./Comments.css";

function Comments({ comments, text, handleChanges, handleComment }) {

    const commentsList = comments?.map((comment) => {
        return (
            <>
            <Comment key={comment.id}>
                <Comment.Content>
                {comment.created_at}
                    <Comment.Text>User ID {comment.user_id}: {comment.text}</Comment.Text>
                </Comment.Content>
            </Comment>
            </>
        );
    });
    

    return (
        <Comment.Group>
            <Header as="h3" dividing>
                Comments
            </Header>
            <div className = "comm">
            {commentsList}
            </div>
            <Form onSubmit={handleComment}>
                {/* <Form.Field>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="author"
                        placeholder="Enter your name..."
                        className="input-text"
                        onChange={handleChanges}
                        value={author}
                    />
                </Form.Field> */}
                <Form.Field>
                    <label>Comment: </label>
                    <Form.TextArea
                        type="text"
                        name="text"
                        placeholder="Enter your comment..."
                        className="input-text"
                        onChange={handleChanges}
                        value={text}
                    />
                </Form.Field>
                <Button id='comment-btn' type='submit' color='red' content='Comment' labelPosition='left' icon='plus' primary disabled={text==="" ? true : false} />
                <br />
            </Form>
        </Comment.Group>
    );
}

export default Comments;