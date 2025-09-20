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

    setIsForging(true);

    try {
      // Initialize Metaplex with a simple setup
      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(Keypair.generate()));

      // Create metadata for the NFT with onboarding data
      const metadata = {
        name: `Project Umoja Identity #${Date.now()}`,
        symbol: 'UMOJA',
        description: `A unique digital identity NFT for ${publicKey.toString()} on Project Umoja. Age: ${onboardingData.age}, Purpose: ${onboardingData.purpose}, Location: ${onboardingData.location}`,
        image: 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=U',
        attributes: [
          {
            trait_type: 'Identity Type',
            value: 'Digital Identity'
          },
          {
            trait_type: 'Blockchain',
            value: 'Solana'
          },
          {
            trait_type: 'Project',
            value: 'Umoja'
          },
          {
            trait_type: 'Wallet Address',
            value: publicKey.toString()
          },
          {
            trait_type: 'Age Range',
            value: onboardingData.age
          },
          {
            trait_type: 'Purpose',
            value: onboardingData.purpose
          },
          {
            trait_type: 'Location',
            value: onboardingData.location
          },
          {
            trait_type: 'Facial Recognition',
            value: onboardingData.facialRecognitionComplete ? 'Completed' : 'Skipped'
          }
        ],
        properties: {
          files: [
            {
              uri: 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=U',
              type: 'image/png'
            }
          ],
          category: 'image'
        }
      };

      // Upload metadata
      console.log('Uploading metadata...');
      const { uri } = await metaplex.nfts().uploadMetadata(metadata);
      console.log('Metadata uploaded:', uri);

      // Create NFT with simplified parameters
      console.log('Creating NFT...');
      const { nft } = await metaplex.nfts().create({
        uri: uri,
        name: metadata.name,
        symbol: metadata.symbol,
        sellerFeeBasisPoints: 0,
        tokenOwner: publicKey,
        isMutable: true,
      });

      console.log('NFT created:', nft.address.toString());

      // Save profile to Supabase
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          wallet_address: publicKey.toString(),
          nft_mint_address: nft.address.toString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile to database');
        return;
      }

      console.log('Profile saved:', data);
      setProfile(data);
      setShowOnboarding(false);

    } catch (error) {
      console.error('Error forging identity:', error);
      alert('Failed to forge identity. Please try again.');
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
    return <LandingPage onForgeIdentity={startOnboarding} isForging={isForging} />;
  }

  // If no wallet connected, show cofounder's beautiful landing page with wallet integration
  return <LandingPage onForgeIdentity={startOnboarding} isForging={isForging} />;
}