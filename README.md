# Open Cold Dialer

![GitHub stars](https://img.shields.io/github/stars/6t9xstar/Open-Cold-Dialer?style=social&label=%E2%AD%90)
![Self-hosted](https://img.shields.io/badge/self--hosted-yes-blue)
![Any SIP provider](https://img.shields.io/badge/SIP-any%20provider-blue)

**Self-hosted cold calling software: a browser softphone with leads, campaigns, call scripts and call logs, on your own server, with any SIP provider. No per-seat fees.**

🌐 Website: **[dailer.apexsofteck.com](https://dailer.apexsofteck.com)**

---

## 📩 Get the full source code

The complete source code (frontend, backend, Docker setup and docs) is sent to you by email, together with a done-for-you installation.

**You pay a one-time fee for setup and SIP configuration. There are no monthly per-user charges.**

| What you get | |
|---|---|
| Full source code | React frontend, Express + SQLite backend, Docker files, database scripts |
| Installation | Set up on your VPS, Hostinger or local server |
| SIP configuration | Connected to your provider (SignalWire, Telnyx, Twilio, Asterisk, FreeSWITCH or any SIP server) |
| Handover | Admin account, a walkthrough of the app, and the docs |

### How to order

1. Email **[mtaimoormalik99@gmail.com](mailto:mtaimoormalik99@gmail.com?subject=Open%20Cold%20Dialer%20-%20Source%20code%20and%20setup)** with:
   - your team size
   - where you want it hosted (VPS, Hostinger, local)
   - your SIP provider, or "need help choosing one"
2. You receive a quote for the setup and SIP configuration fee.
3. After payment, you receive the source code and your dialer is installed and connected.

Or use the [contact form](https://dailer.apexsofteck.com/contact/) on the website.

---

## Why Open Cold Dialer?

| | Open Cold Dialer | RingCentral | Dialpad | Five9 |
|---|---|---|---|---|
| Price | One-time setup fee | $30/user/mo | $25/user/mo | $150+/user/mo |
| Self-hosted | ✅ | ❌ | ❌ | ❌ |
| Full source code | ✅ | ❌ | ❌ | ❌ |
| SIP provider | Any | Locked | Locked | Locked |
| Browser-based | ✅ | ✅ | ✅ | ✅ |
| Lead management | ✅ | Extra | Extra | Extra |
| CSV import | ✅ | ❌ | ❌ | ✅ |
| Call scripts | ✅ | ❌ | ❌ | ✅ |

Competitor prices are per user per month; check each vendor for current pricing.

---

## Features

- **Browser softphone:** SIP.js over WebRTC, no desktop app needed
- **Any SIP provider:** SignalWire, Telnyx, Twilio, Asterisk, FreeSWITCH or your own SIP server
- **Lead management:** create, search and filter by status, and import from CSV
- **Campaigns:** create and track outbound calling campaigns
- **Call scripts:** script templates with objection-handling responses
- **Call history:** every call logged with outcome, duration and notes
- **Dashboard:** real-time stats on leads, calls and conversion rates
- **Auth and roles:** user accounts with role-based access
- **Self-hosted backend:** SQLite database, no cloud dependency
- **Supabase support:** optional managed database
- **Docker ready:** one-command deployment
- **REST API:** for integrations with your CRM and tools

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Express.js, SQLite (better-sqlite3) |
| Auth | JWT (bcryptjs) |
| Telephony | SIP.js (WebRTC) |
| Data fetching | TanStack React Query |
| Validation | Zod |
| CSV import | PapaParse |

---

## Roadmap

- [ ] Audio device selector (microphone and speaker)
- [ ] Call recording
- [ ] Parallel dialing (power dialer)
- [ ] Voicemail detection
- [ ] Do-not-call list management
- [ ] Appointment scheduling
- [ ] Webhook integrations
- [ ] AI call summaries

See the full [roadmap](https://dailer.apexsofteck.com/roadmap/).

---

## Contact

- 📧 Email: [mtaimoormalik99@gmail.com](mailto:mtaimoormalik99@gmail.com)
- 🌐 Website: [dailer.apexsofteck.com](https://dailer.apexsofteck.com)
- 📝 Contact form: [dailer.apexsofteck.com/contact](https://dailer.apexsofteck.com/contact/)

If this project interests you, please ⭐ star the repository.
