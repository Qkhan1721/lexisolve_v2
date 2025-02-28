import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard.jsx';
import NicheResearch from './components/NicheResearch';
import AddApi from './components/AddApi';
// import DeepSeekTest from './components/testdeepseek'; // Commented out or removed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/niche-research" element={<NicheResearch />} />
        <Route path="/add-api" element={<AddApi />} />
        {/* <Route path="/testdeepseek" element={<DeepSeekTest />} /> */}
        {/* No route for AddApi since it's handled in Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
