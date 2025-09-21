"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Profile } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { wolframService, EFISCalculationInput } from '@/lib/wolframService';
import { useRouter } from 'next/navigation';

const demoData = {
  efisScore: 0, // Will be calculated dynamically
  components: {
    humanCapital: 0,
    socialCapital: 0,
    reputation: 0,
    behavioral: 0
  },
  incomeHistory: [
    { month: 'Jan', income: 1200, expenses: 800 },
    { month: 'Feb', income: 1350, expenses: 850 },
    { month: 'Mar', income: 1100, expenses: 750 },
    { month: 'Apr', income: 1500, expenses: 900 },
    { month: 'May', income: 1400, expenses: 820 },
    { month: 'Jun', income: 1600, expenses: 950 }
  ],
  loanHistory: [
    { date: '2024-01-15', amount: 500, repaid: true, type: 'Microloan' },
    { date: '2024-03-20', amount: 750, repaid: true, type: 'Emergency' },
    { date: '2024-05-10', amount: 300, repaid: true, type: 'Business' },
    { date: '2024-07-05', amount: 1000, repaid: false, type: 'Education' }
  ],
  remittances: [
    { month: 'Jan', amount: 200, from: 'Family' },
    { month: 'Feb', amount: 150, from: 'Family' },
    { month: 'Mar', amount: 300, from: 'Family' },
    { month: 'Apr', amount: 180, from: 'Family' },
    { month: 'May', amount: 250, from: 'Family' },
    { month: 'Jun', amount: 220, from: 'Family' }
  ],
  spendingCategories: [
    { name: 'Food', value: 45, amount: 450 },
    { name: 'Transport', value: 20, amount: 200 },
    { name: 'Healthcare', value: 15, amount: 150 },
    { name: 'Education', value: 12, amount: 120 },
    { name: 'Other', value: 8, amount: 80 }
  ]
};

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [efisData, setEfisData] = useState(demoData);
  const [calculating, setCalculating] = useState(false);

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
          await calculateEFISScore(data);
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

  useEffect(() => {
    if (!profile || !profile.nft_mint_address.startsWith('temp_nft_')) {
      return;
    }

    const pollForNFT = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', publicKey?.toString())
          .single();

        if (!error && data && !data.nft_mint_address.startsWith('temp_nft_')) {
          console.log('NFT minting completed!', data.nft_mint_address);
          setProfile(data);
          alert(`🎉 Your NFT is ready!\n\nNFT Address: ${data.nft_mint_address}\n\nView on Solscan: https://devnet.solscan.io/token/${data.nft_mint_address}`);
        }
      } catch (error) {
        console.error('Error polling for NFT:', error);
      }
    };

    const interval = setInterval(pollForNFT, 5000);
    
    return () => clearInterval(interval);
  }, [profile, publicKey]);

  const calculateEFISScore = async (profileData: Profile) => {
    setCalculating(true);
    try {
      const input: EFISCalculationInput = {
        humanCapital: 48000,
        socialCapital: 85,
        reputation: 90,
        behavioral: 95,
        weights: {
          humanCapital: 0.35,
          socialCapital: 0.28,
          reputation: 0.22,
          behavioral: 0.15
        }
      };

      const result = await wolframService.calculateEFISScore(input);
      
      setEfisData({
        efisScore: result.totalScore,
        components: {
          humanCapital: result.components.humanCapital,
          socialCapital: result.components.socialCapital,
          reputation: result.components.reputation,
          behavioral: result.components.behavioral
        },
        incomeHistory: demoData.incomeHistory,
        loanHistory: demoData.loanHistory,
        remittances: demoData.remittances,
        spendingCategories: demoData.spendingCategories
      });

      console.log('EFIS Score calculated:', result.breakdown);
    } catch (error) {
      console.error('Error calculating EFIS score:', error);
    } finally {
      setCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
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

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-mono">Wallet Required</CardTitle>
            <CardDescription className="font-mono">
              Please connect your wallet to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-lg !px-6 !py-2 !font-medium" />
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline" className="font-mono">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-mono">No Identity Found</CardTitle>
            <CardDescription className="font-mono">
              You need to create your digital identity first
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button className="font-mono">
                Create Identity
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm font-mono">U</span>
              </div>
              <h1 className="text-xl font-bold text-foreground font-mono">Project Umoja</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="outline" size="sm" className="font-mono">
                  About EFIS
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="font-mono"
                onClick={() => {
                  try { localStorage.removeItem('demo-auth'); } catch {}
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                  } else {
                    router.replace('/login');
                  }
                }}
              >
                Log out
              </Button>
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !border-0 !rounded-lg !px-6 !py-2 !font-medium" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 font-mono">
            Welcome back, Alice
          </h2>
          <p className="text-muted-foreground font-mono">
            Your digital identity dashboard • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-mono">Equitable Financial Inclusion Score (EFIS)</span>
              <Badge variant="secondary" className="font-mono">
                {getScoreLabel(efisData.efisScore)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className={`text-6xl font-bold font-mono ${getScoreColor(efisData.efisScore)}`}>
                  {calculating ? '...' : efisData.efisScore}
                </div>
                <p className="text-sm text-muted-foreground font-mono">out of 1000</p>
                {calculating && (
                  <p className="text-xs text-muted-foreground font-mono mt-2">
                    Calculating with Wolfram...
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Progress value={efisData.efisScore / 10} className="h-3 mb-4" />
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-mono font-semibold">{efisData.components.humanCapital}</div>
                    <div className="text-muted-foreground font-mono">Human Capital</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-semibold">{efisData.components.socialCapital}</div>
                    <div className="text-muted-foreground font-mono">Social Capital</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-semibold">{efisData.components.reputation}</div>
                    <div className="text-muted-foreground font-mono">Reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-semibold">{efisData.components.behavioral}</div>
                    <div className="text-muted-foreground font-mono">Behavioral</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="font-mono">Overview</TabsTrigger>
            <TabsTrigger value="income" className="font-mono">Income & Expenses</TabsTrigger>
            <TabsTrigger value="loans" className="font-mono">Loan History</TabsTrigger>
            <TabsTrigger value="spending" className="font-mono">Spending Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">Digital Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono">
                      Wallet Address
                    </label>
                    <p className="text-foreground font-mono text-sm break-all">
                      {profile.wallet_address}
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono">
                      NFT Address
                    </label>
                    <p className="text-foreground font-mono text-sm break-all mb-2">
                      {profile.nft_mint_address}
                    </p>
                    {profile.nft_mint_address.startsWith('temp_nft_') ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-yellow-600 font-mono text-xs">Minting in progress...</span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`https://devnet.solscan.io/token/${profile.nft_mint_address}`, '_blank')}
                          className="font-mono text-xs"
                        >
                          View on Solscan
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(profile.nft_mint_address)}
                          className="font-mono text-xs"
                        >
                          Copy Address
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono">
                      Created On
                    </label>
                    <p className="text-foreground text-sm font-mono">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center pb-4">
                  <CardTitle className="font-mono">Profile Strength</CardTitle>
                  <CardDescription className="font-mono">
                    EFIS component breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <ChartContainer
                    config={{
                      humanCapital: {
                        label: "Human Capital",
                        color: "var(--chart-1)",
                      },
                      socialCapital: {
                        label: "Social Capital", 
                        color: "var(--chart-2)",
                      },
                      reputation: {
                        label: "Reputation",
                        color: "var(--chart-3)",
                      },
                      behavioral: {
                        label: "Behavioral",
                        color: "var(--chart-4)",
                      },
                    }}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <RadarChart data={[
                      { component: "Human Capital", humanCapital: efisData.components.humanCapital, socialCapital: 0, reputation: 0, behavioral: 0 },
                      { component: "Social Capital", humanCapital: 0, socialCapital: efisData.components.socialCapital, reputation: 0, behavioral: 0 },
                      { component: "Reputation", humanCapital: 0, socialCapital: 0, reputation: efisData.components.reputation, behavioral: 0 },
                      { component: "Behavioral", humanCapital: 0, socialCapital: 0, reputation: 0, behavioral: efisData.components.behavioral },
                    ]}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <PolarAngleAxis dataKey="component" />
                      <PolarGrid radialLines={false} />
                      <Radar
                        dataKey="humanCapital"
                        fill="var(--color-humanCapital)"
                        fillOpacity={0.1}
                        stroke="var(--color-humanCapital)"
                        strokeWidth={2}
                      />
                      <Radar
                        dataKey="socialCapital"
                        fill="var(--color-socialCapital)"
                        fillOpacity={0.1}
                        stroke="var(--color-socialCapital)"
                        strokeWidth={2}
                      />
                      <Radar
                        dataKey="reputation"
                        fill="var(--color-reputation)"
                        fillOpacity={0.1}
                        stroke="var(--color-reputation)"
                        strokeWidth={2}
                      />
                      <Radar
                        dataKey="behavioral"
                        fill="var(--color-behavioral)"
                        fillOpacity={0.1}
                        stroke="var(--color-behavioral)"
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 leading-none font-medium font-mono">
                    Overall EFIS Score: {efisData.efisScore}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 leading-none font-mono">
                    {getScoreLabel(efisData.efisScore)} Creditworthiness
                  </div>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium font-mono">Microloan Repayment</p>
                      <p className="text-sm text-muted-foreground font-mono">$500 • 2 days ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 font-mono">
                      ✓ Paid
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium font-mono">Family Remittance</p>
                      <p className="text-sm text-muted-foreground font-mono">$200 • 5 days ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-mono">
                      Received
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium font-mono">EFIS Score Update</p>
                      <p className="text-sm text-muted-foreground font-mono">+12 points • 1 week ago</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-mono">
                      Improved
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="pt-0">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1">
                    <CardTitle className="font-mono">Financial Activity</CardTitle>
                    <CardDescription className="font-mono">
                      Income and expenses over the last 6 months
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  <ChartContainer
                    config={{
                      income: { label: "Income", color: "var(--chart-1)" },
                      expenses: { label: "Expenses", color: "var(--chart-2)" },
                    }}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <AreaChart data={demoData.incomeHistory}>
                      <defs>
                        <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-income)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-income)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-expenses)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-expenses)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            indicator="dot"
                          />
                        }
                      />
                      <Area
                        dataKey="expenses"
                        type="natural"
                        fill="url(#fillExpenses)"
                        stroke="var(--color-expenses)"
                        stackId="a"
                      />
                      <Area
                        dataKey="income"
                        type="natural"
                        fill="url(#fillIncome)"
                        stroke="var(--color-income)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">Spending Categories</CardTitle>
                  <CardDescription className="font-mono">Monthly spending breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      amount: { label: "Amount" },
                      food: { label: "Food", color: "var(--chart-1)" },
                      transport: { label: "Transport", color: "var(--chart-2)" },
                      healthcare: { label: "Healthcare", color: "var(--chart-3)" },
                      education: { label: "Education", color: "var(--chart-4)" },
                      other: { label: "Other", color: "var(--chart-5)" },
                    }}
                  >
                    <BarChart
                      accessibilityLayer
                      data={demoData.spendingCategories}
                      layout="vertical"
                      margin={{
                        left: 0,
                      }}
                    >
                      <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <XAxis dataKey="amount" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar 
                        dataKey="amount" 
                        layout="vertical" 
                        radius={5}
                        fill="var(--chart-1)"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 leading-none font-medium font-mono">
                    Total monthly spending: $1,000
                  </div>
                  <div className="text-muted-foreground leading-none font-mono">
                    Based on last 6 months average
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">Loan History</CardTitle>
                <CardDescription className="font-mono">
                  Track your microloan performance and build reputation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoData.loanHistory.map((loan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium font-mono">{loan.type} Loan</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          ${loan.amount} • {new Date(loan.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={loan.repaid ? "secondary" : "destructive"}
                        className={loan.repaid ? "bg-green-100 text-green-800 font-mono" : "font-mono"}
                      >
                        {loan.repaid ? "✓ Repaid" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">Spending Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <ChartContainer
                      config={{
                        value: { label: "Percentage" },
                      }}
                      className="h-[300px]"
                    >
                      <PieChart>
                        <Pie
                          data={demoData.spendingCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {demoData.spendingCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`var(--chart-${index + 1})`} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="space-y-4">
                    {demoData.spendingCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: `var(--chart-${index + 1})` }}
                          />
                          <span className="font-medium font-mono">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold">${category.amount}</div>
                          <div className="text-sm text-muted-foreground font-mono">{category.value}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
