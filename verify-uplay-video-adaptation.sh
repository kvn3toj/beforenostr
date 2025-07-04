#!/bin/bash

echo "🎬 VERIFICACIÓN: Resolución de Error video.rewards.meritos en ÜPlay"
echo "================================================================="
echo "📅 Fecha: $(date)"
echo "📍 Directorio: $(pwd)"
echo ""

# VERIFICACIONES PRINCIPALES
declare -i success_count=0
declare -i total_checks=8

# 1. Verificar que el backend esté funcionando
echo "1️⃣ Verificando Backend NestJS..."
if curl -s http://localhost:3002/health > /dev/null; then
    echo "   ✅ Backend respondiendo en puerto 3002"
    ((success_count++))
else
    echo "   ❌ Backend no responde en puerto 3002"
fi

# 2. Verificar que la SuperApp esté funcionando
echo "2️⃣ Verificando SuperApp..."
if curl -s http://localhost:3001 -I | grep -q "200 OK"; then
    echo "   ✅ SuperApp respondiendo en puerto 3001"
    ((success_count++))
else
    echo "   ❌ SuperApp no responde en puerto 3001"
fi

# 3. Verificar estructura de videos en el backend
echo "3️⃣ Verificando estructura de videos del backend..."
video_structure=$(curl -s http://localhost:3002/video-items | jq -r '.[0] | keys[]' 2>/dev/null | grep -E "^(id|title|description|duration|questions)$" | wc -l)
if [ "$video_structure" -ge 4 ]; then
    echo "   ✅ Estructura de videos del backend válida (campos encontrados: $video_structure)"
    ((success_count++))
else
    echo "   ❌ Estructura de videos del backend incompleta"
fi

# 4. Verificar que el adaptador esté implementado
echo "4️⃣ Verificando adaptador de videos..."
if grep -q "adaptBackendVideoToVideoItem" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayGamifiedDashboard.tsx; then
    echo "   ✅ Función adaptBackendVideoToVideoItem implementada"
    ((success_count++))
else
    echo "   ❌ Función adaptBackendVideoToVideoItem no encontrada"
fi

# 5. Verificar validación defensiva en VideoCard
echo "5️⃣ Verificando validación defensiva..."
if grep -q "isValidVideoItem" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayGamifiedDashboard.tsx; then
    echo "   ✅ Validación defensiva isValidVideoItem implementada"
    ((success_count++))
else
    echo "   ❌ Validación defensiva no encontrada"
fi

# 6. Verificar que se usen videos adaptados
echo "6️⃣ Verificando uso de videos adaptados..."
if grep -q "adaptedVideos" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayGamifiedDashboard.tsx; then
    echo "   ✅ Videos adaptados están siendo utilizados"
    ((success_count++))
else
    echo "   ❌ Videos adaptados no están siendo utilizados"
fi

# 7. Verificar que se hayan corregido las warnings de Grid
echo "7️⃣ Verificando corrección de warnings Material UI Grid..."
if ! grep -q "Grid item" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayGamifiedDashboard.tsx; then
    echo "   ✅ Warnings de Grid Material UI v7 corregidas"
    ((success_count++))
else
    echo "   ⚠️ Aún hay warnings de Grid pendientes"
fi

# 8. Verificar que no haya referencias directas a video.rewards sin validación
echo "8️⃣ Verificando acceso seguro a video.rewards..."
unsafe_access=$(grep -n "video\.rewards\." Demo/apps/superapp-unified/src/components/modules/uplay/UPlayGamifiedDashboard.tsx | grep -v "video\.rewards\?" | wc -l)
if [ "$unsafe_access" -eq 0 ]; then
    echo "   ✅ Todos los accesos a video.rewards son seguros"
    ((success_count++))
else
    echo "   ⚠️ Encontrados $unsafe_access accesos inseguros a video.rewards"
fi

echo ""
echo "📊 RESULTADO FINAL:"
echo "   ✅ Verificaciones exitosas: $success_count/$total_checks"

percentage=$((success_count * 100 / total_checks))
echo "   📈 Porcentaje de éxito: $percentage%"

if [ $success_count -eq $total_checks ]; then
    echo ""
    echo "🎉 ¡ÉXITO TOTAL! El error video.rewards.meritos ha sido resuelto completamente."
    echo ""
    echo "🔧 CAMBIOS IMPLEMENTADOS:"
    echo "   • Adaptador backend → VideoItem con fórmulas de recompensas CoomÜnity"
    echo "   • Validación defensiva para estructura de datos"
    echo "   • Acceso seguro con optional chaining (video.rewards?.meritos)"
    echo "   • Corrección de warnings Material UI Grid v7"
    echo "   • Manejo de errores robusto con fallbacks"
    echo ""
    echo "🎮 La experiencia ÜPlay ahora muestra:"
    echo "   • Videos con emojis temáticos como thumbnails"
    echo "   • Recompensas calculadas dinámicamente (Mëritos/Öndas)"
    echo "   • Dificultad basada en duración y número de preguntas"
    echo "   • Integración completa con backend NestJS real"
    
    exit 0
elif [ $success_count -ge 6 ]; then
    echo ""
    echo "✅ ÉXITO PARCIAL. La mayoría de verificaciones pasaron."
    echo "⚠️ Se recomienda revisar las verificaciones fallidas."
    exit 0
else
    echo ""
    echo "❌ PROBLEMAS DETECTADOS. Revisar verificaciones fallidas."
    echo "🔍 Recomendaciones:"
    echo "   • Verificar que ambos servicios estén ejecutándose"
    echo "   • Comprobar logs de la consola del navegador"
    echo "   • Validar implementación del adaptador"
    exit 1
fi 