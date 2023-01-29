import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDSwAYCI6I1UIBtysZ5k1Hcxwk4Jyr_9zE",
    authDomain: "tinder-clone-92217.firebaseapp.com",
    projectId: "tinder-clone-92217",
    storageBucket: "tinder-clone-92217.appspot.com",
    messagingSenderId: "929101621921",
    appId: "1:929101621921:web:54eabb0e10e1ca2c275ee0",
    measurementId: "G-PWQHW9YVW3"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, database }; //be able to use variable outside file
