# Open Cold Dialer

A free, open-source browser-based cold calling dialer with SIP support. No install required — runs in your browser.

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-20%2B-brightgreen)
![Stars](https://img.shields.io/github/stars/6t9xstar/Open-Cold-Dialer?style=social)
![Forks](https://img.shields.io/github/forks/6t9xstar/Open-Cold-Dialer?style=social)
![Last Commit](https://img.shields.io/github/last-commit/6t9xstar/Open-Cold-Dialer)
![Issues](https://img.shields.io/github/issues/6t9xstar/Open-Cold-Dialer)
![License](https://img.shields.io/github/license/6t9xstar/Open-Cold-Dialer)

---

## Demo

> **Coming soon** — Demo video and screenshots

<!-- Add screenshots here: -->
<!-- ![Dashboard](docs/screenshots/dashboard.png) -->
<!-- ![Softphone](docs/screenshots/softphone.png) -->
<!-- ![Leads](docs/screenshots/leads.png) -->

---

## Why Cold Dialer?

| Feature | Cold Dialer | RingCentral | Dialpad | Five9 |
|---------|------------|-------------|---------|-------|
| Price | **Free** | $30/user/mo | $25/user/mo | $150+/user/mo |
| Self-hosted | Yes | No | No | No |
| Open Source | Yes | No | No | No |
| SIP Provider | Any | Locked | Locked | Locked |
| Browser-based | Yes | Yes | Yes | Yes |
| Lead Management | Yes | Extra | Extra | Extra |
| CSV Import | Yes | No | No | Yes |
| Call Scripts | Yes | No | No | Yes |

**Cold Dialer** = Free forever, self-hosted, works with any SIP provider.

---

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
- **REST API** — Full API for integrations

---

## Quick Start (5 Minutes)

### Option 1: Self-Hosted (Recommended)

```bash
git clone https://github.com/6t9xstar/Open-Cold-Dialer.git
cd Open-Cold-Dialer

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

**Default login:** `admin@example.com` / `password123`

### Option 2: Docker

```bash
git clone https://github.com/6t9xstar/Open-Cold-Dialer.git
cd Open-Cold-Dialer
cp .env.example .env.local
docker compose up -d
docker compose exec backend npm run seed
```

### Option 3: Supabase (Cloud)

```bash
git clone https://github.com/6t9xstar/Open-Cold-Dialer.git
cd Open-Cold-Dialer/frontend
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

---

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

---

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

---

## Project Structure

```
Open-Cold-Dialer/
├── frontend/                # React SPA
│   └── src/
│       ├── components/      # UI components
│       ├── hooks/           # Data fetching hooks
│       ├── lib/             # Supabase, auth, API client
│       ├── pages/           # Route pages
│       ├── sip/             # SIP configuration
│       └── types/           # TypeScript types
├── backend/                 # Express API server
│   └── src/
│       ├── db/              # SQLite schema + seed
│       ├── middleware/      # Auth middleware
│       └── routes/          # API routes
├── docs/                    # Documentation
├── docker/                  # Docker configuration
├── supabase/                # Database migrations
└── scripts/                 # Deploy scripts
```

---

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

---

## Roadmap

- [ ] Audio device selector (mic/speaker)
- [ ] Call recording
- [ ] Parallel dialing (power dialer)
- [ ] Voicemail detection
- [ ] DNC list management
- [ ] Appointment scheduling
- [ ] Webhook integrations
- [ ] AI call summary

See [Open Issues](https://github.com/6t9xstar/Open-Cold-Dialer/issues) for more.

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature
# Commit your changes
git commit -m "Add amazing feature"
# Push to the branch
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## License

MIT License — see [LICENSE](LICENSE)

---

## Contributors

<a href="https://github.com/6t9xstar">
  <img src="https://contrib.rocks/image?repo=6t9xstar/Open-Cold-Dialer" />
</a>

---

## Support

- [Documentation](docs/)
- [Quick Start Guide](docs/quick-start.md)
- [SIP Provider Guides](docs/sip-providers.md)
- [Deployment Guide](docs/deployment.md)
- [GitHub Issues](https://github.com/6t9xstar/Open-Cold-Dialer/issues)

---

## Star History

If you find this useful, please give it a star! It helps others discover the project.

[![Star History Chart](https://api.star-history.com/svg?repos=6t9xstar/Open-Cold-Dialer&type=Date)](https://star-history.com/#6t9xstar/Open-Cold-Dialer&Date)
