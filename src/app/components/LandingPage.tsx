"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
                <span className="text-primary-foreground font-bold text-sm font-mono">U</span>
              </div>
              <span className="text-xl font-bold text-foreground font-mono">Project Umoja</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="outline" size="sm" className="font-mono">
                  About EFIS
                </Button>
              </Link>
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-lg !px-6 !py-2 !font-medium" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-mono leading-tight">
                  Your Identity.<br />
                  Your Capital.<br />
                  Your Future.
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  Financial inclusion for the 1.4B ALICEs worldwide. Create your digital identity on the Solana blockchain.
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-mono">Self-sovereign identity NFT</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-mono">EFIS credit scoring system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-mono">Blockchain-secured biometrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-mono">Microloan access</span>
                </div>
              </div>

              {/* Mathematical Foundation */}
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 font-mono">the mathematics of inclusion</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  we solve information asymmetry with the equitable financial inclusion score (efis), using kalman filtering to extract true economic capacity from noisy income data and signaling theory to build reputation through blockchain tokens.
                </p>
                <div className="text-xs font-mono text-muted-foreground">
                  U_i(t) = w_h × H_i(t) + w_s × S_i(t) + w_r × R_i(t) + w_b × B_i(t)
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  onClick={onStartOnboarding}
                  size="lg"
                  className="text-lg font-bold px-8 py-4 font-mono"
                  disabled={isForging}
                >
                  {isForging ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Identity...</span>
                    </div>
                  ) : (
                    'Start Your Journey'
                  )}
                </Button>
              </div>
            </div>

            {/* Right Side - Steps with Arrow */}
            <div className="relative">
              {/* Hand-drawn Arrow */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-10">
                <svg width="60" height="40" viewBox="0 0 60 40" className="text-primary">
                  <path
                    d="M10 20 L45 20 M35 10 L45 20 L35 30"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Steps Card */}
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle className="font-mono">Get Started</CardTitle>
                  <CardDescription className="font-mono">Two simple steps to forge your digital identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Step 1: Connect Wallet */}
                  <div className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-300 ${
                    connected ? 'border-green-500 bg-green-50' : 'border-border'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono ${
                      connected ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium font-mono">Connect Your Wallet</p>
                      <p className="text-sm text-muted-foreground font-mono">Link your Solana wallet to get started</p>
                    </div>
                    {connected ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 font-mono">
                        ✓ Connected
                      </Badge>
                    ) : (
                      <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-md !px-4 !py-2 !text-sm" />
                    )}
                  </div>

                  {/* Step 2: Start Onboarding */}
                  <div className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-300 ${
                    connected ? 'border-primary bg-primary/5' : 'border-border opacity-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono ${
                      connected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium font-mono">Create Your Identity</p>
                      <p className="text-sm text-muted-foreground font-mono">Complete onboarding to mint your NFT</p>
                    </div>
                    <Button 
                      onClick={onStartOnboarding}
                      disabled={!connected || isForging}
                      size="sm"
                      className="font-mono"
                    >
                      {isForging ? 'Creating...' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 font-mono">
                Meet Alice
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Alice represents the 1.4B people worldwide who are Asset-Limited, Income-Constrained, but Employed. Traditional banks can't serve her, but Project Umoja helps her thrive.
              </p>
              <blockquote className="text-xl font-semibold text-primary italic border-l-4 border-primary pl-4 font-mono">
                "The system wasn't built for her. So we built Umoja."
              </blockquote>
            </div>
            <Card className="h-80">
              <CardContent className="flex items-center justify-center h-full">
                <span className="text-muted-foreground text-lg font-mono">Alice Illustration</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-mono">
              Our Impact
            </h2>
            <p className="text-lg text-muted-foreground font-mono">
              Empowering financial inclusion through blockchain technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2 font-mono">1.4B</div>
                <p className="text-muted-foreground font-mono">People Represented</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2 font-mono">100+</div>
                <p className="text-muted-foreground font-mono">Microloans Simulated</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2 font-mono">∞</div>
                <p className="text-muted-foreground font-mono">Infinite Potential</p>
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
              <p className="text-muted-foreground font-mono">
                Built for Hack the Nest 2025
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground font-mono">Team Umoja</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}