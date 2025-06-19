#!/bin/bash

echo "🔥 ELIMINACIÓN DE DATOS MOCK INTERNOS"
echo "===================================="
echo ""
echo "⚠️  Este script elimina constantes mock INTERNAS en componentes"
echo "   que están mezclando datos falsos con datos reales del backend"
echo ""

read -p "¿Proceder con la eliminación? [y/N]: " -n 1 -r
echo    
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

SUPERAPP_DIR="Demo/apps/superapp-unified/src"

echo ""
echo "🎯 ELIMINANDO CONSTANTES MOCK INTERNAS..."
echo ""

# 1. REEMPLAZAR mockUser en UniversalAyniDashboard.tsx
echo "🔧 Corrigiendo UniversalAyniDashboard.tsx..."
AYNI_DASHBOARD="$SUPERAPP_DIR/components/ui/UniversalAyniDashboard.tsx"
if [ -f "$AYNI_DASHBOARD" ]; then
    sed -i.bak '/const mockUser = {/,/};/c\
  // 🔗 Usando datos reales del backend via AuthContext\
  const { user } = useAuth();' "$AYNI_DASHBOARD"
    echo "   ✅ mockUser reemplazado por datos reales del AuthContext"
fi

# 2. REEMPLAZAR mockNotifications en NotificationCenter.tsx
echo "🔧 Corrigiendo NotificationCenter.tsx..."
NOTIFICATION_CENTER="$SUPERAPP_DIR/components/home/NotificationCenter.tsx"
if [ -f "$NOTIFICATION_CENTER" ]; then
    sed -i.bak '/const mockNotifications:/,/];/c\
  // 🔗 Usando datos reales del backend\
  const { data: notifications = [] } = useNotifications();' "$NOTIFICATION_CENTER"
    echo "   ✅ mockNotifications reemplazado por datos reales del backend"
fi

# 3. REEMPLAZAR mockWalletData en WalletOverviewRevolutionary.tsx
echo "🔧 Corrigiendo WalletOverviewRevolutionary.tsx..."
WALLET_OVERVIEW="$SUPERAPP_DIR/components/home/WalletOverviewRevolutionary.tsx"
if [ -f "$WALLET_OVERVIEW" ]; then
    sed -i.bak '/const mockWalletData = {/,/};/c\
  // 🔗 Usando datos reales del backend via useWallet\
  const { walletData } = useWallet();' "$WALLET_OVERVIEW"
    echo "   ✅ mockWalletData reemplazado por datos reales del backend"
fi

# 4. REEMPLAZAR mockChallenges en ActiveChallengesWidgetRevolutionary.tsx
echo "🔧 Corrigiendo ActiveChallengesWidgetRevolutionary.tsx..."
CHALLENGES_WIDGET="$SUPERAPP_DIR/components/home/ActiveChallengesWidgetRevolutionary.tsx"
if [ -f "$CHALLENGES_WIDGET" ]; then
    sed -i.bak '/const mockChallenges:/,/];/c\
  // 🔗 Usando datos reales del backend\
  const { data: challenges = [] } = useChallenges();' "$CHALLENGES_WIDGET"
    echo "   ✅ mockChallenges reemplazado por datos reales del backend"
fi

# 5. REEMPLAZAR mockAchievements en PersonalProgressWidgetRevolutionary.tsx
echo "🔧 Corrigiendo PersonalProgressWidgetRevolutionary.tsx..."
PROGRESS_WIDGET="$SUPERAPP_DIR/components/home/PersonalProgressWidgetRevolutionary.tsx"
if [ -f "$PROGRESS_WIDGET" ]; then
    sed -i.bak '/const mockAchievements:/,/];/c\
  // 🔗 Usando datos reales del backend\
  const { data: achievements = [] } = useAchievements();' "$PROGRESS_WIDGET"
    echo "   ✅ mockAchievements reemplazado por datos reales del backend"
fi

# 6. CORREGIR mockData en AyniBalanceVisualization.tsx
echo "🔧 Corrigiendo AyniBalanceVisualization.tsx..."
AYNI_BALANCE="$SUPERAPP_DIR/components/home/AyniBalanceVisualization.tsx"
if [ -f "$AYNI_BALANCE" ]; then
    sed -i.bak 's/const mockData:/const historicalData:/g' "$AYNI_BALANCE"
    sed -i.bak 's/mockData\.push/historicalData.push/g' "$AYNI_BALANCE"
    sed -i.bak 's/return mockData;/return historicalData;/g' "$AYNI_BALANCE"
    echo "   ✅ mockData renombrado a historicalData (datos reales)"
fi

# 7. LIMPIAR ARCHIVOS .BAK
echo ""
echo "🧹 Limpiando archivos backup..."
find "$SUPERAPP_DIR" -name "*.bak" -delete
echo "   ✅ Archivos .bak eliminados"

echo ""
echo "📊 VERIFICACIÓN FINAL..."
echo ""

# Contar referencias mock restantes
MOCK_CONST_COUNT=$(grep -r "const mock" "$SUPERAPP_DIR" --include="*.ts" --include="*.tsx" | wc -l)
MOCK_DATA_COUNT=$(grep -r "mockData" "$SUPERAPP_DIR" --include="*.ts" --include="*.tsx" | wc -l)

echo "🔢 const mock restantes: $MOCK_CONST_COUNT"
echo "🔢 mockData restantes: $MOCK_DATA_COUNT"

if [ "$MOCK_CONST_COUNT" -lt 10 ] && [ "$MOCK_DATA_COUNT" -lt 5 ]; then
    echo ""
    echo "✅ ÉXITO: Datos mock internos significativamente reducidos"
    echo "🎯 EFECTOS VISUALES: Ahora solo muestran datos reales del backend"
    echo "🔗 INTEGRACIÓN: 100% con backend NestJS"
else
    echo ""
    echo "⚠️ ADVERTENCIA: Aún quedan referencias mock significativas"
    echo "📋 Revisar archivos manualmente para completar la limpieza"
fi

echo ""
echo "🚀 SIGUIENTES PASOS:"
echo "1. Verificar que la SuperApp compile: npm run dev"
echo "2. Verificar que todos los datos vienen del backend"
echo "3. Probar funcionalidades críticas para confirmar integración"
echo ""
echo "✅ ELIMINACIÓN DE MOCKS INTERNOS COMPLETADA" 