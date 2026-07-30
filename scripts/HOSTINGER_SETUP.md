# Hostinger Deployment Guide

## Prerequisites
- A Hostinger hosting plan with PHP support
- Domain `call.apexprecisionbilling.com` pointing to your Hostinger server
- Access to Hostinger hPanel

## Steps

### 1. Deploy the Frontend

```bash
cd cold-dailer/frontend
npm run build
```

Upload the contents of `frontend/dist/` to your Hostinger `public_html/` directory via FTP/cPanel File Manager or hPanel File Manager.

### 2. Environment Variables

Create a `.htaccess` file in your `public_html/` root with these lines:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /index.html [L]
```

Note: The Supabase URL and anon key are embedded at build time via `.env.local`. You need to rebuild if you change them.

### 3. Set Up Supabase (Backend)

1. Create a project at https://app.supabase.com
2. Go to Settings → API → Project URL and anon key
3. Create `.env.local` in the `frontend/` directory:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

4. Run the migration SQL in Supabase SQL Editor:
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the contents of `supabase/migrations/001_init.sql`
5. Enable email auth: Authentication → Providers → Email → Enable

### 4. SignalWire Setup (for Softphone)

1. Sign up at https://signalwire.com
2. Get your Space URL and API token from the dashboard
3. The softphone UI (SIP.js) will use these to connect browsers to SignalWire's SIP network
4. For V1 the softphone connects SignalWire's SIP to the browser; actual calls need a SignalWire phone number

### 5. Verify

- Visit `https://call.apexprecisionbilling.com`
- You should see the login page
- Create an account to get started

## File Structure for Hostinger

```
public_html/
├── index.html
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── vite.svg
├── .htaccess
└── (all other static assets from dist/)
```