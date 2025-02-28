import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../server/firebase';

const AddApi = () => {
  const [apiKey, setApiKey] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
      } else {
        const userId = user.uid;
        const userApiRef = doc(firestore, `users/${userId}/user-data/youtube-data-api`);

        const docSnap = await getDoc(userApiRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            setApiKey(data.apiKey);
            setIsUpdating(true);
            setShowInput(false);
          }
        } else {
          setApiKey('');
          setIsUpdating(false);
          setShowInput(true);
        }
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid;
    if (userId) {
      const userApiRef = doc(firestore, `users/${userId}/user-data/youtube-data-api`);
      await setDoc(userApiRef, { apiKey });
      setIsUpdating(true);
      setShowInput(false);
    }
  };

  const handleUpdateClick = () => {
    setShowInput(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F7F3]">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-bold mb-2 text-center">
            {isUpdating ? "Your YouTube Data API Key" : "Add Your YouTube Data API Key"}
          </h2>

          <h3 className="mb-4 text-center">
            If you don't know how to add, see this 
            <a href="/dashboard" className="bg-[#EDECE3] rounded-lg p-1 font-medium text-black"> Guide</a>
          </h3>

          {showInput ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter your YouTube Data API Key"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="border border-gray-300 rounded-lg p-3 w-full text-sm md:text-base focus:outline-none shadow-md"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-[#EDECE3] text-gray-800 py-2 rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
              >
                Submit
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 font-medium break-all">{apiKey}</p>
              <button 
                onClick={handleUpdateClick} 
                className="mt-4 w-full bg-[#EDECE3] text-gray-800 py-2 rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
              >
                Update YouTube Data API Key
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddApi;
