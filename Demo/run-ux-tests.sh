#!/bin/bash

# 🧪 CoomÜnity UX Heuristics Test Runner
# Script automatizado para ejecutar las pruebas UX de la plataforma CoomÜnity

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_PORT=8080
SERVER_DIR="data/backups/my_recovered_website"
BASE_URL="http://localhost:${SERVER_PORT}"
PLAYWRIGHT_TIMEOUT=30000

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

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if server is running
check_server() {
    curl -s "${BASE_URL}" >/dev/null 2>&1
}

# Function to wait for server
wait_for_server() {
    print_status "Waiting for server to start..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if check_server; then
            print_success "Server is running at ${BASE_URL}"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "Server failed to start after ${max_attempts} seconds"
    return 1
}

# Function to cleanup background processes
cleanup() {
    print_status "Cleaning up..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
        print_status "Server stopped"
    fi
}

# Trap to cleanup on exit
trap cleanup EXIT

# Header
echo "
================================================================================
🧪 CoomÜnity UX Heuristics Test Runner
================================================================================
"

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists "node"; then
    print_error "Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

if ! command_exists "npm"; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

if ! command_exists "python3"; then
    print_error "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

if ! command_exists "curl"; then
    print_error "curl is not installed. Please install curl and try again."
    exit 1
fi

print_success "All prerequisites are available"

# Check if server directory exists
if [ ! -d "$SERVER_DIR" ]; then
    print_error "Server directory '$SERVER_DIR' not found!"
    print_error "Please make sure you're running this script from the correct directory."
    exit 1
fi

print_success "Server directory found"

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "node_modules/@playwright" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Install Playwright browsers if needed
if [ ! -d "node_modules/@playwright/test" ]; then
    print_status "Installing Playwright..."
    npm install @playwright/test
fi

print_status "Installing/updating Playwright browsers..."
npx playwright install --with-deps

# Check if server is already running
if check_server; then
    print_warning "Server is already running at ${BASE_URL}"
    print_status "Using existing server..."
else
    # Start the server
    print_status "Starting server..."
    cd "$SERVER_DIR"
    python3 -m http.server $SERVER_PORT >/dev/null 2>&1 &
    SERVER_PID=$!
    cd - >/dev/null
    
    # Wait for server to start
    if ! wait_for_server; then
        exit 1
    fi
fi

# Parse command line arguments
TEST_TYPE="master"
HEADED_MODE=""
DEBUG_MODE=""
BROWSER=""
TIMEOUT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--test)
            TEST_TYPE="$2"
            shift 2
            ;;
        -h|--headed)
            HEADED_MODE="--headed"
            shift
            ;;
        -d|--debug)
            DEBUG_MODE="--debug"
            shift
            ;;
        -b|--browser)
            BROWSER="--project=$2"
            shift 2
            ;;
        --timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        --help)
            echo "
Usage: $0 [OPTIONS]

Options:
    -t, --test TYPE      Test type to run (master, all, visibility, consistency, adaptive, performance)
    -h, --headed         Run tests in headed mode (show browser)
    -d, --debug          Run tests in debug mode
    -b, --browser NAME   Run tests on specific browser (Desktop Chrome, Mobile Chrome, etc.)
    --timeout SECONDS    Custom timeout in seconds
    --help               Show this help message

Examples:
    $0                           # Run master validation suite
    $0 -t all                    # Run all UX tests
    $0 -t visibility -h          # Run visibility tests in headed mode
    $0 -t adaptive -b 'Mobile Chrome'  # Run adaptive tests on mobile
    $0 -d                        # Run master tests in debug mode
"
            exit 0
            ;;
        *)
            print_warning "Unknown option: $1"
            shift
            ;;
    esac
done

# Determine which tests to run
case $TEST_TYPE in
    "master")
        TEST_PATH="tests/e2e/ux-heuristics/00-master-ux-validation.spec.ts"
        ;;
    "all")
        TEST_PATH="tests/e2e/ux-heuristics/"
        ;;
    "visibility")
        TEST_PATH="tests/e2e/ux-heuristics/01-visibility-system-status.spec.ts"
        ;;
    "consistency")
        TEST_PATH="tests/e2e/ux-heuristics/02-consistency-standards.spec.ts"
        ;;
    "adaptive")
        TEST_PATH="tests/e2e/ux-heuristics/03-adaptive-contextual.spec.ts"
        ;;
    "performance")
        TEST_PATH="tests/e2e/ux-heuristics/04-performance-loading.spec.ts"
        ;;
    *)
        print_error "Unknown test type: $TEST_TYPE"
        print_error "Valid types: master, all, visibility, consistency, adaptive, performance"
        exit 1
        ;;
esac

# Build the Playwright command
PLAYWRIGHT_CMD="npx playwright test"

if [ ! -z "$HEADED_MODE" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD $HEADED_MODE"
fi

if [ ! -z "$DEBUG_MODE" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD $DEBUG_MODE"
fi

if [ ! -z "$BROWSER" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD $BROWSER"
fi

if [ ! -z "$TIMEOUT" ]; then
    export PLAYWRIGHT_TIMEOUT=$((TIMEOUT * 1000))
fi

PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD $TEST_PATH"

# Run the tests
print_status "Running UX tests..."
print_status "Test type: $TEST_TYPE"
print_status "Command: $PLAYWRIGHT_CMD"

echo "
================================================================================
🚀 Starting UX Heuristics Validation
================================================================================
"

# Run Playwright tests
if eval $PLAYWRIGHT_CMD; then
    print_success "Tests completed successfully!"
    
    # Show report if not in debug mode
    if [ -z "$DEBUG_MODE" ]; then
        echo "
================================================================================
📊 Opening Test Report
================================================================================
"
        print_status "Opening HTML report..."
        npx playwright show-report >/dev/null 2>&1 &
    fi
    
    # Show test results location
    echo "
================================================================================
📁 Test Results Location
================================================================================
"
    print_status "HTML Report: test-results/html-report/index.html"
    print_status "JSON Results: test-results/results.json"
    print_status "JUnit XML: test-results/junit.xml"
    
    if [ -d "test-results" ]; then
        SCREENSHOTS=$(find test-results -name "*.png" 2>/dev/null | wc -l)
        VIDEOS=$(find test-results -name "*.webm" 2>/dev/null | wc -l)
        print_status "Screenshots: $SCREENSHOTS"
        print_status "Videos: $VIDEOS"
    fi
    
else
    print_error "Tests failed!"
    echo "
================================================================================
🔍 Troubleshooting Tips
================================================================================
"
    print_status "1. Check server is running: curl $BASE_URL"
    print_status "2. Check test-results/ folder for screenshots and videos"
    print_status "3. Run with --debug flag for interactive debugging"
    print_status "4. Check browser console for JavaScript errors"
    print_status "5. Verify all CSS and JS files are loading correctly"
    exit 1
fi

echo "
================================================================================
✅ UX Heuristics Testing Complete
================================================================================
"

# Final cleanup will be handled by trap 