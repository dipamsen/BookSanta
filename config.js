import firebase from 'firebase';
require('@firebase/firestore');

let firebaseConfig = {
  apiKey: "AIzaSyBX8VL0apaIcrMYGhbxcoy5F9cCpvNsysw",
  authDomain: "book-santa-188f7.firebaseapp.com",
  databaseURL: "https://book-santa-188f7.firebaseio.com",
  projectId: "book-santa-188f7",
  storageBucket: "book-santa-188f7.appspot.com",
  messagingSenderId: "630224584788",
  appId: "1:630224584788:web:29442f7d3278f9697a2dc1"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();