"use client";

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Keypair } from '@solana/web3.js';
import { supabase, Profile } from '@/lib/supabaseClient';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import OnboardingFlow, { OnboardingData } from './components/OnboardingFlow';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xs font-medium text-gray-300">Logo</span>
              </div>
              <span className="text-xl font-bold text-white">Project Umoja</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-300">Home</a>
              <a href="#about" className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-300">About</a>
              <a href="#features" className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-300">Features</a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-300">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative text-center max-w-5xl mx-auto z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-tight">
            Your Identity. Your Capital. Your Future.
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 font-light max-w-4xl mx-auto leading-relaxed">
            Financial inclusion for the 1.4B ALICEs worldwide.
          </p>
          
          <button className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-slate-700 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-400/30 border border-blue-500/20">
            <span className="relative z-10">
              Connect Wallet & Create Identity
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-slate-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          {/* Illustration Placeholder */}
          <div className="mt-16 flex justify-center">
            <div className="w-64 h-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center border border-gray-600/30 shadow-xl">
              <span className="text-gray-400 text-lg font-medium">Illustration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Alice's Story Section */}
      <section id="about" className="py-24 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Placeholder */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-80 h-96 bg-gradient-to-b from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center border border-gray-600/30 shadow-2xl">
                <span className="text-gray-400 text-lg font-medium">Alice Image</span>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-5xl sm:text-6xl font-black text-white mb-8">
                Meet Alice
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Alice represents the 1.4B people worldwide who are Asset-Limited, Income-Constrained, but Employed. Traditional banks can't serve her, but Project Umoja helps her thrive.
              </p>
              
              <blockquote className="text-3xl sm:text-4xl font-bold text-blue-400 italic border-l-4 border-blue-400 pl-6">
                "The system wasn't built for her. So we built Umoja."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">
              Why Project Umoja?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-blue-500/20 hover:border-blue-400/40 shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-blue-500/25">
                <div className="w-10 h-10 bg-white rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Self-Sovereign Identity
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Minted as a soulbound NFT you own forever.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-green-500/20 hover:border-green-400/40 shadow-2xl hover:shadow-green-500/10 transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-500/25">
                <div className="w-10 h-10 bg-white rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Reputation Tokens
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Every repaid loan builds your blockchain-based credit score.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-slate-500/20 hover:border-slate-400/40 shadow-2xl hover:shadow-slate-500/10 transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-slate-500/25">
                <div className="w-10 h-10 bg-white rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Microloans Powered by AI
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Data-validated loans assessed with Wolfram-powered algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">
              Our Impact
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Stat 1 */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl font-black text-transparent bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300">
                1.4B
              </div>
              <p className="text-xl text-gray-300 font-medium">People Represented</p>
              <div className="mt-6 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl font-black text-transparent bg-gradient-to-r from-green-400 to-green-500 bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300">
                100+
              </div>
              <p className="text-xl text-gray-300 font-medium">Microloans Simulated</p>
              <div className="mt-6 h-1 bg-gradient-to-r from-green-500 to-transparent rounded-full"></div>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl font-black text-transparent bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <p className="text-xl text-gray-300 font-medium">Infinite Potential</p>
              <div className="mt-6 h-1 bg-gradient-to-r from-slate-500 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-400 text-lg">
                Built for Hack the Nest 2025.
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Team Umoja</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
  }

  // Show onboarding flow if user clicked to start
  if (showOnboarding) {
    return <OnboardingFlow onComplete={forgeIdentity} isProcessing={isForging} />;
  }

  // If wallet is connected and profile exists, show dashboard
  if (publicKey && profile) {
    return <Dashboard profile={profile} />;
  }

  // If wallet is connected but no profile exists, show landing page
  if (publicKey && !profile) {
    return <LandingPage onStartOnboarding={startOnboarding} isForging={isForging} />;
  }

  // If no wallet connected, show clean landing page with 2-step CTA
  return <LandingPage onStartOnboarding={startOnboarding} isForging={isForging} />;
}