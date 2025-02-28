import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Auth

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBusdxn7Kh3CVHjMCqs5uPkWDc24Ryty_k", // Replace with your actual API key
  authDomain: "lexisolve.firebaseapp.com",
  projectId: "lexisolve",
  storageBucket: "lexisolve.appspot.com",
  messagingSenderId: "190830353742",
  appId: "1:190830353742:web:a5450a87494c422eec521f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };
