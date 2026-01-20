"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

export default function LikeButton({ postId, initialLiked, initialCount, isAuthenticated }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) return;

    // Optimistic update
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newLikedState);
    setLikesCount(newCount);
    setIsAnimating(true);

    try {
      await apiFetch(`posts/${postId}/like/`, {
        method: 'POST',
      });
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikesCount(likesCount);
      console.error('Failed to like post:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2 text-[#666666]">
        <Heart size={24} />
        <span className="font-['Open_Sans']" style={{ fontWeight: 600 }}>
          {likesCount}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 group"
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={24}
          className={`transition-colors ${
            isLiked 
              ? 'text-[#FF6B35] fill-[#FF6B35]' 
              : 'text-[#666666] group-hover:text-[#FF6B35]'
          }`}
        />
      </motion.div>
      <span 
        className={`font-['Open_Sans'] transition-colors ${
          isLiked ? 'text-[#FF6B35]' : 'text-[#666666] group-hover:text-[#FF6B35]'
        }`}
        style={{ fontWeight: 600 }}
      >
        {likesCount}
      </span>
    </button>
  );
}
