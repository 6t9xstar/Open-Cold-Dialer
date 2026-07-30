# Cold Dialer

A free, open-source browser-based cold calling dialer with SIP support. No install required — runs in your browser.

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-20%2B-brightgreen)

## Features

- **Browser Softphone** — SIP.js integration, no desktop app needed
- **Multi-Provider SIP** — Works with SignalWire, Telnyx, Twilio, or any SIP server
- **Lead Management** — CRUD, CSV import, search, filter by status
- **Campaign Management** — Create and track outbound calling campaigns
- **Call Scripts** — Script templates with objection handling responses
- **Call History** — Log every call with outcome, duration, and notes
- **Dashboard** — Real-time stats on leads, calls, and conversion rates
- **Auth** — User accounts with role-based access
- **Self-Hosted Backend** — SQLite database, no cloud dependencies required
- **Supabase Support** — Optional cloud database backend
- **Docker Ready** — One-command deployment

## Quick Start

### Option 1: Self-Hosted (Recommended)

```bash
git clone https://github.com/6t9xstar/cold-dialer.git
cd cold-dialer

# Backend
cd backend
npm install
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local → set VITE_API_URL=http://localhost:4000
npm run dev
```

Open http://localhost:3000 — 20 sample leads pre-loaded.

### Option 2: Docker

```bash
git clone https://github.com/6t9xstar/cold-dailer.git
cd cold-dailer
cp .env.example .env.local
docker compose up -d
docker compose exec backend npm run seed
```

### Option 3: Supabase (Cloud)

```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

See [Full Quick Start Guide](docs/quick-start.md)

## SIP Configuration

To make real phone calls, configure your SIP provider in `.env.local`:

```env
VITE_SIP_URI=sip:your-extension@your-domain.sip.signalwire.com
VITE_SIP_PASSWORD=your-password
VITE_SIP_WS_URL=wss://your-domain.sip.signalwire.com
VITE_SIP_CALLER_ID=+1XXXXXXXXXX
```

Works with SignalWire, Telnyx, Twilio, Asterisk, FreeSWITCH, or any SIP server.

See [SIP Providers Guide](docs/sip-providers.md)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Express.js + SQLite (better-sqlite3) |
| Auth | JWT (bcryptjs) |
| SIP/Telephony | SIP.js (WebRTC) |
| Data Fetching | TanStack React Query |
| Validation | Zod |
| CSV Import | PapaParse |

## Project Structure

```
cold-dialer/
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Data fetching hooks
│   │   ├── lib/             # Supabase, auth, API client
│   │   ├── pages/           # Route pages
│   │   ├── sip/             # SIP configuration
│   │   └── types/           # TypeScript types
│   └── ...
├── backend/                 # Express API server
│   ├── src/
│   │   ├── db/              # SQLite schema + seed
│   │   ├── middleware/      # Auth middleware
│   │   └── routes/          # API routes
│   └── ...
├── docs/                    # Documentation
├── supabase/                # Database migrations
├── scripts/                 # Deploy scripts
└── docker/                  # Docker configuration
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Sign in |
| GET | /api/auth/me | Get current user |
| GET | /api/leads | List leads |
| POST | /api/leads | Create lead |
| PATCH | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead |
| POST | /api/leads/import | Import CSV |
| GET | /api/campaigns | List campaigns |
| POST | /api/campaigns | Create campaign |
| GET | /api/call-logs | List call logs |
| POST | /api/call-logs | Create call log |
| GET | /api/scripts | List scripts |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE)

## Contributors

- [@6t9xstar](https://github.com/6t9xstar) — Malik Taimoor Awan

## Support

- [Documentation](docs/)
- [SIP Provider Guides](docs/sip-providers.md)
- [Deployment Guide](docs/deployment.md)
- [GitHub Issues](https://github.com/6t9xstar/Open-Cold-Dialer/issues)
