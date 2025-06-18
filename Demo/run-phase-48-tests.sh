#!/bin/bash

# 🔗 Script de Verificación - Fase 48: Integración Backend Completa
# Ejecuta tests de Playwright para verificar que la integración backend funciona correctamente

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to check if a process is running on a specific port
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Esperando a que $service_name esté listo..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$service_name está listo"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name no está disponible después de $max_attempts intentos"
    return 1
}

# Parse command line arguments
HEADED_MODE=""
DEBUG_MODE=""
BROWSER=""
TEST_SCENARIO="all"
BACKEND_CHECK="true"

while [[ $# -gt 0 ]]; do
    case $1 in
        --headed)
            HEADED_MODE="--headed"
            shift
            ;;
        --debug)
            DEBUG_MODE="--debug"
            shift
            ;;
        --browser)
            BROWSER="--project=$2"
            shift 2
            ;;
        --scenario)
            TEST_SCENARIO="$2"
            shift 2
            ;;
        --skip-backend-check)
            BACKEND_CHECK="false"
            shift
            ;;
        --help)
            echo "🔗 Script de Verificación - Fase 48: Integración Backend"
            echo ""
            echo "Uso: $0 [OPTIONS]"
            echo ""
            echo "Opciones:"
            echo "  --headed              Ejecutar tests con navegador visible"
            echo "  --debug               Ejecutar en modo debug (paso a paso)"
            echo "  --browser BROWSER     Ejecutar solo en navegador específico (chromium, firefox, webkit)"
            echo "  --scenario SCENARIO   Ejecutar escenario específico:"
            echo "                          all       - Todos los tests (default)"
            echo "                          online    - Solo test de conectividad online"
            echo "                          offline   - Solo test de modo offline"
            echo "                          dashboard - Solo test de dashboard"
            echo "                          wallet    - Solo test de wallet"
            echo "                          marketplace - Solo test de marketplace"
            echo "                          refresh   - Solo test de funcionalidad refresh"
            echo "                          performance - Solo test de performance"
            echo "                          e2e       - Solo test end-to-end"
            echo "  --skip-backend-check  No verificar estado del backend antes de ejecutar"
            echo "  --help                Mostrar esta ayuda"
            echo ""
            echo "Ejemplos:"
            echo "  $0                                    # Ejecutar todos los tests"
            echo "  $0 --headed --scenario dashboard      # Ver dashboard test en navegador"
            echo "  $0 --debug --scenario offline         # Debug del test offline"
            echo "  $0 --browser chromium --scenario e2e  # E2E solo en Chrome"
            exit 0
            ;;
        *)
            print_error "Opción desconocida: $1"
            echo "Usa --help para ver las opciones disponibles"
            exit 1
            ;;
    esac
done

echo ""
echo "================================================================================"
echo "🚀 VERIFICACIÓN FASE 48: INTEGRACIÓN BACKEND COMPLETA"
echo "================================================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/superapp-unified" ]; then
    print_error "No estás en el directorio raíz del proyecto."
    print_status "Por favor, ejecuta este script desde el directorio que contiene package.json"
    exit 1
fi

# Check if Playwright is installed
if ! command -v npx >/dev/null 2>&1; then
    print_error "npx no está instalado. Por favor, instala Node.js y npm."
    exit 1
fi

if [ ! -d "node_modules/@playwright" ]; then
    print_warning "Playwright no está instalado. Instalando..."
    npm install @playwright/test
    npx playwright install
fi

# Backend check (unless skipped)
if [ "$BACKEND_CHECK" = "true" ]; then
    print_status "Verificando estado del backend..."
    
    # Check if frontend is running on port 3000
    if check_port 3000; then
        print_success "Frontend está corriendo en puerto 3000"
        
        # Try to reach the frontend
        if wait_for_service "http://localhost:3333" "Frontend React"; then
            print_success "Frontend accesible en http://localhost:3333"
        else
            print_warning "Frontend no responde, pero el puerto está ocupado"
        fi
    else
        print_error "Frontend no está corriendo en puerto 3000"
        print_status "Por favor, inicia el frontend:"
        print_status "  cd apps/superapp-unified"
        print_status "  npm run dev"
        exit 1
    fi
    
    # Check for backend on port 3000 (API endpoints)
    print_status "Verificando backend API..."
    if curl -s "http://localhost:3333/health" >/dev/null 2>&1; then
        print_success "Backend API disponible en /health"
    elif curl -s "http://localhost:3333/api" >/dev/null 2>&1; then
        print_success "Backend API detectado en /api"
    else
        print_warning "Backend API no detectado - Tests ejecutarán en modo offline"
        print_status "Para probar modo online, asegúrate de que el backend esté corriendo"
    fi
else
    print_status "Saltando verificación de backend (--skip-backend-check)"
fi

# Determine which tests to run based on scenario
TEST_FILTER=""
case $TEST_SCENARIO in
    "all")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts"
        ;;
    "online")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 1: Conectividad con Backend Real\""
        ;;
    "offline")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 2: Modo Offline con Fallback\""
        ;;
    "dashboard")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 3: Dashboard\""
        ;;
    "wallet")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 4: Wallet\""
        ;;
    "marketplace")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 5: Marketplace\""
        ;;
    "refresh")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 6: Funcionalidad de Refresh\""
        ;;
    "performance")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 7: Análisis de Requests\""
        ;;
    "e2e")
        TEST_FILTER="tests/e2e/backend-integration-phase-48.spec.ts -g \"Test 8: Verificación End-to-End\""
        ;;
    *)
        print_error "Escenario desconocido: $TEST_SCENARIO"
        print_status "Escenarios válidos: all, online, offline, dashboard, wallet, marketplace, refresh, performance, e2e"
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

PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD $TEST_FILTER"

# Create test-results directory if it doesn't exist
mkdir -p test-results

print_status "Configuración de tests:"
print_status "  Escenario: $TEST_SCENARIO"
print_status "  Comando: $PLAYWRIGHT_CMD"
print_status "  Backend check: $BACKEND_CHECK"

echo ""
echo "================================================================================"
echo "🧪 EJECUTANDO TESTS DE VERIFICACIÓN"
echo "================================================================================"
echo ""

# Run the tests
if eval $PLAYWRIGHT_CMD; then
    echo ""
    echo "================================================================================"
    print_success "🎉 TESTS COMPLETADOS EXITOSAMENTE"
    echo "================================================================================"
    echo ""
    
    # Show results summary
    print_status "📊 Resumen de Resultados:"
    
    if [ -f "test-results/results.json" ]; then
        # Parse results if JSON file exists
        if command -v jq >/dev/null 2>&1; then
            PASSED=$(jq '.suites[].tests[] | select(.outcome=="expected") | .title' test-results/results.json 2>/dev/null | wc -l)
            FAILED=$(jq '.suites[].tests[] | select(.outcome=="unexpected") | .title' test-results/results.json 2>/dev/null | wc -l)
            print_status "  ✅ Tests pasados: $PASSED"
            print_status "  ❌ Tests fallidos: $FAILED"
        fi
    fi
    
    # List generated screenshots
    if ls test-results/phase-48-*.png 1> /dev/null 2>&1; then
        print_status "📸 Screenshots generados:"
        for screenshot in test-results/phase-48-*.png; do
            print_status "  📷 $(basename "$screenshot")"
        done
    fi
    
    # Show HTML report if available
    if [ -f "test-results/html-report/index.html" ]; then
        print_status "📋 Reporte HTML disponible en:"
        print_status "  file://$(pwd)/test-results/html-report/index.html"
        
        # Try to open report automatically (macOS/Linux)
        if command -v open >/dev/null 2>&1; then
            print_status "🌐 Abriendo reporte en navegador..."
            open "test-results/html-report/index.html"
        elif command -v xdg-open >/dev/null 2>&1; then
            print_status "🌐 Abriendo reporte en navegador..."
            xdg-open "test-results/html-report/index.html"
        fi
    fi
    
    echo ""
    print_success "✅ FASE 48: INTEGRACIÓN BACKEND COMPLETA - VERIFICADA"
    
else
    echo ""
    echo "================================================================================"
    print_error "❌ TESTS FALLARON"
    echo "================================================================================"
    echo ""
    
    print_error "Algunos tests no pasaron. Revisa los logs arriba para detalles."
    
    if ls test-results/phase-48-*.png 1> /dev/null 2>&1; then
        print_status "📸 Screenshots de fallos disponibles:"
        for screenshot in test-results/phase-48-*.png; do
            print_status "  📷 $(basename "$screenshot")"
        done
    fi
    
    if [ -f "test-results/html-report/index.html" ]; then
        print_status "📋 Reporte detallado en:"
        print_status "  file://$(pwd)/test-results/html-report/index.html"
    fi
    
    print_status ""
    print_status "💡 Consejos para debugging:"
    print_status "  1. Verifica que el frontend esté corriendo: npm run dev"
    print_status "  2. Opcional: Inicia el backend en localhost:3333"
    print_status "  3. Ejecuta con --headed para ver el navegador"
    print_status "  4. Usa --debug para modo paso a paso"
    print_status "  5. Prueba escenarios individuales: --scenario offline"
    
    exit 1
fi 