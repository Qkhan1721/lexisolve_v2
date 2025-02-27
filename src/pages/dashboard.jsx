import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth
import Navbar from '../components/Navbar';
import Guide from '../components/Guide';
import AddApi from '../components/AddApi';
import NicheResearch from '../components/NicheResearch';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for redirection
  const [showAddApi, setShowAddApi] = useState(location.pathname === '/add-api');
  const [showNicheResearch, setShowNicheResearch] = useState(location.pathname === '/niche-research');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        navigate('/login'); // Redirect to login if user is not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === '/add-api') {
      setShowAddApi(true);
      setShowNicheResearch(false);
    } else if (location.pathname === '/niche-research') {
      setShowNicheResearch(true);
      setShowAddApi(false);
    } else {
      setShowAddApi(false);
      setShowNicheResearch(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <Navbar setShowAddApi={setShowAddApi} />
      <div className="flex-1 p-4 overflow-hidden flex items-center justify-center mt-16">
        {showAddApi ? <AddApi /> : showNicheResearch ? <NicheResearch /> : <Guide />}
      </div>
    </div>
  );
};

export default Dashboard;