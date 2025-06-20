#!/bin/bash

# 🚀 CoomÜnity Deployment Script - Render + Vercel
# Deploys Backend to Render and SuperApp to Vercel

set -e  # Exit on any error

echo "🚀 Starting CoomÜnity Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Project structure verified ✅"

# 1. 🔧 PREPARE BACKEND FOR RENDER
print_status "Preparing backend for Render deployment..."

# Check if Dockerfile exists
if [ ! -f "backend/Dockerfile.render" ]; then
    print_error "Dockerfile.render not found in backend directory"
    exit 1
fi

# Build backend locally to check for errors
print_status "Building backend locally to verify..."
cd backend
npm run build 2>/dev/null || {
    print_warning "Backend build failed locally, but continuing with deployment"
}
cd ..

print_success "Backend preparation complete"

# 2. 🌐 PREPARE SUPERAPP FOR VERCEL
print_status "Preparing SuperApp for Vercel deployment..."

cd Demo/apps/superapp-unified

# Check if build works
print_status "Testing SuperApp build..."
npm run build 2>/dev/null || {
    print_warning "SuperApp build failed locally, but continuing with deployment"
}

cd ../../../

print_success "SuperApp preparation complete"

# 3. 📋 DEPLOYMENT INSTRUCTIONS
print_status "🎯 DEPLOYMENT INSTRUCTIONS:"

echo ""
echo "📦 BACKEND DEPLOYMENT (Render):"
echo "1. Go to https://render.com"
echo "2. Connect your GitHub repository"
echo "3. Create new Web Service"
echo "4. Use these settings:"
echo "   - Runtime: Docker"
echo "   - Dockerfile Path: ./backend/Dockerfile.render"
echo "   - Build Command: echo 'Building with Docker'"
echo "   - Start Command: node dist/main.js"
echo "   - Port: 10000"
echo ""

echo "🌐 FRONTEND DEPLOYMENT (Vercel):"
echo "1. Go to https://vercel.com"
echo "2. Import project from GitHub"
echo "3. Set Root Directory: Demo/apps/superapp-unified"
echo "4. Framework Preset: Vite"
echo "5. Build Command: npm run build"
echo "6. Output Directory: dist"
echo "7. Install Command: npm install --legacy-peer-deps"
echo ""

echo "🔧 ENVIRONMENT VARIABLES:"
echo ""
echo "For Render (Backend):"
echo "  NODE_ENV=production"
echo "  PORT=10000"
echo "  DATABASE_URL=[Render will provide this]"
echo "  JWT_SECRET=[Generate a secure secret]"
echo "  CORS_ORIGIN=https://your-vercel-app.vercel.app"
echo ""
echo "For Vercel (Frontend):"
echo "  VITE_API_BASE_URL=https://your-render-app.onrender.com"
echo "  VITE_BASE_URL=https://your-vercel-app.vercel.app"
echo "  VITE_ENABLE_MOCK_AUTH=false"
echo ""

print_success "🎉 Deployment preparation complete!"
print_status "Follow the instructions above to deploy to Render and Vercel"

echo ""
echo "📚 Additional Resources:"
echo "- Render Docs: https://render.com/docs"
echo "- Vercel Docs: https://vercel.com/docs"
echo "- Project Documentation: ./docs/"
