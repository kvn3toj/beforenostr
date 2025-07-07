#!/bin/bash

# 🎭 SCRIPT DE PURIFICACIÓN DE CALIDAD - BACKEND COOMUNITY
# Parte de la Sinfonía de la Calidad Modular
# Filosofía SAGE: Purificación sistemática del código

set -e

echo "🎼 INICIANDO SINFONÍA DE PURIFICACIÓN DE CALIDAD"
echo "================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar estadísticas
show_stats() {
    local title="$1"
    local errors="$2"
    local warnings="$3"

    echo -e "${BLUE}📊 ${title}${NC}"
    echo -e "   🔴 Errores: ${RED}${errors}${NC}"
    echo -e "   🟡 Warnings: ${YELLOW}${warnings}${NC}"
    echo "   ────────────────────"
}

# Verificar que estamos en la raíz del proyecto
if [ ! -f "eslint.config.cjs" ]; then
    echo -e "${RED}❌ Error: Ejecutar desde la raíz del monorepo${NC}"
    exit 1
fi

echo -e "${BLUE}🎯 Objetivo: Backend NestJS (backend/src)${NC}"
echo ""

# PASO 1: Purificación automática
echo -e "${GREEN}🔧 PASO 1: Purificación automática...${NC}"
npx eslint backend/src --fix --quiet || true
echo -e "${GREEN}✅ Purificación automática completada${NC}"
echo ""

# PASO 2: Análisis completo con métricas
echo -e "${GREEN}📊 PASO 2: Análisis de calidad completo...${NC}"

# Crear directorio de reportes si no existe
mkdir -p logs/quality

# Generar reporte completo
REPORT_FILE="logs/quality/backend-quality-report-$(date +%Y%m%d_%H%M%S).txt"
echo "Generando reporte en: $REPORT_FILE"

{
    echo "🎼 REPORTE DE CALIDAD - BACKEND COOMUNITY"
    echo "========================================"
    echo "Fecha: $(date)"
    echo "Configuración: Sinfonía de Calidad Modular"
    echo ""

    echo "📊 ANÁLISIS COMPLETO:"
    echo "===================="
    npx eslint backend/src --format=stylish 2>&1 || true

    echo ""
    echo "📋 RESUMEN POR CATEGORÍAS:"
    echo "========================="

    echo ""
    echo "🔴 ERRORES CRÍTICOS (no-explicit-any):"
    npx eslint backend/src --format=unix 2>/dev/null | grep "no-explicit-any" | wc -l || echo "0"

    echo ""
    echo "🔴 VARIABLES NO UTILIZADAS:"
    npx eslint backend/src --format=unix 2>/dev/null | grep "no-unused-vars" | wc -l || echo "0"

    echo ""
    echo "🟡 CONSOLE STATEMENTS:"
    npx eslint backend/src --format=unix 2>/dev/null | grep "no-console" | wc -l || echo "0"

} > "$REPORT_FILE"

# PASO 3: Mostrar resumen en consola
echo -e "${GREEN}📈 PASO 3: Resumen ejecutivo...${NC}"

# Contar errores y warnings
TOTAL_OUTPUT=$(npx eslint backend/src 2>&1 || true)
ERRORS=$(echo "$TOTAL_OUTPUT" | grep -o "[0-9]\+ error" | grep -o "[0-9]\+" | head -1 || echo "0")
WARNINGS=$(echo "$TOTAL_OUTPUT" | grep -o "[0-9]\+ warning" | grep -o "[0-9]\+" | head -1 || echo "0")

# Estadísticas específicas
ANY_ERRORS=$(npx eslint backend/src --format=unix 2>/dev/null | grep -c "no-explicit-any" || echo "0")
UNUSED_VARS=$(npx eslint backend/src --format=unix 2>/dev/null | grep -c "no-unused-vars" || echo "0")
CONSOLE_WARNS=$(npx eslint backend/src --format=unix 2>/dev/null | grep -c "no-console" || echo "0")

echo ""
show_stats "ESTADO GENERAL" "$ERRORS" "$WARNINGS"
echo ""
show_stats "ERRORES CRÍTICOS" "$ANY_ERRORS tipos any" "$UNUSED_VARS vars no usadas"
echo ""
show_stats "WARNINGS DE DESARROLLO" "$CONSOLE_WARNS console.log" "0 otros"

# PASO 4: Recomendaciones
echo ""
echo -e "${BLUE}🎯 RECOMENDACIONES SAGE:${NC}"
echo "========================"

if [ "$ERRORS" -gt 0 ]; then
    echo -e "${RED}🔴 Acción requerida: $ERRORS errores críticos${NC}"
    echo "   • Priorizar: tipos 'any' → interfaces específicas"
    echo "   • Limpiar: variables no utilizadas"
    echo "   • Revisar: try/catch innecesarios"
else
    echo -e "${GREEN}✅ ¡Excelente! Sin errores críticos${NC}"
fi

if [ "$WARNINGS" -gt 100 ]; then
    echo -e "${YELLOW}🟡 Optimización sugerida: $WARNINGS warnings${NC}"
    echo "   • Considerar: remover console.log en producción"
    echo "   • Mantener: logs de debugging importantes"
else
    echo -e "${GREEN}✅ Warnings bajo control${NC}"
fi

echo ""
echo -e "${GREEN}📁 Reporte detallado guardado en:${NC} $REPORT_FILE"
echo ""
echo -e "${BLUE}🎼 SINFONÍA DE PURIFICACIÓN COMPLETADA${NC}"
echo "======================================="
