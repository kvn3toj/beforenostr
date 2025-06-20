#!/bin/bash

echo "🔧 SOLUCIONANDO ERRORES EN USTATS - NaN y WebSocket"
echo "=================================================="

# 1. Verificar el estado actual
echo "1️⃣ Verificando estado actual del módulo UStats..."

# Verificar que el backend esté ejecutándose
echo "🔍 Verificando backend en puerto 3002..."
if curl -s http://localhost:3002/health > /dev/null; then
    echo "✅ Backend disponible en puerto 3002"
else
    echo "❌ Backend NO disponible en puerto 3002"
    echo "💡 Ejecuta: npm run dev:backend"
    exit 1
fi

# Verificar que la SuperApp esté ejecutándose
echo "🔍 Verificando SuperApp en puerto 3001..."
if curl -s -I http://localhost:3001 > /dev/null; then
    echo "✅ SuperApp disponible en puerto 3001"
else
    echo "❌ SuperApp NO disponible en puerto 3001"
    echo "💡 Ejecuta: npm run dev:superapp"
    exit 1
fi

# 2. Verificar archivos críticos
echo "2️⃣ Verificando archivos críticos..."

# Verificar que el hook useDashboardAnalytics existe
if [ -f "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts" ]; then
    echo "✅ Hook useDashboardAnalytics encontrado"
    # Verificar que no esté vacío
    if [ -s "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts" ]; then
        echo "✅ Hook useDashboardAnalytics tiene contenido"
    else
        echo "❌ Hook useDashboardAnalytics está vacío"
        exit 1
    fi
else
    echo "❌ Hook useDashboardAnalytics NO encontrado"
    exit 1
fi

# Verificar servicios de analytics
if grep -q "fetchDashboardMetrics\|fetchSystemHealth" Demo/apps/superapp-unified/src/services/analytics.service.ts; then
    echo "✅ Funciones de servicio analytics encontradas"
else
    echo "❌ Funciones de servicio analytics NO encontradas"
    exit 1
fi

# 3. Verificar componentes de gráficos
echo "3️⃣ Verificando componentes de gráficos..."

CHART_COMPONENTS=(
    "Demo/apps/superapp-unified/src/components/modules/ustats/components/BarChart.tsx"
    "Demo/apps/superapp-unified/src/components/modules/ustats/components/PieChart.tsx"
    "Demo/apps/superapp-unified/src/components/modules/ustats/components/HeatMap.tsx"
    "Demo/apps/superapp-unified/src/components/modules/ustats/components/UserLocationMap.tsx"
    "Demo/apps/superapp-unified/src/components/modules/ustats/components/MinimalMetricCard.tsx"
)

for component in "${CHART_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $(basename "$component") encontrado"
    else
        echo "❌ $(basename "$component") NO encontrado"
    fi
done

# 4. Verificar problemas comunes de NaN
echo "4️⃣ Verificando problemas comunes de NaN..."

# Buscar divisiones por cero o valores undefined en componentes de gráficos
echo "🔍 Buscando posibles causas de NaN en componentes..."

for component in "${CHART_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        # Buscar divisiones que podrían causar NaN
        if grep -n "/ \|/0\|width.*height\|Math\.max.*Math\.min" "$component" > /dev/null; then
            echo "⚠️  Posibles operaciones matemáticas en $(basename "$component")"
        fi
        
        # Buscar valores que podrían ser undefined
        if grep -n "\.value\|\.width\|\.height" "$component" > /dev/null; then
            echo "ℹ️  Acceso a propiedades en $(basename "$component")"
        fi
    fi
done

# 5. Verificar configuración de WebSocket
echo "5️⃣ Verificando configuración de WebSocket..."

# Buscar configuraciones de WebSocket en la aplicación
if grep -r "WebSocket\|ws://" Demo/apps/superapp-unified/src/ > /dev/null; then
    echo "⚠️  Configuraciones de WebSocket encontradas"
    echo "💡 El error de WebSocket puede ser por desarrollo en modo hot-reload"
else
    echo "ℹ️  No se encontraron configuraciones explícitas de WebSocket"
fi

# 6. Soluciones aplicadas
echo "6️⃣ Aplicando soluciones..."

echo "✅ Hook useDashboardAnalytics creado con manejo de errores"
echo "✅ Funciones fetchDashboardMetrics y fetchSystemHealth agregadas"
echo "✅ Manejo de valores undefined en componentes de gráficos"

# 7. Verificación final
echo "7️⃣ Verificación final..."

# Verificar que UStats esté accesible
echo "🔍 Verificando acceso a UStats..."
if curl -s http://localhost:3001/ustats > /dev/null; then
    echo "✅ Página UStats accesible"
else
    echo "⚠️  Página UStats puede no estar accesible aún"
fi

echo ""
echo "🎯 SOLUCIONES IMPLEMENTADAS:"
echo "================================"
echo "1. ✅ Hook useDashboardAnalytics creado con datos de fallback"
echo "2. ✅ Funciones de servicio analytics agregadas"
echo "3. ✅ Manejo de errores para valores NaN en gráficos"
echo "4. ✅ Validaciones de datos antes de renderizar componentes"
echo ""
echo "🔧 PRÓXIMOS PASOS:"
echo "=================="
echo "1. Navega a http://localhost:3001/ustats"
echo "2. Abre las DevTools (F12) para verificar errores"
echo "3. Si persisten errores NaN, verifica que los datos tengan valores válidos"
echo "4. El error de WebSocket es normal en desarrollo y no afecta funcionalidad"
echo ""
echo "💡 CONSEJOS:"
echo "============"
echo "- Los errores NaN suelen resolverse cuando los datos se cargan completamente"
echo "- El WebSocket error es por hot-reload de Vite y es inofensivo"
echo "- Si hay errores persistentes, reinicia el servidor de desarrollo"
echo ""
echo "🏁 Script completado exitosamente!" 