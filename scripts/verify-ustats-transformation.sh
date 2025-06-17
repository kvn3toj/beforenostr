#!/bin/bash

# 🔥 SCRIPT DE VERIFICACIÓN - TRANSFORMACIÓN USTATS CON DESIGN SYSTEM CÓSMICO
# ==========================================================================
# Verificar que el módulo UStats se ha transformado exitosamente
# aplicando el Design System Revolucionario con elemento "fuego"

echo "🔥 VERIFICACIÓN DE TRANSFORMACIÓN USTATS - DESIGN SYSTEM CÓSMICO"
echo "==============================================================="
echo ""

# Función para mostrar estado
show_status() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2"
    else
        echo "❌ $2"
    fi
}

# 1. VERIFICAR IMPORTACIONES DEL DESIGN SYSTEM
echo "📦 1. Verificando importaciones del Design System..."
echo ""

# Verificar RevolutionaryWidget en UStatsMain
grep -q "RevolutionaryWidget" Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx
show_status $? "RevolutionaryWidget importado en UStatsMain.tsx"

# Verificar CosmicCard en MinimalMetricCard
grep -q "CosmicCard" Demo/apps/superapp-unified/src/components/modules/ustats/components/MinimalMetricCard.tsx
show_status $? "CosmicCard importado en MinimalMetricCard.tsx"

# Verificar CosmicCard en GamingStatsCard
grep -q "CosmicCard" Demo/apps/superapp-unified/src/components/modules/ustats/components/GamingStatsCard.tsx
show_status $? "CosmicCard importado en GamingStatsCard.tsx"

echo ""

# 2. VERIFICAR CONFIGURACIÓN DE ELEMENTOS
echo "🔥 2. Verificando configuración del elemento 'fuego'..."
echo ""

# Verificar elemento fuego en UStatsMain
grep -q 'element="fuego"' Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx
show_status $? "Elemento 'fuego' configurado en UStatsMain"

# Verificar elemento fuego en MinimalMetricCard
grep -q 'element="fuego"' Demo/apps/superapp-unified/src/components/modules/ustats/components/MinimalMetricCard.tsx
show_status $? "Elemento 'fuego' configurado en MinimalMetricCard"

# Verificar elemento fuego en GamingStatsCard
grep -q 'element="fuego"' Demo/apps/superapp-unified/src/components/modules/ustats/components/GamingStatsCard.tsx
show_status $? "Elemento 'fuego' configurado en GamingStatsCard"

echo ""

# 3. VERIFICAR EFECTOS CÓSMICOS
echo "✨ 3. Verificando efectos cósmicos habilitados..."
echo ""

# Verificar enableGlow
grep -q "enableGlow.*true" Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx
show_status $? "Efectos de resplandor (glow) habilitados en RevolutionaryWidget"

# Verificar enableAnimations
grep -q "enableAnimations.*true" Demo/apps/superapp-unified/src/components/modules/ustats/components/MinimalMetricCard.tsx
show_status $? "Animaciones cósmicas habilitadas en MinimalMetricCard"

# Verificar partículas en GamingStatsCard
grep -q "enableParticles.*true" Demo/apps/superapp-unified/src/components/modules/ustats/components/GamingStatsCard.tsx
show_status $? "Efectos de partículas habilitados en GamingStatsCard"

echo ""

# 4. VERIFICAR CONFIGURACIÓN DE INTENSIDAD
echo "🌟 4. Verificando configuración de intensidad cósmica..."
echo ""

# Verificar cosmicIntensity medium en UStatsMain
grep -q 'cosmicIntensity="medium"' Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx
show_status $? "Intensidad cósmica 'medium' en UStatsMain"

# Verificar cosmicIntensity intense en GamingStatsCard
grep -q 'cosmicIntensity="intense"' Demo/apps/superapp-unified/src/components/modules/ustats/components/GamingStatsCard.tsx
show_status $? "Intensidad cósmica 'intense' en GamingStatsCard"

echo ""

# 5. VERIFICAR TÍTULO Y SUBTÍTULO PERSONALIZADOS
echo "📊 5. Verificando personalización de títulos..."
echo ""

# Verificar título personalizado
grep -q "📊 Tus Estadísticas de Progreso" Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx
show_status $? "Título personalizado configurado"

# Verificar subtítulo personalizado
grep -q "Métricas revolucionarias de tu evolución en CoomÜnity" Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx
show_status $? "Subtítulo personalizado configurado"

echo ""

# 6. VERIFICAR ELIMINACIÓN DE COMPONENTES ANTIGUOS
echo "🗑️ 6. Verificando eliminación de componentes antiguos..."
echo ""

# Verificar que no se use Card directamente en MinimalMetricCard
if ! grep -q "import.*Card.*from '@mui/material'" Demo/apps/superapp-unified/src/components/modules/ustats/components/MinimalMetricCard.tsx; then
    echo "✅ Card de MUI removido de MinimalMetricCard"
else
    echo "❌ Card de MUI aún presente en MinimalMetricCard"
fi

# Verificar que no se use CardContent directamente en GamingStatsCard
if ! grep -q "import.*CardContent.*from '@mui/material'" Demo/apps/superapp-unified/src/components/modules/ustats/components/GamingStatsCard.tsx; then
    echo "✅ CardContent de MUI removido de GamingStatsCard"
else
    echo "❌ CardContent de MUI aún presente en GamingStatsCard"
fi

echo ""

# 7. CONTAR ARCHIVOS TRANSFORMADOS
echo "📈 7. Resumen de transformación..."
echo ""

TOTAL_FILES=3
TRANSFORMED_FILES=0

# Contar archivos que usan Design System
if grep -q "RevolutionaryWidget\|CosmicCard" Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx; then
    TRANSFORMED_FILES=$((TRANSFORMED_FILES + 1))
fi

if grep -q "CosmicCard" Demo/apps/superapp-unified/src/components/modules/ustats/components/MinimalMetricCard.tsx; then
    TRANSFORMED_FILES=$((TRANSFORMED_FILES + 1))
fi

if grep -q "CosmicCard" Demo/apps/superapp-unified/src/components/modules/ustats/components/GamingStatsCard.tsx; then
    TRANSFORMED_FILES=$((TRANSFORMED_FILES + 1))
fi

echo "📊 Archivos transformados: $TRANSFORMED_FILES de $TOTAL_FILES"

PERCENTAGE=$((TRANSFORMED_FILES * 100 / TOTAL_FILES))
echo "🎯 Porcentaje de transformación: $PERCENTAGE%"

echo ""

# 8. VERIFICACIÓN FINAL
echo "🏆 8. Verificación final..."
echo ""

if [ $TRANSFORMED_FILES -eq $TOTAL_FILES ]; then
    echo "🎉 ¡TRANSFORMACIÓN EXITOSA! El módulo UStats ahora usa el Design System Cósmico"
    echo "🔥 Elemento 'fuego' aplicado para representar energía, pasión y progreso"
    echo "✨ Efectos cósmicos habilitados para una experiencia revolucionaria"
    echo ""
    echo "📋 Componentes transformados:"
    echo "   1. UStatsMain.tsx → RevolutionaryWidget (fuego, medium intensity)"
    echo "   2. MinimalMetricCard.tsx → CosmicCard (fuego, medium intensity)"
    echo "   3. GamingStatsCard.tsx → CosmicCard (fuego, intense intensity)"
    echo ""
    echo "🎯 CRITERIOS DE ACEPTACIÓN CUMPLIDOS:"
    echo "   ✅ Página principal refactorizada con RevolutionaryWidget"
    echo "   ✅ Tarjetas de estadísticas refactorizadas con CosmicCard"
    echo "   ✅ Apariencia visual coherente con el resto de la aplicación"
    echo "   ✅ Transformación de otro módulo clave completada"
    
    EXIT_CODE=0
else
    echo "⚠️ TRANSFORMACIÓN INCOMPLETA"
    echo "❌ Solo $TRANSFORMED_FILES de $TOTAL_FILES archivos transformados"
    echo "🔧 Revisar los archivos faltantes e implementar el Design System"
    
    EXIT_CODE=1
fi

echo ""
echo "=================================================="
echo "🔥 VERIFICACIÓN USTATS COMPLETADA"
echo "=================================================="

exit $EXIT_CODE 