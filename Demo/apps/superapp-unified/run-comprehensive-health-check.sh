#!/bin/bash

# SUPERAPP COMPREHENSIVE HEALTH CHECK
# Script para ejecutar análisis completo de salud de la SuperApp CoomÜnity
# Basado en mejores prácticas de Next.js testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║           SUPERAPP COMPREHENSIVE HEALTH CHECK                 ║"
    echo "║        Testing Framework basado en Next.js Best Practices     ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

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

print_step() {
    echo -e "${BLUE}🔍 $1${NC}"
}

# Main execution
main() {
    print_header
    
    print_step "Iniciando verificación comprehensiva de la SuperApp..."
    echo
    
    # Verify we're in the correct directory
    if [ ! -f "package.json" ] || [ ! -d "e2e" ]; then
        print_error "Error: Este script debe ejecutarse desde Demo/apps/superapp-unified/"
        print_info "Directorio actual: $(pwd)"
        print_info "Ejecuta: cd Demo/apps/superapp-unified && ./run-comprehensive-health-check.sh"
        exit 1
    fi
    
    # Check if SuperApp is running
    print_step "Verificando que la SuperApp esté ejecutándose..."
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        print_status "SuperApp detectada en puerto 3001"
    else
        print_warning "SuperApp no detectada en puerto 3001"
        print_info "Iniciando servidor de desarrollo..."
        npm run dev &
        SERVER_PID=$!
        print_info "Esperando que el servidor inicie..."
        sleep 10
        
        if curl -s http://localhost:3001 > /dev/null 2>&1; then
            print_status "Servidor iniciado exitosamente"
        else
            print_error "No se pudo iniciar el servidor. Verifica la configuración."
            exit 1
        fi
    fi
    
    # Check if Playwright is properly installed
    print_step "Verificando instalación de Playwright..."
    if npx playwright --version > /dev/null 2>&1; then
        PLAYWRIGHT_VERSION=$(npx playwright --version)
        print_status "Playwright instalado: $PLAYWRIGHT_VERSION"
    else
        print_error "Playwright no está instalado"
        print_info "Ejecuta: npm install @playwright/test"
        exit 1
    fi
    
    # Check if browsers are installed
    print_step "Verificando browsers de Playwright..."
    if [ ! -d "$HOME/.cache/ms-playwright" ]; then
        print_warning "Browsers no instalados, instalando..."
        npx playwright install chromium
    else
        print_status "Browsers de Playwright disponibles"
    fi
    
    # Run the comprehensive test
    echo
    print_step "🚀 EJECUTANDO TEST COMPREHENSIVO..."
    echo -e "${PURPLE}${'='*60}${NC}"
    
    # Execute the test with demo config (no auth required)
    if npx playwright test e2e/simple-superapp-verification.spec.ts \
        --config=playwright-demo.config.ts \
        --project=demo-chromium \
        --reporter=list; then
        
        echo
        print_status "Test comprehensivo COMPLETADO exitosamente!"
        echo
        
        # Show where to find the report
        print_info "📊 Reporte HTML generado en: playwright-demo-report/"
        print_info "📋 Reporte completo disponible en: COMPREHENSIVE_TEST_REPORT.md"
        echo
        
        # Offer to open the HTML report
        echo -e "${CYAN}¿Deseas abrir el reporte HTML? (y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            print_info "Abriendo reporte HTML..."
            npx playwright show-report playwright-demo-report
        fi
        
    else
        print_error "El test comprehensivo falló"
        print_info "Revisa los logs arriba para más detalles"
        exit 1
    fi
    
    # Cleanup if we started the server
    if [ ! -z "$SERVER_PID" ]; then
        print_info "Deteniendo servidor de desarrollo..."
        kill $SERVER_PID 2>/dev/null || true
    fi
    
    echo
    print_header
    echo -e "${GREEN}🎉 HEALTH CHECK COMPLETADO EXITOSAMENTE!${NC}"
    echo
    print_info "📈 Métricas de salud de la SuperApp analizadas"
    print_info "🎮 Integración de ÜPlay evaluada"
    print_info "🎨 Sistema de diseño verificado"
    print_info "♿ Accesibilidad analizada"
    print_info "⚡ Performance medido"
    print_info "🔒 Seguridad evaluada"
    echo
    echo -e "${CYAN}Revisa COMPREHENSIVE_TEST_REPORT.md para el análisis completo y recomendaciones.${NC}"
    echo
}

# Execute main function
main "$@"