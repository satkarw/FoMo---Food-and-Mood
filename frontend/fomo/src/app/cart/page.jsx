"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Loader2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
} from "lucide-react";
import { apiFetch } from "../lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from 'motion/react';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('cart');
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  /* ---------------- FETCH CART + MENU ---------------- */
  useEffect(() => {
    if (!authLoading && user) {
      if (activeTab === 'cart') {
        fetchCart();
      } else {
        fetchOrders();
      }
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, activeTab]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cartData, menuData] = await Promise.all([
        apiFetch("cart/"),
        apiFetch("menu/menu-items"),
      ]);

      setCart(cartData);
      setMenuItems(menuData);
    } catch (err) {
      setError("Failed to load cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ordersData = await apiFetch("orders/my");
      setOrders(ordersData.reverse());
      console.log(ordersData)
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MERGE CART + MENU ---------------- */
  const mergedItems = useMemo(() => {
    if (!cart?.items || !menuItems.length) return [];

    return cart.items.map((item) => {
      const menuItem = menuItems.find(
        (m) => m.id === item.menu_item
      );

      return {
        id: item.id,
        menu_item_id: item.menu_item,
        quantity: item.quantity,
        food_name: item.food_name,
        price: parseFloat(item.price),
        image: menuItem?.image,
        available: menuItem?.available,
        subtotal: parseFloat(item.price) * item.quantity,
      };
    });
  }, [cart, menuItems]);

  /* ---------------- CALCULATE TOTAL ---------------- */
  const cartTotal = useMemo(() => {
    return mergedItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [mergedItems]);

  /* ---------------- UPDATE QUANTITY ---------------- */
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      setError(null);
      
      await apiFetch(`cart/item/${itemId}/`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      await fetchCart();
    } catch (err) {
      setError("Failed to update item");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (itemId) => {
    try {
      setUpdating(itemId);
      setError(null);
      
      await apiFetch(`cart/item/${itemId}/`, {
        method: "DELETE",
      });
      
      await fetchCart();
    } catch (err) {
      setError("Failed to remove item");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  /* ---------------- PLACE ORDER ---------------- */
  const handleOrder = async () => {
    if (mergedItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);
      setError(null);

      await apiFetch("orders/place/", {
        method: "POST",
      });

      // Success! Switch to orders tab
      setActiveTab('orders');
      await fetchOrders();
      
      // Show success message
      setError(null);
    } catch (err) {
      setError(err.data?.error || "Failed to place order");
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ---------------- CANCEL ORDER ---------------- */
  const cancelOrder = async (orderId) => {
    try {
      setUpdating(orderId);
      setError(null);

      await apiFetch(`orders/${orderId}/cancel/`, {
        method: "POST",
      });

      await fetchOrders();
    } catch (err) {
      setError(err.data?.error || "Failed to cancel order");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  /* ---------------- STATUS HELPERS ---------------- */
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'preparing':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'preparing':
        return <ChefHat size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  /* ---------------- AUTH GUARD ---------------- */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow text-center max-w-md">
          <ShoppingCart size={56} className="mx-auto text-[#FF6B35] mb-4" />
          <h2 className="text-2xl font-bold">Please Login</h2>
          <p className="text-gray-500 mt-2">
            Login to view your cart and place orders
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#FFF5E1] py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[#333333] font-sans mb-2" style={{ fontWeight: 700, fontSize: '52px' }}>
            My Cart & Orders
          </h1>
          <p className="text-[#666666] font-['Open_Sans']" style={{ fontSize: '16px' }}>
            Manage your cart and track your orders
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-['Poppins'] transition-all duration-200 ${
              activeTab === 'cart'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#E55A25] text-white shadow-[0_4px_12px_rgba(255,107,53,0.3)]'
                : 'text-[#666666] hover:bg-[#FFF5E1]'
            }`}
            style={{ fontWeight: 600 }}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cart && cart.items.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'cart' ? 'bg-white/20' : 'bg-[#FF6B35] text-white'
              }`}>
                {cart.items.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-['Poppins'] transition-all duration-200 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#6BCB77] to-[#5AB866] text-white shadow-[0_4px_12px_rgba(107,203,119,0.3)]'
                : 'text-[#666666] hover:bg-[#FFF5E1]'
            }`}
            style={{ fontWeight: 600 }}
          >
            <Package size={20} />
            <span>Orders</span>
          </button>
        </div>

        {/* Error/Success Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'cart' ? (
            loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-20"
              >
                <Loader2 size={48} className="animate-spin text-[#FF6B35]" />
              </motion.div>
            ) : mergedItems.length > 0 ? (
              <motion.div 
                key="cart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-3 gap-6"
              >
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {mergedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-md p-6 flex gap-4 relative"
                    >
                      {/* Updating Overlay */}
                      {updating === item.id && (
                        <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center z-10">
                          <Loader2 className="animate-spin text-[#FF6B35]" size={32} />
                        </div>
                      )}

                      {/* Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.food_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingCart size={32} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {item.food_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Rs.{item.price.toFixed(2)} each
                        </p>
                        {!item.available && (
                          <p className="text-xs text-red-500 mt-1">Currently unavailable</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || updating === item.id}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updating === item.id}
                            className="w-8 h-8 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="font-bold text-lg text-gray-800">
                          Rs.{item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-md p-6 sticky top-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Items ({mergedItems.length})</span>
                        <span>Rs.{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-[#FF6B35]">Rs.{cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleOrder}
                      disabled={placingOrder || mergedItems.length === 0}
                      className="w-full bg-[#FF6B35] hover:bg-[#ff5722] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {placingOrder ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Placing Order...
                        </>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-cart"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="bg-white p-10 rounded-3xl shadow-md inline-block">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                  <p className="text-gray-500">Add some delicious items to get started!</p>
                </div>
              </motion.div>
            )
          ) : (
            // Orders Tab
            loading ? (
              <motion.div
                key="loading-orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-20"
              >
                <Loader2 size={48} className="animate-spin text-[#6BCB77]" />
              </motion.div>
            ) : orders.length > 0 ? (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-md p-6 relative"
                  >
                    {/* Updating Overlay */}
                    {updating === order.id && (
                      <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center z-10">
                        <Loader2 className="animate-spin text-[#6BCB77]" size={32} />
                      </div>
                    )}

                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.food_name} x {item.quantity}
                          </span>
                          <span className="font-medium text-gray-800">
                            Rs.{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <div className="font-bold text-lg text-gray-800">
                        Total: Rs.{parseFloat(order.total_price).toFixed(2)}
                      </div>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          disabled={updating === order.id}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-orders"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="bg-white p-10 rounded-3xl shadow-md inline-block">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
                  <p className="text-gray-500">Your order history will appear here</p>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}