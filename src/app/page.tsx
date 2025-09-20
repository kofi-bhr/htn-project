"use client";

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { supabase, Profile } from '@/lib/supabaseClient';
import LandingPage from './components/LandingPage';
import OnboardingFlow, { OnboardingData } from './components/OnboardingFlow';
import { createNFTService } from '@/lib/nftService';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mintingStatus, setMintingStatus] = useState<string>('');

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
          // Don't auto-redirect - let user choose when to go to dashboard
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
  }, [publicKey, router]);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const forgeIdentity = async (onboardingData: OnboardingData) => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    console.log('Starting identity forging process...');
    setIsForging(true);
    setMintingStatus('Initializing NFT creation...');

    try {
      // Create NFT service instance
      const nftService = createNFTService(connection, publicKey);
      
      setMintingStatus('Creating NFT metadata...');
      console.log('Creating real NFT identity...');
      
      // Create the actual NFT on Solana devnet
      const { mintAddress, transactionSignature } = await nftService.createIdentityNFT(
        publicKey.toString(),
        onboardingData
      );
      
      setMintingStatus('Saving profile to database...');
      console.log('NFT minted successfully:', mintAddress);
      console.log('Transaction signature:', transactionSignature);
      
      // Save profile to Supabase with real NFT address
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          wallet_address: publicKey.toString(),
          nft_mint_address: mintAddress,
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
      setMintingStatus('');
      
      // Show success message with blockchain explorer link
      alert(`🎉 Identity NFT minted successfully!\n\nNFT Address: ${mintAddress}\nTransaction: ${transactionSignature}\n\nView on Solscan: https://devnet.solscan.io/token/${mintAddress}`);

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
      setMintingStatus('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground text-lg font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding flow if user clicked to start
  if (showOnboarding) {
    return <OnboardingFlow onComplete={forgeIdentity} isProcessing={isForging} mintingStatus={mintingStatus} />;
  }

  // Always show landing page (dashboard redirect is handled in useEffect)
  return (
    <LandingPage 
      onStartOnboarding={startOnboarding} 
      isForging={isForging}
      hasProfile={!!profile}
      onGoToDashboard={goToDashboard}
    />
  );
}
