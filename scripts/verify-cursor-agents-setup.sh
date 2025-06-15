#!/bin/bash

# 🔍 SCRIPT DE VERIFICACIÓN: CURSOR BACKGROUND AGENTS SETUP
# Proyecto: CoomÜnity SuperApp
# Propósito: Verificar que toda la configuración esté correcta

set -e

echo "🔍 VERIFICANDO CONFIGURACIÓN DE CURSOR BACKGROUND AGENTS"
echo "========================================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success_count=0
total_checks=0

check_file() {
    local file=$1
    local description=$2
    total_checks=$((total_checks + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "${YELLOW}   Archivo faltante: $file${NC}"
    fi
}

check_directory() {
    local dir=$1
    local description=$2
    total_checks=$((total_checks + 1))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "${YELLOW}   Directorio faltante: $dir${NC}"
    fi
}

echo -e "${BLUE}📁 Verificando estructura de archivos...${NC}"

# Verificar archivos de configuración principales
check_file ".cursor/environment.json" "Configuración de entorno para Background Agents"
check_file ".cursor/mcp.json" "Configuración de Model Context Protocol"
check_file ".cursor/recommended-settings.json" "Configuración recomendada de Cursor"

# Verificar reglas y notepads
check_file ".cursor/rules/slack-agents-coomunity.md" "Reglas específicas para agentes de Slack"
check_file ".cursor/notepads/coomunity-development-standards.md" "Estándares de desarrollo CoomÜnity"
check_file ".cursor/notepads/slack-prompt-templates.md" "Templates de prompts para Slack"

# Verificar guías y documentación
check_file ".cursor/slack-setup-guide.md" "Guía de configuración de Slack"
check_file ".cursor/coomunity-agents-usage-guide.md" "Guía completa de uso de agentes"

# Verificar scripts
check_file "scripts/setup-cursor-slack-agents.sh" "Script de configuración automática"
check_file "scripts/verify-cursor-agents-setup.sh" "Script de verificación (este archivo)"

# Verificar directorios principales
check_directory ".cursor" "Directorio de configuración de Cursor"
check_directory ".cursor/rules" "Directorio de reglas"
check_directory ".cursor/notepads" "Directorio de notepads"
check_directory "scripts" "Directorio de scripts"

echo ""
echo -e "${BLUE}🔧 Verificando configuración específica...${NC}"

# Verificar contenido de environment.json
if [ -f ".cursor/environment.json" ]; then
    if grep -q "npm run dev:backend" ".cursor/environment.json"; then
        echo -e "${GREEN}✅ Comando de backend configurado correctamente${NC}"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ Comando de backend no configurado${NC}"
    fi
    total_checks=$((total_checks + 1))
    
    if grep -q "npm run dev:superapp" ".cursor/environment.json"; then
        echo -e "${GREEN}✅ Comando de SuperApp configurado correctamente${NC}"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ Comando de SuperApp no configurado${NC}"
    fi
    total_checks=$((total_checks + 1))
fi

# Verificar configuración de puertos en .env
if [ -f "Demo/apps/superapp-unified/.env" ]; then
    if grep -q "VITE_BASE_URL=http://localhost:3001" "Demo/apps/superapp-unified/.env"; then
        echo -e "${GREEN}✅ Puerto SuperApp configurado correctamente (3001)${NC}"
        success_count=$((success_count + 1))
    else
        echo -e "${YELLOW}⚠️  Puerto SuperApp podría necesitar verificación${NC}"
    fi
    total_checks=$((total_checks + 1))
fi

echo ""
echo -e "${BLUE}📊 Resumen de verificación:${NC}"
echo "================================"

if [ $success_count -eq $total_checks ]; then
    echo -e "${GREEN}🎉 ¡CONFIGURACIÓN PERFECTA!${NC}"
    echo -e "${GREEN}✅ $success_count/$total_checks verificaciones pasaron${NC}"
    echo ""
    echo -e "${BLUE}🚀 Próximos pasos:${NC}"
    echo "1. Ve a https://cursor.com/integrations"
    echo "2. Conecta tu workspace de Slack"
    echo "3. Configura tu repositorio GitHub"
    echo "4. ¡Empieza a usar @Cursor en Slack!"
    echo ""
    echo -e "${YELLOW}💡 Comando de prueba:${NC}"
    echo "@Cursor [branch=gamifier2.0] Analiza la estructura del proyecto CoomÜnity"
elif [ $success_count -gt $((total_checks * 3 / 4)) ]; then
    echo -e "${YELLOW}⚠️  CONFIGURACIÓN CASI COMPLETA${NC}"
    echo -e "${YELLOW}✅ $success_count/$total_checks verificaciones pasaron${NC}"
    echo -e "${YELLOW}🔧 Revisa los elementos faltantes arriba${NC}"
else
    echo -e "${RED}❌ CONFIGURACIÓN INCOMPLETA${NC}"
    echo -e "${RED}✅ $success_count/$total_checks verificaciones pasaron${NC}"
    echo -e "${RED}🔧 Ejecuta: ./scripts/setup-cursor-slack-agents.sh${NC}"
fi

echo ""
echo -e "${BLUE}📖 Para más información:${NC}"
echo "- Guía completa: .cursor/coomunity-agents-usage-guide.md"
echo "- Configuración Slack: .cursor/slack-setup-guide.md"
echo "- Templates de prompts: .cursor/notepads/slack-prompt-templates.md"

exit 0 