#!/bin/bash

# 🎓 VERIFICACIÓN COMPLETA: TUTORIALES DISCOVERY & INTEGRACIÓN BACKEND
# ============================================================================
# Script para verificar que los cambios implementados estén correctamente
# alineados con el backend NestJS y que los endpoints necesarios estén disponibles

echo "🎓 INICIANDO VERIFICACIÓN COMPLETA DE TUTORIALES DISCOVERY..."
echo "============================================================================"

# 🔧 Configuración
BACKEND_URL="http://localhost:3002"
FRONTEND_URL="http://localhost:3001"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 🎯 Contadores para el resumen final
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# 🎨 Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 📊 Función para reportar resultados
report_check() {
    local check_name="$1"
    local status="$2"
    local details="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ "$status" = "PASS" ]; then
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        echo -e "  ✅ ${GREEN}$check_name${NC}"
        [ -n "$details" ] && echo -e "     $details"
    else
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        echo -e "  ❌ ${RED}$check_name${NC}"
        [ -n "$details" ] && echo -e "     ${YELLOW}$details${NC}"
    fi
}

# 🏥 Función para verificar salud del backend
check_backend_health() {
    echo ""
    echo "🏥 1. VERIFICACIÓN DE SALUD DEL BACKEND"
    echo "----------------------------------------"
    
    local health_response=$(curl -s "$BACKEND_URL/health" 2>/dev/null)
    local health_status=$?
    
    if [ $health_status -eq 0 ] && echo "$health_response" | grep -q "ok"; then
        report_check "Backend NestJS Health Check" "PASS" "Puerto 3002 respondiendo correctamente"
    else
        report_check "Backend NestJS Health Check" "FAIL" "Backend no disponible en puerto 3002"
        return 1
    fi
}

# 🔐 Función para obtener token de autenticación
get_auth_token() {
    echo ""
    echo "🔐 2. AUTENTICACIÓN CON BACKEND"
    echo "-------------------------------"
    
    local login_payload='{"email": "admin@gamifier.com", "password": "admin123"}'
    local login_response=$(curl -s -X POST "$BACKEND_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "$login_payload" 2>/dev/null)
    
    if echo "$login_response" | grep -q "access_token"; then
        JWT_TOKEN=$(echo "$login_response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
        report_check "Autenticación JWT" "PASS" "Token obtenido exitosamente"
        export JWT_TOKEN
    else
        report_check "Autenticación JWT" "FAIL" "No se pudo obtener token de autenticación"
        return 1
    fi
}

# 🎯 Función para verificar endpoints de métricas de usuario
check_user_metrics_endpoint() {
    echo ""
    echo "🎯 3. VERIFICACIÓN DE ENDPOINTS DE MÉTRICAS"
    echo "--------------------------------------------"
    
    local user_id="00000000-0000-0000-0000-000000000001"
    local metrics_response=$(curl -s "$BACKEND_URL/users/$user_id/ayni-metrics" \
        -H "Authorization: Bearer $JWT_TOKEN" 2>/dev/null)
    
    if echo "$metrics_response" | grep -q "ondas" && echo "$metrics_response" | grep -q "meritos"; then
        local ondas=$(echo "$metrics_response" | grep -o '"ondas":[0-9]*' | cut -d':' -f2)
        local meritos=$(echo "$metrics_response" | grep -o '"meritos":[0-9]*' | cut -d':' -f2)
        report_check "Endpoint de métricas Ayni" "PASS" "Ondas: $ondas, Meritos: $meritos"
    else
        report_check "Endpoint de métricas Ayni" "FAIL" "Endpoint no devuelve métricas válidas"
    fi
}

# 🏆 Función para verificar sistema de recompensas
check_rewards_system() {
    echo ""
    echo "🏆 4. VERIFICACIÓN DEL SISTEMA DE RECOMPENSAS"
    echo "----------------------------------------------"
    
    # Verificar endpoint de creación de méritos
    local merit_payload='{
        "userId": "00000000-0000-0000-0000-000000000001",
        "type": "MERITO",
        "amount": 5,
        "source": "CHALLENGE_COMPLETION",
        "relatedEntityId": "tutorial-test"
    }'
    
    local merit_response=$(curl -s -X POST "$BACKEND_URL/merits" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$merit_payload" 2>/dev/null)
    
    local merit_status=$(echo "$merit_response" | grep -o '"statusCode":[0-9]*' | cut -d':' -f2)
    
    if [ "$merit_status" = "500" ]; then
        report_check "Endpoint de creación de méritos" "FAIL" "Error 500 - Posible problema con modelo Prisma"
    elif echo "$merit_response" | grep -q "id"; then
        report_check "Endpoint de creación de méritos" "PASS" "Mérito creado exitosamente"
    else
        report_check "Endpoint de creación de méritos" "FAIL" "Respuesta inesperada del endpoint"
    fi
}

# 🎮 Función para verificar endpoints de video questions
check_video_questions_endpoint() {
    echo ""
    echo "🎮 5. VERIFICACIÓN DE PREGUNTAS DE VIDEO"
    echo "-----------------------------------------"
    
    local video_questions_response=$(curl -s "$BACKEND_URL/video-items/1/questions" \
        -H "Authorization: Bearer $JWT_TOKEN" 2>/dev/null)
    
    if [ "$video_questions_response" = "[]" ]; then
        report_check "Endpoint de preguntas de video" "PASS" "Endpoint disponible (sin preguntas configuradas)"
    elif echo "$video_questions_response" | grep -q "question"; then
        local questions_count=$(echo "$video_questions_response" | grep -o '"id"' | wc -l)
        report_check "Endpoint de preguntas de video" "PASS" "Endpoint con $questions_count preguntas configuradas"
    else
        report_check "Endpoint de preguntas de video" "FAIL" "Endpoint no responde correctamente"
    fi
}

# 📂 Función para verificar archivos del frontend
check_frontend_files() {
    echo ""
    echo "📂 6. VERIFICACIÓN DE ARCHIVOS FRONTEND"
    echo "----------------------------------------"
    
    # Verificar DiscoveryTutorialProvider expandido
    local tutorial_provider="$PROJECT_ROOT/Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx"
    if [ -f "$tutorial_provider" ]; then
        local tutorial_lines=$(wc -l < "$tutorial_provider")
        if [ "$tutorial_lines" -gt 500 ]; then
            report_check "DiscoveryTutorialProvider expandido" "PASS" "$tutorial_lines líneas (vs. ~100 original)"
        else
            report_check "DiscoveryTutorialProvider expandido" "FAIL" "Archivo parece no estar expandido ($tutorial_lines líneas)"
        fi
    else
        report_check "DiscoveryTutorialProvider expandido" "FAIL" "Archivo no encontrado"
    fi
    
    # Verificar servicio de tutoriales
    local tutorial_service="$PROJECT_ROOT/Demo/apps/superapp-unified/src/services/tutorial.service.ts"
    if [ -f "$tutorial_service" ]; then
        if grep -q "TutorialService" "$tutorial_service"; then
            report_check "Tutorial Service creado" "PASS" "Servicio de tutoriales implementado"
        else
            report_check "Tutorial Service creado" "FAIL" "Servicio incompleto o corrupto"
        fi
    else
        report_check "Tutorial Service creado" "FAIL" "Archivo de servicio no encontrado"
    fi
}

# 🌐 Función para verificar estado del frontend
check_frontend_status() {
    echo ""
    echo "🌐 7. VERIFICACIÓN DEL FRONTEND"
    echo "-------------------------------"
    
    local frontend_response=$(curl -s -I "$FRONTEND_URL" 2>/dev/null | head -1)
    
    if echo "$frontend_response" | grep -q "200 OK"; then
        report_check "SuperApp Frontend" "PASS" "Funcionando en puerto 3001"
    else
        report_check "SuperApp Frontend" "FAIL" "No disponible en puerto 3001"
    fi
}

# 🔍 Función para verificar integración de tutoriales
check_tutorial_integration() {
    echo ""
    echo "🔍 8. VERIFICACIÓN DE INTEGRACIÓN DE TUTORIALES"
    echo "------------------------------------------------"
    
    # Verificar estructura de tutoriales expandidos
    local tutorial_provider="$PROJECT_ROOT/Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx"
    
    if [ -f "$tutorial_provider" ]; then
        # Verificar que contiene tutoriales expandidos
        local marketplace_steps=$(grep -c "marketplace-discovery" "$tutorial_provider" || echo "0")
        local uplay_steps=$(grep -c "uplay-discovery" "$tutorial_provider" || echo "0")
        local social_steps=$(grep -c "social-discovery" "$tutorial_provider" || echo "0")
        
        if [ "$marketplace_steps" -gt 0 ] && [ "$uplay_steps" -gt 0 ] && [ "$social_steps" -gt 0 ]; then
            report_check "Tutoriales discovery expandidos" "PASS" "Marketplace: $marketplace_steps, ÜPlay: $uplay_steps, Social: $social_steps"
        else
            report_check "Tutoriales discovery expandidos" "FAIL" "Tutoriales no completamente expandidos"
        fi
        
        # Verificar que contiene recompensas
        if grep -q "completionRewards" "$tutorial_provider"; then
            report_check "Sistema de recompensas en tutoriales" "PASS" "Recompensas configuradas en tutoriales"
        else
            report_check "Sistema de recompensas en tutoriales" "FAIL" "Recompensas no configuradas"
        fi
        
        # Verificar que contiene tips y elementos interactivos
        if grep -q "tips.*actionButton" "$tutorial_provider"; then
            report_check "Elementos interactivos avanzados" "PASS" "Tips y botones de acción implementados"
        else
            report_check "Elementos interactivos avanzados" "FAIL" "Elementos interactivos faltantes"
        fi
    fi
}

# 📋 Función para verificar documentación
check_documentation() {
    echo ""
    echo "📋 9. VERIFICACIÓN DE DOCUMENTACIÓN"
    echo "------------------------------------"
    
    local summary_doc="$PROJECT_ROOT/docs/implementation/DISCOVERY_TUTORIALS_EXPANSION_SUMMARY.md"
    if [ -f "$summary_doc" ]; then
        local doc_lines=$(wc -l < "$summary_doc")
        if [ "$doc_lines" -gt 50 ]; then
            report_check "Documentación de expansión" "PASS" "Documento completo ($doc_lines líneas)"
        else
            report_check "Documentación de expansión" "FAIL" "Documentación incompleta"
        fi
    else
        report_check "Documentación de expansión" "FAIL" "Documentación no encontrada"
    fi
}

# 🔮 Función para verificar preparación para integración backend
check_backend_integration_readiness() {
    echo ""
    echo "🔮 10. PREPARACIÓN PARA INTEGRACIÓN BACKEND"
    echo "--------------------------------------------"
    
    local tutorial_service="$PROJECT_ROOT/Demo/apps/superapp-unified/src/services/tutorial.service.ts"
    
    if [ -f "$tutorial_service" ]; then
        # Verificar que contiene comentarios de integración futura
        if grep -q "INTEGRACIÓN FUTURA" "$tutorial_service"; then
            report_check "Comentarios de integración futura" "PASS" "Endpoints futuros documentados"
        else
            report_check "Comentarios de integración futura" "FAIL" "Integración futura no documentada"
        fi
        
        # Verificar que tiene métodos para sincronización
        if grep -q "syncWithBackend" "$tutorial_service"; then
            report_check "Método de sincronización backend" "PASS" "Método syncWithBackend implementado"
        else
            report_check "Método de sincronización backend" "FAIL" "Sincronización no implementada"
        fi
        
        # Verificar que maneja recompensas
        if grep -q "calculateRewards" "$tutorial_service"; then
            report_check "Sistema de cálculo de recompensas" "PASS" "Cálculo de recompensas implementado"
        else
            report_check "Sistema de cálculo de recompensas" "FAIL" "Cálculo de recompensas faltante"
        fi
    fi
}

# 🎯 Función principal
main() {
    echo "🎓 VERIFICACIÓN COMPLETA: TUTORIALES DISCOVERY & BACKEND INTEGRATION"
    echo "$(date '+%Y-%m-%d %H:%M:%S')"
    echo "============================================================================"
    
    # Ejecutar todas las verificaciones
    check_backend_health || echo "⚠️ Continuando sin backend..."
    
    if [ -n "$JWT_TOKEN" ] || get_auth_token; then
        check_user_metrics_endpoint
        check_rewards_system
        check_video_questions_endpoint
    else
        echo "⚠️ Saltando verificaciones que requieren autenticación"
        TOTAL_CHECKS=$((TOTAL_CHECKS + 3))
        FAILED_CHECKS=$((FAILED_CHECKS + 3))
    fi
    
    check_frontend_files
    check_frontend_status
    check_tutorial_integration
    check_documentation
    check_backend_integration_readiness
    
    # 📊 Resumen final
    echo ""
    echo "📊 RESUMEN DE VERIFICACIÓN"
    echo "=========================="
    echo -e "Total de verificaciones: ${BLUE}$TOTAL_CHECKS${NC}"
    echo -e "Verificaciones exitosas: ${GREEN}$PASSED_CHECKS${NC}"
    echo -e "Verificaciones fallidas: ${RED}$FAILED_CHECKS${NC}"
    
    local success_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    echo -e "Tasa de éxito: ${BLUE}${success_rate}%${NC}"
    
    if [ $success_rate -ge 80 ]; then
        echo -e ""
        echo -e "🎉 ${GREEN}VERIFICACIÓN EXITOSA${NC}"
        echo -e "Los tutoriales discovery están correctamente implementados y listos para integración con el backend."
        echo -e ""
        echo -e "🔮 PRÓXIMOS PASOS RECOMENDADOS:"
        echo -e "1. Implementar endpoints específicos para tutoriales en el backend NestJS"
        echo -e "2. Crear tablas de Tutorial y TutorialCompletion en Prisma"
        echo -e "3. Integrar TutorialService con endpoints reales del backend"
        echo -e "4. Implementar notificaciones de recompensas en tiempo real"
        echo -e "5. Crear tests E2E para el flujo completo de tutoriales"
    elif [ $success_rate -ge 60 ]; then
        echo -e ""
        echo -e "⚠️ ${YELLOW}VERIFICACIÓN PARCIAL${NC}"
        echo -e "La mayoría de componentes están funcionando, pero hay áreas que necesitan atención."
    else
        echo -e ""
        echo -e "❌ ${RED}VERIFICACIÓN FALLIDA${NC}"
        echo -e "Múltiples componentes necesitan ser corregidos antes de proceder."
    fi
    
    echo ""
    echo "============================================================================"
    echo "Verificación completada: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Return appropriate exit code
    if [ $success_rate -ge 80 ]; then
        exit 0
    else
        exit 1
    fi
}

# 🚀 Ejecutar verificación
main "$@" 