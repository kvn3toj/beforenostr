#!/bin/bash

# SUPERAPP COMPREHENSIVE TEST RUNNER
# Based on Next.js testing best practices
# Executes the complete verification suite for the CoomÜnity SuperApp

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print header
echo -e "${PURPLE}🚀 SUPERAPP COMPREHENSIVE TEST SUITE${NC}"
echo -e "${BLUE}=====================================\n${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Pre-flight check
print_info "Running pre-flight check..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the SuperApp directory."
    exit 1
fi

# Check if backend is running
print_info "Checking backend availability..."
if curl -s http://localhost:3002/health > /dev/null; then
    print_status "Backend is running on port 3002"
else
    print_warning "Backend is not available on port 3002. Starting backend..."
    # Note: Backend should be started from the root directory
    echo -e "${YELLOW}Please ensure the backend is running:${NC}"
    echo -e "  ${CYAN}cd ../../../ && npm run dev:backend${NC}"
    exit 1
fi

# Check if SuperApp dev server is available
print_info "Checking SuperApp availability..."
if curl -s -I http://localhost:3001 > /dev/null; then
    print_status "SuperApp is available on port 3001"
else
    print_warning "SuperApp dev server not running. You may want to start it:"
    echo -e "  ${CYAN}npm run dev${NC}"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Run the comprehensive test suite
print_info "Starting comprehensive test execution..."

echo -e "\n${PURPLE}📋 TEST EXECUTION PLAN:${NC}"
echo -e "${CYAN}01. Button Functionality Verification${NC}"
echo -e "${CYAN}02. Route Navigation and Consistency${NC}"
echo -e "${CYAN}03. Style Consistency with Home Design${NC}"
echo -e "${CYAN}04. ÜPlay Comprehensive Functionality${NC}"
echo -e "${CYAN}05. Discovery System Verification${NC}"
echo -e "${CYAN}06. Progressive Learning Evolution${NC}"
echo -e "${CYAN}07. Mission and Reward System Integration${NC}"
echo -e "${CYAN}08. Overall SuperApp Harmony Verification${NC}"
echo -e "${CYAN}09. Cross-Module Navigation Flow${NC}"
echo -e "${CYAN}10. User Journey Simulation${NC}"

echo -e "\n${BLUE}Starting Playwright test execution...${NC}\n"

# Execute the test with proper output
npx playwright test e2e/superapp-comprehensive-test.spec.ts \
    --project=chromium \
    --reporter=list \
    --timeout=120000 \
    --retries=1 \
    --workers=1

# Check test results
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}🎉 COMPREHENSIVE TEST SUITE COMPLETED SUCCESSFULLY!${NC}"
    echo -e "${GREEN}✅ All SuperApp components are functioning correctly${NC}"
    echo -e "${GREEN}✅ Button functionality verified across all pages${NC}"
    echo -e "${GREEN}✅ Route navigation is consistent and working${NC}"
    echo -e "${GREEN}✅ Style harmony maintained throughout the app${NC}"
    echo -e "${GREEN}✅ ÜPlay functionality with missions and rewards confirmed${NC}"
    echo -e "${GREEN}✅ Discovery system enables progressive learning${NC}"
    echo -e "${GREEN}✅ User journey flows seamlessly across modules${NC}"
    
    echo -e "\n${PURPLE}📊 GENERATING TEST REPORT...${NC}"
    npx playwright show-report
    
else
    echo -e "\n${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}📋 To view detailed results:${NC}"
    echo -e "  ${CYAN}npx playwright show-report${NC}"
    echo -e "\n${YELLOW}🔧 For debugging specific failures:${NC}"
    echo -e "  ${CYAN}npx playwright test e2e/superapp-comprehensive-test.spec.ts --debug${NC}"
    exit 1
fi

echo -e "\n${BLUE}🎯 SUPERAPP VERIFICATION COMPLETE${NC}"
echo -e "${CYAN}All systems verified and functioning optimally!${NC}"