"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPageProps {
  onForgeIdentity: () => void;
  isForging: boolean;
}

export default function LandingPage({ onForgeIdentity, isForging }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold text-foreground">Project Umoja</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300">Home</a>
              <a href="#about" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300">About</a>
              <a href="#features" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300">Features</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative text-center max-w-5xl mx-auto z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground mb-8 leading-tight">
            Your Identity. Your Capital. Your Future.
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-12 font-light max-w-4xl mx-auto leading-relaxed">
            Financial inclusion for the 1.4B ALICEs worldwide.
          </p>
          
          <Button 
            onClick={onForgeIdentity}
            size="lg"
            className="text-xl font-bold px-12 py-6"
            disabled={isForging}
          >
            {isForging ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>Forging Identity...</span>
              </div>
            ) : (
              'Connect Wallet & Create Identity'
            )}
          </Button>
          
          {/* Illustration Placeholder */}
          <div className="mt-16 flex justify-center">
            <Card className="w-64 h-32">
              <CardContent className="flex items-center justify-center h-full">
                <span className="text-muted-foreground text-lg font-medium">Illustration</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alice's Story Section */}
      <section id="about" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Placeholder */}
            <div className="flex justify-center lg:justify-start">
              <Card className="w-80 h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <span className="text-muted-foreground text-lg font-medium">Alice Image</span>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-8">
                Meet Alice
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Alice represents the 1.4B people worldwide who are Asset-Limited, Income-Constrained, but Employed. Traditional banks can't serve her, but Project Umoja helps her thrive.
              </p>
              
              <blockquote className="text-3xl sm:text-4xl font-bold text-primary italic border-l-4 border-primary pl-6">
                "The system wasn't built for her. So we built Umoja."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-6">
              Why Project Umoja?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <div className="w-10 h-10 bg-primary-foreground rounded-full"></div>
                </div>
                <CardTitle className="text-2xl">
                  Self-Sovereign Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Minted as a soulbound NFT you own forever.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="group hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <div className="w-10 h-10 bg-primary-foreground rounded-full"></div>
                </div>
                <CardTitle className="text-2xl">
                  Reputation Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Every repaid loan builds your blockchain-based credit score.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="group hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-lg">
                  <div className="w-10 h-10 bg-primary-foreground rounded-full"></div>
                </div>
                <CardTitle className="text-2xl">
                  Microloans Powered by AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Data-validated loans assessed with Wolfram-powered algorithms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-6">
              Our Impact
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Stat 1 */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl font-black text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                1.4B
              </div>
              <p className="text-xl text-muted-foreground font-medium">People Represented</p>
              <div className="mt-6 h-1 bg-primary rounded-full"></div>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl font-black text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                100+
              </div>
              <p className="text-xl text-muted-foreground font-medium">Microloans Simulated</p>
              <div className="mt-6 h-1 bg-primary rounded-full"></div>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl font-black text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <p className="text-xl text-muted-foreground font-medium">Infinite Potential</p>
              <div className="mt-6 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-foreground py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-muted-foreground text-lg">
                Built for Hack the Nest 2025.
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">Team Umoja</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
