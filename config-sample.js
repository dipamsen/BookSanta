import firebase from 'firebase';
require('@firebase/firestore');

// Rename this file to config.js

let firebaseConfig = {
  // Your Firebase Configuration here.
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();