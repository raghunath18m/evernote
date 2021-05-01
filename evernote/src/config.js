import firebase from 'firebase/app';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCA2U46hh33VDt-DBlafTw4VaHPY_ThEws",
    authDomain: "evernote-5bd46.firebaseapp.com",
    projectId: "evernote-5bd46",
    storageBucket: "evernote-5bd46.appspot.com",
    messagingSenderId: "849568017978",
    appId: "1:849568017978:web:011c6331e71a86d5090f03"
  };

  firebase.initializeApp(firebaseConfig);

  const projectFirestore = firebase.firestore();

  const timeStamp = firebase.firestore.FieldValue.serverTimestamp;

  export { projectFirestore, timeStamp };

