import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Search, Filter } from "lucide-react";
import Navbar from "./Navbar";
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NicheResearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("last 24 hours");
  const [minViews, setMinViews] = useState(0);
  const [sortBy, setSortBy] = useState("most views");
  const [maxResults, setMaxResults] = useState(10);
  const auth = getAuth();
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login'); // Redirect to login if user is not authenticated
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (Ensures Visibility) */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content (Search Box & Filter) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 bg-[#F8F7F3] mt-4">
        {/* Center-aligned title */}
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
          What do you want to Search?
        </h2>

        {/* Responsive Search Box */}
        <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row items-center justify-center max-w-xs sm:max-w-md md:max-w-lg gap-3">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              placeholder="Ask Any Topic ?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg p-4 w-full text-sm sm:text-base focus:outline-none shadow-sm pr-12 h-14 bg-white"
              required
            />
            {/* Submit Button (Inside Input) */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-300 transition flex items-center justify-center"
            >
              <Search size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Filter Button (Mobile: Full width + Text, Desktop: Icon Only) */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center bg-[#EDECE3] text-gray-800 p-3 rounded-lg shadow-md hover:bg-gray-300 transition h-14 w-full sm:w-14 sm:rounded-full"
          >
            <Filter size={22} className="sm:block" />
            <span className="ml-2 text-sm font-medium sm:hidden">Add Filter</span>
          </button>
        </form>

        {/* Filter Modal */}
        <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-lg font-bold mb-4">Filters</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-medium">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="last 24 hours">Last 24 hours</option>
                  <option value="last week">Last week</option>
                  <option value="last month">Last month</option>
                  <option value="last year">Last year</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Minimum Views:</label>
                <input
                  type="number"
                  value={minViews}
                  onChange={(e) => setMinViews(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="most views">Most Views</option>
                  <option value="least views">Least Views</option>
                  <option value="newest first">Newest First</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Maximum Results:</label>
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default NicheResearch;
