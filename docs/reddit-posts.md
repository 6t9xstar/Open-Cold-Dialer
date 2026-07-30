# Reddit Posts for Open Cold Dialer

## Post 1: r/selfhosted

**Title:** I built a free open-source cold calling dialer that runs in your browser

**Body:**

Hey selfhosters,

I built **Open Cold Dialer** — a free, open-source cold calling CRM with a built-in SIP softphone.

**Why?** Most cold calling tools cost $50-200/user/month. This is free and self-hosted.

**Features:**
- Browser-based SIP softphone (no desktop app)
- Works with SignalWire, Telnyx, Twilio, or any SIP server
- Lead management with CSV import
- Campaign management
- Call scripts with objection handling
- Call history and logging
- Dashboard with analytics
- Docker deployment

**Tech stack:**
- React + TypeScript + Tailwind (frontend)
- Express.js + SQLite (backend)
- SIP.js for WebRTC telephony

**Quick start:**
```bash
git clone https://github.com/6t9xstar/Open-Cold-Dialer.git
cd Open-Cold-Dialer/backend && npm install && npm run seed && npm run dev
```

Opens on localhost:3000 with 20 sample leads.

Would love feedback from the community. If you find it useful, a star on GitHub helps!

**GitHub:** https://github.com/6t9xstar/Open-Cold-Dialer

---

## Post 2: r/SaaS

**Title:** Free alternative to RingCentral/Dialpad — open-source cold calling CRM

**Body:**

Built a free, open-source alternative to paid cold calling software.

**What it does:**
- Browser softphone with SIP support
- Lead management (CSV import)
- Campaign tracking
- Call scripts
- Call logging
- Dashboard analytics

**Cost comparison:**
- RingCentral: $30/user/month
- Dialpad: $25/user/month
- Five9: $150+/user/month
- **This: Free forever**

**Who it's for:**
- Small sales teams
- Startups on a budget
- Anyone who wants full control over their calling data

Self-hosted with Docker or run locally. Works with any SIP provider.

GitHub: https://github.com/6t9xstar/Open-Cold-Dialer

---

## Post 3: r/microsaas

**Title:** Built a free SIP dialer — looking for feedback

**Body:**

Hey microsaas community,

I built an open-source cold calling dialer. It's a browser-based softphone with lead management, campaigns, and call scripts.

**Key points:**
- Free and open-source
- Self-hosted (your data stays local)
- Works with any SIP provider
- Docker ready

**Looking for:**
- Feedback on features
- Suggestions for improvements
- Anyone who wants to contribute

GitHub: https://github.com/6t9xstar/Open-Cold-Dialer

---

## Post 4: r/reactjs

**Title:** I built a SIP softphone in React — open source

**Body:**

Hi React community,

I built **Open Cold Dialer** — a browser-based SIP softphone using React, TypeScript, and SIP.js.

**What it does:**
- Makes/receives phone calls via WebRTC
- Lead management with CSV import
- Campaign tracking
- Call scripts with objection handling

**Tech:**
- React 18 + Vite + TypeScript
- Tailwind CSS
- SIP.js for WebRTC
- TanStack React Query
- Express.js + SQLite backend

**Interesting challenges:**
- SIP.js state management
- Audio device handling
- Real-time call state updates
- CSV parsing with PapaParse

GitHub: https://github.com/6t9xstar/Open-Cold-Dialer

Would appreciate any feedback or contributions!

---

## Post 5: r/typescript

**Title:** Open-source cold calling CRM built with TypeScript (React + Express)

**Body:**

Built a full-stack TypeScript application — a cold calling CRM with SIP softphone.

**Stack:**
- Frontend: React 18 + Vite + TypeScript + Tailwind
- Backend: Express.js + SQLite (better-sqlite3)
- Types shared between frontend and backend

**Features:**
- Browser-based SIP calling via SIP.js
- Lead management with CSV import
- Campaign management
- Call scripts
- JWT auth
- REST API

GitHub: https://github.com/6t9xstar/Open-Cold-Dialer
