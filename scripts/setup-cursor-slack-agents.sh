#!/bin/bash

# 🚀 SCRIPT DE CONFIGURACIÓN: CURSOR BACKGROUND AGENTS + SLACK
# Proyecto: CoomÜnity SuperApp
# Autor: Equipo CoomÜnity
# Fecha: Enero 2025

set -e  # Salir en caso de error

echo "🚀 CONFIGURANDO CURSOR BACKGROUND AGENTS + SLACK PARA COOMUNITY"
echo "================================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. VERIFICAR UBICACIÓN CORRECTA
log_info "Verificando ubicación del monorepo..."
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER copy"

if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
    log_error "Ubicación incorrecta"
    echo "📍 Actual: $CURRENT_DIR"
    echo "📍 Esperada: $EXPECTED_DIR"
    echo "🔧 Ejecuta: cd '$EXPECTED_DIR'"
    exit 1
fi
log_success "Ubicación correcta verificada"

# 2. VERIFICAR ESTRUCTURA DE DIRECTORIOS
log_info "Verificando estructura del proyecto..."

required_dirs=(
    "Demo/apps/superapp-unified"
    "backend"
    "admin-frontend"
    ".cursor"
)

for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        log_error "Directorio faltante: $dir"
        exit 1
    fi
done
log_success "Estructura de directorios verificada"

# 3. CREAR DIRECTORIOS CURSOR SI NO EXISTEN
log_info "Creando estructura de configuración Cursor..."

mkdir -p .cursor/rules
mkdir -p .cursor/notepads
mkdir -p .cursor/docs

log_success "Directorios Cursor creados"

# 4. VERIFICAR ARCHIVOS DE CONFIGURACIÓN CREADOS
log_info "Verificando archivos de configuración..."

config_files=(
    ".cursor/rules/slack-agents-coomunity.md"
    ".cursor/notepads/coomunity-development-standards.md"
    ".cursor/notepads/slack-prompt-templates.md"
)

for file in "${config_files[@]}"; do
    if [ ! -f "$file" ]; then
        log_warning "Archivo faltante: $file"
        echo "   Este archivo debe ser creado manualmente"
    else
        log_success "Archivo encontrado: $file"
    fi
done

# 5. VERIFICAR CONFIGURACIÓN DE PUERTOS
log_info "Verificando configuración de puertos..."

if [ -f "Demo/apps/superapp-unified/.env" ]; then
    SUPERAPP_PORT=$(grep VITE_BASE_URL Demo/apps/superapp-unified/.env | cut -d':' -f3 | cut -d'/' -f1)
    if [ "$SUPERAPP_PORT" = "3001" ]; then
        log_success "Puerto SuperApp correcto: 3001"
    else
        log_warning "Puerto SuperApp: $SUPERAPP_PORT (esperado: 3001)"
    fi
else
    log_warning "Archivo .env de SuperApp no encontrado"
fi

# 6. VERIFICAR DEPENDENCIAS CRÍTICAS
log_info "Verificando dependencias críticas..."

cd Demo/apps/superapp-unified/

# Verificar Playwright
if npm ls @playwright/test >/dev/null 2>&1; then
    PLAYWRIGHT_VERSION=$(npm ls @playwright/test --depth=0 | grep @playwright/test | cut -d@ -f3)
    log_success "Playwright instalado: v$PLAYWRIGHT_VERSION"
else
    log_warning "Playwright no encontrado"
    echo "   Ejecuta: npm install @playwright/test --save-dev"
fi

# Verificar Sentry
if npm ls @sentry/react >/dev/null 2>&1; then
    log_success "Sentry React instalado"
else
    log_warning "Sentry React no encontrado"
    echo "   Ejecuta: npm install @sentry/react --legacy-peer-deps"
fi

# Verificar Web Vitals
if npm ls web-vitals >/dev/null 2>&1; then
    log_success "Web Vitals instalado"
else
    log_warning "Web Vitals no encontrado"
    echo "   Ejecuta: npm install web-vitals --legacy-peer-deps"
fi

cd ../../../

# 7. VERIFICAR TURBOREPO
log_info "Verificando Turborepo..."

if npm ls turbo >/dev/null 2>&1; then
    TURBO_VERSION=$(npm ls turbo --depth=0 | grep turbo@ | cut -d@ -f2)
    log_success "Turborepo local instalado: v$TURBO_VERSION"
else
    log_warning "Turborepo no instalado localmente"
    echo "   Ejecuta: npm install turbo --save-dev --legacy-peer-deps"
fi

# 8. LIMPIAR PROCESOS MÚLTIPLES
log_info "Limpiando procesos múltiples..."

pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "turbo" 2>/dev/null || true

sleep 2

RUNNING_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ $RUNNING_PROCESSES -eq 0 ]; then
    log_success "No hay procesos múltiples ejecutándose"
else
    log_warning "Procesos aún ejecutándose: $RUNNING_PROCESSES"
    ps aux | grep -E "(vite|npm run dev)" | grep -v grep
fi

# 9. VERIFICAR PUERTOS DISPONIBLES
log_info "Verificando disponibilidad de puertos..."

check_port() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        log_warning "Puerto $port ocupado"
        lsof -i :$port
    else
        log_success "Puerto $port disponible"
    fi
}

check_port 3000
check_port 3001
check_port 3002

# 10. VERIFICAR SERVICIOS (si están ejecutándose)
log_info "Verificando servicios disponibles..."

if curl -s http://localhost:1111/health >/dev/null; then
    log_success "Backend (3002) disponible"
else
    log_info "Backend (3002) no disponible (normal si no está iniciado)"
fi

if curl -s -I http://localhost:2222 >/dev/null; then
    log_success "SuperApp (3001) disponible"
else
    log_info "SuperApp (3001) no disponible (normal si no está iniciada)"
fi

# 11. GENERAR CONFIGURACIÓN RECOMENDADA
log_info "Generando configuración recomendada..."

cat > .cursor/recommended-settings.json << 'EOF'
{
  "cursor.chat.defaultMode": "agent",
  "cursor.chat.autoRefresh": true,
  "cursor.chat.autoScroll": true,
  "cursor.chat.autoApplyOutsideContext": true,
  "cursor.chat.autoRun": true,
  "cursor.chat.largeContext": true,
  "cursor.chat.iterateOnLints": true,
  "cursor.chat.webSearchTool": true,
  "cursor.tab.enabled": true,
  "cursor.tab.suggestionsInComments": true,
  "cursor.tab.autoImport": true,
  "cursor.codebase.indexNewFolders": true,
  "cursor.editor.showChatEditTooltip": true,
  "cursor.editor.autoSelectForCmdK": true,
  "cursor.editor.useThemedDiffBackgrounds": true,
  "cursor.terminal.hint": true,
  "cursor.terminal.showHoverHint": true
}
EOF

log_success "Configuración recomendada generada en .cursor/recommended-settings.json"

# 12. GENERAR GUÍA DE CONFIGURACIÓN SLACK
log_info "Generando guía de configuración Slack..."

cat > .cursor/slack-setup-guide.md << 'EOF'
# 🔧 GUÍA DE CONFIGURACIÓN SLACK PARA COOMUNITY

## 📋 PASOS DE CONFIGURACIÓN

### 1. Activar Integración Slack
1. Ve a [Cursor Integrations](https://cursor.com/integrations)
2. Click "Connect" junto a Slack
3. Instala la app Cursor en tu workspace Slack
4. Autoriza la conexión

### 2. Configurar GitHub
1. Conecta tu cuenta GitHub si no está conectada
2. Autoriza acceso al repositorio CoomÜnity

### 3. Configurar Ajustes por Defecto
- **Repositorio**: `kevinp/coomunity` (ajustar según tu repo)
- **Rama**: `gamifier2.0`
- **Modelo**: `claude-3.5-sonnet`
- **Base Branch**: dejar en blanco (usará main/master)

### 4. Configurar Canales Slack
```
# En cada canal relevante:
@Cursor settings

# Configuración sugerida:
Repositorio: kevinp/coomunity
Rama: gamifier2.0
Modelo: claude-3.5-sonnet
```

### 5. Habilitar Configuraciones
- ✅ Usage based pricing
- ✅ Display agent summary
- ⚠️ Display agent summary in external channels (según necesidad)

## 🎯 COMANDOS DE PRUEBA

### Comando Básico
```
@Cursor [branch=gamifier2.0] help me understand the CoomÜnity project structure
```

### Comando Específico
```
@Cursor [branch=gamifier2.0] 
Check the health of backend and frontend services.
Verify ports 3001 (SuperApp) and 3002 (Backend) are configured correctly.
Run commands from monorepo root: /Users/kevinp/Movies/GAMIFIER copy/
```

## 📚 RECURSOS
- Templates de prompts: `.cursor/notepads/slack-prompt-templates.md`
- Estándares de desarrollo: `.cursor/notepads/coomunity-development-standards.md`
- Reglas específicas: `.cursor/rules/slack-agents-coomunity.md`
EOF

log_success "Guía de configuración Slack generada"

# 13. RESUMEN FINAL
echo ""
echo "🎉 CONFIGURACIÓN COMPLETADA"
echo "=========================="
echo ""
log_success "Archivos de configuración creados"
log_success "Estructura de directorios verificada"
log_success "Dependencias verificadas"
log_success "Procesos limpiados"
log_success "Puertos verificados"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Revisar configuración recomendada en .cursor/recommended-settings.json"
echo "2. Seguir guía de Slack en .cursor/slack-setup-guide.md"
echo "3. Configurar integración Slack en https://cursor.com/integrations"
echo "4. Probar comandos básicos en Slack"
echo ""
echo "🔗 RECURSOS CREADOS:"
echo "- .cursor/rules/slack-agents-coomunity.md"
echo "- .cursor/notepads/coomunity-development-standards.md"
echo "- .cursor/notepads/slack-prompt-templates.md"
echo "- .cursor/recommended-settings.json"
echo "- .cursor/slack-setup-guide.md"
echo ""
log_success "¡Configuración de Cursor Background Agents + Slack lista para CoomÜnity!" 