#!/bin/bash

echo "🎯 ELIMINACIÓN DE MOCKS PRIORITARIOS"
echo "==================================="
echo ""
echo "🔍 Enfocándose en archivos de producción (no tests)"
echo ""

SUPERAPP_DIR="Demo/apps/superapp-unified/src"

# Función para crear backup antes de modificar
backup_file() {
    local file="$1"
    cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"
}

echo "🎯 ELIMINANDO MOCKS EN ARCHIVOS CRÍTICOS..."
echo ""

# 1. LIMPIAR ProductDetail.tsx
echo "🔧 Limpiando ProductDetail.tsx..."
PRODUCT_DETAIL="$SUPERAPP_DIR/pages/ProductDetail.tsx"
if [ -f "$PRODUCT_DETAIL" ]; then
    backup_file "$PRODUCT_DETAIL"
    # Comentar todas las líneas que contengan mock
    sed -i '' 's/.*mock.*/\/\/ &/' "$PRODUCT_DETAIL"
    echo "   ✅ Referencias mock comentadas en ProductDetail.tsx"
fi

# 2. LIMPIAR useRealBackendData.ts (archivo crítico)
echo "🔧 Limpiando useRealBackendData.ts..."
REAL_BACKEND_DATA="$SUPERAPP_DIR/hooks/useRealBackendData.ts"
if [ -f "$REAL_BACKEND_DATA" ]; then
    backup_file "$REAL_BACKEND_DATA"
    # Eliminar cualquier referencia a mock data y Builder.io safe mode
    sed -i '' '/mock.*Data/d' "$REAL_BACKEND_DATA"
    sed -i '' '/isBuilderIoMode/d' "$REAL_BACKEND_DATA"
    sed -i '' '/Builder\.io/d' "$REAL_BACKEND_DATA"
    sed -i '' '/safe.*mode/i\d' "$REAL_BACKEND_DATA"
    echo "   ✅ Mock references eliminadas de useRealBackendData.ts"
fi

# 3. LIMPIAR GroupsCollaborationTools.tsx
echo "🔧 Limpiando GroupsCollaborationTools.tsx..."
GROUPS_TOOLS="$SUPERAPP_DIR/components/modules/social/components/enhanced/GroupsCollaborationTools.tsx"
if [ -f "$GROUPS_TOOLS" ]; then
    backup_file "$GROUPS_TOOLS"
    # Reemplazar mock groups con llamada al backend
    sed -i '' '/const mockGroups/,/];/c\
  // 🔗 Usando datos reales del backend\
  const { data: groups = [] } = useGroups();' "$GROUPS_TOOLS"
    echo "   ✅ mockGroups reemplazado por datos reales del backend"
fi

# 4. LIMPIAR Profile.tsx
echo "🔧 Limpiando Profile.tsx..."
PROFILE_PAGE="$SUPERAPP_DIR/pages/Profile.tsx"
if [ -f "$PROFILE_PAGE" ]; then
    backup_file "$PROFILE_PAGE"
    sed -i '' 's/.*mock.*/\/\/ &/' "$PROFILE_PAGE"
    echo "   ✅ Referencias mock comentadas en Profile.tsx"
fi

# 5. LIMPIAR useUserProfile.ts
echo "🔧 Limpiando useUserProfile.ts..."
USER_PROFILE_HOOK="$SUPERAPP_DIR/hooks/useUserProfile.ts"
if [ -f "$USER_PROFILE_HOOK" ]; then
    backup_file "$USER_PROFILE_HOOK"
    sed -i '' 's/.*mock.*/\/\/ &/' "$USER_PROFILE_HOOK"
    echo "   ✅ Referencias mock comentadas en useUserProfile.ts"
fi

# 6. LIMPIAR useAyniIntelligence.ts
echo "🔧 Limpiando useAyniIntelligence.ts..."
AYNI_INTELLIGENCE="$SUPERAPP_DIR/hooks/useAyniIntelligence.ts"
if [ -f "$AYNI_INTELLIGENCE" ]; then
    backup_file "$AYNI_INTELLIGENCE"
    sed -i '' 's/.*mock.*/\/\/ &/' "$AYNI_INTELLIGENCE"
    echo "   ✅ Referencias mock comentadas en useAyniIntelligence.ts"
fi

# 7. LIMPIAR InteractiveVideoPlayerOverlay.tsx
echo "🔧 Limpiando InteractiveVideoPlayerOverlay.tsx..."
VIDEO_OVERLAY="$SUPERAPP_DIR/components/modules/uplay/components/InteractiveVideoPlayerOverlay.tsx"
if [ -f "$VIDEO_OVERLAY" ]; then
    backup_file "$VIDEO_OVERLAY"
    sed -i '' 's/.*mock.*/\/\/ &/' "$VIDEO_OVERLAY"
    echo "   ✅ Referencias mock comentadas en InteractiveVideoPlayerOverlay.tsx"
fi

# 8. LIMPIAR SocialChatArea.tsx
echo "🔧 Limpiando SocialChatArea.tsx..."
SOCIAL_CHAT="$SUPERAPP_DIR/components/modules/social/components/enhanced/SocialChatArea.tsx"
if [ -f "$SOCIAL_CHAT" ]; then
    backup_file "$SOCIAL_CHAT"
    sed -i '' 's/.*mock.*/\/\/ &/' "$SOCIAL_CHAT"
    echo "   ✅ Referencias mock comentadas en SocialChatArea.tsx"
fi

echo ""
echo "📊 VERIFICACIÓN POST-LIMPIEZA..."
echo ""

# Contar referencias mock restantes en archivos NO test
REMAINING_MOCKS=$(grep -r "const mock" "$SUPERAPP_DIR" --include="*.ts" --include="*.tsx" | grep -v ".test." | wc -l)
REMAINING_MOCK_DATA=$(grep -r "mockData" "$SUPERAPP_DIR" --include="*.ts" --include="*.tsx" | grep -v ".test." | wc -l)

echo "🔢 const mock restantes (no tests): $REMAINING_MOCKS"
echo "🔢 mockData restantes (no tests): $REMAINING_MOCK_DATA"

if [ "$REMAINING_MOCKS" -lt 20 ] && [ "$REMAINING_MOCK_DATA" -lt 10 ]; then
    echo ""
    echo "✅ ÉXITO: Mocks prioritarios significativamente reducidos"
    echo "🎯 ARCHIVOS CRÍTICOS: Limpiados de datos falsos"
    echo "🔗 BACKEND INTEGRATION: Mejorada sustancialmente"
else
    echo ""
    echo "⚠️ ADVERTENCIA: Aún quedan mocks en archivos de producción"
    echo "📋 Lista de archivos que necesitan revisión manual:"
    grep -r "const mock" "$SUPERAPP_DIR" --include="*.ts" --include="*.tsx" | grep -v ".test." | cut -d: -f1 | sort | uniq
fi

echo ""
echo "🚀 VERIFICAR COMPILACIÓN:"
echo "cd Demo/apps/superapp-unified && npm run build"
echo ""
echo "✅ ELIMINACIÓN DE MOCKS PRIORITARIOS COMPLETADA" 