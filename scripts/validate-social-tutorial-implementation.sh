#!/bin/bash

echo "👥 VALIDACIÓN DE IMPLEMENTACIÓN - TUTORIAL SOCIAL DISCOVERY"
echo "=========================================================="

SUPERAPP_DIR="Demo/apps/superapp-unified"
TUTORIALS_FILE="$SUPERAPP_DIR/src/components/tutorials/DiscoveryTutorialProvider.tsx"

echo ""
echo "📋 VERIFICACIÓN DE TUTORIAL SOCIAL"
echo "=================================="

if [ -f "$TUTORIALS_FILE" ]; then
    echo "✅ $TUTORIALS_FILE encontrado"
else
    echo "❌ $TUTORIALS_FILE NO encontrado"
    exit 1
fi

# Verificar tutorial social-discovery
SOCIAL_TUTORIAL=$(grep -c "id: 'social-discovery'" "$TUTORIALS_FILE")
if [ $SOCIAL_TUTORIAL -gt 0 ]; then
    echo "✅ Tutorial social-discovery definido"
else
    echo "❌ Tutorial social-discovery NO encontrado"
    exit 1
fi

# Contar pasos del tutorial social
SOCIAL_SECTION=$(grep -A 200 "id: 'social-discovery'" "$TUTORIALS_FILE")
SOCIAL_STEPS=$(echo "$SOCIAL_SECTION" | grep -c "id: 'social-" || echo "0")
echo "📊 Pasos implementados: $SOCIAL_STEPS"

# Verificar contenido social específico
COMMUNITY_CONTENT=$(echo "$SOCIAL_SECTION" | grep -c -i "comunidad\|community\|social" || echo "0")
CONNECTION_CONTENT=$(echo "$SOCIAL_SECTION" | grep -c -i "conectar\|connection\|trust" || echo "0")
COLLABORATION_CONTENT=$(echo "$SOCIAL_SECTION" | grep -c -i "colabora\|collaborat" || echo "0")

echo ""
echo "📋 VERIFICACIÓN DE CONTENIDO SOCIAL"
echo "==================================="

[ $COMMUNITY_CONTENT -gt 0 ] && echo "✅ Contenido de comunidad presente" || echo "❌ Falta contenido de comunidad"
[ $CONNECTION_CONTENT -gt 0 ] && echo "✅ Contenido de conexión presente" || echo "❌ Falta contenido de conexión"
[ $COLLABORATION_CONTENT -gt 0 ] && echo "✅ Contenido de colaboración presente" || echo "❌ Falta contenido de colaboración"

# Verificar useNavigate y funciones
USE_NAVIGATE=$(grep -c "useNavigate" "$TUTORIALS_FILE")
HANDLE_FUNCTION=$(grep -c "handleActionButtonClick" "$TUTORIALS_FILE")

[ $USE_NAVIGATE -gt 0 ] && echo "✅ useNavigate importado" || echo "❌ useNavigate NO importado"
[ $HANDLE_FUNCTION -gt 0 ] && echo "✅ handleActionButtonClick implementado" || echo "❌ handleActionButtonClick NO implementado"

# Calcular score
TOTAL_CHECKS=7
PASSED_CHECKS=0

[ $SOCIAL_TUTORIAL -gt 0 ] && ((PASSED_CHECKS++))
[ $SOCIAL_STEPS -gt 0 ] && ((PASSED_CHECKS++))
[ $COMMUNITY_CONTENT -gt 0 ] && ((PASSED_CHECKS++))
[ $CONNECTION_CONTENT -gt 0 ] && ((PASSED_CHECKS++))
[ $COLLABORATION_CONTENT -gt 0 ] && ((PASSED_CHECKS++))
[ $USE_NAVIGATE -gt 0 ] && ((PASSED_CHECKS++))
[ $HANDLE_FUNCTION -gt 0 ] && ((PASSED_CHECKS++))

SUCCESS_RATE=$(echo "scale=1; $PASSED_CHECKS * 100 / $TOTAL_CHECKS" | bc)

echo ""
echo "📊 RESUMEN DE VALIDACIÓN"
echo "========================"
echo "Total verificaciones: $TOTAL_CHECKS"
echo "Verificaciones exitosas: $PASSED_CHECKS"
echo "Tasa de éxito: $SUCCESS_RATE%"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo "🎉 EXCELENTE: Tutorial Social completamente implementado"
elif [ $PASSED_CHECKS -ge 5 ]; then
    echo "✅ BUENO: Tutorial Social mayormente implementado"
else
    echo "⚠️ NECESITA TRABAJO: Tutorial Social requiere más desarrollo"
fi

echo ""
echo "📝 COMANDOS ÚTILES:"
echo "   Iniciar tutorial: useDiscoveryTutorial().startTutorial('social-discovery')"
echo "   URL social: http://localhost:3001/social"
