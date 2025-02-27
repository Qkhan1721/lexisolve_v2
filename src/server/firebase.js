// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBusdxn7Kh3CVHjMCqs5uPkWDc24Ryty_k",
  authDomain: "lexisolve.firebaseapp.com",
  databaseURL: "https://lexisolve-default-rtdb.firebaseio.com",
  projectId: "lexisolve",
  storageBucket: "lexisolve.firebasestorage.app",
  messagingSenderId: "190830353742",
  appId: "1:190830353742:web:a5450a87494c422eec521f",
  measurementId: "G-1EJ9K5VDFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };