"use client";

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Keypair } from '@solana/web3.js';
import { supabase, Profile } from '@/lib/supabaseClient';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

export default function Home() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isForging, setIsForging] = useState(false);

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

  const forgeIdentity = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    setIsForging(true);

    try {
      // Initialize Metaplex
      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(Keypair.generate()));

      // Create metadata for the NFT
      const metadata = {
        name: `Project Umoja Identity #${Date.now()}`,
        symbol: 'UMOJA',
        description: `A unique digital identity NFT for ${publicKey.toString()} on Project Umoja`,
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

      // Create NFT
      console.log('Creating NFT...');
      const { nft } = await metaplex.nfts().create({
        uri: uri,
        name: metadata.name,
        symbol: metadata.symbol,
        sellerFeeBasisPoints: 0,
        updateAuthority: metaplex.identity(),
        mintAuthority: metaplex.identity(),
        tokenOwner: publicKey,
        isMutable: true,
        creators: [
          {
            address: publicKey,
            share: 100,
          },
        ],
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

    } catch (error) {
      console.error('Error forging identity:', error);
      alert('Failed to forge identity. Please try again.');
    } finally {
      setIsForging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If wallet is connected and profile exists, show dashboard
  if (publicKey && profile) {
    return <Dashboard profile={profile} />;
  }

  // If wallet is connected but no profile exists, show landing page
  if (publicKey && !profile) {
    return <LandingPage onForgeIdentity={forgeIdentity} isForging={isForging} />;
  }

  // If no wallet connected, show landing page with connect wallet prompt
  return <LandingPage onForgeIdentity={forgeIdentity} isForging={isForging} />;
}