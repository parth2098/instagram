import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBuOy_Q3LzgCGfiWm1IOPxa0D5Z4qguEAE",
    authDomain: "instagram-clone-2-3582d.firebaseapp.com",
    databaseURL: "https://instagram-clone-2-3582d.firebaseio.com",
    projectId: "instagram-clone-2-3582d",
    storageBucket: "instagram-clone-2-3582d.appspot.com",
    messagingSenderId: "879756056886",
    appId: "1:879756056886:web:170e1198d44a6a81c43b97",
    measurementId: "G-E047H672HB"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export{db,auth,storage};
