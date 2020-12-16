import firebase from 'firebase';
import firestore from 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAqiW7DEk282ynmhvwmazOMyBPD8B44lQ0",
  authDomain: "product-uploader-8f2fd.firebaseapp.com",
  projectId: "product-uploader-8f2fd",
  storageBucket: "product-uploader-8f2fd.appspot.com",
  messagingSenderId: "444115498015",
  appId: "1:444115498015:web:d2d1b13a1607abc6a2912a",
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
