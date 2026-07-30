#!/bin/bash
set -e

echo "=== Cold Dialer - Deploy Script ==="

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend"
HOSTINGER_DIR="$PROJECT_DIR/hostinger"

echo "Building frontend..."
cd "$FRONTEND_DIR"
npm run build

echo "Copying dist to Hostinger directory..."
mkdir -p "$HOSTINGER_DIR"
rm -rf "$HOSTINGER_DIR"/*
cp -r "$FRONTEND_DIR/dist/"* "$HOSTINGER_DIR/"

echo "Deploying to Hostinger..."
echo "Upload contents of $HOSTINGER_DIR to your Hostinger public_html/"
echo ""
echo "Don't forget to set environment variables in Hostinger:"
echo "  VITE_SUPABASE_URL=https://your-project.supabase.co"
echo "  VITE_SUPABASE_ANON_KEY=your-anon-key"
echo ""
echo "=== Deployment Complete ==="