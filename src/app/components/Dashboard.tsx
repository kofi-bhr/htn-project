"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Profile } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

interface DashboardProps {
  profile: Profile;
}

const demoData = {
  efisScore: 742,
  components: {
    humanCapital: 85,
    socialCapital: 78,
    reputation: 92,
    behavioral: 88
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

export default function Dashboard({ profile }: DashboardProps) {
  const { publicKey } = useWallet();

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm font-mono">U</span>
              </div>
              <h1 className="text-xl font-bold text-foreground font-mono">Project Umoja</h1>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 font-mono">
            Welcome back, Alice
          </h2>
          <p className="text-muted-foreground">
            Your digital identity dashboard • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-mono">Equitable Financial Inclusion Score (EFIS)</span>
              <Badge variant="secondary" className="font-mono">
                {getScoreLabel(demoData.efisScore)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className={`text-6xl font-bold font-mono ${getScoreColor(demoData.efisScore)}`}>
                  {demoData.efisScore}
                </div>
                <p className="text-sm text-muted-foreground">out of 1000</p>
              </div>
              <div className="flex-1">
                <Progress value={demoData.efisScore / 10} className="h-3 mb-4" />
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-mono font-semibold">{demoData.components.humanCapital}</div>
                    <div className="text-muted-foreground">Human Capital</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-semibold">{demoData.components.socialCapital}</div>
                    <div className="text-muted-foreground">Social Capital</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-semibold">{demoData.components.reputation}</div>
                    <div className="text-muted-foreground">Reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-semibold">{demoData.components.behavioral}</div>
                    <div className="text-muted-foreground">Behavioral</div>
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
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Microloan Repayment</p>
                        <p className="text-sm text-muted-foreground">$500 • 2 days ago</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Paid
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Family Remittance</p>
                        <p className="text-sm text-muted-foreground">$200 • 5 days ago</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Received
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">EFIS Score Update</p>
                        <p className="text-sm text-muted-foreground">+12 points • 1 week ago</p>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Improved
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      income: { label: "Income" },
                      expenses: { label: "Expenses" },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart data={demoData.incomeHistory}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="oklch(var(--chart-1))"
                        fill="oklch(var(--chart-1))"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="oklch(var(--chart-2))"
                        fill="oklch(var(--chart-2))"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">Remittances</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      amount: { label: "Amount" },
                    }}
                    className="h-[300px]"
                  >
                    <BarChart data={demoData.remittances}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="oklch(var(--chart-3))" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">Loan History</CardTitle>
                <CardDescription>
                  Track your microloan performance and build reputation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoData.loanHistory.map((loan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{loan.type} Loan</p>
                        <p className="text-sm text-muted-foreground">
                          ${loan.amount} • {new Date(loan.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={loan.repaid ? "secondary" : "destructive"}
                        className={loan.repaid ? "bg-green-100 text-green-800" : ""}
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
                            <Cell key={`cell-${index}`} fill={`oklch(var(--chart-${index + 1}))`} />
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
                            style={{ backgroundColor: `oklch(var(--chart-${index + 1}))` }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold">${category.amount}</div>
                          <div className="text-sm text-muted-foreground">{category.value}%</div>
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