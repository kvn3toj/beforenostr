#!/bin/bash

# ================================================
# SCRIPT DE VERIFICACIÓN: UBICACIÓN DE IMPLEMENTACIONES
# ================================================
# Este script verifica que estemos trabajando en la ubicación correcta
# de la página CoomÜnity unificada antes de hacer implementaciones.

echo "🔍 VERIFICANDO UBICACIÓN DE LA PÁGINA UNIFICADA CoomÜnity..."
echo "================================================"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio objetivo
UNIFIED_DIR="data/backups/my_recovered_website"
CURRENT_DIR=$(pwd)

echo "📂 Directorio actual: $CURRENT_DIR"

# Verificar si estamos en el proyecto raíz
if [[ ! -d "$UNIFIED_DIR" ]]; then
    echo -e "${RED}❌ ERROR: No se encuentra el directorio de la página unificada${NC}"
    echo "   Esperado: $CURRENT_DIR/$UNIFIED_DIR"
    echo "   Asegúrate de estar en el directorio raíz del proyecto"
    exit 1
fi

# Verificar archivos clave de la página unificada
echo -e "\n🎯 VERIFICANDO ARCHIVOS CLAVE..."

# Verificar GA4 en index.html
if grep -q "G-COOMUNITY123" "$UNIFIED_DIR/index.html" 2>/dev/null; then
    echo -e "${GREEN}✅ GA4 integrado encontrado${NC}"
else
    echo -e "${RED}❌ GA4 no encontrado en index.html${NC}"
fi

# Verificar CSS de heurísticas
CSS_COUNT=$(find "$UNIFIED_DIR/shared/css" -name "*.css" 2>/dev/null | wc -l | tr -d ' ')
if [[ $CSS_COUNT -gt 10 ]]; then
    echo -e "${GREEN}✅ CSS de heurísticas encontrado ($CSS_COUNT archivos)${NC}"
else
    echo -e "${YELLOW}⚠️  Pocos archivos CSS encontrados ($CSS_COUNT)${NC}"
fi

# Verificar JavaScript managers
JS_COUNT=$(find "$UNIFIED_DIR/shared/js" -name "*manager*.js" 2>/dev/null | wc -l | tr -d ' ')
if [[ $JS_COUNT -gt 5 ]]; then
    echo -e "${GREEN}✅ JavaScript managers encontrados ($JS_COUNT archivos)${NC}"
else
    echo -e "${YELLOW}⚠️  Pocos managers JS encontrados ($JS_COUNT)${NC}"
fi

# Verificar navegación unificada
if grep -q "unified-navbar" "$UNIFIED_DIR/sections/pilgrim/index-mejorado.html" 2>/dev/null; then
    echo -e "${GREEN}✅ Navegación unificada encontrada${NC}"
else
    echo -e "${YELLOW}⚠️  Navegación unificada no detectada${NC}"
fi

# Verificar servidor funcionando
echo -e "\n🌐 VERIFICANDO SERVIDORES..."

# Verificar puerto 8080
if curl -s -I http://localhost:8080/ | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Servidor puerto 8080 funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  Servidor puerto 8080 no responde${NC}"
    echo "   Para iniciar: cd $UNIFIED_DIR && python3 -m http.server 8080"
fi

# Verificar puerto 3001 
if curl -s -I http://localhost:3001/ | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Servidor Node.js puerto 3001 funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  Servidor Node.js puerto 3001 no responde${NC}"
    echo "   Para iniciar: cd $UNIFIED_DIR && PORT=3001 node server.js"
fi

echo -e "\n🎯 RESUMEN:"
echo "================================================"
echo -e "${GREEN}📁 Página unificada ubicada en: $UNIFIED_DIR${NC}"
echo -e "${GREEN}🌐 URLs de acceso:${NC}"
echo "   - http://localhost:8080/ (Python server)"
echo "   - http://localhost:3001/ (Node.js server)"
echo -e "${GREEN}📝 Para implementar mejoras, trabajar SIEMPRE en: $UNIFIED_DIR${NC}"

echo -e "\n✅ Verificación completada." 