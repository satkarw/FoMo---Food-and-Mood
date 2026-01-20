"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

export default function FoodFavouriteButton({ postId, initialFavourited, isAuthenticated, hasFood }) {
  const [isFavourited, setIsFavourited] = useState(initialFavourited);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavourite = async(e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !hasFood) return;

    // Optimistic update
    const newFavouritedState = !isFavourited;
    setIsFavourited(newFavouritedState);
    setIsAnimating(true);

    try {
      await apiFetch(`posts/${postId}/favourite/`, {
        method: 'POST',
      });
    } 
    
    catch (error) {
      // Revert on error
      setIsFavourited(!newFavouritedState);
      console.error('Failed to favourite food:', error);
    } 
    
    finally {
      setTimeout(() => setIsAnimating(false), 300);
    }

  };

  if (!isAuthenticated || !hasFood) {
    return null;
  }

  return (
    <button
      onClick={handleFavourite}
      className="group"
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -15, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Bookmark
          size={24}
          className={`transition-colors ${
            isFavourited 
              ? 'text-[#6BCB77] fill-[#6BCB77]' 
              : 'text-[#666666] group-hover:text-[#6BCB77]'
          }`}
        />
      </motion.div>
    </button>
  );
}
