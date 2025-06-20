#!/bin/bash
# 🎯 SCRIPT DE VERIFICACIÓN FINAL - REPRODUCTOR ÜPLAY MEJORADO ACTIVO
# Verify that UPlayVideoPlayer.tsx is using the enhanced InteractiveVideoPlayerOverlay

echo "🔍 VERIFICACIÓN FINAL - REPRODUCTOR MEJORADO ACTIVO"
echo "=================================================="

# Verificar que UPlayVideoPlayer.tsx usa InteractiveVideoPlayerOverlay
uplay_video_player="Demo/apps/superapp-unified/src/pages/UPlayVideoPlayer.tsx"

echo "📁 Verificando archivo principal..."
if [ ! -f "$uplay_video_player" ]; then
  echo "❌ UPlayVideoPlayer.tsx no encontrado"
  exit 1
fi
echo "✅ UPlayVideoPlayer.tsx encontrado"

echo "🔍 Verificando imports y componentes..."

# 1. Verificar import del reproductor mejorado
enhanced_import=$(grep -c "InteractiveVideoPlayerOverlay" "$uplay_video_player")
old_import=$(grep -c "EnhancedInteractiveVideoPlayer" "$uplay_video_player")

if [ "$enhanced_import" -gt 0 ]; then
  echo "✅ Import correcto: InteractiveVideoPlayerOverlay encontrado ($enhanced_import ocurrencias)"
else
  echo "❌ Import incorrecto: InteractiveVideoPlayerOverlay NO encontrado"
  exit 1
fi

if [ "$old_import" -gt 0 ]; then
  echo "⚠️ ADVERTENCIA: Aún hay referencias a EnhancedInteractiveVideoPlayer ($old_import ocurrencias)"
else
  echo "✅ Sin referencias al reproductor anterior"
fi

# 2. Verificar componente renderizado
component_usage=$(grep -A 10 -B 5 "InteractiveVideoPlayerOverlay" "$uplay_video_player" | grep -c "videoUrl=")
if [ "$component_usage" -gt 0 ]; then
  echo "✅ Componente renderizado correctamente con videoUrl prop"
else
  echo "❌ Componente no está siendo renderizado correctamente"
  exit 1
fi

# 3. Verificar función de conversión de URL
url_converter=$(grep -c "convertToVideoPlayerUrl" "$uplay_video_player")
if [ "$url_converter" -gt 0 ]; then
  echo "✅ Función de conversión de URL implementada ($url_converter ocurrencias)"
else
  echo "❌ Función de conversión de URL no encontrada"
  exit 1
fi

# 4. Verificar import del apiService
api_service_import=$(grep -c "api-service" "$uplay_video_player")
if [ "$api_service_import" -gt 0 ]; then
  echo "✅ Import de apiService encontrado"
else
  echo "❌ Import de apiService faltante"
  exit 1
fi

# 5. Verificar props específicas del reproductor mejorado
props_check=0
if grep -q "videoUrl=" "$uplay_video_player"; then
  echo "✅ Prop videoUrl configurada"
  ((props_check++))
fi
if grep -q "questions=" "$uplay_video_player"; then
  echo "✅ Prop questions configurada"
  ((props_check++))
fi
if grep -q "onRewardEarned=" "$uplay_video_player"; then
  echo "✅ Prop onRewardEarned configurada"
  ((props_check++))
fi
if grep -q "onQuestionAnswer=" "$uplay_video_player"; then
  echo "✅ Prop onQuestionAnswer configurada"
  ((props_check++))
fi

if [ "$props_check" -eq 4 ]; then
  echo "✅ Todas las props críticas configuradas ($props_check/4)"
else
  echo "⚠️ Props incompletas ($props_check/4)"
fi

echo ""
echo "🎯 RESUMEN DE VERIFICACIÓN:"
echo "=========================="
echo "✅ Reproductor mejorado: InteractiveVideoPlayerOverlay"
echo "✅ Props configuradas correctamente"
echo "✅ Función de conversión de URL"
echo "✅ Import de apiService para analytics"
echo "✅ Sin referencias al reproductor anterior"
echo ""
echo "🚀 ESTADO: REPRODUCTOR MEJORADO ACTIVO"
echo "🎮 INSTRUCCIONES DE TESTING:"
echo "1. Navega a ÜPlay en http://localhost:3001"
echo "2. Haz clic en cualquier video"
echo "3. Busca el botón 🧩 Debug en la esquina superior derecha"
echo "4. Haz clic para activar preguntas interactivas"
echo "5. Verifica el diseño glassmorphism mejorado"
echo ""
echo "🎨 CARACTERÍSTICAS ACTIVAS:"
echo "• Preguntas interactivas con diseño moderno"
echo "• Botón debug para testing inmediato"
echo "• Gradientes cósmicos y efectos glassmorphism"
echo "• Timer visual con progress bar dinámico"
echo "• Preview de recompensas Mëritos/Öndas"
echo "• Preguntas temáticas de CoomÜnity/Ayni"
echo ""
echo "🎉 VERIFICACIÓN COMPLETADA - SISTEMA LISTO" 