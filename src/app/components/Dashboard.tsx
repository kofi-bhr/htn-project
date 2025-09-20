"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Profile } from '@/lib/supabaseClient';

interface DashboardProps {
  profile: Profile;
}

export default function Dashboard({ profile }: DashboardProps) {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <h1 className="text-xl font-bold text-white">Project Umoja</h1>
            </div>
            <WalletMultiButton className="!bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 !text-white !border-0 !rounded-lg !px-6 !py-2 !font-medium" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to Your Identity Dashboard
          </h2>
          <p className="text-xl text-gray-300">
            Your digital identity has been successfully forged on the Solana blockchain
          </p>
        </div>

        {/* Identity Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {profile.wallet_address.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Your Digital Identity
          </h3>
          
          <div className="space-y-4">
            <div className="bg-black/20 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wallet Address
              </label>
              <p className="text-white font-mono text-sm break-all">
                {profile.wallet_address}
              </p>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                NFT Mint Address
              </label>
              <p className="text-white font-mono text-sm break-all">
                {profile.nft_mint_address}
              </p>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Created On
              </label>
              <p className="text-white text-sm">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
            View NFT on Solscan
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20">
            Share Identity
          </button>
        </div>
      </main>
    </div>
  );
}
