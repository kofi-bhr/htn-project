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
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user profile exists when wallet connects
  useEffect(() => {
    const checkProfile = async () => {
      if (!publicKey) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', publicKey.toString())
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking profile:', error);
        } else if (data) {
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [publicKey]);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const forgeIdentity = async (onboardingData: OnboardingData) => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    console.log('Starting identity forging process...');
    setIsForging(true);

    try {
      // For now, let's create a mock NFT address and save the profile
      // This will allow us to test the flow without dealing with Metaplex complexity
      const mockNftAddress = `mock_nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Creating mock NFT identity...');
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Saving profile to Supabase...');
      // Save profile to Supabase
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          wallet_address: publicKey.toString(),
          nft_mint_address: mockNftAddress,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving profile to Supabase:', error);
        alert(`Failed to save profile to database: ${error.message}`);
        return;
      }

      console.log('Profile saved successfully:', data);
      setProfile(data);
      setShowOnboarding(false);

    } catch (error) {
      console.error('Error forging identity:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to forge identity. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsForging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Loading...</p>
      </div>
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