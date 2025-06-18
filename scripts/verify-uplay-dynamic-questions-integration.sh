#!/bin/bash

# 🎯 Script de Verificación: Integración de Preguntas Dinámicas ÜPlay
# Verifica que la refactorización del módulo ÜPlay esté correctamente implementada

echo "🎯 VERIFICACIÓN: Integración de Preguntas Dinámicas en ÜPlay"
echo "=============================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# Función para verificar archivos
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $description"
        ((FAILED++))
        return 1
    fi
}

# Función para verificar contenido en archivos
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $description"
        ((FAILED++))
        return 1
    fi
}

# Función para verificar que contenido NO esté presente
check_not_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ] && ! grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $description"
        ((FAILED++))
        return 1
    fi
}

echo ""
echo "📋 VERIFICACIÓN 1: Estructura de Archivos"
echo "----------------------------------------"

# Verificar que el hook existe
check_file "Demo/apps/superapp-unified/src/hooks/uplay/useVideoQuestions.ts" \
    "Hook useVideoQuestions.ts creado"

# Verificar que el directorio uplay existe
if [ -d "Demo/apps/superapp-unified/src/hooks/uplay" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Directorio hooks/uplay creado"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Directorio hooks/uplay creado"
    ((FAILED++))
fi

echo ""
echo "📋 VERIFICACIÓN 2: Contenido del Hook useVideoQuestions"
echo "-----------------------------------------------------"

HOOK_FILE="Demo/apps/superapp-unified/src/hooks/uplay/useVideoQuestions.ts"

# Verificar importaciones necesarias
check_content "$HOOK_FILE" "import.*useQuery.*@tanstack/react-query" \
    "Importación de useQuery de React Query"

check_content "$HOOK_FILE" "import.*apiService.*@/lib/api-service" \
    "Importación del apiService"

# Verificar interface QuestionOverlay
check_content "$HOOK_FILE" "export interface QuestionOverlay" \
    "Interface QuestionOverlay exportada"

# Verificar función principal del hook
check_content "$HOOK_FILE" "export const useVideoQuestions" \
    "Hook useVideoQuestions exportado"

# Verificar endpoint correcto
check_content "$HOOK_FILE" "/video-items/\${videoId}/questions" \
    "Endpoint correcto para obtener preguntas"

# Verificar configuración de React Query
check_content "$HOOK_FILE" "queryKey.*video-questions" \
    "Query key configurada correctamente"

check_content "$HOOK_FILE" "staleTime.*5.*60.*1000" \
    "Configuración de staleTime (5 minutos)"

check_content "$HOOK_FILE" "enabled.*!!videoId" \
    "Habilitación condicional del query"

echo ""
echo "📋 VERIFICACIÓN 3: Refactorización del EnhancedInteractiveVideoPlayer"
echo "-------------------------------------------------------------------"

PLAYER_FILE="Demo/apps/superapp-unified/src/components/modules/uplay/components/EnhancedInteractiveVideoPlayer.tsx"

# Verificar importación del hook
check_content "$PLAYER_FILE" "import.*useVideoQuestions.*hooks/uplay/useVideoQuestions" \
    "Importación del hook useVideoQuestions"

# Verificar que getMockQuestions fue eliminada
check_not_content "$PLAYER_FILE" "const getMockQuestions.*=.*videoId.*string.*:" \
    "Función getMockQuestions eliminada"

# Verificar uso del hook en el componente
check_content "$PLAYER_FILE" "useVideoQuestions.*videoData\.id" \
    "Hook useVideoQuestions utilizado en el componente"

# Verificar manejo de estados del hook
check_content "$PLAYER_FILE" "questionsFromBackend" \
    "Variable questionsFromBackend del hook"

check_content "$PLAYER_FILE" "questionsLoading" \
    "Variable questionsLoading del hook"

check_content "$PLAYER_FILE" "questionsError" \
    "Variable questionsError del hook"

# Verificar useEffect refactorizado
check_content "$PLAYER_FILE" "REFACTORIZADO.*Integración con hook de preguntas dinámicas" \
    "useEffect refactorizado para usar el hook"

# Verificar que ya no usa getMockQuestions
check_not_content "$PLAYER_FILE" "getMockQuestions.*videoData\.id" \
    "Eliminadas las llamadas a getMockQuestions"

echo ""
echo "📋 VERIFICACIÓN 4: Arquitectura de Componentes"
echo "---------------------------------------------"

# Verificar componente wrapper
check_content "$PLAYER_FILE" "const VideoPlayerContent.*React\.FC" \
    "Componente VideoPlayerContent creado"

check_content "$PLAYER_FILE" "const EnhancedInteractiveVideoPlayer.*React\.FC" \
    "Componente wrapper EnhancedInteractiveVideoPlayer creado"

# Verificar export correcto
check_content "$PLAYER_FILE" "export default EnhancedInteractiveVideoPlayer" \
    "Export por defecto correcto"

echo ""
echo "📋 VERIFICACIÓN 5: Logging y Debugging"
echo "-------------------------------------"

# Verificar logs informativos
check_content "$HOOK_FILE" "console\.log.*useVideoQuestions.*Fetching questions" \
    "Logs de debugging en el hook"

check_content "$PLAYER_FILE" "console\.log.*VideoPlayer.*Questions loading state" \
    "Logs de debugging en el componente"

check_content "$PLAYER_FILE" "Using backend questions for video" \
    "Log de confirmación de uso de preguntas del backend"

echo ""
echo "📋 VERIFICACIÓN 6: Manejo de Errores y Fallbacks"
echo "------------------------------------------------"

# Verificar manejo de errores en el hook
check_content "$HOOK_FILE" "catch.*error" \
    "Manejo de errores en el hook"

check_content "$HOOK_FILE" "return.*\[\]" \
    "Fallback a array vacío en caso de error"

# Verificar fallback en el componente
check_content "$PLAYER_FILE" "Backend questions not available.*using fallback" \
    "Fallback a preguntas configuradas"

check_content "$PLAYER_FILE" "getVideoQuestions.*videoData\.id" \
    "Uso de getVideoQuestions como fallback"

echo ""
echo "📋 VERIFICACIÓN 7: TypeScript y Tipos"
echo "------------------------------------"

# Verificar tipado correcto
check_content "$HOOK_FILE" "useQuery<QuestionOverlay\[\]>" \
    "Tipado correcto del hook con QuestionOverlay[]"

check_content "$HOOK_FILE" "apiService\.get<QuestionOverlay\[\]>" \
    "Tipado correcto de la llamada API"

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="

TOTAL=$((PASSED + FAILED))

echo -e "Total de verificaciones: ${BLUE}$TOTAL${NC}"
echo -e "Verificaciones exitosas: ${GREEN}$PASSED${NC}"
echo -e "Verificaciones fallidas: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ¡ÉXITO! Todas las verificaciones pasaron.${NC}"
    echo -e "${GREEN}✅ La integración de preguntas dinámicas en ÜPlay está correctamente implementada.${NC}"
    echo ""
    echo "🎯 SIGUIENTE PASO:"
    echo "- Verificar que el backend esté ejecutándose en puerto 3002"
    echo "- Probar el módulo ÜPlay en la SuperApp para confirmar que obtiene preguntas del backend"
    echo "- Si el backend no está disponible, verificar que usa el fallback correctamente"
    exit 0
else
    echo ""
    echo -e "${RED}❌ FALLÓ: $FAILED verificación(es) no pasaron.${NC}"
    echo -e "${YELLOW}⚠️  Revisa los errores arriba y corrige los problemas antes de continuar.${NC}"
    exit 1
fi 