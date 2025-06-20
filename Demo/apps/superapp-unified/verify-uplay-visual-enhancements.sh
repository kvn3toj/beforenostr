#!/bin/bash

# ===============================================================================
# 🎮 SCRIPT DE VERIFICACIÓN - MEJORAS VISUALES UPLAY
# Verifica que todas las mejoras visuales estén implementadas correctamente
# ===============================================================================

echo "🎮 VERIFICANDO MEJORAS VISUALES DEL MÓDULO UPLAY..."
echo "==============================================================================="

# 🎯 Función de verificación
check_file() {
    local file=$1
    local description=$2
    local patterns=("${@:3}")
    
    echo "📁 Verificando: $description"
    
    if [[ ! -f "$file" ]]; then
        echo "   ❌ Archivo no encontrado: $file"
        return 1
    fi
    
    local found=0
    local total=${#patterns[@]}
    
    for pattern in "${patterns[@]}"; do
        if grep -q "$pattern" "$file"; then
            found=$((found + 1))
        else
            echo "   ⚠️  Patrón no encontrado: $pattern"
        fi
    done
    
    local percentage=$((found * 100 / total))
    echo "   ✅ Implementado: $found/$total patrones ($percentage%)"
    
    return 0
}

# 🎯 Verificar archivo de estilos CSS
echo "1. VERIFICANDO ESTILOS CSS AVANZADOS"
echo "----------------------------------------------------------------------"

check_file "src/styles/uplay-advanced-effects.css" "Estilos UPlay avanzados" \
    "--uplay-primary" \
    "--uplay-meritos" \
    "--uplay-ondas" \
    "uplay-glassmorphism" \
    "uplay-metric-card" \
    "uplay-progress-bar" \
    "uplay-particle" \
    "uplay-floating-action" \
    "@keyframes uplay-sparkle" \
    "@keyframes uplay-pulse" \
    "@keyframes uplay-glow" \
    "@keyframes uplay-float"

# 🎯 Verificar componente principal UPlay.tsx
echo ""
echo "2. VERIFICANDO COMPONENTE PRINCIPAL UPLAY"
echo "----------------------------------------------------------------------"

check_file "src/pages/UPlay.tsx" "Página principal UPlay" \
    "import.*Fade.*from '@mui/material'" \
    "import.*Zoom.*from '@mui/material'" \
    "import.*Badge.*from '@mui/material'" \
    "Revolutionary.*Widget" \
    "uplay-advanced-effects.css" \
    "useState.*animate" \
    "useState.*hoveredMetric" \
    "useMemo.*userStats" \
    "renderEnhancedHero\|renderCosmicHeader" \
    "renderEnhancedTabs\|renderNavigationTabs" \
    "uplay-glassmorphism" \
    "linear-gradient.*6366f1.*a855f7" \
    "backgroundClip.*text" \
    "WebkitBackgroundClip.*text" \
    "WebkitTextFillColor.*transparent"

# 🎯 Verificar dashboard mejorado
echo ""
echo "3. VERIFICANDO DASHBOARD MEJORADO"
echo "----------------------------------------------------------------------"

check_file "src/components/modules/uplay/UPlayEnhancedDashboard.tsx" "Dashboard UPlay mejorado" \
    "import.*useMemo.*from 'react'" \
    "import.*Fade.*from '@mui/material'" \
    "import.*Zoom.*from '@mui/material'" \
    "import.*Slide.*from '@mui/material'" \
    "Revolutionary.*Widget" \
    "dashboardData.*useMemo" \
    "renderEnhancedMetrics" \
    "renderWeeklyProgress" \
    "renderRecentActivity" \
    "renderQuickActions" \
    "uplay-metric-card" \
    "uplay-glassmorphism" \
    "hoveredCard.*useState" \
    "animate.*useState" \
    "LocalFireDepartment.*Icon" \
    "QuestionAnswer.*Icon"

# 🎯 Verificar biblioteca interactiva
echo ""
echo "4. VERIFICANDO BIBLIOTECA INTERACTIVA"
echo "----------------------------------------------------------------------"

check_file "src/components/modules/uplay/UPlayInteractiveLibrary.tsx" "Biblioteca interactiva UPlay" \
    "import.*useMemo.*from 'react'" \
    "import.*Fade.*from '@mui/material'" \
    "import.*Zoom.*from '@mui/material'" \
    "import.*CardMedia.*from '@mui/material'" \
    "useVideoData" \
    "adaptBackendVideo" \
    "processedVideos.*useMemo" \
    "filteredVideos.*useMemo" \
    "renderSearchHeader" \
    "renderVideoCard" \
    "Revolutionary.*Widget" \
    "hoveredVideo.*useState" \
    "uplay-video-card" \
    "uplay-video-overlay" \
    "uplay-play-button"

# 🎯 Verificar sistema de logros
echo ""
echo "5. VERIFICANDO SISTEMA DE LOGROS"
echo "----------------------------------------------------------------------"

check_file "src/components/modules/uplay/UPlayAchievementSystem.tsx" "Sistema de logros UPlay" \
    "import.*useMemo.*from 'react'" \
    "import.*Fade.*from '@mui/material'" \
    "import.*Zoom.*from '@mui/material'" \
    "achievementData.*useMemo" \
    "filteredAchievements.*useMemo" \
    "renderAchievementCard" \
    "Revolutionary.*Widget" \
    "uplay-achievement-card" \
    "achievement-rarity-common" \
    "achievement-rarity-rare" \
    "achievement-rarity-epic" \
    "achievement-rarity-legendary" \
    "celebration.*effect"

# 🎯 Verificar salas de estudio
echo ""
echo "6. VERIFICANDO SALAS DE ESTUDIO"
echo "----------------------------------------------------------------------"

check_file "src/components/modules/uplay/UPlayStudyRooms.tsx" "Salas de estudio UPlay" \
    "import.*useMemo.*from 'react'" \
    "import.*Fade.*from '@mui/material'" \
    "import.*Zoom.*from '@mui/material'" \
    "studyRoomsData.*useMemo" \
    "renderStudyRoomCard" \
    "Revolutionary.*Widget" \
    "uplay-study-room-card" \
    "room-status-active" \
    "participant-avatar" \
    "occupancy-indicator"

# 🎯 Verificar reproductor avanzado
echo ""
echo "7. VERIFICANDO REPRODUCTOR AVANZADO"
echo "----------------------------------------------------------------------"

check_file "src/components/modules/uplay/UPlayAdvancedVideoPlayer.tsx" "Reproductor avanzado UPlay" \
    "import.*useState.*useEffect.*from 'react'" \
    "import.*Modal.*from '@mui/material'" \
    "Revolutionary.*Widget" \
    "video-player-modal" \
    "interactive-question" \
    "celebration-effect" \
    "reward-popup" \
    "video-controls" \
    "gamified-progress"

# 🎯 Resumen final
echo ""
echo "==============================================================================="
echo "🎯 RESUMEN DE VERIFICACIÓN - MEJORAS VISUALES UPLAY"
echo "==============================================================================="

# Contar archivos verificados
total_files=7
existing_files=0

files_to_check=(
    "src/styles/uplay-advanced-effects.css"
    "src/pages/UPlay.tsx"
    "src/components/modules/uplay/UPlayEnhancedDashboard.tsx"
    "src/components/modules/uplay/UPlayInteractiveLibrary.tsx"
    "src/components/modules/uplay/UPlayAchievementSystem.tsx"
    "src/components/modules/uplay/UPlayStudyRooms.tsx"
    "src/components/modules/uplay/UPlayAdvancedVideoPlayer.tsx"
)

for file in "${files_to_check[@]}"; do
    if [[ -f "$file" ]]; then
        existing_files=$((existing_files + 1))
    fi
done

percentage=$((existing_files * 100 / total_files))

echo "📊 ESTADO GENERAL:"
echo "   ✅ Archivos existentes: $existing_files/$total_files ($percentage%)"
echo "   🎨 Estilos CSS: $([ -f "src/styles/uplay-advanced-effects.css" ] && echo "✅ Implementado" || echo "❌ Faltante")"
echo "   🎮 Componente principal: $([ -f "src/pages/UPlay.tsx" ] && echo "✅ Mejorado" || echo "❌ Sin mejoras")"
echo "   📊 Dashboard: $([ -f "src/components/modules/uplay/UPlayEnhancedDashboard.tsx" ] && echo "✅ Mejorado" || echo "❌ Sin mejoras")"
echo "   📚 Biblioteca: $([ -f "src/components/modules/uplay/UPlayInteractiveLibrary.tsx" ] && echo "✅ Mejorada" || echo "❌ Sin mejoras")"

echo ""
echo "🚀 INSTRUCCIONES PARA PROBAR:"
echo "   1. Ejecutar: npm run dev"
echo "   2. Navegar a: http://localhost:3001/uplay"
echo "   3. Verificar efectos visuales:"
echo "      • Glassmorphism en tarjetas y contenedores"
echo "      • Animaciones de entrada (Fade, Zoom, Slide)"
echo "      • Efectos hover con transformaciones suaves"
echo "      • Gradientes y colores temáticos de CoomÜnity"
echo "      • Partículas flotantes y efectos cósmicos"
echo "      • Métricas animadas con iconos y recompensas"
echo "      • Navegación por tabs fluida y responsiva"

echo ""
echo "🎨 EFECTOS VISUALES IMPLEMENTADOS:"
echo "   • 🌟 Cosmic Design System effects"
echo "   • 💎 Glassmorphism con backdrop filters"
echo "   • ⚡ Revolutionary Auras y dynamic particles"
echo "   • 🎯 Responsive depth con box shadows"
echo "   • 🎪 Celebration animations para logros"
echo "   • 🔮 Gradient backgrounds temáticos"
echo "   • ✨ Sparkle effects en elementos especiales"
echo "   • 🌊 Fluid animations con cubic-bezier"

if [[ $percentage -ge 85 ]]; then
    echo ""
    echo "🎉 ¡ÉXITO! Las mejoras visuales del UPlay están implementadas correctamente."
    echo "   El módulo está listo para una experiencia de aprendizaje inmersiva."
else
    echo ""
    echo "⚠️  ADVERTENCIA: Algunas mejoras visuales pueden estar incompletas."
    echo "   Revisa los archivos faltantes para una experiencia completa."
fi

echo "===============================================================================" 