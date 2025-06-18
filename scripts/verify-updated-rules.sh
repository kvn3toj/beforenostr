#!/bin/bash

# 🔍 SCRIPT DE VERIFICACIÓN COMPLETA DE REGLAS COOMUNITY
# Versión: Post-Migración de Puertos - Enero 2025

echo "🔍 INICIANDO VERIFICACIÓN COMPLETA DE REGLAS..."
echo "==============================================="
echo ""

# Colors para output
GREEN='🟢'
RED='🔴'
YELLOW='🟡'
BLUE='🔵'

# Contadores
PASSED=0
FAILED=0
WARNINGS=0

# Función para verificación con resultado
check_rule() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    echo -n "📋 $test_name... "
    
    if eval "$test_command" >/dev/null 2>&1; then
        if [ "$expected_result" = "pass" ]; then
            echo "$GREEN CORRECTO"
            ((PASSED++))
            return 0
        else
            echo "$RED INCORRECTO"
            ((FAILED++))
            return 1
        fi
    else
        if [ "$expected_result" = "fail" ]; then
            echo "$GREEN CORRECTO (esperado)"
            ((PASSED++))
            return 0
        else
            echo "$RED FALLO"
            ((FAILED++))
            return 1
        fi
    fi
}

check_warning() {
    local test_name="$1"
    local test_command="$2"
    local warning_message="$3"
    
    echo -n "⚠️  $test_name... "
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo "$GREEN OK"
        ((PASSED++))
    else
        echo "$YELLOW ADVERTENCIA"
        echo "   $warning_message"
        ((WARNINGS++))
    fi
}

echo "🎯 SECCIÓN 1: VERIFICACIÓN DE PUERTOS ACTUALIZADOS"
echo "================================================="

# 1.1 Verificar configuración de puertos
check_rule "Backend puerto 1111 en .env" 'grep -q "localhost:1111" .env' "pass"
check_rule "SuperApp puerto 2222 en config" 'grep -q "localhost:2222" Demo/apps/superapp-unified/.env' "pass"
check_rule "Admin puerto 3333 en config" 'grep -q "localhost:3333" apps/admin-frontend/.env' "pass"

# 1.2 Verificar ausencia de puertos obsoletos
check_rule "Sin referencias a puerto 3002" 'grep -r "localhost:3002" . --exclude-dir=node_modules --exclude-dir=.git' "fail"
check_rule "Sin referencias a puerto 3001" 'grep -r "localhost:3001" . --exclude-dir=node_modules --exclude-dir=.git' "fail"
check_rule "Sin referencias a puerto 3000" 'grep -r "localhost:3000" . --exclude-dir=node_modules --exclude-dir=.git' "fail"

echo ""
echo "🗄️ SECCIÓN 2: VERIFICACIÓN DE POSTGRESQL"
echo "========================================"

# 2.1 PostgreSQL debe estar disponible
check_warning "PostgreSQL ejecutándose" 'brew services list | grep postgresql | grep started' "PostgreSQL no está iniciado. Ejecuta: brew services start postgresql@15"
check_warning "Puerto 5432 disponible" 'lsof -i :5432 | grep LISTEN' "PostgreSQL no está escuchando en puerto 5432"

echo ""
echo "📁 SECCIÓN 3: VERIFICACIÓN DE ESTRUCTURA DE ARCHIVOS"
echo "==================================================="

# 3.1 Archivos críticos deben existir
check_rule "Archivo .env principal existe" '[ -f ".env" ]' "pass"
check_rule "Archivo SuperApp .env existe" '[ -f "Demo/apps/superapp-unified/.env" ]' "pass"
check_rule "Archivo Admin .env existe" '[ -f "apps/admin-frontend/.env" ]' "pass"
check_rule "package.json raíz existe" '[ -f "package.json" ]' "pass"
check_rule "turbo.json existe" '[ -f "turbo.json" ]' "pass"

# 3.2 Directorios críticos deben existir
check_rule "Directorio SuperApp existe" '[ -d "Demo/apps/superapp-unified" ]' "pass"
check_rule "Directorio Admin existe" '[ -d "apps/admin-frontend" ]' "pass"
check_rule "Directorio Backend existe" '[ -d "src" ]' "pass"

echo ""
echo "🔧 SECCIÓN 4: VERIFICACIÓN DE DEPENDENCIAS"
echo "=========================================="

# 4.1 Turborepo local
check_warning "Turborepo instalado localmente" 'npm ls turbo | grep turbo@' "Recomendado instalar Turborepo localmente: npm install turbo --save-dev --legacy-peer-deps"

# 4.2 Dependencias críticas SuperApp
cd Demo/apps/superapp-unified/ 2>/dev/null || true
check_warning "Playwright instalado" 'npm ls @playwright/test' "Falta @playwright/test en SuperApp"
check_warning "Sentry instalado" 'npm ls @sentry/react' "Falta @sentry/react en SuperApp"
check_warning "Web Vitals instalado" 'npm ls web-vitals' "Falta web-vitals en SuperApp"
cd ../../.. 2>/dev/null || true

echo ""
echo "⚙️ SECCIÓN 5: VERIFICACIÓN DE CONFIGURACIONES"
echo "============================================"

# 5.1 Vite configs actualizados
check_rule "SuperApp Vite config puerto 2222" 'grep -q "port: 2222" Demo/apps/superapp-unified/vite.config.ts' "pass"
check_rule "Admin Vite config puerto 3333" 'grep -q "port: 3333" apps/admin-frontend/vite.config.ts' "pass"

# 5.2 CORS config actualizada
check_rule "Backend CORS incluye puerto 1111" 'grep -q "localhost:1111" src/main.ts' "pass"
check_rule "Backend CORS incluye puerto 2222" 'grep -q "localhost:2222" src/main.ts' "pass"
check_rule "Backend CORS incluye puerto 3333" 'grep -q "localhost:3333" src/main.ts' "pass"

echo ""
echo "🎮 SECCIÓN 6: VERIFICACIÓN DE SCRIPTS"
echo "===================================="

# 6.1 Scripts de puerto deben existir
check_rule "Script port:verify existe" 'grep -q "port:verify" package.json' "pass"
check_rule "Script port:summary existe" 'grep -q "port:summary" package.json' "pass"
check_rule "Script dev existe" 'grep -q "\"dev\":" package.json' "pass"

# 6.2 Scripts de verificación ejecutables
check_rule "Script verify-new-ports.sh ejecutable" '[ -x "scripts/verify-new-ports.sh" ]' "pass"
check_rule "Script post-migration-summary.sh ejecutable" '[ -x "scripts/post-migration-summary.sh" ]' "pass"

echo ""
echo "🌐 SECCIÓN 7: VERIFICACIÓN DE SERVICIOS (OPCIONAL)"
echo "================================================="

# 7.1 Servicios respondiendo (solo si están ejecutándose)
check_warning "Backend responde en puerto 1111" 'curl -s http://localhost:1111/health' "Backend no está ejecutándose (opcional para verificación)"
check_warning "SuperApp responde en puerto 2222" 'curl -s -I http://localhost:2222' "SuperApp no está ejecutándose (opcional para verificación)"
check_warning "Admin responde en puerto 3333" 'curl -s -I http://localhost:3333' "Admin no está ejecutándose (opcional para verificación)"

echo ""
echo "📊 SECCIÓN 8: VERIFICACIÓN DE PROCESOS"
echo "====================================="

# 8.1 No debe haber procesos conflictivos
RUNNING_VITE=$(ps aux | grep -E "vite.*node" | grep -v grep | wc -l)
RUNNING_NPM_DEV=$(ps aux | grep "npm run dev" | grep -v grep | wc -l)

if [ $RUNNING_VITE -gt 1 ]; then
    echo "$RED Múltiples procesos Vite detectados ($RUNNING_VITE)"
    echo "   Ejecuta: pkill -f vite"
    ((FAILED++))
else
    echo "$GREEN Procesos Vite normales"
    ((PASSED++))
fi

if [ $RUNNING_NPM_DEV -gt 1 ]; then
    echo "$RED Múltiples procesos npm run dev detectados ($RUNNING_NPM_DEV)"
    echo "   Ejecuta: pkill -f 'npm run dev'"
    ((FAILED++))
else
    echo "$GREEN Procesos npm run dev normales"
    ((PASSED++))
fi

# 8.2 Puertos no deben estar ocupados por procesos obsoletos
OCCUPIED_1111=$(lsof -i :1111 2>/dev/null | wc -l)
OCCUPIED_2222=$(lsof -i :2222 2>/dev/null | wc -l)
OCCUPIED_3333=$(lsof -i :3333 2>/dev/null | wc -l)

echo "📡 Puertos ocupados: 1111($OCCUPIED_1111) 2222($OCCUPIED_2222) 3333($OCCUPIED_3333)"

echo ""
echo "🔍 SECCIÓN 9: VERIFICACIÓN DE REGLAS CRÍTICAS"
echo "============================================"

# 9.1 Ubicación correcta
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" == *"/workspace"* ]] || [[ "$CURRENT_DIR" == *"GAMIFIER"* ]]; then
    echo "$GREEN Ubicación de workspace correcta"
    ((PASSED++))
else
    echo "$RED Ubicación incorrecta: $CURRENT_DIR"
    echo "   Debe estar en la raíz del monorepo"
    ((FAILED++))
fi

# 9.2 Variables de entorno críticas
ENV_VARS_OK=true

if ! grep -q "VITE_API_BASE_URL=http://localhost:1111" .env 2>/dev/null; then
    echo "$RED Variable VITE_API_BASE_URL incorrecta en .env"
    ENV_VARS_OK=false
fi

if ! grep -q "VITE_BASE_URL=http://localhost:2222" Demo/apps/superapp-unified/.env 2>/dev/null; then
    echo "$RED Variable VITE_BASE_URL incorrecta en SuperApp .env"
    ENV_VARS_OK=false
fi

if $ENV_VARS_OK; then
    echo "$GREEN Variables de entorno críticas correctas"
    ((PASSED++))
else
    ((FAILED++))
fi

echo ""
echo "🎊 RESUMEN FINAL"
echo "==============="
echo "✅ PASSED: $PASSED"
echo "❌ FAILED: $FAILED"
echo "⚠️  WARNINGS: $WARNINGS"
echo ""

# Calcular porcentaje de éxito
TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((PASSED * 100 / TOTAL))
    echo "📊 TASA DE ÉXITO: $SUCCESS_RATE%"
else
    echo "📊 TASA DE ÉXITO: 0%"
fi

echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 ¡TODAS LAS REGLAS CRÍTICAS SE CUMPLEN!"
    echo "🚀 El proyecto está listo para desarrollo"
elif [ $FAILED -le 3 ]; then
    echo "⚠️  ADVERTENCIAS MENORES DETECTADAS"
    echo "🔧 Revisa y corrige los errores indicados"
elif [ $FAILED -le 6 ]; then
    echo "❌ ERRORES MODERADOS DETECTADOS"
    echo "🛠️  Se requiere corrección antes de continuar"
else
    echo "🚨 ERRORES CRÍTICOS DETECTADOS"
    echo "🆘 Se requiere corrección inmediata"
fi

echo ""
echo "📋 COMANDOS DE CORRECCIÓN RÁPIDA:"
echo "================================"
echo "🔧 Limpiar procesos: pkill -f 'vite|npm run dev'"
echo "🗄️ Iniciar PostgreSQL: brew services start postgresql@15"
echo "📦 Instalar deps faltantes: npm install turbo @sentry/react web-vitals --legacy-peer-deps"
echo "🌐 Verificar servicios: npm run port:verify"
echo "📊 Ver resumen: npm run port:summary"

exit $FAILED