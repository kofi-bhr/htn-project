"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Profile } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  profile: Profile;
}

export default function Dashboard({ profile }: DashboardProps) {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">U</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Project Umoja</h1>
            </div>
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-lg !px-6 !py-2 !font-medium" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Your digital identity has been successfully created
          </p>
        </div>

        {/* Identity Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">
                  {profile.wallet_address.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl">Your Digital Identity</CardTitle>
            <CardDescription>
              Your unique identity NFT on the Solana blockchain
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Wallet Address
              </label>
              <p className="text-foreground font-mono text-sm break-all">
                {profile.wallet_address}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                NFT Address
              </label>
              <p className="text-foreground font-mono text-sm break-all">
                {profile.nft_mint_address}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Created On
              </label>
              <p className="text-foreground text-sm">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            View NFT Details
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Share Identity
          </Button>
        </div>

        {/* Status Badge */}
        <div className="text-center mt-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            ✓ Identity Verified
          </Badge>
        </div>
      </main>
    </div>
  );
}