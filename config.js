import firebase from "firebase";
require ("@firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyCzbTjaDBa1ve_hhb1hYEu5shXInsf56PU",
    authDomain: "barter-system-caeeb.firebaseapp.com",
    projectId: "barter-system-caeeb",
    storageBucket: "barter-system-caeeb.appspot.com",
    messagingSenderId: "103890060562",
    appId: "1:103890060562:web:d3376ba2309396c9d41fcb"
  };
  
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();