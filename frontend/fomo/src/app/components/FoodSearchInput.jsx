"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

/**
 * Reusable Food Search Input Component
 * 
 * @param {Function} onFoodSelect - Callback when a food is selected (receives foodItem object or custom name string)
 * @param {string} placeholder - Input placeholder text
 * @param {string} value - Controlled input value (optional)
 * @param {Function} onChange - Controlled input change handler (optional)
 * @param {string} className - Additional CSS classes
 */

export default function FoodSearchInput({ 
  onFoodSelect, 
  placeholder = "Tag a food (optional)",
  value: controlledValue,
  onChange: controlledOnChange,
  className = ""
}) {
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const [isSearchingFood, setIsSearchingFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const foodInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Use controlled or uncontrolled state
  const isControlled = controlledValue !== undefined;
  const inputValue = isControlled ? controlledValue : foodSearchQuery;

  // Fetch food suggestions from API
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (inputValue.trim().length < 2) {
      setFoodSuggestions([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingFood(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/menu/menu-items?search=${inputValue}`);
        const data = await response.json();
        const query = inputValue.toLowerCase();

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
  }, [inputValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (isControlled && controlledOnChange) {
      controlledOnChange(value);
    } else {
      setFoodSearchQuery(value);
    }
    
    setSelectedFood(null);
    setShowFoodDropdown(true);
  };

  const handleFoodSelect = (foodItem) => {
    setSelectedFood(foodItem);
    
    if (isControlled && controlledOnChange) {
      controlledOnChange(foodItem.food.name);
    } else {
      setFoodSearchQuery(foodItem.food.name);
    }
    
    setShowFoodDropdown(false);
    
    if (onFoodSelect) {
      onFoodSelect(foodItem);
    }
  };

  const handleCustomFoodCreate = () => {
    setShowFoodDropdown(false);
    
    if (onFoodSelect) {
      // Pass the custom food name as a string
      onFoodSelect({ isCustom: true, name: inputValue.trim() });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
        <input
          ref={foodInputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowFoodDropdown(true)}
          onBlur={() => {
            // Delay to allow clicking on dropdown items
            setTimeout(() => setShowFoodDropdown(false), 200);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-[#FFF5E1] border-2 border-transparent focus:border-[#FF6B35] rounded-xl outline-none transition-colors font-['Open_Sans']"
          style={{ fontSize: '14px' }}
        />
      </div>

      {/* Food Dropdown */}
      {showFoodDropdown && inputValue.trim().length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden max-h-48 overflow-y-auto"
        >
          {isSearchingFood ? (
            <div className="px-4 py-3 text-center text-[#888888] font-['Open_Sans']">
              Searching...
            </div>
          ) : (
            <>
              {foodSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    handleFoodSelect(item);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-[#FFF5E1] transition-colors font-['Open_Sans'] flex items-center gap-3"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.food.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <span>🍽️ {item.food.name}</span>
                </button>
              ))}
              
              {inputValue.trim() && !foodSuggestions.some(f => f.food.name.toLowerCase() === inputValue.toLowerCase()) && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCustomFoodCreate();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-[#FFF5E1] transition-colors font-['Open_Sans'] border-t border-gray-200"
                >
                  <span className="text-[#6BCB77]">✨ Create new "{inputValue}"</span>
                </button>
              )}

              {!isSearchingFood && foodSuggestions.length === 0 && (
                <div className="px-4 py-3 text-center font-['Open_Sans']">
                  <span className="text-[#6BCB77]">Type to create "{inputValue}"</span>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}