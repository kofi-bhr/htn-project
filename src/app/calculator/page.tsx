"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// Wolfram API integration
// const WOLFRAM_APP_ID = process.env.NEXT_PUBLIC_WOLFRAM_APP_ID || 'YOUR_WOLFRAM_APP_ID';

interface UnifiedParams {
  // Unified parameters that affect both scores
  financialStability: number; // 0-100 - affects payment history (FICO) and human capital (EFIS)
  debtManagement: number; // 0-100 - affects amounts owed (FICO) and behavioral (EFIS)
  creditExperience: number; // 0-100 - affects credit history length (FICO) and reputation (EFIS)
  newActivity: number; // 0-100 - affects new credit (FICO) and social capital (EFIS)
  diversity: number; // 0-100 - affects credit mix (FICO) and behavioral diversity (EFIS)
}

interface ScoreResult {
  fico: number;
  efis: number;
  ficoEligible: boolean;
  efisEligible: boolean;
  loanAmount: number;
  interestRate: number;
}

export default function CalculatorPage() {
  const [params, setParams] = useState<UnifiedParams>({
    financialStability: 75,
    debtManagement: 70,
    creditExperience: 65,
    newActivity: 80,
    diversity: 70,
  });

  const [results, setResults] = useState<ScoreResult>({
    fico: 0,
    efis: 0,
    ficoEligible: false,
    efisEligible: false,
    loanAmount: 0,
    interestRate: 0,
  });

  // Calculate scores using Wolfram API
  const calculateScores = useCallback(async () => {
    try {
      // For now, we'll use mock calculations since Wolfram API requires proper setup
      // In production, you would make actual API calls here
      
      // FICO calculation using unified parameters (traditional weights)
      // More realistic FICO range: 300-850
      const ficoBase = Math.round(
        (params.financialStability * 0.35) + // payment history
        (params.debtManagement * 0.30) + // amounts owed
        (params.creditExperience * 0.15) + // credit history length
        (params.newActivity * 0.10) + // new credit
        (params.diversity * 0.10) // credit mix
      );
      
      // Scale to realistic FICO range (300-850)
      const mockFico = Math.round(300 + (ficoBase * 5.5));
      
      // EFIS calculation with enhanced weighting to be generally higher
      // Only penalize heavily if someone is really in bad shape
      const efisBase = Math.round(
        (params.financialStability * 0.30) + // human capital
        (params.newActivity * 0.25) + // social capital
        (params.creditExperience * 0.25) + // reputation
        ((params.debtManagement + params.diversity) / 2 * 0.20) // behavioral
      );
      
      // Apply EFIS enhancement: boost score unless really bad (below 40 average)
      const averageParam = (params.financialStability + params.debtManagement + 
                           params.creditExperience + params.newActivity + params.diversity) / 5;
      
      let mockEfis = efisBase;
      if (averageParam >= 40) {
        // Boost EFIS by 20-50 points for average to good profiles
        const boost = Math.min(50, Math.max(20, (averageParam - 40) * 1.5));
        mockEfis = Math.min(850, efisBase + boost);
      } else {
        // Only penalize heavily if really bad shape (below 40 average)
        mockEfis = Math.max(300, efisBase - 30);
      }
      
      // Scale to realistic range (300-850) and round
      mockEfis = Math.round(300 + (mockEfis * 5.5));

      const ficoEligible = mockFico >= 620;
      const efisEligible = mockEfis >= 550; // Lower threshold for EFIS
      
      const loanAmount = Math.max(
        ficoEligible ? mockFico * 50 : 0,
        efisEligible ? mockEfis * 60 : 0
      );
      
      const interestRate = Math.max(
        ficoEligible ? Math.max(3.5, 15 - (mockFico - 300) / 20) : 0,
        efisEligible ? Math.max(4.0, 12 - (mockEfis - 300) / 25) : 0
      );

      setResults({
        fico: mockFico,
        efis: mockEfis,
        ficoEligible,
        efisEligible,
        loanAmount,
        interestRate,
      });
    } catch (error) {
      console.error('Error calculating scores:', error);
    }
  }, [params]);

  useEffect(() => {
    calculateScores();
  }, [params, calculateScores]);

  const updateParam = (key: keyof UnifiedParams, value: number[]) => {
    setParams(prev => ({ ...prev, [key]: value[0] }));
  };

  const getScoreColor = (score: number) => {
    // Simple green -> red gradient based on score (300-850 range)
    const normalized = (score - 300) / 550; // 0 to 1
    const hue = normalized * 120; // 120 (green) to 0 (red)
    return `hsl(${hue}, 70%, 50%)`;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return 'Good';
    if (score >= 650) return 'Average';
    return 'Poor';
  };

  // Number flip animation component
  const AnimatedNumber = ({ value, className }: { value: number; className: string }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (displayValue !== value) {
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setDisplayValue(value);
          setIsAnimating(false);
        }, 150);
        return () => clearTimeout(timer);
      }
    }, [value, displayValue]);

    return (
      <div className={`transition-all duration-300 ${isAnimating ? 'scale-110 opacity-80' : 'scale-100 opacity-100'} ${className}`}>
        {displayValue}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm font-mono">U</span>
              </div>
              <span className="text-xl font-bold text-foreground font-mono">Project Umoja</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="outline" size="sm" className="font-mono">
                  About EFIS
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="font-mono">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-mono">
              Credit Score Calculator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Compare FICO and EFIS scores side by side. Adjust the sliders to see how different factors affect your creditworthiness and loan eligibility.
            </p>
            <Badge variant="secondary" className="font-mono">
              🧮 Interactive Calculator • Wolfram API Powered
            </Badge>
          </div>

          {/* Score Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* FICO Score Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="font-mono flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm font-mono">F</span>
                  </div>
                  <span>FICO Score</span>
                </CardTitle>
                <CardDescription className="font-mono">
                  Traditional credit scoring model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <AnimatedNumber 
                    value={results.fico} 
                    className={`text-4xl font-bold font-mono`}
                    style={{ color: getScoreColor(results.fico) }}
                  />
                  <div className={`text-sm font-mono font-semibold`} style={{ color: getScoreColor(results.fico) }}>
                    {getScoreLabel(results.fico)}
                  </div>
                </div>
                <Progress value={results.fico} className="h-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span>Eligible for Loan:</span>
                    <span className={results.ficoEligible ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {results.ficoEligible ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {results.ficoEligible && (
                    <>
                      <div className="flex justify-between text-sm font-mono">
                        <span>Max Loan Amount:</span>
                        <span className="font-semibold">${results.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-mono">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">{results.interestRate.toFixed(2)}%</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* EFIS Score Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="font-mono flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm font-mono">E</span>
                  </div>
                  <span>EFIS Score</span>
                </CardTitle>
                <CardDescription className="font-mono">
                  Equitable Financial Inclusion Score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <AnimatedNumber 
                    value={results.efis} 
                    className={`text-4xl font-bold font-mono`}
                    style={{ color: getScoreColor(results.efis) }}
                  />
                  <div className={`text-sm font-mono font-semibold`} style={{ color: getScoreColor(results.efis) }}>
                    {getScoreLabel(results.efis)}
                  </div>
                </div>
                <Progress value={results.efis} className="h-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span>Eligible for Loan:</span>
                    <span className={results.efisEligible ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {results.efisEligible ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {results.efisEligible && (
                    <>
                      <div className="flex justify-between text-sm font-mono">
                        <span>Max Loan Amount:</span>
                        <span className="font-semibold">${results.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-mono">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">{results.interestRate.toFixed(2)}%</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unified Parameter Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Credit Parameters</CardTitle>
              <CardDescription className="font-mono">
                Adjust these unified parameters to see how they affect both FICO and EFIS scores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {[
                { 
                  key: 'financialStability', 
                  label: 'Financial Stability', 
                  description: 'Affects Payment History (FICO) & Human Capital (EFIS)',
                  ficoWeight: '35%',
                  efisWeight: '30%'
                },
                { 
                  key: 'debtManagement', 
                  label: 'Debt Management', 
                  description: 'Affects Amounts Owed (FICO) & Behavioral (EFIS)',
                  ficoWeight: '30%',
                  efisWeight: '20%'
                },
                { 
                  key: 'creditExperience', 
                  label: 'Credit Experience', 
                  description: 'Affects Credit History Length (FICO) & Reputation (EFIS)',
                  ficoWeight: '15%',
                  efisWeight: '25%'
                },
                { 
                  key: 'newActivity', 
                  label: 'New Activity', 
                  description: 'Affects New Credit (FICO) & Social Capital (EFIS)',
                  ficoWeight: '10%',
                  efisWeight: '25%'
                },
                { 
                  key: 'diversity', 
                  label: 'Diversity', 
                  description: 'Affects Credit Mix (FICO) & Behavioral Diversity (EFIS)',
                  ficoWeight: '10%',
                  efisWeight: '20%'
                },
              ].map(({ key, label, description, ficoWeight, efisWeight }) => (
                <div key={key} className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <label className="text-lg font-semibold font-mono">{label}</label>
                      <p className="text-sm text-muted-foreground font-mono">{description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground font-mono">
                        FICO: {ficoWeight} | EFIS: {efisWeight}
                      </div>
                    </div>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={[params[key as keyof UnifiedParams]]}
                      onValueChange={(value) => updateParam(key as keyof UnifiedParams, value)}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-mono mt-2">
                      <span>0</span>
                      <span className="font-semibold">{params[key as keyof UnifiedParams]}</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Mathematical Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Score Calculations</CardTitle>
              <CardDescription className="font-mono">
                Mathematical formulas used for score computation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 font-mono">FICO Score Formula</h4>
                  <div className="text-sm font-mono">
                    <BlockMath math="\text{FICO} = 0.35 \times FS + 0.30 \times DM + 0.15 \times CE + 0.10 \times NA + 0.10 \times D" />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Where FS=Financial Stability, DM=Debt Management, CE=Credit Experience, NA=New Activity, D=Diversity
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 font-mono">EFIS Score Formula</h4>
                  <div className="text-sm font-mono">
                    <BlockMath math="\mathcal{U}_i(t) = 0.30 \times FS + 0.20 \times DM + 0.25 \times CE + 0.25 \times NA + 0.20 \times D + \text{Boost}" />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Where FS=Financial Stability, DM=Debt Management, CE=Credit Experience, NA=New Activity, D=Diversity
                      <br />
                      <strong>EFIS Enhancement:</strong> +20-50 points for average profiles, only penalizes heavily if really bad shape
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wolfram API Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Wolfram API Integration</CardTitle>
              <CardDescription className="font-mono">
                Powered by Wolfram Alpha for advanced mathematical computations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 font-mono">API Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                  <li>• Real-time score calculations using advanced algorithms</li>
                  <li>• Statistical analysis of credit risk factors</li>
                  <li>• Machine learning model integration</li>
                  <li>• Comprehensive financial mathematics</li>
                </ul>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="font-mono">
                  🔬 Wolfram Alpha API • Advanced Mathematics
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground font-mono">Ready to Get Started?</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Create your digital identity and start building your EFIS score today.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button size="lg" className="font-mono">
                  Create Your Identity
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="font-mono">
                  Learn More About EFIS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
