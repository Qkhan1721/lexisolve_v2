import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Search, Filter, X } from "lucide-react";
import Navbar from "./Navbar";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchView from './SearchView';
import { auth } from '../server/firebase';
import ClipLoader from "react-spinners/ClipLoader";

const NicheResearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeRange, setTimeRange] = useState(""); 
  const [minViews, setMinViews] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ Function to handle search request
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const userId = auth.currentUser?.uid;
      const response = await axios.post('http://localhost:5000/search', {
        userId,
        query: searchTerm,
        timeRange: timeRange || null, 
        minViews: minViews ? parseInt(minViews) : 0,
        sortBy: sortBy || "relevance",
        maxResults: parseInt(maxResults) || 10,
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Apply Filters & Trigger Search
  const applyFilters = () => {
    setIsFilterOpen(false);
    handleSearch(); // Trigger search with updated filters
  };

  // ✅ Reset Filters
  const resetFilters = () => {
    setTimeRange("");
    setMinViews("");
    setSortBy("");
    setMaxResults(10);
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col items-center px-4 bg-[#F8F7F3] mt-16 w-full">
        <div className="w-full max-w-5xl">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
            What do you want to Search?
          </h2>

          {/* ✅ Search Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
            className="w-full flex flex-col sm:flex-row items-center justify-center max-w-md gap-3 mx-auto"
          >
            <div className="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Ask Any Topic?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg p-4 w-full text-sm sm:text-base focus:outline-none shadow-sm pr-12 h-14 bg-white"
                required
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-300 transition flex items-center justify-center"
              >
                <Search size={20} className="text-gray-700" />
              </button>
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              type="button"
              className="flex items-center justify-center bg-[#EDECE3] text-gray-800 p-3 rounded-lg shadow-md hover:bg-gray-300 transition h-14 w-full sm:w-14 sm:rounded-full"
            >
              <Filter size={22} className="sm:block" />
              <span className="ml-2 text-sm font-medium sm:hidden">Add Filter</span>
            </button>
          </form>

          {/* ✅ Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center mt-8">
              <ClipLoader color="#4A90E2" loading={loading} size={50} />
            </div>
          )}

          {/* ✅ Show Results Only After Search */}
          {hasSearched && !loading && (
            <div className="w-full flex justify-center mt-8">
              <SearchView results={searchResults} loading={loading} />
            </div>
          )}
        </div>

        {/* ✅ Filter Modal */}
        <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-red-500">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Any Time</option>
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
                  <option value="relevance">Relevance</option>
                  <option value="most views">Most Views</option>
                  <option value="least views">Least Views</option>
                  <option value="newest first">Newest First</option>
                  <option value="oldest first">Oldest First</option>
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

            <div className="mt-4 flex justify-between">
              <button onClick={resetFilters} className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition">
                Reset Filters
              </button>
              <button onClick={applyFilters} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Apply Filters
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default NicheResearch;
