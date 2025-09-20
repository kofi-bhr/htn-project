"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import WorldMap from '@/components/ui/world-map';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  onStartOnboarding: () => void;
  isForging: boolean;
  hasProfile?: boolean;
  onGoToDashboard?: () => void;
}

interface TypewriterTextProps {
  phrases: string[];
}

function TypewriterText({ phrases }: TypewriterTextProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000); // Pause before deleting
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentPhraseIndex, isDeleting, phrases]);

  return (
    <span>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function LandingPage({ onStartOnboarding, isForging, hasProfile, onGoToDashboard }: LandingPageProps) {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Circuit board style circular frame */}
                  <circle cx="20" cy="20" r="18" stroke="#60A5FA" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="20" r="14" stroke="#60A5FA" strokeWidth="1" fill="none"/>
                  
                  {/* Letter U */}
                  <text x="20" y="26" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#60A5FA" fontFamily="Arial, sans-serif">U</text>
                  
                  {/* Left connecting lines and dots */}
                  <line x1="2" y1="20" x2="8" y2="20" stroke="#60A5FA" strokeWidth="1"/>
                  <line x1="2" y1="16" x2="8" y2="16" stroke="#60A5FA" strokeWidth="1"/>
                  <line x1="2" y1="24" x2="8" y2="24" stroke="#60A5FA" strokeWidth="1"/>
                  <circle cx="2" cy="20" r="1.5" fill="#60A5FA"/>
                  <circle cx="2" cy="16" r="1.5" fill="#60A5FA"/>
                  <circle cx="2" cy="24" r="1.5" fill="#60A5FA"/>
                  
                  {/* Right connecting lines and dots */}
                  <line x1="32" y1="20" x2="38" y2="20" stroke="#60A5FA" strokeWidth="1"/>
                  <line x1="32" y1="16" x2="38" y2="16" stroke="#60A5FA" strokeWidth="1"/>
                  <line x1="32" y1="24" x2="38" y2="24" stroke="#60A5FA" strokeWidth="1"/>
                  <circle cx="38" cy="20" r="1.5" fill="#60A5FA"/>
                  <circle cx="38" cy="16" r="1.5" fill="#60A5FA"/>
                  <circle cx="38" cy="24" r="1.5" fill="#60A5FA"/>
                  
                  {/* Top and bottom curved lines */}
                  <path d="M 20 2 Q 20 8 20 8" stroke="#60A5FA" strokeWidth="1" fill="none"/>
                  <path d="M 20 32 Q 20 38 20 38" stroke="#60A5FA" strokeWidth="1" fill="none"/>
                  <circle cx="20" cy="2" r="1.5" fill="#60A5FA"/>
                  <circle cx="20" cy="38" r="1.5" fill="#60A5FA"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground font-mono">Project Umoja</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#about" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#features" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#impact" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                Impact
              </a>
              <Link href="/calculator">
                <Button variant="outline" size="sm" className="font-mono">
                  Calculator
                </Button>
              </Link>
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated World Map Background */}
        <div className="absolute inset-0 opacity-20">
          <WorldMap
            dots={[
              {
                start: { lat: 40.7128, lng: -74.0060 }, // New York
                end: { lat: 51.5074, lng: -0.1278 }, // London
              },
              {
                start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
                end: { lat: -33.8688, lng: 151.2093 }, // Sydney
              },
              {
                start: { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 1.3521, lng: 103.8198 }, // Singapore
                end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              },
              {
                start: { lat: 55.7558, lng: 37.6176 }, // Moscow
                end: { lat: -15.7975, lng: -47.8919 }, // Brasília
              },
              {
                start: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
                end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
              },
            ]}
            lineColor="#0ea5e9"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Centered Heading */}
          <div className="text-center mb-16">
             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-mono leading-tight">
               <TypewriterText phrases={["Your Identity.", "Your Capital.", "Your Future."]} />
             </h1>
             <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Financial inclusion for the{" "}
              <span className="text-primary">
                {"1.4B_ALICEs".split("").map((char, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-block"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.04 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>{" "}
              worldwide. Create your digital identity on the Solana blockchain.
            </p>
          </div>

          {/* Steps Card */}
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
               <Card className="p-8 space-y-6 border-4">
                 <div className="text-center">
                   <CardTitle className="text-2xl font-bold font-mono mb-2">
                     {hasProfile ? 'Welcome Back!' : 'Get Started with Project Umoja'}
                   </CardTitle>
                <CardDescription className="font-sans">
                  {hasProfile 
                    ? 'Your digital identity is ready. Access your dashboard or learn more about EFIS.'
                    : 'Follow these simple steps to forge your digital identity.'
                  }
                </CardDescription>
              </div>

              {hasProfile ? (
                <div className="space-y-4">
                   <Card className="p-4 flex items-center justify-between border-4">
                     <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold font-mono">✓</div>
                       <span className="text-lg font-medium font-sans">Identity Created</span>
                     </div>
                    <Badge className="bg-primary text-primary-foreground font-mono">Complete</Badge>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {onGoToDashboard && (
                      <Button
                        onClick={onGoToDashboard}
                        className="flex-1 font-mono"
                        size="lg"
                      >
                        Go to Dashboard
                      </Button>
                    )}
                    <Link href="/calculator" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full font-mono"
                        size="lg"
                      >
                        Try Calculator
                      </Button>
                    </Link>
                    <Link href="/about" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full font-mono"
                        size="lg"
                      >
                        Learn About EFIS
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                   {/* Step 1: Connect Wallet */}
                   <Card className="p-4 flex items-center justify-between border-4">
                     <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold font-mono">1</div>
                       <span className="text-lg font-medium font-sans">Connect Your Wallet</span>
                     </div>
                    {connected ? (
                      <Badge className="bg-primary text-primary-foreground font-mono">✓ Connected</Badge>
                    ) : (
                      <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-lg !px-4 !py-2 !font-medium !font-mono" />
                    )}
                  </Card>

                   {/* Step 2: Start Onboarding */}
                   <Card className="p-4 flex items-center justify-between border-4">
                     <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold font-mono">2</div>
                       <span className="text-lg font-medium font-sans">Start Onboarding</span>
                     </div>
                    <Button
                      onClick={onStartOnboarding}
                      disabled={!connected || isForging}
                      className="font-mono"
                    >
                      {isForging ? 'Processing...' : 'Start'}
                    </Button>
                  </Card>
                </div>
              )}

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
                  <InlineMath math="\mathcal{U}_i(t) = \omega_H \times H_i(t) + \omega_S \times S_i(t) + \omega_R \times R_i(t) + \omega_B \times B_i(t)" />
                </div>
              </div>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-mono">
               The Problem We Solve
             </h2>
             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditional credit scoring excludes 1.4B people worldwide. We use mathematics to bridge this gap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
             {/* The Problem */}
             <Card className="p-8 border-4 bg-card">
               <CardHeader>
                 <CardTitle className="text-2xl font-bold font-mono text-destructive">The Problem</CardTitle>
               </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-foreground font-sans">Information asymmetry in credit markets</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-foreground font-sans">No formal financial history for ALICE individuals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-foreground font-sans">Traditional banks can't assess risk</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-foreground font-sans">1.4B people excluded from formal credit</span>
                  </div>
                </div>
                <blockquote className="text-base text-muted-foreground italic border-l-4 border-destructive pl-4 font-sans">
                  "The system wasn't built for her. So we built Umoja."
                </blockquote>
              </CardContent>
            </Card>

             {/* The Solution */}
             <Card className="p-8 border-4 bg-card">
               <CardHeader>
                 <CardTitle className="text-2xl font-bold font-mono text-primary">Our Solution</CardTitle>
               </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-sans">Self-sovereign identity NFTs on Solana</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-sans">EFIS: Equitable Financial Inclusion Score</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-sans">Kalman filtering for income assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground font-sans">Reputation tokens for credit building</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2 font-sans">
                    Mathematical foundation:
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    <InlineMath math="\mathcal{U}_i(t) = \omega_H \times H_i(t) + \omega_S \times S_i(t) + \omega_R \times R_i(t) + \omega_B \times B_i(t)" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alice's Story Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Placeholder */}
            <div className="flex justify-center lg:justify-start">
              <Card className="w-80 h-96 flex items-center justify-center">
                <span className="text-muted-foreground text-lg font-mono">Alice Image</span>
              </Card>
            </div>

            <div className="space-y-8">
               <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-mono">
                 Meet Alice
               </h2>
               <p className="text-xl text-muted-foreground leading-relaxed mb-6 font-sans">
                Alice represents the 1.4B people worldwide who are Asset-Limited, Income-Constrained, but Employed. Traditional banks can't serve her, but Project Umoja helps her thrive.
              </p>
              <blockquote className="text-xl sm:text-2xl font-semibold text-primary italic border-l-4 border-primary pl-6 font-mono">
                "The system wasn't built for her. So we built Umoja."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
             <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-mono">
               Why Project Umoja?
             </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 border-4">
              <CardHeader>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <div className="w-10 h-10 bg-primary-foreground rounded-full"></div>
                </div>
                <CardTitle className="text-2xl font-bold font-mono">
                  Self-Sovereign Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  Minted as a soulbound NFT you own forever.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 border-4">
              <CardHeader>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <div className="w-10 h-10 bg-primary-foreground rounded-full"></div>
                </div>
                <CardTitle className="text-2xl font-bold font-mono">
                  Reputation Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  Every repaid loan builds your blockchain-based credit score.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 border-4">
              <CardHeader>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <div className="w-10 h-10 bg-primary-foreground rounded-full"></div>
                </div>
                <CardTitle className="text-2xl font-bold font-mono">
                  Microloans Powered by AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  Data-validated loans assessed with Wolfram-powered algorithms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
             <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-mono">
               Our Impact
             </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Stat 1 */}
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform duration-300 font-mono">
                1.4B
              </div>
              <p className="text-lg text-muted-foreground font-medium font-sans">People Represented</p>
              <div className="mt-6 h-1 bg-primary rounded-full"></div>
            </div>

            {/* Stat 2 */}
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform duration-300 font-mono">
                100+
              </div>
              <p className="text-lg text-muted-foreground font-medium font-sans">Microloans Simulated</p>
              <div className="mt-6 h-1 bg-primary rounded-full"></div>
            </div>

            {/* Stat 3 */}
            <div className="text-center group">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform duration-300 font-mono">
                ∞
              </div>
              <p className="text-lg text-muted-foreground font-medium font-sans">Infinite Potential</p>
              <div className="mt-6 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-foreground py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-muted-foreground text-base font-sans">
                Built for Hack the Nest 2025.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground font-mono">Team Umoja</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}