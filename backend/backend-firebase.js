// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import Realtime Database
import { getFirestore } from "firebase/firestore"; // Import Firestore
import admin from 'firebase-admin';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBusdxn7Kh3CVHjMCqs5uPkWDc24Ryty_k",
  authDomain: "lexisolve.firebaseapp.com",
  databaseURL: "https://lexisolve-default-rtdb.firebaseio.com", // Ensure this is correct
  projectId: "lexisolve",
  storageBucket: "lexisolve.firebasestorage.app",
  messagingSenderId: "190830353742",
  appId: "1:190830353742:web:a5450a87494c422eec521f",
  measurementId: "G-1EJ9K5VDFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Realtime Database
const firestore = getFirestore(app); // Initialize Firestore

// Ensure that Firestore is initialized
const adminFirestore = admin.firestore();

// Use the initialized Firestore instance
const adminFirestoreInstance = admin.firestore();

// Example function to fetch data
export const fetchData = async () => {
    try {
        const data = await adminFirestoreInstance.collection('yourCollection').get();
        return data.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Export the database and firestore instances
export { database, firestore }; 