import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { apiFetch } from '../lib/api';


export default function CartSidebar  ({ isOpen, onClose }) {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const sidebarRef = useRef(null);

  // Fetch cart data
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('cart/');
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await apiFetch(`cart/item/${itemId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQuantity }),
      });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      await apiFetch(`cart/item/${itemId}/`, {
        method: 'DELETE',
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((total, item) => {
      return total + (parseFloat(item.menu_item.price) * item.quantity);
    }, 0);
  };

  // Fetch cart when sidebar opens
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b-2"
            style={{ borderColor: '#feefd3' }}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} style={{ color: '#FF6B35' }} />
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div
                  className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}
                />
              </div>
            ) : !cartData?.items || cartData.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart size={64} className="mb-4 opacity-20" />
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm">Add some delicious items!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartData.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-xl p-4 flex gap-4 transition-all duration-200 hover:shadow-md"
                  >
                    {/* Item Image */}
                    <img
                      src={item.image}
                      alt={item.food.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {item.food.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-semibold mb-3" style={{ color: '#FF6B35' }}>
                        ₹{parseFloat(item.price).toFixed(0)} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: '#feefd3',
                            color: '#FF6B35'
                          }}
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-8 text-center font-semibold text-gray-800">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                          style={{
                            backgroundColor: '#FF6B35',
                            color: 'white'
                          }}
                        >
                          <Plus size={16} />
                        </button>

                        <span className="ml-auto font-semibold text-gray-800">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Total and Checkout */}
          {cartData?.items && cartData.items.length > 0 && (
            <div
              className="p-6 border-t-2"
              style={{ borderColor: '#feefd3' }}
            >
              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold" style={{ color: '#FF6B35' }}>
                  ₹{calculateTotal().toFixed(0)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: '#FF6B35',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
