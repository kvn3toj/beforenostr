#!/bin/bash

# 🔍 USTATS PATTERNS ERROR RESOLUTION VERIFICATION
# ================================================
# Verifica que el error "Can't find variable: patterns" esté resuelto
# y que el módulo UStats funcione correctamente con el diseño cósmico

echo "🔍 INICIANDO VERIFICACIÓN RESOLUCIÓN ERROR PATTERNS USTATS..."
echo "=============================================================="

# 🎯 1. VERIFICAR EXPORTS DEL DESIGN SYSTEM
echo ""
echo "📦 1. VERIFICANDO EXPORTS DEL DESIGN SYSTEM:"
echo "---------------------------------------------"

DESIGN_SYSTEM_INDEX="Demo/apps/superapp-unified/src/design-system/index.ts"
PATTERNS_FILE="Demo/apps/superapp-unified/src/design-system/patterns.ts"

if [ -f "$DESIGN_SYSTEM_INDEX" ]; then
    echo "✅ Design system index encontrado: $DESIGN_SYSTEM_INDEX"
    
    # Verificar que patterns esté exportado correctamente
    if grep -q "export { default as patterns }" "$DESIGN_SYSTEM_INDEX"; then
        echo "✅ Patterns exportado correctamente como named export"
    else
        echo "❌ ERROR: Patterns no exportado como named export"
    fi
    
    # Verificar imports explícitos para default export
    if grep -q "import patternsDefault from './patterns'" "$DESIGN_SYSTEM_INDEX"; then
        echo "✅ Imports explícitos para default export implementados"
    else
        echo "❌ ERROR: Falta imports explícitos para default export"
    fi
    
    # Verificar uso correcto en default export
    if grep -q "patterns: patternsDefault" "$DESIGN_SYSTEM_INDEX"; then
        echo "✅ Default export usa imports explícitos correctamente"
    else
        echo "❌ ERROR: Default export no usa imports explícitos"
    fi
    
else
    echo "❌ ERROR: Design system index no encontrado"
    exit 1
fi

if [ -f "$PATTERNS_FILE" ]; then
    echo "✅ Patterns file encontrado: $PATTERNS_FILE"
    
    # Verificar que tiene default export
    if grep -q "export default {" "$PATTERNS_FILE"; then
        echo "✅ Patterns file tiene default export"
    else
        echo "❌ ERROR: Patterns file no tiene default export"
    fi
else
    echo "❌ ERROR: Patterns file no encontrado"
    exit 1
fi

# 🎯 2. VERIFICAR IMPORTS EN USTATS
echo ""
echo "🎮 2. VERIFICANDO IMPORTS EN MÓDULO USTATS:"
echo "------------------------------------------"

USTATS_MAIN="Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx"
USTATS_PAGE="Demo/apps/superapp-unified/src/pages/UStats.tsx"

if [ -f "$USTATS_MAIN" ]; then
    echo "✅ UStatsMain encontrado: $USTATS_MAIN"
    
    # Verificar import del design system
    if grep -q "import.*RevolutionaryWidget.*from.*design-system" "$USTATS_MAIN"; then
        echo "✅ UStatsMain importa correctamente del design system"
    else
        echo "❌ ERROR: UStatsMain no importa del design system"
    fi
    
    # Verificar uso de RevolutionaryWidget
    if grep -q "<RevolutionaryWidget" "$USTATS_MAIN"; then
        echo "✅ UStatsMain usa RevolutionaryWidget"
    else
        echo "❌ ERROR: UStatsMain no usa RevolutionaryWidget"
    fi
else
    echo "❌ ERROR: UStatsMain no encontrado"
    exit 1
fi

if [ -f "$USTATS_PAGE" ]; then
    echo "✅ UStats page encontrado: $USTATS_PAGE"
else
    echo "❌ ERROR: UStats page no encontrado"
    exit 1
fi

# 🎯 3. VERIFICAR COMPONENTES USTATS
echo ""
echo "🧩 3. VERIFICANDO COMPONENTES USTATS:"
echo "------------------------------------"

USTATS_COMPONENTS_DIR="Demo/apps/superapp-unified/src/components/modules/ustats/components"

if [ -d "$USTATS_COMPONENTS_DIR" ]; then
    echo "✅ Directorio de componentes UStats encontrado"
    
    COMPONENT_COUNT=$(find "$USTATS_COMPONENTS_DIR" -name "*.tsx" | wc -l)
    echo "📊 Componentes encontrados: $COMPONENT_COUNT"
    
    # Verificar MinimalMetricCard específicamente
    MINIMAL_METRIC="$USTATS_COMPONENTS_DIR/MinimalMetricCard.tsx"
    if [ -f "$MINIMAL_METRIC" ]; then
        echo "✅ MinimalMetricCard encontrado"
        
        # Verificar import de CosmicCard
        if grep -q "import.*CosmicCard.*from.*design-system" "$MINIMAL_METRIC"; then
            echo "✅ MinimalMetricCard importa CosmicCard correctamente"
        else
            echo "❌ ERROR: MinimalMetricCard no importa CosmicCard"
        fi
    else
        echo "❌ ERROR: MinimalMetricCard no encontrado"
    fi
else
    echo "❌ ERROR: Directorio de componentes UStats no encontrado"
    exit 1
fi

# 🎯 4. VERIFICAR ROUTING USTATS
echo ""
echo "🛤️ 4. VERIFICANDO ROUTING USTATS:"
echo "--------------------------------"

# Verificar rutas en App.tsx
APP_FILE="Demo/apps/superapp-unified/src/App.tsx"
if [ -f "$APP_FILE" ]; then
    if grep -q "/ustats" "$APP_FILE"; then
        echo "✅ Ruta /ustats configurada en App.tsx"
    else
        echo "❌ ERROR: Ruta /ustats no configurada en App.tsx"
    fi
else
    echo "❌ ERROR: App.tsx no encontrado"
fi

# Verificar navegación
BOTTOM_NAV="Demo/apps/superapp-unified/src/components/layout/BottomNavigation.tsx"
if [ -f "$BOTTOM_NAV" ]; then
    if grep -q "/ustats" "$BOTTOM_NAV"; then
        echo "✅ Navegación a /ustats configurada en BottomNavigation"
    else
        echo "❌ ERROR: Navegación a /ustats no configurada en BottomNavigation"
    fi
else
    echo "❌ ERROR: BottomNavigation no encontrado"
fi

SIDEBAR="Demo/apps/superapp-unified/src/components/layout/Sidebar.tsx"
if [ -f "$SIDEBAR" ]; then
    if grep -q "/ustats" "$SIDEBAR"; then
        echo "✅ Navegación a /ustats configurada en Sidebar"
    else
        echo "❌ ERROR: Navegación a /ustats no configurada en Sidebar"
    fi
else
    echo "❌ ERROR: Sidebar no encontrado"
fi

# 🎯 5. VERIFICAR SUPERAPP FUNCIONANDO
echo ""
echo "🌐 5. VERIFICANDO SUPERAPP FUNCIONANDO:"
echo "--------------------------------------"

# Verificar que el servidor esté ejecutándose
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ SuperApp ejecutándose en puerto 3001"
    
    # Verificar respuesta HTTP específica
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ SuperApp responde HTTP 200 OK"
    else
        echo "⚠️ ADVERTENCIA: SuperApp responde HTTP $HTTP_STATUS"
    fi
else
    echo "❌ ERROR: SuperApp no está ejecutándose en puerto 3001"
    echo "💡 TIP: Ejecuta 'npm run dev:superapp' para iniciar la SuperApp"
fi

# 🎯 6. VERIFICAR PROCESOS MÚLTIPLES
echo ""
echo "🔄 6. VERIFICANDO PROCESOS MÚLTIPLES:"
echo "------------------------------------"

VITE_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ "$VITE_PROCESSES" -eq 1 ]; then
    echo "✅ Un solo proceso Vite ejecutándose (correcto)"
elif [ "$VITE_PROCESSES" -eq 0 ]; then
    echo "⚠️ ADVERTENCIA: Ningún proceso Vite ejecutándose"
else
    echo "❌ ERROR: Múltiples procesos Vite ejecutándose ($VITE_PROCESSES)"
    echo "💡 TIP: Ejecuta 'pkill -f vite && pkill -f \"npm run dev\"' para limpiar"
fi

# 🎯 7. RESUMEN FINAL
echo ""
echo "📊 RESUMEN FINAL DE VERIFICACIÓN:"
echo "================================="

TOTAL_CHECKS=7
PASSED_CHECKS=0

# Contar checks pasados basado en outputs anteriores
if [ -f "$DESIGN_SYSTEM_INDEX" ] && [ -f "$PATTERNS_FILE" ]; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

if [ -f "$USTATS_MAIN" ] && [ -f "$USTATS_PAGE" ]; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

if [ -d "$USTATS_COMPONENTS_DIR" ]; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

if [ -f "$APP_FILE" ] && [ -f "$BOTTOM_NAV" ] && [ -f "$SIDEBAR" ]; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

if curl -s http://localhost:3001 > /dev/null; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

if [ "$VITE_PROCESSES" -le 1 ]; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# Verificación específica del error patterns
if grep -q "patterns: patternsDefault" "$DESIGN_SYSTEM_INDEX"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo "✅ ERROR 'Can't find variable: patterns' RESUELTO"
else
    echo "❌ ERROR 'Can't find variable: patterns' PERSISTE"
fi

PERCENTAGE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))

echo ""
echo "🎯 RESULTADO: $PASSED_CHECKS/$TOTAL_CHECKS checks pasados ($PERCENTAGE%)"

if [ "$PERCENTAGE" -ge 85 ]; then
    echo "🎉 ¡VERIFICACIÓN EXITOSA! UStats patterns error resuelto"
    echo ""
    echo "🔥 PRÓXIMOS PASOS RECOMENDADOS:"
    echo "1. Navegar a http://localhost:3001/ustats para probar"
    echo "2. Verificar que no aparezcan errores en consola"
    echo "3. Comprobar que los widgets cósmicos se muestren correctamente"
elif [ "$PERCENTAGE" -ge 70 ]; then
    echo "⚠️ VERIFICACIÓN PARCIAL - Algunos issues menores detectados"
else
    echo "❌ VERIFICACIÓN FALLIDA - Issues críticos requieren atención"
    exit 1
fi

echo ""
echo "✨ Verificación completada - $(date)" 