---
title: "I Built a Free Cold Calling Dialer That Replaces $200/Month Software"
published: false
description: "How I created an open-source browser-based SIP softphone with lead management, campaigns, and call scripts — completely free."
tags: react, opensource, webdev, typescript
canonical_url: null
---

# I Built a Free Cold Calling Dialer That Replaces $200/Month Software

Most cold calling tools cost **$50-200 per user per month**. I built one that's free, open-source, and runs in your browser.

## The Problem

I was working with a small sales team that needed to make cold calls. They looked at:

- **RingCentral** — $30/user/month
- **Dialpad** — $25/user/month  
- **Five9** — $150+/user/month
- **Vicidial** — Free but requires a dedicated server and is ancient

None of these fit their budget or needs. So I built **Open Cold Dialer**.

## What It Does

It's a full-featured cold calling CRM that runs in your browser:

### Core Features

- **Browser Softphone** — Make calls directly from your browser using SIP.js
- **Multi-Provider SIP** — Works with SignalWire, Telnyx, Twilio, or any SIP server
- **Lead Management** — Add leads manually or import from CSV
- **Campaign Management** — Organize leads into campaigns
- **Call Scripts** — Templates with objection handling responses
- **Call History** — Track every call with outcome and notes
- **Dashboard** — Real-time stats on your calling activity

### Tech Stack

```
Frontend:  React 18 + Vite + TypeScript + Tailwind CSS
Backend:   Express.js + SQLite (zero config!)
Auth:      JWT with bcrypt
SIP:       SIP.js (WebRTC)
```

## How It Works

### 1. Self-Hosted (Recommended)

```bash
git clone https://github.com/6t9xstar/Open-Cold-Dialer.git
cd Open-Cold-Dialer

# Backend
cd backend
npm install
npm run seed  # Loads 20 sample leads
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` and you're running.

### 2. Docker

```bash
docker compose up -d
docker compose exec backend npm run seed
```

### 3. With Real SIP Calls

Add your SIP provider credentials to `.env.local`:

```env
VITE_SIP_URI=sip:your-extension@your-domain.sip.signalwire.com
VITE_SIP_PASSWORD=your-password
VITE_SIP_WS_URL=wss://your-domain.sip.signalwire.com
VITE_SIP_CALLER_ID=+1XXXXXXXXXX
```

## The Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ React UI│  │ SIP.js   │  │ WebRTC    │  │
│  │         │  │ Client   │  │ Audio     │  │
│  └────┬────┘  └────┬─────┘  └─────┬─────┘  │
│       │            │              │         │
└───────┼────────────┼──────────────┼─────────┘
        │            │              │
   ┌────▼────┐  ┌────▼─────┐  ┌────▼─────┐
   │ Express │  │ SignalWire│  │ Browser  │
   │ API     │  │ / Telnyx  │  │ Mic      │
   │ (REST)  │  │ (SIP)     │  │          │
   └────┬────┘  └──────────┘  └──────────┘
        │
   ┌────▼────┐
   │ SQLite  │
   │ DB      │
   └─────────┘
```

The key insight: **SIP.js handles the telephony** directly from the browser. No need for a SIP server — just connect to your provider's WebSocket endpoint.

## Why I Chose These Tools

### SIP.js

The library that makes browser-based calling possible. It handles:
- SIP registration
- Making/receiving calls
- Audio via WebRTC
- DTMF tones

### SQLite

Zero-config database. No PostgreSQL, no MySQL — just a file. Perfect for:
- Single-server deployments
- Easy backup (copy one file)
- No database admin needed

### Vite

Blazing fast development. Hot module replacement means changes appear instantly.

## Comparison with Alternatives

| Feature | Open Cold Dialer | RingCentral | Vicidial |
|---------|-----------------|-------------|----------|
| Price | **Free** | $30/user/mo | Free* |
| Self-hosted | Yes | No | Yes |
| Open Source | Yes | No | Yes |
| Setup Time | 5 minutes | 30 minutes | 2+ hours |
| UI | Modern React | Modern | PHP (2005) |
| Browser-based | Yes | Yes | No |
| Lead Management | Built-in | Extra | Basic |
| CSV Import | Yes | No | Yes |
| Call Scripts | Yes | No | Basic |

*Vicidial is free but requires a dedicated server and is complex to set up.

## What's Next

I'm working on these features:

- [ ] Audio device selector (choose mic/speaker)
- [ ] Call recording
- [ ] Parallel dialing (power dialer mode)
- [ ] Voicemail detection
- [ ] DNC list management
- [ ] AI call summaries

## Try It Out

The project is open-source and ready to use:

**GitHub:** [github.com/6t9xstar/Open-Cold-Dialer](https://github.com/6t9xstar/Open-Cold-Dialer)

```bash
git clone https://github.com/6t9xstar/Open-Cold-Dialer.git
cd Open-Cold-Dialer/backend && npm install && npm run seed && npm run dev
```

If you find it useful, please give it a star on GitHub. It helps others discover the project.

## Questions?

Open an issue on GitHub or drop a comment below. I'm happy to help you set it up.

---

*Built with React, TypeScript, SIP.js, and a lot of coffee.*
