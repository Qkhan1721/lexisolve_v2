import React, { useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { firestore } from '../server/firebase'; // Import Firestore if needed
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth, navigate]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore if needed
      // Example: await setDoc(doc(firestore, `users/${user.uid}`), { name: user.displayName });

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-r from-[#EDECE3] to-[#F9F8F3] p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 text-center w-full max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Welcome to Lexi Solve</h1>
        <p className="text-sm sm:text-md mb-6">Login with Your Google Account</p>
        <button 
          onClick={handleLogin} 
          className="flex items-center justify-center bg-white text-[#4285F4] border border-[#4285F4] rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-lg transition duration-300 hover:bg-[#f1f1f1] w-full shadow-md"
        >
          <FaGoogle className="w-4 sm:w-5 mr-2" />
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;