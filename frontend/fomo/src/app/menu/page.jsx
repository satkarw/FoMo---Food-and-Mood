"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MenuItemCard from '../components/MenuItemCard';

const FoMoMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/menu/menu-items');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        setMenuItems(data);
        setFilteredItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);


  // Filter and search logic
  useEffect(() => {
    let filtered = menuItems;

    if (filterType === 'veg') {
      filtered = filtered.filter(item => item.food.is_veg === true);
    } else if (filterType === 'non-veg') {
      filtered = filtered.filter(item => item.food.is_veg === false);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.food.name.toLowerCase().includes(query) ||
        item.food.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, filterType, menuItems]);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#feefd3' }}>
      {/* Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ color: '#FF6B35' }}
          >
            Our Menu
          </h1>
          <p className="text-xl text-gray-700">
            Discover delicious dishes crafted with love
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-transparent bg-white shadow-lg focus:outline-none focus:shadow-xl transition-all duration-300"
              style={{
                borderColor: searchQuery ? '#FF6B35' : 'transparent',
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-3">
            {['all', 'veg', 'non-veg'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className="px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor:
                    filterType === filter ? '#FF6B35' : 'white',
                  color: filterType === filter ? 'white' : '#FF6B35',
                  boxShadow:
                    filterType === filter
                      ? '0 4px 12px rgba(255, 107, 53, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                {filter === 'all'
                  ? 'All'
                  : filter === 'veg'
                  ? 'Vegetarian'
                  : 'Non-Veg'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div
              className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}
            />
            <p className="mt-4 text-gray-600 text-lg">
              Loading delicious items...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">Error: {error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? 'item' : 'items'} found
            </p>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">
              No items found matching your criteria
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoMoMenu;
