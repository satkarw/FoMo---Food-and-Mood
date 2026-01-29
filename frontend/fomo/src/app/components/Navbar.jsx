"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { House, UtensilsCrossed, Rss, ShoppingCart, CircleUser, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ onAuthClick }) {
  const { user, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const router = useRouter()

  // Close profile menu when clicking outside
  


  useEffect(() => {

    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const navLinks = [
    { name: 'Home', href: '/', icon: House },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'Feed', href: '/feed', icon: Rss },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'About', href: '/about', icon: null },
  ];

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.08)] sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button className="flex items-center gap-2 py-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E55A25] rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,53,0.3)]">
              <UtensilsCrossed size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-['Poppins'] text-[#333333]" style={{ fontWeight: 700, fontSize: '24px' }}>
              FoMo
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#666666] hover:text-[#FF6B35] hover:bg-[#FFF5E1] transition-all duration-200 font-['Open_Sans']"
                style={{ fontWeight: 500 }}
              >
                {link.icon && <link.icon size={18} />}
                <span>{link.name}</span>
              </a>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
              
            ) : user ? (
              <div className="relative " ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer hover:bg-[#FFF5E1] transition-all duration-200 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#f58760] to-[#ff6a25] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(107,203,119,0.3)]">
                    <CircleUser size={20} className="text-white" />
                  </div>
                  <span className="text-[#333333] font-['Open_Sans'] group-hover:text-[#FF6B35] transition-colors" style={{ fontWeight: 600 }}>
                    {user.username}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-2 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-[#333333] font-['Poppins']" style={{ fontWeight: 600 }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[#888888] font-['Open_Sans']" style={{ fontSize: '14px' }}>
                        @{user.username}
                      </p>
                    </div>
                    <a
                      href={`/profile/${user.id}`}
                      className="block px-4 py-2.5 text-[#666666] hover:bg-[#FFF5E1] hover:text-[#FF6B35] transition-colors font-['Open_Sans']"
                    >
                      My Profile
                    </a>
                    {/* <a
                      href="#settings"
                      className="block px-4 py-2.5 text-[#666666] hover:bg-[#FFF5E1] hover:text-[#FF6B35] transition-colors font-['Open_Sans']"
                    >
                      Settings
                    </a> */}
                    <a
                      href="/cart"
                      className="block px-4 py-2.5 text-[#666666] hover:bg-[#FFF5E1] hover:text-[#FF6B35] transition-colors font-['Open_Sans']"
                    >
                      My Orders
                    </a>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-[#d4183d] cursor-pointer hover:bg-red-50 transition-colors font-['Open_Sans']"
                      style={{ fontWeight: 600 }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login") }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-[#FF6B35] hover:bg-[#FFF5E1] transition-all duration-200 font-['Open_Sans']"
                  style={{ fontWeight: 600 }}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button
                  className="px-5 py-2.5 bg-[#FF6B35] text-white rounded-xl cursor-pointer hover:bg-[#E55A25] hover:shadow-[0_4px_12px_rgba(255,107,53,0.4)] transition-all duration-200 font-['Open_Sans']"
                  style={{ fontWeight: 600 }}
                  onClick={() => router.push("/registration")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl cursor-pointer hover:bg-[#FFF5E1] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-[#333333]" />
            ) : (
              <Menu size={24} className="text-[#333333]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] hover:text-[#FF6B35] hover:bg-[#FFF5E1] transition-all duration-200 font-['Open_Sans']"
                  style={{ fontWeight: 500 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon size={20} />}
                  <span>{link.name}</span>
                </a>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              {loading ? (
                <div className="px-4 py-3 rounded-xl bg-gray-100 animate-pulse"></div>
              ) : user ? (
                <>
                  <div className="px-4 py-3 bg-[#FFF5E1] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#6BCB77] to-[#5AB866] rounded-full flex items-center justify-center">
                        <CircleUser size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[#333333] font-['Poppins']" style={{ fontWeight: 600 }}>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[#888888] font-['Open_Sans']" style={{ fontSize: '14px' }}>
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`/profile/${user.id}`}
                    className="block px-4 py-3 text-[#666666] hover:bg-[#FFF5E1] hover:text-[#FF6B35] rounded-xl transition-colors font-['Open_Sans']"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-3 text-[#666666] hover:bg-[#FFF5E1] hover:text-[#FF6B35] rounded-xl transition-colors font-['Open_Sans']"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </a>
                  <a
                    href="#orders"
                    className="block px-4 py-3 text-[#666666] hover:bg-[#FFF5E1] hover:text-[#FF6B35] rounded-xl transition-colors font-['Open_Sans']"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-[#d4183d] cursor-pointer hover:bg-red-50 rounded-xl transition-colors font-['Open_Sans']"
                    style={{ fontWeight: 600 }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {

                      setIsMobileMenuOpen(false);
                      router.push("/login");
                    }}
                    className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-3 rounded-xl text-[#FF6B35] border-2 border-[#FF6B35] hover:bg-[#FFF5E1] transition-all duration-200 font-['Open_Sans']"
                    style={{ fontWeight: 600 }}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {

                      setIsMobileMenuOpen(false);
                      router.push("/registration");
                    }}
                    className="w-full px-4 py-3 bg-[#FF6B35] cursor-pointer text-white rounded-xl hover:bg-[#E55A25] hover:shadow-[0_4px_12px_rgba(255,107,53,0.4)] transition-all duration-200 font-['Open_Sans']"
                    style={{ fontWeight: 600 }}


                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}