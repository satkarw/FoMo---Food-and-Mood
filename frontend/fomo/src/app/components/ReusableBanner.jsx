'use client';

import React, { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function ReusableBanner({page,message,description}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#feefd3' }}>
      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
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
          
          .fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          
          .fade-in-up-delay-1 {
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.2s forwards;
          }
          
          .fade-in-up-delay-2 {
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.4s forwards;
          }
          
          .fade-in-up-delay-3 {
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.6s forwards;
          }
          
          .pulse-delay-100 {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.1s infinite;
          }
          
          .pulse-delay-200 {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 0.2s infinite;
          }

          @media (max-width: 640px) {
            .hero-title {
              font-size: 4rem !important;
            }
          }
        `
      }} />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Abstract shape 1 - top right */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)' }}
        />
        
        {/* Abstract shape 2 - bottom left */}
        <div 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)' }}
        />
        
        {/* Decorative dots pattern */}
        <div className="absolute top-20 left-10 opacity-10">
          <div className="grid grid-cols-8 gap-4">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6B35' }} />
            ))}
          </div>
        </div>
        
        {/* Decorative curved line */}
        <svg className="absolute bottom-10 right-10 opacity-10" width="200" height="200" viewBox="0 0 200 200">
          <path
            d="M10,100 Q50,50 100,100 T190,100"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
        {/* Logo with animation */}
        <div className={mounted ? 'fade-in-up mb-8' : 'opacity-0 mb-8'}>
          <div className="flex justify-center">

            <div className="flex items-center gap-2">
            <div className="w-30 h-30 bg-gradient-to-br from-[#FF6B35] to-[#E55A25] rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,53,0.3)]">
              <UtensilsCrossed size={70} className="text-white" strokeWidth={2.5} />
            </div>
            </div>

          </div>
        </div>

        {/* App Name with animation */}
        <div className={mounted ? 'fade-in-up' : 'opacity-0'}>
          <h1 
            className="hero-title text-7xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight"
            style={{ 
              color: '#FF6B35',
              textShadow: '4px 4px 8px rgba(255, 107, 53, 0.2)'
            }}
          >
            {page}
          </h1>
        </div>

        {/* Slogan with staggered animation */}
        <div className={mounted ? 'fade-in-up-delay-1' : 'opacity-0'}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-gray-800">
           {message}
          </h2>
        </div>

        {/* Subtext with staggered animation */}
        <div className={mounted ? 'fade-in-up-delay-2' : 'opacity-0'}>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>


        {/* Subtle decorative element below buttons */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF6B35' }} />
          <div className="w-2 h-2 rounded-full pulse-delay-100" style={{ backgroundColor: '#FF6B35' }} />
          <div className="w-2 h-2 rounded-full pulse-delay-200" style={{ backgroundColor: '#FF6B35' }} />
        </div>
      </div>
    </div>
  );
}