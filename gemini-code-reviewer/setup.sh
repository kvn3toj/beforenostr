#!/bin/bash

# GEMINI CODE REVIEWER - AUTOMATED SETUP SCRIPT
# This script sets up the project for development

set -e

echo "🚀 GEMINI CODE REVIEWER - AUTOMATED SETUP"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js $(node --version) detected"

# Install dependencies
print_info "Installing dependencies..."
if npm install; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_info "Creating .env file from template..."
    cp .env.example .env
    print_warning "IMPORTANT: Edit .env file and add your Gemini API key!"
    print_info "Get your API key from: https://makersuite.google.com/app/apikey"
else
    print_status ".env file already exists"
fi

# Run verification tests
print_info "Running verification tests..."
if node test-imports-and-functionality.js; then
    print_status "All verification tests passed!"
else
    print_error "Some verification tests failed"
    exit 1
fi

# Build project to verify everything works
print_info "Testing build process..."
if npm run build; then
    print_status "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
print_info "Next steps:"
echo "1. Edit .env file and add your Gemini API key"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:5173 in your browser"
echo "4. Test with sample code to verify API integration"
echo ""
print_status "Project is ready for development!"