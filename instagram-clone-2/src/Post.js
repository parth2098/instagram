import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import './Post.css';
import App from './App';
import {db} from './firebase.js'
import { Button, Input } from '@material-ui/core';
import firebase from 'firebase'

function Post({ username,caption,imageUrl,postId,user }) {

    const [comments,setComments]=useState([]);
    const [comment,setComment]=useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc) => doc.data()));
            });

        }
        return() => {
            unsubscribe();
        };
    }, [postId]);

    const postComment =(event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text : comment,
            username:user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }



    return (
        <div className="post">
            <div className="post__header">
                {/*header->avatatr+username */}
                

                <Avatar
                    className="post__avatar"
                    alt="pparth2098"
                    src="img.jpeg"
                />
                <h3>{username}</h3>
            </div>
            

            {/*image */}
            <img
                className="post__image"
                src={imageUrl} 
                alt="Mahant swami img"
            />
            {/**username+caption */}
            <h4 className="post__text"><strong>{username}</strong> : {caption}</h4>

                <div className="post__comments">
                    {comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong>{comment.text}
                        </p>
                    ))}
                </div>

                {
                    user && (
                        <form className = "post__commentBox">
                            <Input
                                className="post__input"
                                placeholder="Add a Comment"
                                type="text"
                                value={comment}
                                onChange = {(e)=> setComment(e.target.value)}
                            />

                            <Button
                                className="post__button"
                                type="submit"
                                disabled={!comment}
                                onClick={postComment}
                            >
                                Post
                            </Button>
                        </form>
                    )
                }

            
        </div>
    )
}

export default Post
