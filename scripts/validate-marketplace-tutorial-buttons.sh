#!/bin/bash

echo "🛒 VALIDACIÓN DE BOTONES DE ACCIÓN - TUTORIAL MARKETPLACE DISCOVERY"
echo "=================================================================="

SUPERAPP_DIR="Demo/apps/superapp-unified"
TUTORIALS_FILE="$SUPERAPP_DIR/src/components/tutorials/DiscoveryTutorialProvider.tsx"

echo ""
echo "📋 VERIFICACIÓN DE ESTRUCTURA DE BOTONES"
echo "----------------------------------------"

# Verificar que el archivo existe
if [ -f "$TUTORIALS_FILE" ]; then
    echo "✅ $TUTORIALS_FILE encontrado"
else
    echo "❌ $TUTORIALS_FILE NO encontrado"
    exit 1
fi

# Verificar que el tutorial marketplace-discovery existe
MARKETPLACE_TUTORIAL=$(grep -c "id: 'marketplace-discovery'" "$TUTORIALS_FILE")
if [ $MARKETPLACE_TUTORIAL -gt 0 ]; then
    echo "✅ Tutorial marketplace-discovery definido"
else
    echo "❌ Tutorial marketplace-discovery NO encontrado"
    exit 1
fi

# Verificar botones de acción definidos
MARKETPLACE_SECTION=$(grep -A 300 "id: 'marketplace-discovery'" "$TUTORIALS_FILE")

# Verificar action buttons específicos
ACTION_BUTTONS_COUNT=$(echo "$MARKETPLACE_SECTION" | grep -c "actionButton:" || echo "0")
echo "📊 ActionButtons definidos: $ACTION_BUTTONS_COUNT"

# Verificar botones específicos esperados
EXPLORE_BUTTON=$(echo "$MARKETPLACE_SECTION" | grep -c "Explorar Categorías" || echo "0")
RECOMMENDED_BUTTON=$(echo "$MARKETPLACE_SECTION" | grep -c "Ver Productos Recomendados" || echo "0")

echo ""
echo "📋 VERIFICACIÓN DE BOTONES ESPECÍFICOS DEL MARKETPLACE"
echo "-----------------------------------------------------"

if [ $EXPLORE_BUTTON -gt 0 ]; then
    echo "✅ Botón 'Explorar Categorías' encontrado"
else
    echo "❌ Botón 'Explorar Categorías' NO encontrado"
fi

if [ $RECOMMENDED_BUTTON -gt 0 ]; then
    echo "✅ Botón 'Ver Productos Recomendados' encontrado"
else
    echo "❌ Botón 'Ver Productos Recomendados' NO encontrado"
fi

# Verificar URLs de navegación
MARKETPLACE_URL=$(echo "$MARKETPLACE_SECTION" | grep -c "/marketplace" || echo "0")
if [ $MARKETPLACE_URL -gt 0 ]; then
    echo "✅ URLs de navegación al marketplace encontradas"
else
    echo "⚠️ URLs de navegación específicas no encontradas"
fi

echo ""
echo "📋 VERIFICACIÓN DE INTEGRACIÓN CON COMPONENTES"
echo "----------------------------------------------"

# Verificar useNavigate import
USE_NAVIGATE=$(grep -c "useNavigate" "$TUTORIALS_FILE")
if [ $USE_NAVIGATE -gt 0 ]; then
    echo "✅ useNavigate importado"
else
    echo "❌ useNavigate NO importado"
fi

# Verificar función handleActionButtonClick
HANDLE_FUNCTION=$(grep -c "handleActionButtonClick" "$TUTORIALS_FILE")
if [ $HANDLE_FUNCTION -gt 0 ]; then
    echo "✅ Función handleActionButtonClick implementada"
else
    echo "❌ Función handleActionButtonClick NO encontrada"
fi

# Verificar que el tutorial se renderiza en Dialog
DIALOG_RENDER=$(grep -A 50 "Dialog" "$TUTORIALS_FILE" | grep -c "tutorial" || echo "0")
if [ $DIALOG_RENDER -gt 0 ]; then
    echo "✅ Tutorial se renderiza en Dialog"
else
    echo "⚠️ Renderizado en Dialog no verificable"
fi

# Calcular score total
TOTAL_CHECKS=8
PASSED_CHECKS=0

[ $MARKETPLACE_TUTORIAL -gt 0 ] && ((PASSED_CHECKS++))
[ $ACTION_BUTTONS_COUNT -gt 0 ] && ((PASSED_CHECKS++))
[ $EXPLORE_BUTTON -gt 0 ] && ((PASSED_CHECKS++))
[ $RECOMMENDED_BUTTON -gt 0 ] && ((PASSED_CHECKS++))
[ $MARKETPLACE_URL -gt 0 ] && ((PASSED_CHECKS++))
[ $USE_NAVIGATE -gt 0 ] && ((PASSED_CHECKS++))
[ $HANDLE_FUNCTION -gt 0 ] && ((PASSED_CHECKS++))
[ $DIALOG_RENDER -gt 0 ] && ((PASSED_CHECKS++))

SUCCESS_RATE=$(echo "scale=1; $PASSED_CHECKS * 100 / $TOTAL_CHECKS" | bc)

echo ""
echo "📊 RESUMEN DE VALIDACIÓN"
echo "========================"
echo "Total de verificaciones: $TOTAL_CHECKS"
echo "Verificaciones exitosas: $PASSED_CHECKS"
echo "Verificaciones fallidas: $((TOTAL_CHECKS - PASSED_CHECKS))"
echo "Tasa de éxito: $SUCCESS_RATE%"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo ""
    echo "🎉 EXCELENTE: Todos los botones de acción están correctamente implementados"
    echo "🛒 Los botones del tutorial Marketplace están listos para usar"
elif [ $PASSED_CHECKS -ge 6 ]; then
    echo ""
    echo "✅ BUENO: La mayoría de los botones están implementados"
    echo "⚠️ Algunas mejoras menores requeridas"
else
    echo ""
    echo "❌ NECESITA TRABAJO: Varios botones requieren implementación"
fi

echo ""
echo "🎯 ACCIONES RECOMENDADAS:"
echo "1. Si hay errores, revisar DiscoveryTutorialProvider.tsx"
echo "2. Verificar que todos los botones tienen onClick handlers"
echo "3. Confirmar que useNavigate está correctamente implementado"
echo "4. Probar manualmente cada botón en el tutorial"
echo "5. Verificar que las URLs de navegación son válidas"

echo ""
echo "📝 COMANDO PARA PRUEBA MANUAL:"
echo "   1. Iniciar SuperApp: npm run dev"
echo "   2. Navegar a /marketplace"
echo "   3. En DevTools: useDiscoveryTutorial().startTutorial('marketplace-discovery')"
echo "   4. Probar cada botón de acción"

echo ""
echo "🛒 Validación de botones Marketplace completada."
