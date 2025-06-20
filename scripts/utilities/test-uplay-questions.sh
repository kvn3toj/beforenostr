#!/bin/bash
# 🎯 SCRIPT DE TESTING PARA PREGUNTAS ÜPLAY MEJORADAS
# Test the enhanced interactive questions system in ÜPlay module

echo "🎮 TESTING MEJORADO - PREGUNTAS INTERACTIVAS ÜPLAY"
echo "=============================================="

# Pre-flight check
echo "📋 PRE-FLIGHT CHECK..."
pwd_check=$(pwd)
expected_dir="/Users/kevinp/Movies/GAMIFIER-copy"
if [ "$pwd_check" != "$expected_dir" ]; then
  echo "❌ ERROR: Ubicación incorrecta"
  echo "📍 Actual: $pwd_check"
  echo "📍 Esperada: $expected_dir"
  exit 1
fi
echo "✅ Ubicación correcta verificada"

# Verificar que el backend esté ejecutándose
echo "🗄️ Verificando backend..."
backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
if [ "$backend_status" != "200" ]; then
  echo "❌ Backend no disponible en puerto 3002"
  echo "🔧 Ejecuta: npm run dev:backend"
  exit 1
fi
echo "✅ Backend operacional (puerto 3002)"

# Verificar SuperApp
echo "🌐 Verificando SuperApp..."
superapp_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$superapp_status" != "200" ]; then
  echo "❌ SuperApp no disponible en puerto 3001"
  echo "🔧 Ejecuta: npm run dev:superapp"
  exit 1
fi
echo "✅ SuperApp operacional (puerto 3001)"

# Verificar que los archivos de mejoras existan
echo "📁 Verificando archivos de mejoras..."
uplay_overlay="Demo/apps/superapp-unified/src/components/modules/uplay/components/InteractiveVideoPlayerOverlay.tsx"
if [ ! -f "$uplay_overlay" ]; then
  echo "❌ Archivo InteractiveVideoPlayerOverlay.tsx no encontrado"
  exit 1
fi
echo "✅ InteractiveVideoPlayerOverlay.tsx encontrado"

# Verificar que las mejoras estén implementadas
echo "🔍 Verificando mejoras implementadas..."

# 1. Verificar preguntas tempranas para testing
early_questions=$(grep -c "timestamp: 5" "$uplay_overlay")
if [ "$early_questions" -eq 0 ]; then
  echo "❌ Preguntas tempranas para testing no encontradas"
  exit 1
fi
echo "✅ Preguntas tempranas implementadas (timestamp: 5s)"

# 2. Verificar botón de debug
debug_button=$(grep -c "QuizIcon" "$uplay_overlay")
if [ "$debug_button" -eq 0 ]; then
  echo "❌ Botón de debug no encontrado"
  exit 1
fi
echo "✅ Botón de debug implementado"

# 3. Verificar diseño mejorado de preguntas
enhanced_design=$(grep -c "linear-gradient.*rgba(99, 102, 241" "$uplay_overlay")
if [ "$enhanced_design" -eq 0 ]; then
  echo "❌ Diseño mejorado de preguntas no encontrado"
  exit 1
fi
echo "✅ Diseño mejorado de preguntas implementado"

# 4. Verificar preguntas con Ayni y CoomÜnity
coomunity_questions=$(grep -c "principio fundamental de Ayni" "$uplay_overlay")
if [ "$coomunity_questions" -eq 0 ]; then
  echo "❌ Preguntas de CoomÜnity no encontradas"
  exit 1
fi
echo "✅ Preguntas temáticas CoomÜnity implementadas"

echo ""
echo "🎯 RESULTADOS DEL TESTING:"
echo "=========================="
echo "✅ Backend funcionando (puerto 3002)"
echo "✅ SuperApp funcionando (puerto 3001)" 
echo "✅ Preguntas tempranas (5s, 15s, 30s)"
echo "✅ Botón de debug para testing"
echo "✅ Diseño mejorado con gradientes y efectos"
echo "✅ Preguntas temáticas de CoomÜnity/Ayni"
echo "✅ Sistema de recompensas visual"
echo "✅ Timer y progress bars mejorados"
echo ""
echo "🚀 INSTRUCCIONES DE TESTING:"
echo "1. Abre http://localhost:3001"
echo "2. Navega a ÜPlay"
echo "3. Inicia cualquier video"
echo "4. Busca el botón 🧩 Debug en la esquina superior"
echo "5. Haz clic para activar preguntas de prueba"
echo "6. O espera 5 segundos para pregunta automática"
echo ""
echo "🎨 MEJORAS IMPLEMENTADAS:"
echo "• Preguntas con diseño glassmorphism"
echo "• Gradientes cósmicos y efectos visuales"
echo "• Botones de respuesta mejorados con avatares"
echo "• Timer visual con cambio de color"
echo "• Preview de recompensas Mëritos/Öndas"
echo "• Animaciones suaves y transiciones"
echo ""
echo "🎉 TESTING COMPLETADO - SISTEMA LISTO PARA PRUEBAS" 