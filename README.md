# project umoja - identity core

A next.js 14 application that lets users forge their digital identity on the solana blockchain using nfts and supabase for data persistence. 0% vibecoded. soooo much work went into this!

## Face Auth with @vladmandic/human (Hackathon-ready)

Browser-first face authentication using `@vladmandic/human` for embeddings and liveness. Only embeddings are sent to the backend. On first login, register your face; later logins verify against stored embedding.

### Install

```bash
npm i @vladmandic/human @vladmandic/face-api
# Tailwind is already configured, but if needed:
npm i -D tailwindcss @tailwindcss/postcss
```

### How it works

- Client loads Human models from CDN and uses webcam to detect face + embedding
- Liveness check: blink or head turn (Human gesture)
- Registration: POST embedding to `/api/face/register` (stores in `.data/embeddings.json`)
- Login: POST embedding to `/api/face/verify` (cosine similarity threshold)
- Demo session is client-side via `localStorage` only

### Key files

- `src/lib/human.ts`: Human singleton + config + utility
- `src/components/FaceAuth.tsx`: Webcam UI, detection loop, liveness, embedding callback
- `src/app/register/page.tsx`: Registration page
- `src/app/login/page.tsx`: Login page
- `src/app/api/face/register/route.ts`: Save embedding (JSON file)
- `src/app/api/face/verify/route.ts`: Verify embedding similarity
- `src/app/dashboard/page.tsx`: Simple gated page

### Model loading

Human is configured to load models from the official CDN:

```ts
// src/lib/human.ts
modelBasePath: "https://vladmandic.github.io/human/models"
```

No action required for local model hosting for the demo.

### Running

```bash
npm run dev
```

Open http://localhost:3000 and use the buttons to Register/Login. Grant webcam access when prompted.

### Notes

- This is a demo. For production, encrypt embeddings at rest, add user accounts, CSRF protection, sessions, and rate limits. Tweak the similarity threshold based on your environment.
- `.data` is gitignored and stores a single demo user embedding.

## Getting Started

## the story of alice

i want to start by telling you a story about a woman named alice. she's a low-income entrepreneur and a mother, striving to build a better future for her children. but there's just one caveat. she doesn't have a bank account. like, at all.

no bank account means no formal credit, limited ownership, no way to build a financial identity. she is fundamentally invisible to the global economy. and what's terrifying is that alice is not just one person. she is 1.4 billion people across the world without a bank account.

you see, alice isn't just a name. it's an acronym: asset-limited, income-constrained, but employed. her story is a global crisis. and its rly sad tbh.

as technologists, we sought to understand the root of this problem. it's not just bureaucracy; it's a market failure driven by a core economic principle: information asymmetry. big banks have no data on alice. they can't price the risk of a loan, so they don't offer one. they see her not as a person, but as a void of information. which is kinda messed up imo.

for people like alice—refugees, immigrants, creators of color—the system isn't just broken; it was never built for them in the first place. and that's why we built a new system. we were like "screw this, lets make something better"

this is project umoja. it's not a sim card; it's a globally accessible web platform that runs on any device with a browser. you sign up with a selfie, which serves as the foundation for your self-sovereign identity. we don't store this on a server. we mint it as a soulbound nft on the solana blockchain. it is a permanent, digital asset that you own. pretty cool right?

this nft is your key. it's your connection to a new financial ecosystem through which we can provide data-validated microloans.

so how do we solve the information asymmetry problem? with mathematics. when alice requests a loan, our wolfram-powered oracle uses principles from the kalman filter—an algorithm used by nasa to navigate spacecraft with noisy data. it takes her plan and real-world economic indicators to produce a clear, probabilistic assessment of her project's viability. the math is rly complex but it works!

then, to build trust over time, we apply signaling theory. every repaid loan automatically mints a 'reputation token' to her wallet. it's a non-transferable, on-chain proof of her reliability. she is forging her own credit score in public on the blockchain. its like gamification but for credit!

so let's return to the story of alice. she's no longer just an acronym. she's thriving. she's building her business, providing for her children. it's because project umoja became a part of her story. and we hope that you can, too. this is why we built this thing!

## features

- solana wallet integration: connect with phantom wallet (sometimes it disconnects tho)
- nft minting: create unique digital identity nfts using metaplex sdk
- supabase backend: store user profiles and nft metadata
- modern ui: beautiful, responsive design with tailwind css (mostly responsive lol)
- real-time updates: instant profile creation and updates
- **credit score calculator**: compare fico and efis scores side by side with interactive sliders
- **wolfram api integration**: powered by wolfram alpha for advanced mathematical computations (this part is rly cool!)

## tech stack

- frontend: next.js 14 with app router, react 19, typescript (typescript is a lifesaver)
- styling: tailwind css
- blockchain: solana (devnet), metaplex sdk
- wallet: solana wallet adapter (phantom)
- backend: supabase
- deployment: vercel-ready (hopefully!)

## prerequisites

- node.js 18+ (or higher, we used 20)
- npm or yarn
- supabase account (free tier works fine)
- phantom wallet browser extension

## setup instructions

### 1. clone and install dependencies

```bash
git clone <your-repo-url>
cd htn-project
npm install
# this might take a while, grab some coffee
```

### 2. supabase setup

1. create a new project at supabase.com (its free!)
2. go to settings > api to get your project url and anon key
3. create the `profiles` table with the following sql (copy paste this):

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

create a `.env.local` file in the root directory (dont commit this file!):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WOLFRAM_APP_ID=your_wolfram_api_key
```

### 4. wolfram api setup (optional)

for full calculator functionality (this part is rly cool):

1. get your api key from [wolfram alpha developer portal](https://developer.wolframalpha.com/) (its free for students!)
2. add `NEXT_PUBLIC_WOLFRAM_APP_ID=your_api_key_here` to your `.env.local` file
3. restart the development server

## calculator usage

the `/calculator` page allows users to:

1. **compare fico and efis scores** side by side (the math is rly interesting!)
2. **adjust parameters** using interactive sliders for both scoring systems
3. **see loan eligibility** and potential loan amounts based on scores
4. **understand the mathematics** behind both scoring systems (kalman filtering is wild)
5. **experience real-time calculations** powered by wolfram alpha api

### unified parameters (affect both scores)
- **financial stability** (fico: 35%, efis: 30%) - affects payment history and human capital
- **debt management** (fico: 30%, efis: 20%) - affects amounts owed and behavioral patterns
- **credit experience** (fico: 15%, efis: 25%) - affects credit history length and reputation
- **new activity** (fico: 10%, efis: 25%) - affects new credit applications and social capital
- **diversity** (fico: 10%, efis: 20%) - affects credit mix and behavioral diversity

this unified approach allows users to see how the same financial behaviors impact both traditional fico scoring and the innovative efis system, highlighting the differences in how each model weighs various factors. its pretty eye-opening tbh!

### 4. run the development server

```bash
npm run dev
# this starts the dev server, should be pretty fast
```

open http://localhost:3000 in your browser. (make sure phantom wallet is installed!)

## usage

1. connect wallet: click the "select wallet" button and connect your phantom wallet (sometimes it takes a sec)
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
- includes phantom wallet support (sometimes it disconnects tho)
- provides wallet context to entire app

### main page (page.tsx)
- manages wallet connection state
- handles profile checking and creation
- implements nft minting with metaplex (this part was tricky!)
- conditional rendering based on user state

### dashboard
- displays user's wallet address and nft mint address
- shows creation timestamp
- provides action buttons for nft exploration (you can view it on solscan!)

### landingpage
- welcomes new users
- explains the identity forging process
- contains the "forge your identity" button (the main cta!)

## nft metadata

each identity nft includes:
- unique name with timestamp
- symbol: "umoja"
- description with wallet address
- attributes for identity type, blockchain, and project
- placeholder image (can be customized later)

## deployment

the application is ready for deployment on vercel (hopefully!):

1. push your code to github
2. connect your repository to vercel
3. add environment variables in vercel dashboard
4. deploy! (fingers crossed)

## troubleshooting

### common issues

1. wallet connection issues: ensure phantom wallet is installed and unlocked (sometimes it just doesnt work)
2. supabase connection: verify your environment variables are correct
3. nft minting fails: check that you have sol in your wallet for transaction fees (devnet sol is free!)
4. build errors: run `npm install` to ensure all dependencies are installed

### development tips

- use solana devnet for testing (no real sol required, its free!)
- check browser console for detailed error messages (chrome dev tools are your friend)
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
- check the troubleshooting section (we tried to cover everything!)
- open an issue on github
- contact the development team (we're pretty responsive)

---

for hack the nest 2025 - we're sooo excited to show this off! 