#!/bin/bash
set -e

echo "=== Cold Dialer - Setup Script ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js 20+ is required. Install from https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "Error: Node.js 20+ is required (found v$(node -v))"
  exit 1
fi

echo "Node.js $(node -v) detected"
echo ""

# Setup backend
echo "Setting up backend..."
cd backend
npm install
npm run seed
echo ""

# Setup frontend
echo "Setting up frontend..."
cd ../frontend
npm install
cp .env.example .env.local
echo ""

# Print instructions
echo "=== Setup Complete ==="
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "Open http://localhost:3000"
echo ""
echo "Default credentials: admin@example.com / password123"
echo ""
echo "To configure SIP, edit frontend/.env.local"
