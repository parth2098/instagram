import { Button } from '@material-ui/core';
import React,{useState} from 'react';
import { db,storage} from './firebase.js';
import firebase from "firebase";
import './ImageUpload.css'



function ImageUpload({username}) {

    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    const [caption,setCaption] = useState('');

    const handleChange = (e)=>{
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload=()=> {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot)=> {
                //Progress logics
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //Complete Function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url =>{
                        //Post image inside db
                        db.collection("posts").add({
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageUrl : url,
                            username : username
                        })

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div className="imageUpload">
            
        {/**caption input */}
        <progress className="imageUpload__progress" value= {progress} />
        <input type="text" placeholder="Enter a Caption..."onChange={event => setCaption(event.target.value)} value={caption} />
        {/**File Picker */}
        <input type="file" onChange={handleChange} />
        {/**Post Button */}
        <Button onClick={handleUpload}>
          Upload
        </Button>

        </div>
    )
}

export default ImageUpload
