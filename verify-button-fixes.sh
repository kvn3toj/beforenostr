#!/bin/bash

# ===============================================================================
# 🎯 VERIFICACIÓN DE CORRECCIONES PROMPT #097
# ===============================================================================
# 
# Verificar que los 3 botones críticos con console.log han sido corregidos
# con funcionalidad real (navegación y WhatsApp)
# ===============================================================================

set -e

echo "🎯 VERIFICACIÓN DE CORRECCIONES - PROMPT #097"
echo "=============================================="
echo ""

# ===============================================================================
# 1. VERIFICAR MARKETPLACE: CREAR SERVICIO
# ===============================================================================

echo "🏪 1. VERIFICANDO MARKETPLACE - CREAR SERVICIO..."
echo "================================================"

MARKETPLACE_FILE="Demo/apps/superapp-unified/src/components/modules/marketplace/components/MobileMarketplaceView.tsx"

# Verificar que se eliminó el console.log de "Crear servicio"
if grep -q "console.log('Crear servicio')" "$MARKETPLACE_FILE"; then
  echo "❌ FALLO: Aún existe console.log('Crear servicio')"
  MARKETPLACE_STATUS="❌ FALLIDO"
else
  echo "✅ console.log('Crear servicio') eliminado"
  MARKETPLACE_STATUS="✅ PARCIAL"
fi

# Verificar que se agregó la navegación correcta
if grep -q "navigate('/marketplace/create-service')" "$MARKETPLACE_FILE"; then
  echo "✅ Navegación a '/marketplace/create-service' implementada"
  MARKETPLACE_STATUS="✅ COMPLETADO"
else
  echo "⚠️  Navegación no encontrada"
fi

# Verificar que useNavigate está importado
if grep -q "import.*useNavigate.*from 'react-router-dom'" "$MARKETPLACE_FILE"; then
  echo "✅ useNavigate importado correctamente"
else
  echo "❌ useNavigate NO importado"
  MARKETPLACE_STATUS="❌ FALLIDO"
fi

# ===============================================================================
# 2. VERIFICAR MARKETPLACE: WHATSAPP INTEGRATION
# ===============================================================================

echo ""
echo "📱 2. VERIFICANDO MARKETPLACE - WHATSAPP..."
echo "==========================================="

# Verificar que se eliminó el console.log de WhatsApp
if grep -q "console.log('WhatsApp')" "$MARKETPLACE_FILE"; then
  echo "❌ FALLO: Aún existe console.log('WhatsApp')"
  WHATSAPP_STATUS="❌ FALLIDO"
else
  echo "✅ console.log('WhatsApp') eliminado"
  WHATSAPP_STATUS="✅ PARCIAL"
fi

# Verificar que se implementó la integración de WhatsApp
if grep -q "wa.me" "$MARKETPLACE_FILE"; then
  echo "✅ Integración WhatsApp implementada (wa.me)"
  WHATSAPP_STATUS="✅ COMPLETADO"
else
  echo "⚠️  Integración WhatsApp no encontrada"
fi

# Verificar que se usa window.open
if grep -q "window.open.*whatsappUrl" "$MARKETPLACE_FILE"; then
  echo "✅ window.open para WhatsApp implementado"
else
  echo "⚠️  window.open no encontrado"
fi

# ===============================================================================
# 3. VERIFICAR SOCIAL: NOTIFICACIONES
# ===============================================================================

echo ""
echo "🤝 3. VERIFICANDO SOCIAL - NOTIFICACIONES..."
echo "============================================"

SOCIAL_FILE="Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx"

# Verificar que se eliminó el console.log de notificaciones
if grep -q "console.log('Ver notificaciones')" "$SOCIAL_FILE"; then
  echo "❌ FALLO: Aún existe console.log('Ver notificaciones')"
  SOCIAL_STATUS="❌ FALLIDO"
else
  echo "✅ console.log('Ver notificaciones') eliminado"
  SOCIAL_STATUS="✅ PARCIAL"
fi

# Verificar que se agregó la navegación correcta
if grep -q "navigate('/social/notifications')" "$SOCIAL_FILE"; then
  echo "✅ Navegación a '/social/notifications' implementada"
  SOCIAL_STATUS="✅ COMPLETADO"
else
  echo "⚠️  Navegación no encontrada"
fi

# Verificar que useNavigate está importado en Social
if grep -q "import.*useNavigate.*from 'react-router-dom'" "$SOCIAL_FILE"; then
  echo "✅ useNavigate importado en SocialMain"
else
  echo "❌ useNavigate NO importado en SocialMain"
  SOCIAL_STATUS="❌ FALLIDO"
fi

# ===============================================================================
# 4. VERIFICAR CHAT: WEBSOCKET CALLBACKS
# ===============================================================================

echo ""
echo "💬 4. VERIFICANDO CHAT - WEBSOCKET CALLBACKS..."
echo "==============================================="

CHAT_FILE="Demo/apps/superapp-unified/src/components/modules/social/components/ChatArea.tsx"

# Verificar que se eliminaron los callbacks vacíos
if grep -q "() => {}, () => {}" "$CHAT_FILE"; then
  echo "❌ FALLO: Aún existen callbacks vacíos () => {}"
  CHAT_STATUS="❌ FALLIDO"
else
  echo "✅ Callbacks vacíos eliminados"
  CHAT_STATUS="✅ PARCIAL"
fi

# Verificar que se implementaron callbacks reales
if grep -q "console.log.*Mensaje recibido en reconexión" "$CHAT_FILE"; then
  echo "✅ Callback de mensajes implementado"
  CHAT_STATUS="✅ COMPLETADO"
else
  echo "⚠️  Callback de mensajes no encontrado"
fi

if grep -q "setConnectionStatus.*status" "$CHAT_FILE"; then
  echo "✅ Callback de estado implementado"
else
  echo "⚠️  Callback de estado no encontrado"
fi

# ===============================================================================
# 5. RESUMEN FINAL
# ===============================================================================

echo ""
echo "📊 RESUMEN FINAL DE VERIFICACIONES"
echo "=================================="
echo ""
echo "🏪 Marketplace - Crear Servicio: $MARKETPLACE_STATUS"
echo "📱 Marketplace - WhatsApp:       $WHATSAPP_STATUS"
echo "🤝 Social - Notificaciones:      $SOCIAL_STATUS"
echo "💬 Chat - WebSocket Callbacks:   $CHAT_STATUS"
echo ""

# Contar éxitos
SUCCESS_COUNT=0
if [[ "$MARKETPLACE_STATUS" == "✅ COMPLETADO" ]]; then
  SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi
if [[ "$WHATSAPP_STATUS" == "✅ COMPLETADO" ]]; then
  SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi
if [[ "$SOCIAL_STATUS" == "✅ COMPLETADO" ]]; then
  SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi
if [[ "$CHAT_STATUS" == "✅ COMPLETADO" ]]; then
  SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi

# ===============================================================================
# 6. EVALUACIÓN GENERAL
# ===============================================================================

echo "🎯 EVALUACIÓN GENERAL"
echo "====================="
echo "Correcciones exitosas: $SUCCESS_COUNT/4"
echo ""

if [ "$SUCCESS_COUNT" -eq 4 ]; then
  echo "🎉 ¡TODAS LAS CORRECCIONES APLICADAS EXITOSAMENTE!"
  echo "✨ Los 4 botones problemáticos ahora tienen funcionalidad real"
  echo "🚀 UX mejorada: console.log → Navegación y acciones reales"
  echo ""
  echo "🎯 PRÓXIMOS PASOS RECOMENDADOS:"
  echo "1. Probar navegación: /marketplace/create-service"
  echo "2. Probar navegación: /social/notifications"
  echo "3. Verificar WhatsApp se abre correctamente"
  echo "4. Probar reconexión de WebSocket en chat"
  FINAL_STATUS="🎉 COMPLETADO"
elif [ "$SUCCESS_COUNT" -ge 2 ]; then
  echo "✅ CORRECCIONES MAYORMENTE EXITOSAS"
  echo "⚠️  $((4 - SUCCESS_COUNT)) elementos requieren revisión adicional"
  FINAL_STATUS="✅ PARCIAL"
else
  echo "❌ MÚLTIPLES CORRECCIONES FALLARON"
  echo "🔧 Revisar implementaciones y dependencias"
  FINAL_STATUS="❌ FALLIDO"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎯 PROMPT #097 STATUS: $FINAL_STATUS"
echo "🧹 CÓDIGO LIMPIO: $SUCCESS_COUNT/4 botones corregidos"
echo "✨ UX MEJORADA: console.log → Funcionalidad real"
echo "═══════════════════════════════════════════════════════" 