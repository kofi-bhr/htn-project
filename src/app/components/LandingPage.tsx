"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPageProps {
  onStartOnboarding: () => void;
  isForging: boolean;
}

export default function LandingPage({ onStartOnboarding, isForging }: LandingPageProps) {
  const { publicKey, connected } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold text-foreground">Project Umoja</span>
            </div>
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-lg !px-6 !py-2 !font-medium" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Your Identity. Your Capital. Your Future.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Financial inclusion for the 1.4B ALICEs worldwide. Create your digital identity on the Solana blockchain.
          </p>

          {/* 2-Step CTA */}
          <Card className="max-w-md mx-auto mb-12">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Two simple steps to forge your digital identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 1: Connect Wallet */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  connected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Connect Your Wallet</p>
                  <p className="text-sm text-muted-foreground">Link your Solana wallet to get started</p>
                </div>
                {connected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓ Connected
                  </Badge>
                ) : (
                  <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-md !px-4 !py-2 !text-sm" />
                )}
              </div>

              {/* Step 2: Start Onboarding */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  connected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Create Your Identity</p>
                  <p className="text-sm text-muted-foreground">Complete onboarding to mint your NFT</p>
                </div>
                <Button 
                  onClick={onStartOnboarding}
                  disabled={!connected || isForging}
                  size="sm"
                >
                  {isForging ? 'Creating...' : 'Start'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Your identity is protected by blockchain cryptography and cannot be tampered with.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Verifiable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Anyone can verify your identity authenticity using the blockchain.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Instant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Create your identity in seconds with Solana's fast and low-cost transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Meet Alice
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Alice represents the 1.4B people worldwide who are Asset-Limited, Income-Constrained, but Employed. Traditional banks can't serve her, but Project Umoja helps her thrive.
              </p>
              <blockquote className="text-xl font-semibold text-primary italic border-l-4 border-primary pl-4">
                "The system wasn't built for her. So we built Umoja."
              </blockquote>
            </div>
            <Card className="h-80">
              <CardContent className="flex items-center justify-center h-full">
                <span className="text-muted-foreground text-lg">Alice Illustration</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              Empowering financial inclusion through blockchain technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">1.4B</div>
                <p className="text-muted-foreground">People Represented</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <p className="text-muted-foreground">Microloans Simulated</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">∞</div>
                <p className="text-muted-foreground">Infinite Potential</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-muted-foreground">
                Built for Hack the Nest 2025
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Team Umoja</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}