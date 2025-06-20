#!/bin/bash

echo "🚀 PRE-DEPLOY CHECK - COOMUNITY SUPERAPP"
echo "========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

SUCCESS_COUNT=0
TOTAL_CHECKS=15
CRITICAL_ISSUES=0

check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}❌ $2${NC}"
        if [ "$3" = "CRITICAL" ]; then
            ((CRITICAL_ISSUES++))
            echo -e "${RED}   🚨 CRITICAL: Este issue debe resolverse antes del deploy${NC}"
        fi
    fi
}

warning() {
    echo -e "${YELLOW}⚠️ WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️ INFO: $1${NC}"
}

echo -e "${PURPLE}📋 INICIANDO VERIFICACIÓN PRE-DEPLOY...${NC}"
echo ""

# 1. Verificar ubicación correcta
echo -e "${BLUE}1. Verificando ubicación del proyecto...${NC}"
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"
if [ "$CURRENT_DIR" = "$EXPECTED_DIR" ]; then
    check_result 0 "Directorio de proyecto correcto"
else
    check_result 1 "Directorio incorrecto. Actual: $CURRENT_DIR, Esperado: $EXPECTED_DIR" "CRITICAL"
fi

# 2. Verificar estructura de archivos críticos
echo -e "${BLUE}2. Verificando estructura de archivos...${NC}"
if [ -f "Demo/apps/superapp-unified/package.json" ] && [ -f "Demo/apps/superapp-unified/vite.config.ts" ]; then
    check_result 0 "Estructura de archivos de SuperApp presente"
else
    check_result 1 "Archivos críticos de SuperApp faltantes" "CRITICAL"
fi

# 3. Verificar dependencias instaladas
echo -e "${BLUE}3. Verificando dependencias...${NC}"
cd Demo/apps/superapp-unified
if [ -d "node_modules" ]; then
    check_result 0 "Dependencias node_modules instaladas"
else
    check_result 1 "node_modules faltante - ejecutar npm install" "CRITICAL"
fi

# 4. Verificar dependencias críticas específicas
echo -e "${BLUE}4. Verificando dependencias críticas...${NC}"
MISSING_DEPS=""
if ! npm ls @supabase/supabase-js > /dev/null 2>&1; then
    MISSING_DEPS="$MISSING_DEPS @supabase/supabase-js"
fi
if ! npm ls @mui/material > /dev/null 2>&1; then
    MISSING_DEPS="$MISSING_DEPS @mui/material"
fi
if ! npm ls react > /dev/null 2>&1; then
    MISSING_DEPS="$MISSING_DEPS react"
fi

if [ -z "$MISSING_DEPS" ]; then
    check_result 0 "Todas las dependencias críticas instaladas"
else
    check_result 1 "Dependencias faltantes: $MISSING_DEPS" "CRITICAL"
fi

# 5. Verificar configuración de Supabase
echo -e "${BLUE}5. Verificando configuración de Supabase...${NC}"
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        check_result 0 "Variables de entorno de Supabase configuradas"
    else
        check_result 1 "Variables de Supabase incompletas en .env.local" "CRITICAL"
    fi
else
    check_result 1 "Archivo .env.local no encontrado" "CRITICAL"
fi

# 6. Test de build de producción
echo -e "${BLUE}6. Probando build de producción...${NC}"
echo "   Ejecutando npm run build..."
if npm run build > /dev/null 2>&1; then
    check_result 0 "Build de producción exitoso"

    # Verificar que el directorio dist existe
    if [ -d "dist" ]; then
        DIST_SIZE=$(du -sh dist | cut -f1)
        info "Tamaño del build: $DIST_SIZE"
    fi
else
    check_result 1 "Build de producción falló" "CRITICAL"
fi

# 7. Verificar archivos de configuración de deployment
echo -e "${BLUE}7. Verificando archivos de configuración...${NC}"
cd ../../..
if [ -f "Demo/apps/superapp-unified/vite.config.ts" ]; then
    check_result 0 "Configuración de Vite presente"
else
    check_result 1 "vite.config.ts faltante"
fi

# 8. Verificar integración de Supabase
echo -e "${BLUE}8. Verificando integración de Supabase...${NC}"
./scripts/verify-supabase-integration.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check_result 0 "Integración de Supabase operacional"
else
    check_result 1 "Problemas con integración de Supabase" "CRITICAL"
fi

# 9. Verificar que no hay procesos conflictivos
echo -e "${BLUE}9. Verificando procesos conflictivos...${NC}"
CONFLICTING_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ $CONFLICTING_PROCESSES -eq 0 ]; then
    check_result 0 "No hay procesos de desarrollo ejecutándose"
else
    warning "Hay $CONFLICTING_PROCESSES procesos de desarrollo ejecutándose"
    check_result 1 "Procesos de desarrollo activos - detener antes del deploy"
fi

# 10. Verificar variables de entorno para diferentes ambientes
echo -e "${BLUE}10. Verificando configuración de ambientes...${NC}"
ENV_FILES_COUNT=0
for env_file in Demo/apps/superapp-unified/.env.local Demo/apps/superapp-unified/.env Demo/apps/superapp-unified/.env.production; do
    if [ -f "$env_file" ]; then
        ((ENV_FILES_COUNT++))
    fi
done

if [ $ENV_FILES_COUNT -ge 1 ]; then
    check_result 0 "Archivos de configuración de ambiente presentes ($ENV_FILES_COUNT encontrados)"
else
    check_result 1 "No se encontraron archivos de configuración de ambiente" "CRITICAL"
fi

# 11. Verificar conectividad con Supabase
echo -e "${BLUE}11. Verificando conectividad con Supabase...${NC}"
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" Demo/apps/superapp-unified/.env.local 2>/dev/null | cut -d'=' -f2)
if [ -n "$SUPABASE_URL" ]; then
    if curl -s "$SUPABASE_URL/rest/v1/" > /dev/null 2>&1; then
        check_result 0 "Conectividad con Supabase confirmada"
    else
        check_result 1 "No se puede conectar con Supabase API"
    fi
else
    check_result 1 "URL de Supabase no configurada"
fi

# 12. Verificar tamaño del bundle
echo -e "${BLUE}12. Analizando tamaño del bundle...${NC}"
cd Demo/apps/superapp-unified
if [ -d "dist" ]; then
    BUNDLE_SIZE_KB=$(du -sk dist | cut -f1)
    BUNDLE_SIZE_MB=$((BUNDLE_SIZE_KB / 1024))

    if [ $BUNDLE_SIZE_MB -lt 10 ]; then
        check_result 0 "Tamaño del bundle optimizado (${BUNDLE_SIZE_MB}MB)"
    elif [ $BUNDLE_SIZE_MB -lt 20 ]; then
        warning "Bundle size: ${BUNDLE_SIZE_MB}MB (considerar optimización)"
        check_result 0 "Tamaño del bundle aceptable (${BUNDLE_SIZE_MB}MB)"
    else
        check_result 1 "Bundle demasiado grande (${BUNDLE_SIZE_MB}MB) - optimizar antes del deploy"
    fi
else
    check_result 1 "Directorio dist no encontrado - ejecutar build primero"
fi

# 13. Verificar archivos críticos para deployment
echo -e "${BLUE}13. Verificando archivos críticos para deployment...${NC}"
CRITICAL_FILES=(
    "src/main.tsx"
    "src/App.tsx"
    "src/lib/supabase.ts"
    "src/hooks/useSupabaseAuth.ts"
    "index.html"
)

MISSING_CRITICAL=""
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_CRITICAL="$MISSING_CRITICAL $file"
    fi
done

if [ -z "$MISSING_CRITICAL" ]; then
    check_result 0 "Todos los archivos críticos presentes"
else
    check_result 1 "Archivos críticos faltantes: $MISSING_CRITICAL" "CRITICAL"
fi

# 14. Verificar configuración de TypeScript
echo -e "${BLUE}14. Verificando configuración de TypeScript...${NC}"
if npx tsc --noEmit > /dev/null 2>&1; then
    check_result 0 "Compilación de TypeScript exitosa"
else
    check_result 1 "Errores de TypeScript encontrados - revisar antes del deploy"
fi

# 15. Verificar que no hay console.logs en producción
echo -e "${BLUE}15. Verificando limpieza de código...${NC}"
CONSOLE_COUNT=$(find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "console\.log" | wc -l)
if [ $CONSOLE_COUNT -eq 0 ]; then
    check_result 0 "No hay console.logs en el código"
else
    warning "Se encontraron $CONSOLE_COUNT archivos con console.log"
    check_result 0 "Console.logs encontrados (no crítico para deploy)"
fi

cd ../../..

echo ""
echo "========================================="
echo -e "${PURPLE}📊 RESUMEN DE PRE-DEPLOY CHECK${NC}"
echo "========================================="
echo -e "Verificaciones exitosas: ${GREEN}$SUCCESS_COUNT/$TOTAL_CHECKS${NC}"
echo -e "Issues críticos: ${RED}$CRITICAL_ISSUES${NC}"

if [ $CRITICAL_ISSUES -eq 0 ]; then
    if [ $SUCCESS_COUNT -eq $TOTAL_CHECKS ]; then
        echo -e "${GREEN}🎉 LISTO PARA DEPLOY! Todas las verificaciones pasaron.${NC}"
        echo ""
        echo -e "${BLUE}🚀 Próximos pasos:${NC}"
        echo "   1. Configurar proyecto en Vercel"
        echo "   2. Configurar variables de entorno de producción"
        echo "   3. Realizar deploy inicial"
        echo ""
        echo -e "${GREEN}Ejecuta: npx vercel --cwd Demo/apps/superapp-unified${NC}"
    elif [ $SUCCESS_COUNT -ge 12 ]; then
        echo -e "${YELLOW}⚠️ CASI LISTO para deploy. Issues menores detectados.${NC}"
        echo "Se recomienda resolver los issues antes del deploy a producción."
    else
        echo -e "${RED}❌ NO LISTO para deploy. Demasiados issues detectados.${NC}"
    fi
else
    echo -e "${RED}🚨 NO LISTO PARA DEPLOY - ISSUES CRÍTICOS DETECTADOS${NC}"
    echo -e "${RED}Debe resolver TODOS los issues críticos antes de continuar.${NC}"
    echo ""
    echo -e "${YELLOW}Acciones recomendadas:${NC}"
    echo "   1. Resolver todos los issues marcados como CRITICAL"
    echo "   2. Re-ejecutar este script: ./scripts/pre-deploy-check.sh"
    echo "   3. Proceder con deploy solo cuando todos los checks pasen"
fi

echo ""
echo "========================================="
echo -e "${BLUE}Fecha de verificación: $(date)${NC}"
echo "========================================="

# Exit con código apropiado
if [ $CRITICAL_ISSUES -eq 0 ] && [ $SUCCESS_COUNT -ge 12 ]; then
    exit 0
else
    exit 1
fi
