#!/bin/bash

# 🔧 VERIFICACIÓN: WebSocket JWT Authentication Fix
# Verifica que StudyRoomsGateway tenga acceso correcto a JwtService

echo "🔧 VERIFICACIÓN: WebSocket JWT Authentication Fix"
echo "================================================"

failed_tests=0

echo ""
echo "📋 Verificando configuración de módulos..."
echo ""

# 1. Verificar que StudyRoomsModule NO tenga JwtModule.register duplicado
STUDY_ROOMS_MODULE="backend/src/study-rooms/study-rooms.module.ts"
if grep -q "JwtModule.register" "$STUDY_ROOMS_MODULE"; then
    echo "❌ StudyRoomsModule - Aún tiene JwtModule.register duplicado"
    ((failed_tests++))
else
    echo "✅ StudyRoomsModule - NO tiene JwtModule.register duplicado"
fi

# 2. Verificar que StudyRoomsModule importa AuthModule
if grep -q "import.*AuthModule" "$STUDY_ROOMS_MODULE"; then
    echo "✅ StudyRoomsModule - Importa AuthModule correctamente"
else
    echo "❌ StudyRoomsModule - NO importa AuthModule"
    ((failed_tests++))
fi

# 3. Verificar que AuthModule exporta JwtService
AUTH_MODULE="backend/src/auth/auth.module.ts"
if grep -q "JwtService" "$AUTH_MODULE" && grep -A5 "exports:" "$AUTH_MODULE" | grep -q "JwtService"; then
    echo "✅ AuthModule - Exporta JwtService correctamente"
else
    echo "❌ AuthModule - NO exporta JwtService"
    ((failed_tests++))
fi

# 4. Verificar que StudyRoomsGateway tiene debugging activo
GATEWAY_FILE="backend/src/study-rooms/study-rooms.gateway.ts"
if grep -q "JwtService injected" "$GATEWAY_FILE"; then
    echo "✅ StudyRoomsGateway - Tiene debugging de JwtService"
else
    echo "❌ StudyRoomsGateway - NO tiene debugging de JwtService"
    ((failed_tests++))
fi

echo ""
echo "🌐 Verificando servicios del backend..."
echo ""

# 5. Verificar que el backend esté ejecutándose
BACKEND_URL="http://localhost:3002"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend - Responde correctamente en puerto 3002"
else
    echo "⚠️ Backend - No disponible (HTTP $BACKEND_STATUS)"
    echo "   Para probar completamente, ejecuta: npm run dev:backend"
fi

# 6. Verificar logs del backend para errores de JwtService
echo ""
echo "🔍 Instrucciones para verificar logs del backend:"
echo ""
echo "Después de reiniciar el backend, busca en los logs:"
echo "✅ ESPERADO: 'JwtService injected: true'"
echo "❌ PROBLEMÁTICO: 'CRITICAL: JwtService is undefined'"
echo ""
echo "Para reiniciar el backend:"
echo "  npm run dev:backend"
echo ""

# 7. Resumen de resultados
echo "📊 RESUMEN DE RESULTADOS"
echo "========================"

if [ $failed_tests -eq 0 ]; then
    echo "🎉 ¡ÉXITO TOTAL! Todas las verificaciones pasaron ($failed_tests errores)"
    echo ""
    echo "🔧 PRÓXIMOS PASOS:"
    echo "1. Reiniciar el backend: npm run dev:backend"
    echo "2. Verificar logs: buscar 'JwtService injected: true'"
    echo "3. Probar WebSocket desde SuperApp"
    echo ""
    echo "🎯 El problema de 'JwtService is undefined' debería estar RESUELTO"
else
    echo "❌ FALLÓ: $failed_tests verificaciones fallaron"
    echo ""
    echo "🔧 ACCIONES REQUERIDAS:"
    if grep -q "JwtModule.register" "$STUDY_ROOMS_MODULE"; then
        echo "• Eliminar JwtModule.register de StudyRoomsModule"
    fi
    if ! grep -A5 "exports:" "$AUTH_MODULE" | grep -q "JwtService"; then
        echo "• Agregar JwtService a exports de AuthModule"
    fi
fi

echo ""
echo "📝 DOCUMENTACIÓN:"
echo "El problema era causado por dependencias duplicadas de JwtModule."
echo "StudyRoomsModule tenía su propio JwtModule.register() además de importar AuthModule."
echo "La solución es usar SOLO AuthModule que exporta tanto JwtModule como JwtService."
