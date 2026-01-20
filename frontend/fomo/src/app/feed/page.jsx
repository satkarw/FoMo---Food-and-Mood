"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '../lib/api';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import { getMediaUrl } from '../lib/getMediaUrl';

// Add userId as an optional prop
export default function FeedPage({ userId = null }) {
  const { user, userLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add userId to dependency array
  useEffect(() => {
    if (!userLoading) { // Wait for auth to load
      fetchFeed();
    }
  }, [userId, userLoading]); // Re-fetch when userId or loading state changes

  console.log(posts)
  
  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build the API endpoint based on whether userId is provided
      const endpoint = userId 
        ? `posts/user/${userId}`  // Filter by user
        : 'posts/';  // Get all posts
      
      const data = await apiFetch(endpoint);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      setError('Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // Add new post to the top of the feed
    // Only add if we're on the main feed or if it's the current user's post
    if (!userId || (userId && user && userId === user.id)) {
      setPosts([newPost, ...posts]);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  // Determine if CreatePost should be shown
  const shouldShowCreatePost = user && (!userId || (userId && Number(userId) === user.id));
  
  // Safe console.log - only access user.id if user exists
  console.log(`userId: ${userId}, user: ${user ? user.id : 'null'}, shouldShowCreatePost: ${shouldShowCreatePost}`);

  // Show loading while auth is loading
  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5E1] py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-[#FF6B35] animate-spin mb-4" />
            <p className="text-[#666666] font-['Open_Sans']">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Create Post (Only for authenticated users on their own feed) */}
        {shouldShowCreatePost && <CreatePost onPostCreated={handlePostCreated} />}

        {/* Feed Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-[#FF6B35] animate-spin mb-4" />
            <p className="text-[#666666] font-['Open_Sans']">Loading delicious posts...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-8 text-center"
          >
            <AlertCircle size={48} className="text-[#FF6B35] mx-auto mb-4" />
            <h3 className="text-[#333333] font-['Poppins'] mb-2" style={{ fontWeight: 700, fontSize: '20px' }}>
              Oops! Something went wrong
            </h3>
            <p className="text-[#666666] font-['Open_Sans'] mb-6">
              {error}
            </p>
            <button
              onClick={fetchFeed}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E55A25] text-white rounded-xl hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] transition-all font-['Poppins']"
              style={{ fontWeight: 600 }}
            >
              Try Again
            </button>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B35]/10 to-[#6BCB77]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🍽️</span>
            </div>
            <h3 className="text-[#333333] font-['Poppins'] mb-2" style={{ fontWeight: 700, fontSize: '24px' }}>
              No Posts Yet
            </h3>
            <p className="text-[#666666] font-['Open_Sans']">
              {!userId 
                ? user
                  ? 'Be the first to share your food experience!'
                  : 'Login to share your food experience!'
                : user && userId === user.id
                  ? 'Share your first food experience!'
                  : 'This user hasn\'t shared any posts yet.'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <PostCard
                  post={post}
                  currentUser={user?.id || null}
                  onDelete={handlePostDeleted}
                  onUpdate={() => {
                    // Future: Open edit modal
                  }}
                  // Add optional prop to hide certain actions on others' feeds
                  isOnOwnFeed={!userId || (userId && user?.id && userId === user?.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More (Future enhancement) */}
        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-[#888888] font-['Open_Sans']" style={{ fontSize: '14px' }}>
              {userId 
                ? `All ${posts.length} posts by this user`
                : "You've reached the end 🎉"
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}