import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDO3IzJFZURvDVYCjQ9SZYTC5sV78z_NOc",
  authDomain: "homeless-28d09.firebaseapp.com",
  projectId: "homeless-28d09",
  storageBucket: "homeless-28d09.appspot.com",
  messagingSenderId: "402162612864",
  appId: "1:402162612864:web:199549f748debb928fc465",
  measurementId: "G-QQFFPT2ZHQ"
};



const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, database }; //be able to use variable outside file

