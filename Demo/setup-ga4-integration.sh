#!/bin/bash

# 📊 GA4 Integration Setup Script - CoomÜnity Platform
# Script para instalar dependencias y ejecutar la integración de GA4

set -e  # Exit on any error

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

# Header
echo "
================================================================================
📊 GA4 Integration Setup - CoomÜnity Platform
================================================================================
"

# Check prerequisites
print_status "Verificando prerequisitos..."

if ! command -v node >/dev/null 2>&1; then
    print_error "Node.js no está instalado. Por favor instala Node.js 16+ y vuelve a intentar."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    print_error "npm no está instalado. Por favor instala npm y vuelve a intentar."
    exit 1
fi

print_success "Prerequisitos verificados"

# Install dependencies
print_status "Instalando dependencias..."

if [ ! -f "package.json" ]; then
    print_status "Copiando package.json específico para GA4..."
    cp ga4-package.json package.json
fi

npm install

print_success "Dependencias instaladas"

# Function to show usage
show_usage() {
    echo "
Uso: $0 [OPCIONES]

Opciones:
    --measurement-id ID    Especifica tu Measurement ID de GA4 (ej: G-XXXXXXXXXX)
    --project-path PATH    Ruta al proyecto (por defecto: data/backups/my_recovered_website)
    --backup              Crear backup antes de realizar cambios
    --dry-run             Mostrar qué se haría sin hacer cambios reales
    --help                Mostrar esta ayuda

Ejemplos:
    $0                                           # Ejecutar con configuración por defecto
    $0 --measurement-id G-ABC123XYZ              # Especificar Measurement ID
    $0 --backup                                  # Crear backup antes de integrar
    $0 --dry-run                                 # Modo simulación
"
}

# Parse command line arguments
MEASUREMENT_ID=""
PROJECT_PATH="data/backups/my_recovered_website"
CREATE_BACKUP=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --measurement-id)
            MEASUREMENT_ID="$2"
            shift 2
            ;;
        --project-path)
            PROJECT_PATH="$2"
            shift 2
            ;;
        --backup)
            CREATE_BACKUP=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_warning "Opción desconocida: $1"
            shift
            ;;
    esac
done

# Verify project path exists
if [ ! -d "$PROJECT_PATH" ]; then
    print_error "Directorio del proyecto no encontrado: $PROJECT_PATH"
    print_status "Directorios disponibles:"
    ls -la data/backups/ 2>/dev/null || echo "No se encontró data/backups/"
    exit 1
fi

print_success "Directorio del proyecto verificado: $PROJECT_PATH"

# Create a temporary TypeScript config for the script
print_status "Creando configuración temporal..."

cat > tsconfig.temp.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["ga4-integration-script.ts"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Update script configuration if measurement ID provided
if [ ! -z "$MEASUREMENT_ID" ]; then
    print_status "Configurando Measurement ID: $MEASUREMENT_ID"
    
    # Create a temporary script with the updated measurement ID
    sed "s/G-XXXXXXXXXX/$MEASUREMENT_ID/g" ga4-integration-script.ts > ga4-integration-script.temp.ts
    mv ga4-integration-script.temp.ts ga4-integration-script.ts
fi

# Update project path if different from default
if [ "$PROJECT_PATH" != "data/backups/my_recovered_website" ]; then
    print_status "Configurando ruta del proyecto: $PROJECT_PATH"
    sed -i.bak "s|data/backups/my_recovered_website|$PROJECT_PATH|g" ga4-integration-script.ts
fi

# Set backup option
if [ "$CREATE_BACKUP" = true ]; then
    print_status "Backup habilitado"
    sed -i.bak "s/createBackup: false/createBackup: true/g" ga4-integration-script.ts
fi

# Execute the integration
if [ "$DRY_RUN" = true ]; then
    print_warning "MODO DRY-RUN: Mostrando qué se haría..."
    print_status "Archivos HTML que se procesarían:"
    find "$PROJECT_PATH" -name "*.html" -not -path "*/node_modules/*" -not -path "*/backup*/*" -not -path "*/test*/*" | head -10
    print_status "Archivos JS que se generarían:"
    echo "  - $PROJECT_PATH/shared/js/ga4-events.js"
    echo "  - $PROJECT_PATH/shared/js/ga4-examples-red-pill.js"
    echo "  - $PROJECT_PATH/shared/js/ga4-examples-merchant.js"
    echo "  - $PROJECT_PATH/shared/js/ga4-examples-pilgrim.js"
    echo "  - $PROJECT_PATH/GA4-INTEGRATION-GUIDE.md"
    print_warning "Para ejecutar realmente, quita la opción --dry-run"
else
    print_status "Ejecutando integración de GA4..."
    
    # Run the TypeScript script
    npx ts-node --project tsconfig.temp.json ga4-integration-script.ts
    
    if [ $? -eq 0 ]; then
        print_success "¡Integración de GA4 completada exitosamente!"
        
        echo "
================================================================================
📁 Archivos Generados
================================================================================
"
        
        if [ -f "$PROJECT_PATH/shared/js/ga4-events.js" ]; then
            print_success "Módulo principal: $PROJECT_PATH/shared/js/ga4-events.js"
        fi
        
        if [ -f "$PROJECT_PATH/GA4-INTEGRATION-GUIDE.md" ]; then
            print_success "Documentación: $PROJECT_PATH/GA4-INTEGRATION-GUIDE.md"
        fi
        
        echo "
================================================================================
📋 Próximos Pasos
================================================================================
"
        
        if [ -z "$MEASUREMENT_ID" ]; then
            print_warning "1. IMPORTANTE: Reemplaza 'G-XXXXXXXXXX' con tu Measurement ID real en todos los archivos HTML"
        else
            print_success "1. ✅ Measurement ID configurado: $MEASUREMENT_ID"
        fi
        
        print_status "2. Incluye el archivo ga4-events.js en tu JavaScript Manager principal"
        print_status "3. Implementa los ejemplos de tracking en cada sección según la documentación"
        print_status "4. Prueba los eventos usando GA4 DebugView en Google Analytics"
        print_status "5. Lee GA4-INTEGRATION-GUIDE.md para configuración avanzada"
        
        echo "
================================================================================
🔍 Testing y Validación
================================================================================
"
        
        print_status "Para probar la integración:"
        print_status "1. Abre las páginas web en tu navegador"
        print_status "2. Abre Developer Tools (F12) y ve a la consola"
        print_status "3. Busca mensajes de 'GA4 Event:' para confirmar que los eventos se envían"
        print_status "4. Ve a GA4 DebugView en Google Analytics para ver eventos en tiempo real"
        
    else
        print_error "Error durante la integración de GA4"
        exit 1
    fi
fi

# Cleanup
print_status "Limpiando archivos temporales..."
rm -f tsconfig.temp.json
rm -f ga4-integration-script.ts.bak

print_success "¡Setup completo!"

echo "
================================================================================
✅ GA4 Integration Setup Completado
================================================================================
" 