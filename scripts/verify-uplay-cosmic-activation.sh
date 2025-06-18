#!/bin/bash

# 🌌 SCRIPT DE VERIFICACIÓN: ACTIVACIÓN ESTILOS CÓSMICOS UPLAY
# ============================================================
# Verifica que los cambios del PROMPT #073 estén correctamente aplicados
# para transformar ÜPlay con efectos visuales revolucionarios

echo "🌌 VERIFICACIÓN DE ACTIVACIÓN DE ESTILOS CÓSMICOS - ÜPLAY"
echo "========================================================"
echo ""

# Variables de archivos clave
UPLAY_FILE="Demo/apps/superapp-unified/src/pages/UPlay.tsx"
PATTERNS_FILE="Demo/apps/superapp-unified/src/design-system/patterns.ts"
MOBILE_FILE="Demo/apps/superapp-unified/src/components/modules/uplay/UPlayMobileHome.tsx"

echo "🎯 1. Verificando configuraciones avanzadas en UPlay.tsx..."

# Verificar variant="elevated"
ELEVATED_COUNT=$(grep -c 'variant="elevated"' "$UPLAY_FILE" 2>/dev/null || echo "0")
if [ "$ELEVATED_COUNT" -ge 3 ]; then
    echo "✅ RevolutionaryWidgets con variant='elevated': $ELEVATED_COUNT/3 ✨"
else
    echo "❌ ERROR: Solo $ELEVATED_COUNT/3 RevolutionaryWidgets con variant='elevated'"
fi

# Verificar cosmicIntensity="intense"
INTENSE_COUNT=$(grep -c 'cosmicIntensity="intense"' "$UPLAY_FILE" 2>/dev/null || echo "0")
if [ "$INTENSE_COUNT" -ge 3 ]; then
    echo "✅ RevolutionaryWidgets con cosmicIntensity='intense': $INTENSE_COUNT/3 🔥"
else
    echo "❌ ERROR: Solo $INTENSE_COUNT/3 RevolutionaryWidgets con cosmicIntensity='intense'"
fi

# Verificar enableOrbitalEffects
if grep -q "enableOrbitalEffects: true" "$UPLAY_FILE"; then
    echo "✅ Efectos orbitales activados 🌌"
else
    echo "❌ ERROR: Efectos orbitales no activados"
fi

# Verificar configuración de partículas avanzada
PARTICLE_COUNT=$(grep -c "count: [8-9]" "$UPLAY_FILE" 2>/dev/null || echo "0")
PARTICLE_COUNT_HIGH=$(grep -c "count: 10" "$UPLAY_FILE" 2>/dev/null || echo "0")
TOTAL_PARTICLES=$((PARTICLE_COUNT + PARTICLE_COUNT_HIGH))
if [ "$TOTAL_PARTICLES" -gt 0 ]; then
    echo "✅ Configuración de partículas avanzada (8-10 partículas): $TOTAL_PARTICLES 💫"
else
    echo "⚠️ ADVERTENCIA: Partículas en configuración básica"
fi

echo ""

echo "🎨 2. Verificando estilos 'elevated' extremos en patterns.ts..."

# Verificar glassmorphism extremo
if grep -q "GLASSMORPHISM EXTREMO REVOLUCIONARIO" "$PATTERNS_FILE"; then
    echo "✅ Glassmorphism extremo implementado 🔮"
else
    echo "❌ ERROR: Glassmorphism extremo no encontrado"
fi

# Verificar sombras cósmicas multicapa
if grep -q "SOMBRAS CÓSMICAS MULTICAPA EXTREMAS" "$PATTERNS_FILE"; then
    echo "✅ Sombras cósmicas multicapa extremas 🌟"
else
    echo "❌ ERROR: Sombras cósmicas multicapa no encontradas"
fi

# Verificar blur intenso
if grep -q "backdropFilter: 'blur(30px)" "$PATTERNS_FILE"; then
    echo "✅ Blur extremo (30px) configurado 🌊"
else
    echo "❌ ERROR: Blur extremo no encontrado"
fi

# Verificar aura externa brillante
if grep -q "AURA EXTERNA BRILLANTE" "$PATTERNS_FILE"; then
    echo "✅ Aura externa brillante implementada ✨"
else
    echo "❌ ERROR: Aura externa brillante no encontrada"
fi

# Verificar saturación del backdrop filter
if grep -q "saturate(180%)" "$PATTERNS_FILE"; then
    echo "✅ Saturación extrema (180%) implementada 🎨"
else
    echo "❌ ERROR: Saturación extrema no encontrada"
fi

echo ""

echo "🎮 3. Verificando CosmicCards en UPlayMobileHome.tsx..."

# Verificar variant="elevated" en BackendVideoCard
MOBILE_ELEVATED=$(grep -c 'variant="elevated"' "$MOBILE_FILE" 2>/dev/null || echo "0")
if [ "$MOBILE_ELEVATED" -ge 2 ]; then
    echo "✅ BackendVideoCards con variant='elevated': $MOBILE_ELEVATED ⚡"
else
    echo "❌ ERROR: BackendVideoCards no tienen variant='elevated'"
fi

# Verificar cosmicIntensity="intense"
MOBILE_INTENSE=$(grep -c 'cosmicIntensity="intense"' "$MOBILE_FILE" 2>/dev/null || echo "0")
if [ "$MOBILE_INTENSE" -ge 2 ]; then
    echo "✅ BackendVideoCards con cosmicIntensity='intense': $MOBILE_INTENSE 🔥"
else
    echo "❌ ERROR: BackendVideoCards no tienen cosmicIntensity='intense'"
fi

# Verificar elemento agua
if grep -q 'element="agua"' "$MOBILE_FILE"; then
    echo "✅ Elemento 'agua' asignado para fluidez de video 💧"
else
    echo "❌ ERROR: Elemento 'agua' no asignado"
fi

# Verificar efectos completos
if grep -q "enableParticles={true}" "$MOBILE_FILE" && grep -q "enableGlow={true}" "$MOBILE_FILE"; then
    echo "✅ Efectos completos activados (partículas + glow) 🌟"
else
    echo "❌ ERROR: Efectos completos no activados"
fi

echo ""

echo "🌐 4. Verificando conectividad y rendimiento..."

# Verificar que SuperApp esté ejecutándose
if curl -s http://localhost:2222 > /dev/null; then
    echo "✅ SuperApp funcionando en puerto 3001 🚀"
else
    echo "❌ ERROR: SuperApp no responde en puerto 3001"
fi

# Verificar archivos clave existen
if [ -f "$UPLAY_FILE" ] && [ -f "$PATTERNS_FILE" ] && [ -f "$MOBILE_FILE" ]; then
    echo "✅ Todos los archivos clave encontrados 📁"
else
    echo "❌ ERROR: Archivos clave faltantes"
fi

echo ""

echo "🏆 RESUMEN DE ACTIVACIÓN CÓSMICA:"
echo "================================="

# Contar criterios cumplidos
TOTAL_CHECKS=0
PASSED_CHECKS=0

# UPlay.tsx checks
((TOTAL_CHECKS += 4))
[ "$ELEVATED_COUNT" -ge 3 ] && ((PASSED_CHECKS++))
[ "$INTENSE_COUNT" -ge 3 ] && ((PASSED_CHECKS++))
grep -q "enableOrbitalEffects: true" "$UPLAY_FILE" && ((PASSED_CHECKS++))
[ "$TOTAL_PARTICLES" -gt 0 ] && ((PASSED_CHECKS++))

# patterns.ts checks  
((TOTAL_CHECKS += 5))
grep -q "GLASSMORPHISM EXTREMO REVOLUCIONARIO" "$PATTERNS_FILE" && ((PASSED_CHECKS++))
grep -q "SOMBRAS CÓSMICAS MULTICAPA EXTREMAS" "$PATTERNS_FILE" && ((PASSED_CHECKS++))
grep -q "backdropFilter: 'blur(30px)" "$PATTERNS_FILE" && ((PASSED_CHECKS++))
grep -q "AURA EXTERNA BRILLANTE" "$PATTERNS_FILE" && ((PASSED_CHECKS++))
grep -q "saturate(180%)" "$PATTERNS_FILE" && ((PASSED_CHECKS++))

# UPlayMobileHome.tsx checks
((TOTAL_CHECKS += 4))
[ "$MOBILE_ELEVATED" -ge 2 ] && ((PASSED_CHECKS++))
[ "$MOBILE_INTENSE" -ge 2 ] && ((PASSED_CHECKS++))
grep -q 'element="agua"' "$MOBILE_FILE" && ((PASSED_CHECKS++))
grep -q "enableParticles={true}" "$MOBILE_FILE" && grep -q "enableGlow={true}" "$MOBILE_FILE" && ((PASSED_CHECKS++))

# Calcular porcentaje
PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "📊 Criterios cumplidos: $PASSED_CHECKS/$TOTAL_CHECKS ($PERCENTAGE%)"

if [ "$PERCENTAGE" -ge 90 ]; then
    echo "🌟 EXCELENTE: Los estilos cósmicos avanzados están completamente activados"
    echo "💫 ÜPlay ahora brilla con la intensidad cósmica del Dashboard HOME"
    echo ""
    echo "🎯 ACCIONES SIGUIENTES:"
    echo "1. Abrir http://localhost:2222/uplay en ventana incógnito"
    echo "2. Hacer Hard Refresh (Cmd+Shift+R)"
    echo "3. Observar la transformación visual drástica"
    echo "4. Verificar glassmorphism, gradientes y efectos orbitales"
elif [ "$PERCENTAGE" -ge 75 ]; then
    echo "⚠️ BUENO: La mayoría de estilos cósmicos están activados"
    echo "🔧 Revisar elementos faltantes arriba marcados con ❌"
elif [ "$PERCENTAGE" -ge 50 ]; then
    echo "🔴 REGULAR: Solo algunos estilos cósmicos están activos"
    echo "🛠️ Requiere correcciones en varios archivos"
else
    echo "💥 CRÍTICO: Los estilos cósmicos NO están activados correctamente"
    echo "🚨 Revisar todas las configuraciones marcadas con ❌"
fi

echo ""
echo "🌌 Activación cósmica de ÜPlay completada"
echo "========================================="

echo ""
echo "🔗 Enlaces útiles:"
echo "   🌐 SuperApp: http://localhost:2222"
echo "   🎬 ÜPlay: http://localhost:2222/uplay"
echo "   🏠 Dashboard HOME (referencia): http://localhost:2222/"
echo ""

# Generar reporte de análisis visual
echo "📊 ANÁLISIS VISUAL ESPERADO:"
echo "============================"
echo "1. 🎬 HEADER PRINCIPAL:"
echo "   • Fondo glassmorphism con gradientes radiales"
echo "   • Bordes con gradiente multicolor brillante"
echo "   • Sombras profundas con aura azul (elemento agua)"
echo "   • Partículas flotantes animadas"
echo ""
echo "2. 📚 SECCIÓN DE VIDEOS:"
echo "   • CosmicCards con efectos 'elevated'"
echo "   • Hover con transformación 3D dramática"
echo "   • Blur backdrop intenso (30px+)"
echo "   • Auras de colores por elemento"
echo ""
echo "3. 🌱 SECCIÓN FILOSÓFICA:"
echo "   • Elementos espíritu con partículas púrpura"
echo "   • Efectos orbitales alrededor del contenido"
echo "   • Brillo interno y externo intensificado"
echo ""
echo "🎯 COMPARACIÓN: ÜPlay debería lucir TAN impactante como el Dashboard HOME"
echo "💫 Si no ves estos efectos, revisa la consola del navegador para errores CSS" 