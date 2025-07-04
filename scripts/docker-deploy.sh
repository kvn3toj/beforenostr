#!/bin/bash

# ================================================================
# CoomÜnity Docker Deployment Script
# Script automatizado para deployment en producción
# ================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Header
echo "================================================================"
echo "🚀 CoomÜnity Docker Deployment Script"
echo "================================================================"

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    log_warning ".env.prod file not found!"
    log_info "Creating from template..."
    cp env.prod.template .env.prod
    log_warning "Please configure .env.prod with your production values before continuing."
    log_info "Edit .env.prod and then run this script again."
    exit 1
fi

# Load environment variables
source .env.prod

# Check required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "REDIS_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        log_error "Required environment variable $var is not set in .env.prod"
        exit 1
    fi
done

log_success "Environment variables validated"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

log_success "Docker is running"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    log_error "docker-compose is not installed. Please install Docker Compose."
    exit 1
fi

log_success "Docker Compose is available"

# Parse command line arguments
COMMAND=${1:-"full"}
PROFILE=${2:-""}

case $COMMAND in
    "build")
        log_info "Building Docker images..."
        docker-compose -f docker-compose.prod.yml build
        ;;
    "up")
        log_info "Starting services..."
        if [ -n "$PROFILE" ]; then
            docker-compose -f docker-compose.prod.yml --profile $PROFILE up -d
        else
            docker-compose -f docker-compose.prod.yml up -d
        fi
        ;;
    "down")
        log_info "Stopping services..."
        docker-compose -f docker-compose.prod.yml down
        ;;
    "restart")
        log_info "Restarting services..."
        docker-compose -f docker-compose.prod.yml down
        docker-compose -f docker-compose.prod.yml up -d
        ;;
    "full")
        log_info "Full deployment: Build + Start"
        
        # Build images
        log_info "1/3 Building Docker images..."
        docker-compose -f docker-compose.prod.yml build
        
        # Start services
        log_info "2/3 Starting services..."
        docker-compose -f docker-compose.prod.yml up -d
        
        # Wait for services to be ready
        log_info "3/3 Waiting for services to be ready..."
        sleep 30
        
        # Check health
        log_info "Checking service health..."
        npm run health:all || log_warning "Some services may not be ready yet"
        ;;
    "monitoring")
        log_info "Starting with monitoring stack..."
        docker-compose -f docker-compose.prod.yml --profile monitoring up -d
        ;;
    "proxy")
        log_info "Starting with Nginx proxy..."
        docker-compose -f docker-compose.prod.yml --profile proxy up -d
        ;;
    "logs")
        SERVICE=${2:-""}
        if [ -n "$SERVICE" ]; then
            docker-compose -f docker-compose.prod.yml logs -f $SERVICE
        else
            docker-compose -f docker-compose.prod.yml logs -f
        fi
        ;;
    "status")
        docker-compose -f docker-compose.prod.yml ps
        ;;
    "help")
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  build      - Build Docker images"
        echo "  up         - Start services"
        echo "  down       - Stop services"
        echo "  restart    - Restart services"
        echo "  full       - Full deployment (build + start)"
        echo "  monitoring - Start with monitoring stack"
        echo "  proxy      - Start with Nginx proxy"
        echo "  logs       - Show logs (optionally for specific service)"
        echo "  status     - Show service status"
        echo "  help       - Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 full              # Full deployment"
        echo "  $0 up monitoring     # Start with monitoring"
        echo "  $0 logs backend      # Show backend logs"
        exit 0
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        log_info "Use '$0 help' for available commands"
        exit 1
        ;;
esac

log_success "Deployment command completed!"

# Show status
if [ "$COMMAND" != "logs" ] && [ "$COMMAND" != "help" ]; then
    echo ""
    log_info "Current service status:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    log_info "Access URLs:"
    echo "  🌐 SuperApp:       http://localhost:3001"
    echo "  ⚙️  Gamifier Admin: http://localhost:3000"
    echo "  🔗 Backend API:    http://localhost:3002/api"
    echo "  📊 Grafana:        http://localhost:3003 (if monitoring enabled)"
    echo "  📈 Prometheus:     http://localhost:9090 (if monitoring enabled)"
fi 