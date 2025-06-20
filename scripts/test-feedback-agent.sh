#!/bin/bash

# 🤖 SCRIPT DE PRUEBA RÁPIDA - AGENTE DE FEEDBACK
# ===============================================================================
# Script simple para probar rápidamente el agente de feedback
# ===============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🤖 PRUEBA RÁPIDA - AGENTE DE FEEDBACK${NC}"
echo -e "${PURPLE}========================================${NC}"
echo ""

# 1. VERIFICAR ESTADO BÁSICO
echo -e "${BLUE}🔍 Verificando estado básico...${NC}"

# Verificar ubicación
if [[ "$(pwd)" != *"GAMIFIER-copy" ]]; then
    echo -e "${RED}❌ Error: Ejecutar desde /Users/kevinp/Movies/GAMIFIER-copy${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Ubicación correcta${NC}"

# Verificar SuperApp
if curl -s http://localhost:3001 >/dev/null; then
    echo -e "${GREEN}✅ SuperApp funcionando (puerto 3001)${NC}"
else
    echo -e "${YELLOW}⚠️ SuperApp no disponible, iniciando...${NC}"
    npm run dev:superapp &
    sleep 8
    if curl -s http://localhost:3001 >/dev/null; then
        echo -e "${GREEN}✅ SuperApp iniciada correctamente${NC}"
    else
        echo -e "${RED}❌ Error: No se pudo iniciar SuperApp${NC}"
        exit 1
    fi
fi

# 2. VERIFICAR ARCHIVOS CLAVE
echo -e "${BLUE}📁 Verificando archivos clave...${NC}"

KEY_FILES=(
    "Demo/apps/superapp-unified/src/contexts/FeedbackContext.tsx"
    "Demo/apps/superapp-unified/src/components/feedback/FeedbackAgent.tsx"
    "Demo/apps/superapp-unified/src/components/AdminPanel/AdminPanel.tsx"
)

for file in "${KEY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $(basename "$file")${NC}"
    else
        echo -e "${RED}❌ FALTA: $(basename "$file")${NC}"
        exit 1
    fi
done

# 3. MOSTRAR INFORMACIÓN DE PRUEBA
echo ""
echo -e "${BLUE}🎯 INFORMACIÓN PARA PRUEBAS${NC}"
echo -e "${PURPLE}========================================${NC}"
echo ""

echo -e "${YELLOW}🌐 URL de la aplicación:${NC}"
echo "   http://localhost:3001"
echo ""

echo -e "${YELLOW}🔑 Credenciales de administrador:${NC}"
echo "   📧 Email: admin@gamifier.com"
echo "   🔒 Password: admin123"
echo ""

echo -e "${YELLOW}🎮 Pasos para probar:${NC}"
echo "   1. Abre http://localhost:3001 en tu navegador"
echo "   2. Haz login con las credenciales de administrador"
echo "   3. Busca el toggle 'Modo Agente' en la esquina superior derecha"
echo "   4. Activa el modo agente (aparecerá un botón flotante)"
echo "   5. Haz clic en el botón flotante para reportar feedback"
echo "   6. Selecciona un tipo de feedback y un elemento"
echo "   7. Completa el modal y envía el feedback"
echo ""

echo -e "${YELLOW}🔧 Funcionalidades disponibles:${NC}"
echo "   • 🐛 Bug - Reportar errores"
echo "   • 💡 Improvement - Sugerencias de mejora"
echo "   • ❓ Missing Feature - Funcionalidades faltantes"
echo "   • 🎨 UI/UX - Problemas de interfaz"
echo "   • ⚡ Performance - Problemas de rendimiento"
echo "   • 📱 Other - Comentarios generales"
echo ""

# 4. ABRIR NAVEGADOR AUTOMÁTICAMENTE (opcional)
if command -v open >/dev/null 2>&1; then
    echo -e "${BLUE}🌐 ¿Abrir navegador automáticamente? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}🚀 Abriendo navegador...${NC}"
        open http://localhost:3001
    fi
fi

echo ""
echo -e "${GREEN}🎉 ¡Sistema listo para pruebas!${NC}"
echo -e "${BLUE}Para más información detallada, ejecuta: ./scripts/demo-feedback-system.sh${NC}"
echo ""
