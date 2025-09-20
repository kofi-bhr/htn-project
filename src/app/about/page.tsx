"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
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
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="font-mono">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-mono">
              About EFIS
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The Equitable Financial Inclusion Score (EFIS) is a revolutionary credit assessment framework designed for underserved populations.
            </p>
            <Badge variant="secondary" className="font-mono">
              📊 Academic Research • Blockchain Innovation
            </Badge>
          </div>

          {/* Problem Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">The Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Over 1.4 billion adults lack access to formal credit. Traditional credit scoring models exclude Asset-Limited, Income-Constrained, but Employed (ALICE) individuals by relying on formal financial histories that are unavailable to this demographic.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 font-mono">Traditional Credit Scoring</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Requires formal financial history</li>
                    <li>• Excludes 1.4B people globally</li>
                    <li>• Creates information asymmetry</li>
                    <li>• Leads to adverse selection</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 font-mono">EFIS Solution</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Uses alternative data sources</li>
                    <li>• Includes social capital</li>
                    <li>• Builds reputation from zero</li>
                    <li>• Transparent and explainable</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EFIS Components */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">EFIS Components</CardTitle>
              <CardDescription className="font-mono">
                Four integrated components that create a comprehensive creditworthiness assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Human Capital */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm font-mono">H</span>
                    </div>
                    <h3 className="text-lg font-semibold font-mono">Human Capital</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uses Kalman filtering to extract true economic capacity from noisy income data, incorporating verified credentials and education.
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    Formula: <InlineMath math="H_i(t) = E[\theta_t | y_{1:t}] \times (1 + \sum \delta_j c_{ij})" />
                  </div>
                </div>

                {/* Social Capital */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm font-mono">S</span>
                    </div>
                    <h3 className="text-lg font-semibold font-mono">Social Capital</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quantifies community networks as collateral through verified endorsements weighted by network distance and endorser credibility.
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    Formula: <InlineMath math="S_i(t) = \sum \frac{v_{ji} \times U_j(t-1)}{d(i,j)}" />
                  </div>
                </div>

                {/* Reputation */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm font-mono">R</span>
                    </div>
                    <h3 className="text-lg font-semibold font-mono">Reputation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Creates costly signaling through non-transferable Reputation Tokens linked to successful loan repayments with streaking bonuses.
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    Formula: <InlineMath math="R_i(t) = \sum \lambda^k \times \tanh\left(\frac{L_k}{C}\right) \times I(\text{repaid}_k)" />
                  </div>
                </div>

                {/* Behavioral */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm font-mono">B</span>
                    </div>
                    <h3 className="text-lg font-semibold font-mono">Behavioral</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Measures financial discipline through time discount rates and loss aversion inferred from savings patterns and risk management behaviors.
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    Formula: <InlineMath math="B_i(t) = \frac{k_1}{\log(1+\hat{\beta}_i)} + k_2 \hat{\gamma}_i" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mathematical Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Mathematical Framework</CardTitle>
              <CardDescription className="font-mono">
                The complete EFIS formula and its theoretical foundations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h4 className="font-semibold mb-4 font-mono">EFIS Score Formula</h4>
                <div className="text-center space-y-4">
                  <div className="text-2xl font-mono">
                    <BlockMath math="\mathcal{U}_i(t) = \omega_H \times H_i(t) + \omega_S \times S_i(t) + \omega_R \times R_i(t) + \omega_B \times B_i(t)" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Where each component k has weight <InlineMath math="\omega_k" /> with <InlineMath math="\sum \omega_k = 1" />, calibrated using machine learning on historical repayment data.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold font-mono">Key Features</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-mono">Transparent & Explainable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-mono">Self-Sovereign Identity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-mono">Blockchain Secured</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-mono">Zero-History Start</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-mono">Community Driven</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-mono">Dynamic Scoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Paper */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Academic Foundation</CardTitle>
              <CardDescription className="font-mono">
                Based on peer-reviewed research and economic theory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 font-mono">Research Paper</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  "The Equitable Financial Inclusion Score (EFIS): A Microeconomic Framework for Credit Assessment in Underserved Populations"
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Author: Maya Patel, Stanford University</div>
                  <div>JEL Classification: D82, G21, O16, C58</div>
                  <div>Keywords: financial inclusion, credit scoring, information asymmetry, microfinance, behavioral economics</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The EFIS model synthesizes principles from stochastic calculus, network theory, game theory, and behavioral economics to create a comprehensive framework for financial inclusion.
              </p>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Expected Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2 font-mono">1.4B</div>
                  <p className="text-sm text-muted-foreground font-mono">People Gaining Access</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2 font-mono">$2.5T</div>
                  <p className="text-sm text-muted-foreground font-mono">Economic Potential Unlocked</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2 font-mono">85%</div>
                  <p className="text-sm text-muted-foreground font-mono">Reduction in Default Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground font-mono">Ready to Experience EFIS?</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Create your digital identity and see how EFIS can transform your financial future.
            </p>
            <Link href="/">
              <Button size="lg" className="font-mono">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
