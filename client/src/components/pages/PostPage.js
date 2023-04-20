import React, { useState, useEffect } from 'react';
import "./PostPage.css";
import { useParams, Link } from 'react-router-dom';
import Comments from "./Comments"
import { Icon, Button, Container } from 'semantic-ui-react';

function PostPage({user, post, setPost}) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    const AMPM = hour >= 12 ? 'PM' : 'AM';
    hour = hour > 12 ? hour - 12 : hour;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const timestamp = `${month + 1}/${day}/${year} at ${hour}:${minutes}${AMPM}`;
    const likes = post.likes
    const initialInput = {
        text: "",
        post_id: null,
        user_id: null
    }
    const [comments, setComments] = useState([]);
    const [comm, setComm] = useState([])
    const [input, setInput] = useState(initialInput);
    const [posts, setPosts] = useState([]);
    const [postLikes, setPostLikes] = useState(likes);
    const [inputs, setInputs] = useState({
        title: "",
        image: "",
        description: "",
    });
    const { id } = useParams();

    useEffect(() => {
      fetch(`/posts/${id}`)
        .then((r) => r.json())
        .then(pos => {
            setPosts(pos)
        })
    }, []);


    console.log(posts)

    useEffect(() => {
        fetch(`/comments/${id}`)
          .then((r) => r.json())
          .then(pos => {
              setComm(pos)
          })
      }, []);

    console.log(comm, comments, posts, id)

    if (posts) {
        

        function handleChanges(e) {
            setInput({ ...input, [e.target.name]: e.target.value });
        }

        function handleLikes() {
            const updatedLikes = likes + 1;
            setPostLikes(updatedLikes);
            fetch(`posts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    likes: updatedLikes,
                })
            })
                .then(r => r.json())
                .then((post) => {
                    const updatedPost = posts.map((ogPost) => {
                        if (ogPost.id === post.id) {
                            return post
                    } else {
                        return ogPost
                    }
                })
                    setPost(updatedPost);
                });
        }

        function handleComment(e) {
            e.preventDefault();
            fetch(`/comments/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: input.text,
                    post_id: id,
                    user_id: user.id
                })
            })
                .then(r => r.json())
                .then(comment => {
                    console.log(comment.text)
                    setComments([comment.text, ...comments]);
                    setInput(initialInput)
                });
        }

        console.log(input)

        return (
            <div className="card input-filed"
            style={{
                margin:"100px auto",
                maxHeight:"800px",
                maxWidth:"700px",
                padding:"20px",
                textAlign:"center",
                background: "#b2b2b2",
                border: "2px solid"
            }}
            >
                <div>
                    <div>
                        <h2 style={{
                            color: "black",
                            font: 'Montserrat',
            }}>{posts.title}</h2>
                        <div className="card-image">
                            <img style={{
                                margin:"10px auto",
                                maxHeight:"300px",
                                maxWidth:"300px",
                                padding:"20px",
                                textAlign:"center"
                                }}
                                src={posts.image}/>
                        </div>
                        <h2>{posts.description}</h2>
                    </div>
                </div>
                <Comments comments={comm} text={input.text} handleChanges={handleChanges} handleComment={handleComment} />
            </div>
        );
    } else {
        return (
            <h2>Loading...</h2>
        );
    }
}

export default PostPage;

