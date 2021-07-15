import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post.js';
import { db,auth} from './firebase.js';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload.js';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
const classes = useStyles();
const [modalStyle] = React.useState(getModalStyle);
const [posts, setPosts] = useState([]);
const [open,setOpen]=useState(false);
const [username,setusername]=useState('');
const [password,setPassword]=useState('');
const [email,setEmail]=useState('');
const [user,setUser]=useState(null);
const [openSignIn,setOpenSignIn]=useState(false);



useEffect(()=>{
  const unsubscribe = auth.onAuthStateChanged((authUser)=>{
    if(authUser) {
      //user Has Login in
      console.log(authUser);
     setUser(authUser);//because of it user stays loged in while refreshing

      if(authUser.displayName){
        //dont update username
      }
      else {
        //If we just created someone
        return authUser.updateProfile({
          displayName : username
        });
      }
    } else {
      //useer has loged out
      setUser(null);
    }
  })

  return()=>{
    //perform some clean up
    unsubscribe();
  }
},[user,username]);

useEffect (()=>{
  db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
    setPosts(snapshot.docs.map(doc=>({
      id : doc.id,
      post :doc.data()
      
    })));
  })
},[]);

  const signUp=(event)=>{
    event.preventDefault();


    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser)=>{
        authUser.user.updateProfile({
          displayName:username
        })
      })
      .catch((error)=>alert(error.message));

      setOpen(false);
  }

  const signIn=(event)=>{
    event.preventDefault();


    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error)=>alert(error.message));

      setOpenSignIn(false);
  }

  return (
    <div className="App">
      
      


      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signUp">
        <center>
        < img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/150px-Instagram_logo.svg.png"
            alt="Instagram" 
            className="app__headerImage"
        />
        </center>
        <Input
          placeholder="username"
          type="text"
          value={username}
          onChange = {(e)=> setusername(e.target.value)}
        />

        <Input
          placeholder="E-mail"
          type="text"
          value={email}
          onChange = {(e)=> setEmail(e.target.value)}
        />

        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange = {(e)=> setPassword(e.target.value)}
        />

         <Button type="submit" onClick={signUp}>Sign Up</Button>
        
        </form>
        
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signUp">
        <center>
        < img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/150px-Instagram_logo.svg.png"
            alt="Instagram" 
            className="app__headerImage"
        />
        </center>
        <Input
          placeholder="E-mail"
          type="text"
          value={email}
          onChange = {(e)=> setEmail(e.target.value)}
        />

        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange = {(e)=> setPassword(e.target.value)}
        />

         <Button type="submit" onClick={signIn}>Sign In</Button>
        
        </form>
        
      </div>
      </Modal>

      {/*Header*/}
      <div className="app__header">
      < img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/150px-Instagram_logo.svg.png"
            alt="Instagram" 
            className="app__headerImage"
      />

      {user ? (
        <Button onClick={()=>auth.signOut()}>LogOut</Button>
      ) : (
        <div className="app__loginContainer">
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          <Button onClick={()=>setOpenSignIn(true)}>Sign in</Button>
        </div>
        
      )}
      </div>

      
      

      
      {user?.displayName ? (
        <h1>Hello,  {user.displayName}</h1>
      ) : (
        <h3>Sorry You need Login </h3>
      )
      }
      
      {/*Posts*/}
      <div className="app__post">
        <div className="app__postLeft">
          {
          posts.map(({id,post})=>(
            <Post key={id} postId = {id} user = {user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
          }
        </div>

        <div className="app__postRight">
        <InstagramEmbed
          url='https://www.instagram.com/p/BqUK14IH1KY/?utm_source=ig_web_copy_link'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
        </div>


      
      </div>
      

      
      
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry You need Login to upload</h3>
      )
      }
      
    </div>
  );
}

export default App;
