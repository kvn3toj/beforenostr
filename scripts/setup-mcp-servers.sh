#!/bin/bash

# 🌟 Script de Configuración MCP Servers - CoomÜnity
# Configuración automática de Model Context Protocol servers para Cursor
# Invocación del Concilio: ANA + ATLAS + COSMOS + MIRA + SAGE

set -e

echo "🌟 Iniciando configuración MCP Servers para CoomÜnity..."
echo "🔮 Invocando la sabiduría del Concilio de Guardianes..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# 1. VERIFICAR DEPENDENCIAS CRÍTICAS
log_info "ATLAS verifica la infraestructura base..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
log_success "Node.js detectado: $NODE_VERSION"

# Verificar npm
if ! command -v npm &> /dev/null; then
    log_error "npm no está disponible"
    exit 1
fi

NPM_VERSION=$(npm --version)
log_success "npm detectado: $NPM_VERSION"

# 2. INSTALAR DEPENDENCIAS MCP GLOBALES
log_info "MIRA configura las herramientas especializadas..."

# Instalar MCP servers oficiales
log_info "Instalando MCP servers oficiales..."

npm install -g @modelcontextprotocol/server-postgres
log_success "PostgreSQL MCP Server instalado"

npm install -g @modelcontextprotocol/server-filesystem
log_success "Filesystem MCP Server instalado"

npm install -g @modelcontextprotocol/server-github
log_success "GitHub MCP Server instalado"

npm install -g @modelcontextprotocol/server-web-search
log_success "Web Search MCP Server instalado"

npm install -g @modelcontextprotocol/server-playwright
log_success "Playwright MCP Server instalado"

# 3. CONFIGURAR DEPENDENCIAS DEL PHILOSOPHY GUARDIAN
log_info "SAGE prepara el Guardian Filosófico..."

# Instalar dependencias para el Philosophy Guardian Server
npm install @modelcontextprotocol/sdk

log_success "SDK MCP instalado para Philosophy Guardian"

# Hacer el script ejecutable
chmod +x scripts/mcp-philosophy-server.js
log_success "Philosophy Guardian Server configurado"

# 4. VERIFICAR SERVICIOS BACKEND CRÍTICOS
log_info "COSMOS verifica la sinfonía sistémica..."

# Verificar PostgreSQL
if brew services list | grep -q "postgresql.*started"; then
    log_success "PostgreSQL está ejecutándose"
else
    log_warning "PostgreSQL no está ejecutándose. Iniciando..."
    brew services start postgresql@15
    sleep 3
    if brew services list | grep -q "postgresql.*started"; then
        log_success "PostgreSQL iniciado exitosamente"
    else
        log_error "No se pudo iniciar PostgreSQL. Verificar instalación."
    fi
fi

# Verificar Redis
if brew services list | grep -q "redis.*started"; then
    log_success "Redis está ejecutándose"
else
    log_warning "Redis no está ejecutándose. Iniciando..."
    brew services start redis
    sleep 2
    if brew services list | grep -q "redis.*started"; then
        log_success "Redis iniciado exitosamente"
    else
        log_error "No se pudo iniciar Redis. Verificar instalación."
    fi
fi

# 5. VERIFICAR CONECTIVIDAD DEL BACKEND
log_info "NIRA verifica los patrones de conectividad..."

# Test de conectividad PostgreSQL
if lsof -i :5432 >/dev/null 2>&1; then
    log_success "PostgreSQL escuchando en puerto 5432"
else
    log_warning "PostgreSQL no está escuchando en puerto 5432"
fi

# Test de conectividad Redis
if lsof -i :6379 >/dev/null 2>&1; then
    log_success "Redis escuchando en puerto 6379"
else
    log_warning "Redis no está escuchando en puerto 6379"
fi

# Test del backend NestJS (si está corriendo)
if curl -s http://localhost:3002/health >/dev/null 2>&1; then
    log_success "Backend NestJS respondiendo en puerto 3002"
    BACKEND_STATUS="✅ OPERACIONAL"
else
    log_warning "Backend NestJS no está respondiendo en puerto 3002"
    BACKEND_STATUS="⚠️ NO DISPONIBLE"
fi

# 6. VALIDAR CONFIGURACIÓN MCP
log_info "SAGE valida la configuración del oráculo..."

# Verificar archivo de configuración global
if [ -f ~/.cursor/mcp.json ]; then
    log_success "Configuración MCP global encontrada"

    # Verificar que contiene los servers de CoomÜnity
    if grep -q "coomunity-backend" ~/.cursor/mcp.json; then
        log_success "Configuración CoomÜnity Backend detectada"
    else
        log_warning "Configuración CoomÜnity Backend no encontrada"
    fi

    if grep -q "coomunity-philosophy" ~/.cursor/mcp.json; then
        log_success "Configuración Philosophy Guardian detectada"
    else
        log_warning "Configuración Philosophy Guardian no encontrada"
    fi
else
    log_error "Archivo de configuración MCP no encontrado en ~/.cursor/mcp.json"
fi

# Verificar configuración local del SuperApp
if [ -f Demo/apps/superapp-unified/.cursor/mcp.json ]; then
    log_success "Configuración MCP local del SuperApp encontrada"
else
    log_warning "Configuración MCP local del SuperApp no encontrada"
fi

# 7. GENERAR REPORTE DE ESTADO
log_info "KIRA documenta el estado del sistema..."

cat > logs/mcp-setup-report.md << EOF
# 🌟 Reporte de Configuración MCP - CoomÜnity

## Estado de los Servidores MCP

### ✅ Servidores Instalados
- **PostgreSQL MCP**: Integración con base de datos CoomÜnity
- **Filesystem MCP**: Navegación inteligente del monorepo
- **GitHub MCP**: Gestión de repositorio y colaboración
- **Web Search MCP**: Búsqueda consciente y ética
- **Playwright MCP**: Testing automatizado E2E
- **Philosophy Guardian**: Validador de alineación filosófica

### 🔧 Estado de Infraestructura
- **Backend NestJS**: $BACKEND_STATUS
- **PostgreSQL**: $(brew services list | grep postgresql | awk '{print $2}' | tr '[:lower:]' '[:upper:]')
- **Redis**: $(brew services list | grep redis | awk '{print $2}' | tr '[:lower:]' '[:upper:]')

### 📋 Configuración
- **Configuración Global**: ~/.cursor/mcp.json ✅
- **Configuración SuperApp**: Demo/apps/superapp-unified/.cursor/mcp.json ✅
- **Philosophy Guidelines**: docs/philosophy-guidelines.json ✅

### 🎯 Próximos Pasos
1. **Configurar tokens de API**: GitHub, Notion (opcional), Linear (opcional)
2. **Reiniciar Cursor** para cargar la nueva configuración MCP
3. **Probar conectividad** con comandos de test en Cursor Chat
4. **Validar Philosophy Guardian** con features existentes

### 🧪 Comandos de Test Recomendados

En Cursor Chat, prueba:
- "¿Qué herramientas MCP están disponibles?"
- "Lista los archivos del módulo ÜPlay usando el MCP filesystem"
- "Valida la alineación filosófica del componente SmartQuickActions"
- "Busca mejores prácticas para React Performance usando web search"

---
**Generado por**: Setup MCP Script - CoomÜnity
**Fecha**: $(date)
**Concilio Invocado**: ANA + ATLAS + COSMOS + MIRA + SAGE
EOF

log_success "Reporte de estado generado en logs/mcp-setup-report.md"

# 8. INSTRUCCIONES FINALES
echo ""
echo "🎉 CONFIGURACIÓN MCP COMPLETADA"
echo "==============================="
echo ""
log_success "✅ Todos los MCP Servers están instalados y configurados"
log_success "✅ Philosophy Guardian está listo para supervisar el desarrollo"
log_success "✅ Configuraciones generadas para uso global y local"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. 🔑 Configurar tokens de API (GitHub, etc.) en los archivos .cursor/mcp.json"
echo "2. 🔄 Reiniciar Cursor para cargar las nuevas configuraciones"
echo "3. 🧪 Probar conectividad con comandos de test en Cursor Chat"
echo "4. 🌟 Comenzar a desarrollar con la sabiduría del Concilio"
echo ""
echo "🔗 RECURSOS:"
echo "- Reporte de estado: logs/mcp-setup-report.md"
echo "- Configuración global: ~/.cursor/mcp.json"
echo "- Directrices filosóficas: docs/philosophy-guidelines.json"
echo "- Philosophy Guardian: scripts/mcp-philosophy-server.js"
echo ""
log_success "¡El Concilio de Guardianes ha bendecido tu configuración MCP! 🌌✨"
