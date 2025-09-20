"use client";

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/assets/homepage.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0eee6] text-[#171717]">
      {/* Main Content Area */}
      <div className="px-8 py-20 sm:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            
            {/* Left Section - Text */}
            <div className="space-y-8">
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                style={{ fontFamily: 'Sunset-Serial, serif' }}
              >
                <span className="underline decoration-2 underline-offset-4">Creative</span> solutions and{" "}
                <span className="underline decoration-2 underline-offset-4">innovative</span> products that put design at the forefront
              </h1>
              
              <p 
                className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl"
                style={{ fontFamily: 'var(--font-libre-baskerville), serif' }}
              >
                Design will have a vast impact on the world. We are dedicated to creating beautiful experiences and meaningful connections through thoughtful design.
              </p>
            </div>

            {/* Right Section - Lottie Animation */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 lg:w-96 lg:h-96">
                {animationData ? (
                  <Lottie 
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Loading animation...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-8 py-12 sm:px-20 bg-gray-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 
              className="text-2xl sm:text-3xl font-bold mb-8"
              style={{ fontFamily: 'Sunset-Serial, serif' }}
            >
              Ready to create something extraordinary?
            </h2>
            <p 
              className="text-base text-gray-700 mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-libre-baskerville), serif' }}
            >
              Join us in building the future of design, one thoughtful interaction at a time.
            </p>
            <button 
              className="bg-[#d97757] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#c66a4a] transition-colors"
              style={{ fontFamily: 'var(--font-libre-baskerville), serif' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}