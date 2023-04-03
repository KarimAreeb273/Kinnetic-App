import React, { useState, useEffect } from 'react';
import "./PostPage.css";
import { useParams, Link } from 'react-router-dom';
import { Icon, Button, Container } from 'semantic-ui-react';

function PostPage() {
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState(0);
    const [input, setInput] = useState({
        title: "",
        image: "",
        description: "",
    });
    const { id } = useParams();

    useEffect(() => {
      fetch(`/posts/${id}`)
        .then((r) => r.json())
        .then(posts => setPosts(posts))
    }, []);

    console.log(posts)

    if (posts) {
        

        function handleChanges(e) {
            setInput({ ...input, [e.target.name]: e.target.value });
        }

        function handleLikes() {
            fetch(`posts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    likes: likes + 1
                })
            })
                .then(r => r.json())
                .then(posts => {
                    setLikes(posts.likes);
                });
        }

        // function handleComment(e) {
        //     e.preventDefault();

        //     const newComment = {
        //         author: input.author,
        //         comment: input.comment,
        //         timestamp: timestamp,
        //     }

        //     fetch(`http://localhost:3001/fighters/${id}`, {
        //         method: 'PATCH',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             comments: [...fighterComments, newComment]
        //         })
        //     })
        //         .then(r => r.json())
        //         .then(fighter => {
        //             setFighterComments(fighter.comments);
        //             console.log(fighterComments)
        //             setInput(initialInput);
        //         });
        // }

        return (
            <>
                <div>
                    <div >
                        <h2>{posts.title}</h2>
                        <div>
                            <Icon id='like-btn' name='thumbs up outline' size='large' color='red' link onClick={handleLikes}>{likes}</Icon>
                            <Link to={`/posts/${id}/edit`}>
                                <Icon id='edit-btn' name='edit' size='large' color='red' link />
                            </Link>
                        </div>
                        <img src={posts.image}/>
                        <h2>{posts.description}</h2>
                    </div>
                </div>
                {/* <Comments comments={fighterComments} author={input.author} comment={input.comment} timestamp={input.timestamp} handleChanges={handleChanges} handleComment={handleComment} />
                <br /> */}
            </>
        );
    } else {
        return (
            <h2>Loading...</h2>
        );
    }
}

export default PostPage;