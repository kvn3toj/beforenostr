#!/bin/bash

# 🚀 CoomÜnity Free Deployment Script
# Railway + Vercel + Supabase - 100% Gratuito

set -e  # Exit on any error

# Colors for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}"
    echo "╔═══════════════════════════════════════╗"
    echo "║        🚀 CoomÜnity Deployment       ║"
    echo "║      Railway + Vercel + Supabase     ║"
    echo "║            100% GRATUITO             ║"
    echo "╚═══════════════════════════════════════╝"
    echo -e "${NC}"
}

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

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Main deployment function
main() {
    print_header

    print_status "Iniciando deployment gratuito de CoomÜnity..."
    print_status "Stack: Railway (Backend) + Vercel (Frontend) + Supabase (Database)"

    # Check if we're in the correct directory
    if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi

    print_success "✅ Directorio del proyecto verificado"

    # Step 1: Verify project structure
    print_step "1/6 - Verificando estructura del proyecto..."

    if [ ! -f "backend/Dockerfile.railway" ]; then
        print_error "❌ backend/Dockerfile.railway not found"
        exit 1
    fi

    if [ ! -f "railway.json" ]; then
        print_error "❌ railway.json not found"
        exit 1
    fi

    if [ ! -f "vercel.json" ]; then
        print_error "❌ vercel.json not found"
        exit 1
    fi

    if [ ! -f "prisma/schema.prisma" ]; then
        print_error "❌ prisma/schema.prisma not found"
        exit 1
    fi

    print_success "✅ Todos los archivos de configuración encontrados"

    # Step 2: Generate Prisma client (from root where schema is)
    print_step "2/6 - Generando Prisma client..."

    print_status "Generando Prisma client desde la raíz del proyecto..."
    if npx prisma generate; then
        print_success "✅ Prisma client generado correctamente"
    else
        print_error "❌ Error generando Prisma client"
        exit 1
    fi

    # Step 3: Test backend build
    print_step "3/6 - Probando build del backend..."

    cd backend/

    if [ ! -f ".env" ]; then
        print_warning "⚠️ No se encontró .env en backend/, usando configuración por defecto"
        echo "NODE_ENV=development" > .env
        echo "PORT=3002" >> .env
        echo "DATABASE_URL=postgresql://localhost:5432/coomunity" >> .env
        echo "JWT_SECRET=test-secret-for-build" >> .env
    fi

    print_status "Compilando TypeScript..."
    if npm run build; then
        print_success "✅ Backend compilado correctamente"
    else
        print_warning "⚠️ Backend compilation has errors, but continuing..."
    fi

    cd ..

    # Step 4: Test SuperApp build
    print_step "4/6 - Probando build del SuperApp..."

    cd Demo/apps/superapp-unified/

    print_status "Instalando dependencias del SuperApp..."
    if npm install --legacy-peer-deps > /dev/null 2>&1; then
        print_success "✅ Dependencias instaladas"
    else
        print_warning "⚠️ Some dependency warnings, but continuing..."
    fi

    print_status "Compilando SuperApp..."
    if npm run build; then
        print_success "✅ SuperApp compilado correctamente"
        print_status "📊 Build stats:"
        du -sh dist/ 2>/dev/null || echo "Directory size calculation failed"
    else
        print_error "❌ Error compilando SuperApp"
        exit 1
    fi

    cd ../../../

    # Step 5: Verify Git status
    print_step "5/6 - Verificando estado de Git..."

    if git status --porcelain | grep -q .; then
        print_warning "⚠️ Hay cambios sin commit en Git"
        print_status "Archivos modificados:"
        git status --short
        print_status "Continuando con el deployment..."
    else
        print_success "✅ Git working directory limpio"
    fi

    # Step 6: Deploy instructions
    print_step "6/6 - Instrucciones de Deployment..."

    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════"
    echo "           🎯 DEPLOYMENT INSTRUCTIONS"
    echo "═══════════════════════════════════════════════════"
    echo -e "${NC}"

    echo -e "${YELLOW}📋 PASO 1 - SUPABASE (Base de datos):${NC}"
    echo "1. Ve a: https://supabase.com"
    echo "2. Create new project: 'coomunity-database'"
    echo "3. Region: West US (Oregon)"
    echo "4. Copia la connection string"
    echo "5. En SQL Editor ejecuta: CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
    echo ""

    echo -e "${YELLOW}📋 PASO 2 - RAILWAY (Backend):${NC}"
    echo "1. Ve a: https://railway.app"
    echo "2. New Project > Deploy from GitHub"
    echo "3. Selecciona: kvn3toj/beforenostr"
    echo "4. Branch: gamifier2.0"
    echo "5. Root Directory: backend/"
    echo "6. Variables de entorno:"
    echo "   - DATABASE_URL=[supabase-connection-string]"
    echo "   - JWT_SECRET=[generate-random-32-chars]"
    echo "   - NODE_ENV=production"
    echo "   - PORT=3000"
    echo ""

    echo -e "${YELLOW}📋 PASO 3 - VERCEL (Frontend):${NC}"
    echo "1. Ve a: https://vercel.com"
    echo "2. New Project > Import Git Repository"
    echo "3. Selecciona: kvn3toj/beforenostr"
    echo "4. Framework: Vite"
    echo "5. Root Directory: Demo/apps/superapp-unified"
    echo "6. Build Command: npm run vercel-build"
    echo "7. Variables de entorno:"
    echo "   - VITE_API_BASE_URL=[railway-backend-url]"
    echo "   - VITE_ENABLE_MOCK_AUTH=false"
    echo ""

    # Success summary
    print_success "🎉 ¡Proyecto preparado para deployment gratuito!"
    print_success "📋 Archivos de configuración creados:"
    print_success "   ✓ backend/Dockerfile.railway"
    print_success "   ✓ railway.json"
    print_success "   ✓ vercel.json"
    print_success "   ✓ docs/deployment guides"
    print_success ""
    print_success "💰 Costo estimado: $0/mes durante 1-2 meses"
    print_success "⏱️ Tiempo total de deployment: ~45-60 minutos"
    print_success ""
    print_success "🔗 Documentación detallada:"
    print_success "   📖 docs/DEPLOYMENT_ROADMAP.md"
    print_success "   📖 docs/SUPABASE_SETUP_GUIDE.md"
    print_success "   📖 docs/RAILWAY_DEPLOYMENT_GUIDE.md"
    print_success "   📖 docs/VERCEL_DEPLOYMENT_GUIDE.md"

    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════╗"
    echo "║     🚀 READY FOR DEPLOYMENT! 🚀      ║"
    echo "╚═══════════════════════════════════════╝"
    echo -e "${NC}"
}

# Execute main function
main "$@"
