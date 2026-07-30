# Quick Start

Get Cold Dialer running in 5 minutes.

## Prerequisites

- Node.js 20 or higher
- npm

## Option 1: Self-Hosted Backend (Recommended for local dev)

```bash
# Clone the repository
git clone https://github.com/6t9xstar/cold-dialer.git
cd cold-dialer

# Setup backend
cd backend
npm install
npm run seed
npm run dev

# In a new terminal, setup frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL=http://localhost:4000
npm run dev
```

Open http://localhost:3000

## Option 2: Supabase (Cloud)

```bash
# Clone the repository
git clone https://github.com/6t9xstar/cold-dialer.git
cd cold-dialer

# Setup frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

Open http://localhost:3000

## Option 3: Docker

```bash
git clone https://github.com/6t9xstar/cold-dialer.git
cd cold-dialer

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your SIP credentials

# Start services
docker compose up

# In a new terminal, seed the database
docker compose exec backend npm run seed
```

Open http://localhost:3000

## SIP Configuration

To make real calls, configure your SIP provider in `.env.local`:

```env
VITE_SIP_URI=sip:your-extension@your-domain.sip.signalwire.com
VITE_SIP_PASSWORD=your-password
VITE_SIP_WS_URL=wss://your-domain.sip.signalwire.com
VITE_SIP_CALLER_ID=+1XXXXXXXXXX
```

See [SIP Providers Guide](sip-providers.md) for provider-specific setup.
