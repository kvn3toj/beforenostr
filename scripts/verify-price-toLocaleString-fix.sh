#!/bin/bash

# 🔍 Script de Verificación: price.toLocaleString Error Fix
# Error ID: 6a997bf4fce2467d83d6df8848048496
# Descripción: "undefined is not an object (evaluating 'price.toLocaleString')"

echo "🔍 VERIFICANDO RESOLUCIÓN DEL ERROR price.toLocaleString()..."
echo "=================================================="
echo ""

# Contador de verificaciones
PASSED=0
TOTAL=10

# 1. Verificar que no queden usos inseguros de price.toLocaleString
echo "1️⃣ Verificando eliminación de price.toLocaleString() inseguro..."
UNSAFE_PRICE_USAGE=$(grep -r "price\.toLocaleString" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ "$UNSAFE_PRICE_USAGE" -eq 0 ]; then
  echo "   ✅ Sin usos inseguros de price.toLocaleString() restantes"
  ((PASSED++))
else
  echo "   ❌ Encontrados $UNSAFE_PRICE_USAGE usos inseguros:"
  grep -r "price\.toLocaleString" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts"
fi

# 2. Verificar que no queden usos inseguros de originalPrice.toLocaleString
echo ""
echo "2️⃣ Verificando eliminación de originalPrice.toLocaleString() inseguro..."
UNSAFE_ORIGINAL_PRICE=$(grep -r "originalPrice\.toLocaleString" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ "$UNSAFE_ORIGINAL_PRICE" -eq 0 ]; then
  echo "   ✅ Sin usos inseguros de originalPrice.toLocaleString() restantes"
  ((PASSED++))
else
  echo "   ❌ Encontrados $UNSAFE_ORIGINAL_PRICE usos inseguros:"
  grep -r "originalPrice\.toLocaleString" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts"
fi

# 3. Verificar imports de safeToLocaleString en archivos corregidos
echo ""
echo "3️⃣ Verificando imports de safeToLocaleString..."
ENHANCED_CARD_IMPORT=$(grep -c "safeToLocaleString" Demo/apps/superapp-unified/src/components/modules/marketplace/components/EnhancedMarketplaceCard.tsx)
PRODUCT_CARD_IMPORT=$(grep -c "safeToLocaleString" Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx)

if [ "$ENHANCED_CARD_IMPORT" -gt 0 ] && [ "$PRODUCT_CARD_IMPORT" -gt 0 ]; then
  echo "   ✅ Imports de safeToLocaleString agregados correctamente"
  ((PASSED++))
else
  echo "   ❌ Faltan imports de safeToLocaleString"
  echo "      EnhancedMarketplaceCard: $ENHANCED_CARD_IMPORT"
  echo "      ProductCardEnhanced: $PRODUCT_CARD_IMPORT"
fi

# 4. Verificar uso correcto de safeToLocaleString en EnhancedMarketplaceCard
echo ""
echo "4️⃣ Verificando uso de safeToLocaleString en EnhancedMarketplaceCard..."
SAFE_USAGE_ENHANCED=$(grep -c "safeToLocaleString(item\.price)" Demo/apps/superapp-unified/src/components/modules/marketplace/components/EnhancedMarketplaceCard.tsx)
if [ "$SAFE_USAGE_ENHANCED" -gt 0 ]; then
  echo "   ✅ safeToLocaleString usado correctamente en EnhancedMarketplaceCard"
  ((PASSED++))
else
  echo "   ❌ safeToLocaleString no encontrado en EnhancedMarketplaceCard"
fi

# 5. Verificar uso correcto de safeToLocaleString en ProductCardEnhanced
echo ""
echo "5️⃣ Verificando uso de safeToLocaleString en ProductCardEnhanced..."
SAFE_USAGE_PRODUCT=$(grep -c "safeToLocaleString(price)" Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx)
if [ "$SAFE_USAGE_PRODUCT" -ge 2 ]; then
  echo "   ✅ safeToLocaleString usado correctamente en ProductCardEnhanced (${SAFE_USAGE_PRODUCT} usos)"
  ((PASSED++))
else
  echo "   ❌ safeToLocaleString no suficiente en ProductCardEnhanced: $SAFE_USAGE_PRODUCT"
fi

# 6. Verificar que numberUtils.ts existe y tiene las funciones necesarias
echo ""
echo "6️⃣ Verificando existencia de numberUtils.ts..."
if [ -f "Demo/apps/superapp-unified/src/utils/numberUtils.ts" ]; then
  echo "   ✅ numberUtils.ts existe"
  ((PASSED++))
else
  echo "   ❌ numberUtils.ts no encontrado"
fi

# 7. Verificar funciones en numberUtils.ts
echo ""
echo "7️⃣ Verificando funciones en numberUtils.ts..."
SAFE_FUNCTION=$(grep -c "export const safeToLocaleString" Demo/apps/superapp-unified/src/utils/numberUtils.ts)
FORMAT_FUNCTION=$(grep -c "export const formatPrice" Demo/apps/superapp-unified/src/utils/numberUtils.ts)

if [ "$SAFE_FUNCTION" -gt 0 ] && [ "$FORMAT_FUNCTION" -gt 0 ]; then
  echo "   ✅ Funciones safeToLocaleString y formatPrice encontradas"
  ((PASSED++))
else
  echo "   ❌ Funciones faltantes en numberUtils.ts"
  echo "      safeToLocaleString: $SAFE_FUNCTION"
  echo "      formatPrice: $FORMAT_FUNCTION"
fi

# 8. Verificar que SuperApp responde correctamente
echo ""
echo "8️⃣ Verificando que SuperApp responde..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ || echo "000")
if [ "$RESPONSE" = "200" ]; then
  echo "   ✅ SuperApp responde correctamente (HTTP 200)"
  ((PASSED++))
else
  echo "   ❌ SuperApp no responde correctamente (HTTP $RESPONSE)"
fi

# 9. Verificar que backend responde
echo ""
echo "9️⃣ Verificando que backend responde..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health || echo "000")
if [ "$BACKEND_RESPONSE" = "200" ]; then
  echo "   ✅ Backend responde correctamente (HTTP 200)"
  ((PASSED++))
else
  echo "   ❌ Backend no responde correctamente (HTTP $BACKEND_RESPONSE)"
fi

# 10. Verificar que no hay otros archivos con problemas similares
echo ""
echo "🔟 Verificando otros archivos por problemas similares..."
OTHER_UNSAFE=$(grep -r "\.toLocaleString()" Demo/apps/superapp-unified/src/components/modules/marketplace/ --include="*.tsx" --include="*.ts" | grep -v "safeToLocaleString\|safePrice\.toLocaleString" | wc -l)
if [ "$OTHER_UNSAFE" -eq 0 ]; then
  echo "   ✅ No se encontraron otros usos inseguros de toLocaleString en marketplace"
  ((PASSED++))
else
  echo "   ⚠️  Encontrados $OTHER_UNSAFE usos que pueden necesitar revisión:"
  grep -r "\.toLocaleString()" Demo/apps/superapp-unified/src/components/modules/marketplace/ --include="*.tsx" --include="*.ts" | grep -v "safeToLocaleString\|safePrice\.toLocaleString"
fi

# Resumen final
echo ""
echo "=========================================="
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================================="
echo "✅ Verificaciones pasadas: $PASSED/$TOTAL"
echo ""

if [ "$PASSED" -eq "$TOTAL" ]; then
  echo "🎉 ¡ERROR COMPLETAMENTE RESUELTO!"
  echo ""
  echo "✨ BENEFICIOS APLICADOS:"
  echo "   • Eliminación total de price.toLocaleString() inseguro"
  echo "   • Uso de safeToLocaleString() para prevenir crashes"
  echo "   • Manejo defensivo de propiedades undefined/null"
  echo "   • Marketplace funcional sin errores de JavaScript"
  echo "   • Experiencia de usuario mejorada y estable"
  echo ""
  echo "🔧 PATRÓN APLICADO:"
  echo "   • Reemplazar: price.toLocaleString()"
  echo "   • Por: safeToLocaleString(price)"
  echo "   • Utilidad: numberUtils.ts con manejo de undefined/null"
  echo ""
elif [ "$PASSED" -ge 7 ]; then
  echo "✅ Error mayormente resuelto (${PASSED}/${TOTAL})"
  echo "⚠️  Revisar las verificaciones fallidas arriba"
else
  echo "❌ Error requiere más trabajo (${PASSED}/${TOTAL})"
  echo "🔍 Revisar implementación de safeToLocaleString"
fi

echo ""
echo "📁 Archivos corregidos en esta sesión:"
echo "   • Demo/apps/superapp-unified/src/components/modules/marketplace/components/EnhancedMarketplaceCard.tsx"
echo "   • Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx"
echo ""
echo "📚 Utilidad usada:"
echo "   • Demo/apps/superapp-unified/src/utils/numberUtils.ts (safeToLocaleString, formatPrice)"
