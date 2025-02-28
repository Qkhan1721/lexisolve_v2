import React, { useState } from 'react';
import { FiEye, FiUsers } from 'react-icons/fi';
import { AiOutlineLike } from 'react-icons/ai';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';

const SearchView = ({ results, loading }) => {
    const [visibleResults, setVisibleResults] = useState(12);

    // ✅ Convert numbers to K / M format
    const formatNumber = (num) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
        return num;
    };

    // ✅ Calculate Engagement Score (Likes per View)
    const calculateEngagementScore = (likes, views) => {
        const likesNum = Number(likes);
        const viewsNum = Number(views);
        return viewsNum ? ((likesNum / viewsNum) * 100).toFixed(2) + '%' : 'N/A';
    };

    const loadMore = () => setVisibleResults((prev) => prev + 12);

    return (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-6 px-6 max-w-[95%] mx-auto">
            {loading
                ? Array.from({ length: visibleResults }).map((_, index) => (
                      <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white shadow-lg rounded-lg overflow-hidden"
                      >
                          <Skeleton height={200} className="w-full" />
                          <div className="p-3">
                              <Skeleton width="80%" height={18} />
                              <Skeleton width="60%" height={14} className="mt-1" />
                          </div>
                      </motion.div>
                  ))
                : results.slice(0, visibleResults).map((video) => (
                      <motion.div
                          key={video.id.videoId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                      >
                          <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                              <img
                                  src={video.snippet.thumbnails.medium.url}
                                  alt={video.snippet.title}
                                  className="w-full h-48 object-cover"
                              />
                          </a>
                          <div className="p-3">
                              <h3 className="text-base font-semibold">
                                  <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" className="text-black no-underline">
                                      {video.snippet.title}
                                  </a>
                              </h3>
                              <p className="text-gray-500 text-xs">
                                  <a href={`https://www.youtube.com/channel/${video.snippet.channelId}`} target="_blank" rel="noopener noreferrer" className="text-black no-underline">
                                      {video.snippet.channelTitle}
                                  </a>
                              </p>
                              <div className="flex flex-col items-start mt-2 text-gray-600 text-xs">
                                  <div className="flex items-center">
                                      <FiEye className="mr-1 text-blue-500" />
                                      {formatNumber(Number(video.statistics?.viewCount))} Views
                                  </div>
                                  <div className="flex items-center mt-1">
                                      <FiUsers className="mr-1 text-green-500" />
                                      {formatNumber(Number(video.statistics?.subscribers))} Subs
                                  </div>
                                  <div className="flex items-center mt-1">
                                      <AiOutlineLike className="mr-1 text-yellow-500" />
                                      {video.statistics?.likeCount && video.statistics?.viewCount
                                          ? calculateEngagementScore(video.statistics.likeCount, video.statistics.viewCount)
                                          : 'N/A'}
                                  </div>
                              </div>
                          </div>
                      </motion.div>
                  ))}

            {results.length > visibleResults && (
                <motion.button
                    onClick={loadMore}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full max-w-md mx-auto bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Load More
                </motion.button>
            )}
        </div>
    );
};

export default SearchView;
