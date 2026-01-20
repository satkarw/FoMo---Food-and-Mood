"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, X, Sparkles, Search } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';
import FoodSearchInput from '@/app/components/FoodSearchInput';

export default function CreatePost({ onPostCreated }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [foodSuggestions, setFoodSuggestions] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingFood, setIsSearchingFood] = useState(false);
  const fileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  

  // Fetch food suggestions from  API
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (foodSearchQuery.trim().length < 2) {
      setFoodSuggestions([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingFood(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/menu/menu-items?search=${foodSearchQuery}`);
        const data = await response.json();
        const query = foodSearchQuery.toLowerCase();

        // STRICT FILTER: only show foods starting with typed text
        const filtered = data.filter(item =>
        item.food?.name?.toLowerCase().startsWith(query)
        );

        // Take first 5 results
        setFoodSuggestions(filtered.slice(0, 5));
      } catch (error) {
        console.error('Error searching foods:', error);
        setFoodSuggestions([]);
      } finally {
        setIsSearchingFood(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [foodSearchQuery]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage && !caption.trim()) {
      alert('Please add an image or caption');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }

      // If a food from menu is selected, use its food ID
      if (selectedFood && selectedFood.food && selectedFood.food.id) {
        formData.append('food', selectedFood.food.id);
      } 
      // If user typed a custom food name that's not in menu
      else if (foodSearchQuery.trim()) {
        formData.append('food_name', foodSearchQuery.trim());
      }

      const response = await apiFetch('posts/create/', {
        method: 'POST',
        body: formData,
        headers: {}, // Remove Content-Type to let browser set it with boundary
      });

      // Success - reset form
      setCaption('');
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedFood(null);
      setFoodSearchQuery('');
      setIsExpanded(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent to refresh feed
      if (onPostCreated) {
        onPostCreated(response);
      }

    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setCaption('');
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedFood(null);
    setFoodSearchQuery('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-6 mb-6"
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E55A25] rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1 h-12 bg-[#FFF5E1] rounded-xl flex items-center px-4">
              <span className="text-[#888888] font-['Open_Sans']">
                Share your food experience...
              </span>
            </div>
            <div className="w-10 h-10 bg-[#FFF5E1] rounded-xl flex items-center justify-center hover:bg-[#FFE8C5] transition-colors">
              <Image size={20} className="text-[#FF6B35]" />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-[#333333] font-['Poppins']" style={{ fontWeight: 700, fontSize: '18px' }}>
                Create Post
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 hover:bg-[#FFF5E1] rounded-lg transition-colors"
              >
                <X size={20} className="text-[#666666]" />
              </button>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl overflow-hidden"
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                >
                  <X size={18} className="text-white" />
                </button>
              </motion.div>
            )}

            {/* Caption */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full px-4 py-3 bg-[#FFF5E1] border-2 border-transparent focus:border-[#6BCB77] rounded-xl resize-none outline-none transition-colors font-['Open_Sans']"
              style={{ fontSize: '14px' }}
            />

            <FoodSearchInput
                value={foodSearchQuery}
                onChange={setFoodSearchQuery}
                onFoodSelect={(food) => {
                  if (food.isCustom) {
                    // Custom food name
                    setSelectedFood(null);
                  } else {
                    // Food from menu
                    setSelectedFood(food);
                  }
                }}
                placeholder="Tag a food (optional)"
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFF5E1] hover:bg-[#FFE8C5] rounded-xl transition-colors"
              >
                <Image size={20} className="text-[#FF6B35]" />
                <span className="text-[#FF6B35] font-['Poppins']" style={{ fontWeight: 600 }}>
                  {selectedImage ? 'Change Image' : 'Add Image'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-[#666666] hover:bg-[#FFF5E1] rounded-xl transition-colors font-['Poppins'] disabled:opacity-50"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!selectedImage && !caption.trim())}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF6B35] to-[#E55A25] text-white rounded-xl hover:shadow-[0_4px_12px_rgba(255,107,53,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-['Poppins']"
                  style={{ fontWeight: 600 }}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}