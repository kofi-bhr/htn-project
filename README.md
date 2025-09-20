# project umoja - identity core

a next.js 14 application that lets users forge their digital identity on the solana blockchain using nfts and supabase for data persistence. 0% vibecoded.

## features

- solana wallet integration: connect with phantom wallet
- nft minting: create unique digital identity nfts using metaplex sdk
- supabase backend: store user profiles and nft metadata
- modern ui: beautiful, responsive design with tailwind css
- real-time updates: instant profile creation and updates

## tech stack

- frontend: next.js 14 with app router, react 19, typescript
- styling: tailwind css
- blockchain: solana (devnet), metaplex sdk
- wallet: solana wallet adapter (phantom)
- backend: supabase
- deployment: vercel-ready

## prerequisites

- node.js 18+ 
- npm or yarn
- supabase account
- phantom wallet browser extension

## setup instructions

### 1. clone and install dependencies

```bash
git clone <your-repo-url>
cd htn-project
npm install
```

### 2. supabase setup

1. create a new project at supabase.com
2. go to settings > api to get your project url and anon key
3. create the `profiles` table with the following sql:

```sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  nft_mint_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- enable row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- create policy to allow users to read all profiles
CREATE POLICY "Allow public read access" ON profiles FOR SELECT USING (true);

-- create policy to allow users to insert their own profile
CREATE POLICY "Allow users to insert own profile" ON profiles FOR INSERT WITH CHECK (true);

-- create policy to allow users to update their own profile
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE USING (true);
```

### 3. environment variables

create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. run the development server

```bash
npm run dev
```

open http://localhost:3000 in your browser.

## usage

1. connect wallet: click the "select wallet" button and connect your phantom wallet
2. forge identity: if you don't have a profile, click "forge your identity" to mint your nft
3. view dashboard: once your identity is created, you'll see your dashboard with wallet and nft details

## project structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard.tsx          # user dashboard after identity creation
│   │   ├── landingpage.tsx       # landing page for new users
│   │   └── walletcontextprovider.tsx # solana wallet context
│   ├── layout.tsx                # root layout with wallet provider
│   └── page.tsx                  # main application logic
└── lib/
    └── supabaseclient.ts         # supabase client configuration
```

## key components

### walletcontextprovider
- configures solana wallet adapter for devnet
- includes phantom wallet support
- provides wallet context to entire app

### main page (page.tsx)
- manages wallet connection state
- handles profile checking and creation
- implements nft minting with metaplex
- conditional rendering based on user state

### dashboard
- displays user's wallet address and nft mint address
- shows creation timestamp
- provides action buttons for nft exploration

### landingpage
- welcomes new users
- explains the identity forging process
- contains the "forge your identity" button

## nft metadata

each identity nft includes:
- unique name with timestamp
- symbol: "umoja"
- description with wallet address
- attributes for identity type, blockchain, and project
- placeholder image (can be customized)

## deployment

the application is ready for deployment on vercel:

1. push your code to github
2. connect your repository to vercel
3. add environment variables in vercel dashboard
4. deploy!

## troubleshooting

### common issues

1. wallet connection issues: ensure phantom wallet is installed and unlocked
2. supabase connection: verify your environment variables are correct
3. nft minting fails: check that you have sol in your wallet for transaction fees
4. build errors: run `npm install` to ensure all dependencies are installed

### development tips

- use solana devnet for testing (no real sol required)
- check browser console for detailed error messages
- use solscan devnet to view your minted nfts: https://devnet.solscan.io/

## contributing

1. fork the repository
2. create a feature branch
3. make your changes
4. test thoroughly
5. submit a pull request

## license

mit license - see license file for details.

## support

for issues and questions:
- check the troubleshooting section
- open an issue on github
- contact the development team

---

for hack the nest 