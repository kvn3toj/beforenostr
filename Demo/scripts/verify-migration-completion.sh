#!/bin/bash

# 🔍 Script de Verificación de Migración - Mocks a Backend Real
# Verifica que la migración de datos mock a backend real esté completa

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

echo "🔍 VERIFICACIÓN DE MIGRACIÓN DE MOCKS A BACKEND REAL"
echo "=================================================="
echo ""

# Función para mostrar resultados
check_result() {
    local check_name="$1"
    local result="$2"
    local details="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ $check_name${NC}"
        [ -n "$details" ] && echo -e "   $details"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ $check_name${NC}"
        [ -n "$details" ] && echo -e "   $details"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    echo ""
}

# Verificar ubicación del proyecto
echo "📍 Verificando ubicación del proyecto..."
if [ -d "Demo/apps/superapp-unified" ]; then
    check_result "Ubicación del proyecto" "PASS" "SuperApp encontrada en Demo/apps/superapp-unified/"
else
    check_result "Ubicación del proyecto" "FAIL" "SuperApp no encontrada"
    exit 1
fi

# 1. Verificar eliminación de mocks en servicios
echo "🔍 1. VERIFICANDO ELIMINACIÓN DE MOCKS EN SERVICIOS"
echo "---------------------------------------------------"

SERVICES_DIR="Demo/apps/superapp-unified/src/services"
if [ -d "$SERVICES_DIR" ]; then
    # Buscar referencias a mocks en servicios
    MOCK_REFS=$(grep -r "mock\|Mock\|MOCK\|hardcoded\|hardcode\|fake\|Fake" "$SERVICES_DIR" 2>/dev/null | wc -l)
    
    if [ "$MOCK_REFS" -eq 0 ]; then
        check_result "Servicios sin mocks" "PASS" "0 referencias a mocks encontradas en servicios"
    else
        check_result "Servicios sin mocks" "FAIL" "$MOCK_REFS referencias a mocks encontradas"
        grep -r "mock\|Mock\|MOCK\|hardcoded\|hardcode" "$SERVICES_DIR" 2>/dev/null | head -5
    fi
else
    check_result "Directorio de servicios" "FAIL" "Directorio $SERVICES_DIR no encontrado"
fi

# 2. Verificar servicios reales creados
echo "🛠️ 2. VERIFICANDO SERVICIOS REALES CREADOS"
echo "-------------------------------------------"

# AuthService
if [ -f "$SERVICES_DIR/auth.service.ts" ]; then
    # Verificar que contiene métodos reales
    if grep -q "async login\|async register\|async verifyToken" "$SERVICES_DIR/auth.service.ts"; then
        check_result "AuthService creado" "PASS" "Contiene métodos de autenticación real"
    else
        check_result "AuthService creado" "FAIL" "No contiene métodos esperados"
    fi
else
    check_result "AuthService creado" "FAIL" "Archivo auth.service.ts no encontrado"
fi

# NotificationsService
if [ -f "$SERVICES_DIR/notifications.service.ts" ]; then
    # Verificar que contiene métodos reales
    if grep -q "async getUserNotifications\|async markAsRead\|async toggleStar" "$SERVICES_DIR/notifications.service.ts"; then
        check_result "NotificationsService creado" "PASS" "Contiene métodos de notificaciones reales"
    else
        check_result "NotificationsService creado" "FAIL" "No contiene métodos esperados"
    fi
else
    check_result "NotificationsService creado" "FAIL" "Archivo notifications.service.ts no encontrado"
fi

# 3. Verificar migración de páginas
echo "📄 3. VERIFICANDO MIGRACIÓN DE PÁGINAS"
echo "---------------------------------------"

PAGES_DIR="Demo/apps/superapp-unified/src/pages"

# LoginPage
if [ -f "$PAGES_DIR/LoginPage.tsx" ]; then
    # Verificar que usa servicio real
    if grep -q "authService\|useAuth" "$PAGES_DIR/LoginPage.tsx" && ! grep -q "simulateLoginAPI\|mock" "$PAGES_DIR/LoginPage.tsx"; then
        check_result "LoginPage migrada" "PASS" "Usa servicio real de autenticación"
    else
        check_result "LoginPage migrada" "FAIL" "Aún contiene lógica mock"
    fi
else
    check_result "LoginPage migrada" "FAIL" "Archivo LoginPage.tsx no encontrado"
fi

# NotificationsPage
if [ -f "$PAGES_DIR/NotificationsPage.tsx" ]; then
    # Verificar que usa servicio real
    if grep -q "notificationsService" "$PAGES_DIR/NotificationsPage.tsx" && ! grep -q "fetchUserNotifications.*=.*async" "$PAGES_DIR/NotificationsPage.tsx"; then
        check_result "NotificationsPage migrada" "PASS" "Usa servicio real de notificaciones"
    else
        check_result "NotificationsPage migrada" "FAIL" "Aún contiene lógica mock"
    fi
else
    check_result "NotificationsPage migrada" "FAIL" "Archivo NotificationsPage.tsx no encontrado"
fi

# 4. Verificar AuthContext limpio
echo "🔐 4. VERIFICANDO AUTHCONTEXT LIMPIO"
echo "------------------------------------"

AUTH_CONTEXT="Demo/apps/superapp-unified/src/contexts/AuthContext.tsx"
if [ -f "$AUTH_CONTEXT" ]; then
    # Verificar que no contiene mocks
    if ! grep -q "MOCK_AUTHENTICATED_USER\|BUILDER_IO_ADMIN_USER\|isMockAuthEnabled" "$AUTH_CONTEXT"; then
        check_result "AuthContext sin mocks" "PASS" "No contiene usuarios mock ni lógica condicional"
    else
        check_result "AuthContext sin mocks" "FAIL" "Aún contiene lógica de mocks"
    fi
    
    # Verificar que usa authService
    if grep -q "authService" "$AUTH_CONTEXT"; then
        check_result "AuthContext usa servicio real" "PASS" "Importa y usa authService"
    else
        check_result "AuthContext usa servicio real" "FAIL" "No usa authService"
    fi
else
    check_result "AuthContext" "FAIL" "Archivo AuthContext.tsx no encontrado"
fi

# 5. Verificar variables de entorno
echo "🌍 5. VERIFICANDO CONFIGURACIÓN DE ENTORNO"
echo "-------------------------------------------"

# Buscar referencias a VITE_ENABLE_MOCK_AUTH
MOCK_AUTH_REFS=$(find Demo/apps/superapp-unified/src -name "*.ts" -o -name "*.tsx" | xargs grep -l "VITE_ENABLE_MOCK_AUTH" 2>/dev/null | wc -l)

if [ "$MOCK_AUTH_REFS" -eq 0 ]; then
    check_result "Sin referencias a VITE_ENABLE_MOCK_AUTH" "PASS" "Lógica de mock auth eliminada"
else
    check_result "Sin referencias a VITE_ENABLE_MOCK_AUTH" "FAIL" "$MOCK_AUTH_REFS archivos aún referencian mock auth"
fi

# 6. Verificar importaciones correctas
echo "📦 6. VERIFICANDO IMPORTACIONES"
echo "-------------------------------"

# Verificar que servicios importan apiService
if grep -q "import.*apiService" "$SERVICES_DIR/auth.service.ts" 2>/dev/null; then
    check_result "AuthService importa apiService" "PASS" "Usa cliente HTTP centralizado"
else
    check_result "AuthService importa apiService" "FAIL" "No importa apiService"
fi

if grep -q "import.*apiService" "$SERVICES_DIR/notifications.service.ts" 2>/dev/null; then
    check_result "NotificationsService importa apiService" "PASS" "Usa cliente HTTP centralizado"
else
    check_result "NotificationsService importa apiService" "FAIL" "No importa apiService"
fi

# 7. Verificar React Query en páginas
echo "⚛️ 7. VERIFICANDO REACT QUERY"
echo "-----------------------------"

if grep -q "useQuery\|useMutation" "$PAGES_DIR/NotificationsPage.tsx" 2>/dev/null; then
    check_result "React Query en NotificationsPage" "PASS" "Usa React Query para gestión de estado"
else
    check_result "React Query en NotificationsPage" "FAIL" "No usa React Query"
fi

# 8. Verificar manejo de errores
echo "🚨 8. VERIFICANDO MANEJO DE ERRORES"
echo "-----------------------------------"

# Verificar try-catch en servicios
if grep -q "try.*catch" "$SERVICES_DIR/auth.service.ts" 2>/dev/null; then
    check_result "Manejo de errores en AuthService" "PASS" "Contiene bloques try-catch"
else
    check_result "Manejo de errores en AuthService" "FAIL" "Sin manejo de errores"
fi

if grep -q "try.*catch" "$SERVICES_DIR/notifications.service.ts" 2>/dev/null; then
    check_result "Manejo de errores en NotificationsService" "PASS" "Contiene bloques try-catch"
else
    check_result "Manejo de errores en NotificationsService" "FAIL" "Sin manejo de errores"
fi

# 9. Verificar endpoints del backend
echo "🌐 9. VERIFICANDO ENDPOINTS DEL BACKEND"
echo "---------------------------------------"

# Verificar que servicios usan endpoints correctos
if grep -q "/auth/login\|/auth/register\|/auth/me" "$SERVICES_DIR/auth.service.ts" 2>/dev/null; then
    check_result "Endpoints de autenticación" "PASS" "Usa endpoints correctos del backend"
else
    check_result "Endpoints de autenticación" "FAIL" "No usa endpoints esperados"
fi

if grep -q "/notifications" "$SERVICES_DIR/notifications.service.ts" 2>/dev/null; then
    check_result "Endpoints de notificaciones" "PASS" "Usa endpoints correctos del backend"
else
    check_result "Endpoints de notificaciones" "FAIL" "No usa endpoints esperados"
fi

# 10. Verificar TypeScript estricto
echo "📝 10. VERIFICANDO TYPESCRIPT"
echo "-----------------------------"

# Verificar que servicios tienen tipado estricto
if grep -q "interface.*\|type.*=" "$SERVICES_DIR/auth.service.ts" 2>/dev/null; then
    check_result "Tipado en AuthService" "PASS" "Contiene interfaces y tipos"
else
    check_result "Tipado en AuthService" "FAIL" "Sin tipado TypeScript"
fi

if grep -q "interface.*\|type.*=" "$SERVICES_DIR/notifications.service.ts" 2>/dev/null; then
    check_result "Tipado en NotificationsService" "PASS" "Contiene interfaces y tipos"
else
    check_result "Tipado en NotificationsService" "FAIL" "Sin tipado TypeScript"
fi

# Resumen final
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="
echo ""
echo -e "Total de verificaciones: ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Verificaciones exitosas: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Verificaciones fallidas: ${RED}$FAILED_CHECKS${NC}"
echo ""

# Calcular porcentaje de éxito
if [ "$TOTAL_CHECKS" -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
    echo -e "Tasa de éxito: ${BLUE}$SUCCESS_RATE%${NC}"
    echo ""
fi

# Resultado final
if [ "$FAILED_CHECKS" -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!${NC}"
    echo -e "${GREEN}✅ Todos los mocks han sido reemplazados por conexiones reales al backend${NC}"
    echo ""
    echo "📋 Próximos pasos recomendados:"
    echo "  1. Ejecutar tests E2E: cd Demo/apps/superapp-unified && npx playwright test"
    echo "  2. Verificar backend funcionando: curl http://localhost:3002/health"
    echo "  3. Probar login real: Usar credenciales user@gamifier.com / 123456"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️ MIGRACIÓN INCOMPLETA${NC}"
    echo -e "${RED}❌ $FAILED_CHECKS verificaciones fallaron${NC}"
    echo ""
    echo "🔧 Acciones requeridas:"
    echo "  1. Revisar las verificaciones fallidas arriba"
    echo "  2. Completar la migración de los componentes faltantes"
    echo "  3. Ejecutar este script nuevamente para verificar"
    echo ""
    exit 1
fi 