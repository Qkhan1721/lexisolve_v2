import React, { useEffect, useState } from "react";
import { FaBars, FaTimes, FaHome, FaSearch, FaPlus, FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const Navbar = ({ setShowAddApi }) => {
  const [isOpen, setIsOpen] = useState(false); // Closed by default on mobile
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  const toggleNavbar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Open on desktop
      } else {
        setIsOpen(false); // Close on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, "users/" + user.uid);
        onValue(userRef, (snapshot) => {
          setUser(snapshot.val() || user);
        });
      } else {
        // Keep the user state as null only when the user is logged out
        // setUser(null); // Commenting this out to keep the profile visible
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <>
      {/* Mobile Hamburger Button (Visible when navbar is closed) */}
      {!isOpen && (
        <button className="fixed top-4 left-4 z-50 text-gray-700 md:hidden" onClick={toggleNavbar}>
          <FaBars size={28} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg rounded-lg p-4 h-screen fixed top-0 transition-all duration-300 flex flex-col justify-between 
          ${isOpen ? "w-64 left-0" : "w-16 -left-64"} 
          md:left-0`}
      >
        {/* Navbar Header */}
        <div className="flex items-center justify-start mb-4">
          {isOpen && <h1 className="text-xl font-bold">Lexi Solve</h1>}
          <button className="md:hidden ml-2" onClick={toggleNavbar}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={28} />}
          </button>
          <button className="hidden md:block ml-auto" onClick={toggleNavbar}>
            <FaChevronLeft
              size={isOpen ? 24 : 32}
              className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
            />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col flex-grow">
          <Link to="/dashboard" className="flex items-center py-3 text-gray-700 hover:bg-gray-200 rounded-md">
            <FaHome className={`text-lg ${isOpen ? "mr-2" : "mx-auto"}`} />
            {isOpen && <span className="text-left">Home</span>}
          </Link>
          <Link to="/niche-research" className="flex items-center py-3 text-gray-700 hover:bg-gray-200 rounded-md">
            <FaSearch className={`text-lg ${isOpen ? "mr-2" : "mx-auto"}`} />
            {isOpen && <span className="text-left">Niche Research</span>}
          </Link>
          <Link to="/add-api" className="flex items-center py-3 text-gray-700 hover:bg-gray-200 rounded-md">
            <FaPlus className={`text-lg ${isOpen ? "mr-2" : "mx-auto"}`} />
            {isOpen && <span className="text-left">Add API</span>}
          </Link>
        </div>

        {/* Profile Section */}
        {user && (
          <div className={`mt-auto flex items-center border-t pt-4 ${isOpen ? "" : "justify-center"}`}>
            <img
              src={user.profilePicture || "https://via.placeholder.com/40"}
              alt="Profile"
              className="rounded-full w-10 h-10"
            />
            {isOpen && (
              <div className="flex flex-col ml-3">
                <span className="font-semibold">{user.name || "Profile Name"}</span>
                <span className="text-sm text-gray-500 cursor-pointer" onClick={handleLogout}>Log Out</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
