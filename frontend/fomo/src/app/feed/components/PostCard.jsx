"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { EllipsisVertical, Trash2, Edit } from "lucide-react";
import LikeButton from "./LikeButton";
import FoodFavouriteButton from "./FoodFavouriteButton";
import { apiFetch } from "@/app/lib/api";
import { useNotify } from "@/context/NotifierContext";
import { getMediaUrl } from "@/app/lib/getMediaUrl";

function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function PostCard({ post, currentUser, onDelete, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwnPost = currentUser && post.user.id === currentUser;
  const[foodLable, setFoodLable] = useState()
  const {notify} = useNotify();

  const fetchFoodLable = async () =>{
    try{
      const foodItem = await apiFetch(`menu/food/${post.food}`);
      setFoodLable(foodItem.name)
      

    }
    catch(error){
      console.log("failed to fetch food lable",error)
    }
  }

  useEffect(() => {
    fetchFoodLable()
  },[post?.food])

  const handleDelete = async () => {

    setIsDeleting(true);

    notify("Deleted")

    try {
      await apiFetch(`posts/${post.id}/edit/`, { method: "DELETE" });
      onDelete(post.id);
    } catch (error) {
      console.log("Failed to delete post:", error);
      notify("Failed to delete","error")
      setIsDeleting(false);
    }
  };

  const captionClass = post.image
    ? "text-sm"
    : "text-lg font-semibold";

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E55A25] rounded-full flex items-center justify-center">
            {
              post.user.profile_picture?
              <img
                  src={post.user.profile_picture || "/default-avatar.png"}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />

                :

                <span className="text-white font-['Poppins'] font-bold text-lg">
              {post.user.username.charAt(0).toUpperCase()}
                </span>
            }
            
            
            
          </div>
          <div>
            <a href={`profile/${post.user.id}`} className="text-[#333333] font-['Poppins'] font-semibold">
              {post.user.username}
            </a>
            <p className="text-[#888888] font-['Open_Sans'] text-xs">
              {getRelativeTime(post.created_at)}
            </p>
          </div>
        </div>

        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev )}
              className="p-2 hover:bg-[#f8d99c] rounded-lg transition-colors"
            >
              <EllipsisVertical size={20} className="text-[#666666]" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden z-10"
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // onUpdate callback would open edit modal
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFF5E1] transition-colors text-left"
                >
                  <Edit size={18} className="text-[#666666]" />
                  <span className="text-[#333333] font-['Open_Sans']">Edit Post</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
                >
                  <Trash2 size={18} className="text-red-500" />
                  <span className="text-red-500 font-['Open_Sans']">
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </span>
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Food Label */}
      {post.food && (
        <div className="px-4 pb-4">
          <span
            className="inline-block px-3 py-1 bg-gradient-to-r from-[#FF6B35]/10 to-[#6BCB77]/10 text-[#FF6B35] rounded-full font-['Poppins'] text-sm font-semibold"
          >
            🍽️ {foodLable || "Food Item"}
          </span>
        </div>
      )}

      {/* Caption on top of image */}
      {post.caption && (
        <div className={`px-4 py-2 ${captionClass}`}>
          {post.caption}
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className="w-full aspect-square bg-[#FFF5E1] relative">
          <img
            src={post.image}
            alt={post.caption || "Post image"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton
            postId={post.id}
            initialLiked={post.is_liked}
            initialCount={post.likes_count}
            isAuthenticated={!!currentUser}
          />
        </div>

        <FoodFavouriteButton
          postId={post.id}
          initialFavourited={post.is_favourited || false}
          isAuthenticated={!!currentUser}
          hasFood={!!post.food}
        />
      </div>
    </motion.div>
  );
}
