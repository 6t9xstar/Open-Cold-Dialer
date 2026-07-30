# Deployment Guide

## Docker Deployment (Recommended)

### Production

```bash
# Clone and configure
git clone https://github.com/6t9xstar/cold-dailer.git
cd cold-dialer
cp .env.example .env.local

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -hex 32)
echo "JWT_SECRET=$JWT_SECRET" >> .env.local

# Build and start
docker compose up -d

# Seed the database
docker compose exec backend npm run seed

# Access at http://localhost:3000
```

### Development

```bash
docker compose -f docker-compose.dev.yml up
```

## VPS Deployment

### Prerequisites
- Ubuntu 22.04+ or similar
- Docker and Docker Compose
- Domain name (optional)

### Steps

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone project
git clone https://github.com/6t9xstar/cold-dailer.git
cd cold-dailer

# Configure
cp .env.example .env.local
nano .env.local  # Add your SIP credentials

# Start
docker compose up -d
docker compose exec backend npm run seed
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:4000;
    }
}
```

## Hostinger Deployment

See [HOSTINGER_SETUP.md](../scripts/HOSTINGER_SETUP.md)

## Environment Variables

### Frontend (.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| VITE_SUPABASE_URL | No | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | No | Supabase anonymous key |
| VITE_SIP_URI | No | SIP registration URI |
| VITE_SIP_PASSWORD | No | SIP password |
| VITE_SIP_WS_URL | No | WebSocket URL for SIP |
| VITE_SIP_CALLER_ID | No | Outbound caller ID |
| VITE_API_URL | No | Self-hosted backend URL |

### Backend (environment)
| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Server port (default: 4000) |
| JWT_SECRET | Yes | Secret for JWT tokens |
| DATABASE_URL | No | SQLite database path |
