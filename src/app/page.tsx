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
    setMintingStatus('Creating your profile...');

    try {
      const tempNftAddress = `temp_nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setMintingStatus('Saving profile to database...');
      console.log('Saving profile to Supabase...');
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            wallet_address: publicKey.toString(),
            nft_mint_address: tempNftAddress,
          },
          { onConflict: 'wallet_address' }
        )
        .select()
        .single();

      if (error) {
        console.error('Error saving profile to Supabase:', error);
        alert(`Failed to save profile to database: ${error.message}`);
        return;
      }

      setProfile(data);
      setShowOnboarding(false);
      setMintingStatus('');
      
      // Start minting in the background (non-blocking)
      mintNFTInBackground(publicKey, onboardingData, data.id);
      
      // Navigate to dashboard immediately after successful save
      router.push('/dashboard');

    } catch (error) {
      console.error('Error forging identity:', error);
      
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

  const mintNFTInBackground = async (publicKey: any, onboardingData: OnboardingData, profileId: string) => {
    try {
      console.log('Starting background NFT minting...');
      
      const nftService = createNFTService(connection, publicKey);
      
      const { mintAddress, transactionSignature } = await nftService.createIdentityNFT(
        publicKey.toString(),
        onboardingData
      );
      
      console.log('NFT minted successfully:', mintAddress);
      console.log('Transaction signature:', transactionSignature);
      
      const { error } = await supabase
        .from('profiles')
        .update({ nft_mint_address: mintAddress })
        .eq('id', profileId);

      if (error) {
        console.error('Error updating profile with NFT address:', error);
      } else {
        console.log('Profile updated with real NFT address');
        
        alert(`🎉 Your NFT has been minted!\n\nNFT Address: ${mintAddress}\nTransaction: ${transactionSignature}\n\nView on Solscan: https://devnet.solscan.io/token/${mintAddress}`);
      }

    } catch (error) {
      console.error('Error in background NFT minting:', error);
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

  if (showOnboarding) {
    return <OnboardingFlow onComplete={forgeIdentity} isProcessing={isForging} mintingStatus={mintingStatus} />;
  }

  return (
    <LandingPage 
      onStartOnboarding={startOnboarding} 
      isForging={isForging}
      hasProfile={!!profile}
      onGoToDashboard={goToDashboard}
    />
  );
}
