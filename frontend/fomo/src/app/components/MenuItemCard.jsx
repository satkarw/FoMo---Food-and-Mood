import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Leaf, Minus, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '../lib/api';
import { useNotify } from '@/context/NotifierContext';

export default function MenuItemCard({ item, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { notify } = useNotify();

  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await apiFetch('cart/add/', {
        method: 'POST',
        body: JSON.stringify({
          menu_item: item.id,
          quantity: quantity,
        }),
      });

      notify('Item added to cart','success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      notify('Failed to add item to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };
  


  const handleToggleFavorite = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsFavorited(!isFavorited);
  };

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  
  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
        opacity: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {item.food.is_veg && (
          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Leaf size={16} className="text-green-600" />
            <span className="text-xs font-semibold text-green-600">VEG</span>
          </div>
        )}

        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110"
          style={{ opacity: isHovered || isFavorited ? 1 : 0 }}
        >
          <Heart
            size={20}
            className={`${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 capitalize">
            {item.food.name}
          </h3>
          <span className="text-xl font-bold ml-2 text-[#FF6B35]">
            Rs. {parseFloat(item.price).toFixed(0)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.food.description}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">
            Quantity
          </span>
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
            <button
              onClick={decreaseQty}
              disabled={quantity === 1 || addingToCart}
              className="p-1 rounded-full hover:bg-white transition disabled:opacity-50"
            >
              <Minus size={16} />
            </button>

            <span className="w-6 text-center font-semibold">
              {quantity}
            </span>

            <button
              onClick={increaseQty}
              disabled={addingToCart}
              className="p-1 rounded-full hover:bg-white transition disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!item.available || addingToCart}
          className="w-full py-3 cursor-pointer px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#FF6B35',
            boxShadow: item.available
              ? '0 4px 12px rgba(255, 107, 53, 0.3)'
              : 'none',
          }}
        >
          {addingToCart ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-white" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Decorative Accent */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 opacity-5"
        style={{
          background:
            'radial-gradient(circle at bottom right, #FF6B35 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
