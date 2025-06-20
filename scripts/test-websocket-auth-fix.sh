#!/bin/bash

# 🔧 Script de Verificación: WebSocket Authentication Fix
# Verifica que StudyRoomsGateway esté usando AuthModule correctamente

echo "🔧 VERIFICACIÓN: WebSocket Authentication Fix"
echo "============================================="

failed_tests=0

echo ""
echo "📋 Verificando configuración de módulos..."
echo ""

# 1. Verificar que StudyRoomsModule usa AuthModule
STUDY_ROOMS_MODULE="src/study-rooms/study-rooms.module.ts"
if grep -q "import.*AuthModule" "$STUDY_ROOMS_MODULE"; then
    echo "✅ StudyRoomsModule - Importa AuthModule"
else
    echo "❌ StudyRoomsModule - NO importa AuthModule"
    ((failed_tests++))
fi

# Verificar que NO usa JwtModule directamente
if grep -q "JwtModule.register" "$STUDY_ROOMS_MODULE"; then
    echo "❌ StudyRoomsModule - Aún usa JwtModule.register directamente"
    ((failed_tests++))
else
    echo "✅ StudyRoomsModule - No usa JwtModule directamente"
fi

# 2. Verificar que AuthModule exporta JwtModule
AUTH_MODULE="src/auth/auth.module.ts"
if grep -q "JwtModule" "$AUTH_MODULE" | grep -q "exports"; then
    echo "✅ AuthModule - Exporta JwtModule"
else
    echo "❌ AuthModule - NO exporta JwtModule"
    ((failed_tests++))
fi

# 3. Verificar debugging en StudyRoomsGateway
GATEWAY_FILE="src/study-rooms/study-rooms.gateway.ts"
if grep -q "JwtService injected" "$GATEWAY_FILE"; then
    echo "✅ StudyRoomsGateway - Tiene debugging de inyección"
else
    echo "❌ StudyRoomsGateway - NO tiene debugging de inyección"
    ((failed_tests++))
fi

echo ""
echo "🌐 Verificando servicios del backend..."
echo ""

# 4. Verificar que el backend esté ejecutándose
BACKEND_URL="http://localhost:3002"
if curl -s "$BACKEND_URL/health" > /dev/null; then
    echo "✅ Backend NestJS - Respondiendo en $BACKEND_URL"
    
    # 5. Verificar logs del backend para el debugging
    echo ""
    echo "📋 Instrucciones para verificar logs del backend:"
    echo "1. En la terminal del backend, buscar estos mensajes al iniciar:"
    echo "   - '>>> StudyRoomsGateway constructor initialized'"
    echo "   - '>>> JwtService injected: true'"
    echo "   - '>>> PrismaService injected: true'"
    echo ""
    echo "2. Si JwtService injected es 'false', el problema persiste"
    echo "3. Si es 'true', el problema está resuelto"
    
else
    echo "❌ Backend NestJS - No responde en $BACKEND_URL"
    echo "   📝 Inicia el backend: npm run dev:backend"
    ((failed_tests++))
fi

echo ""
echo "🧪 PRUEBA MANUAL RECOMENDADA"
echo "============================"
echo ""
echo "Para verificar que el WebSocket auth funciona:"
echo ""
echo "1. 🚀 Iniciar backend (si no está iniciado):"
echo "   npm run dev:backend"
echo ""
echo "2. 🚀 Iniciar SuperApp:"
echo "   npm run dev:superapp"
echo ""
echo "3. 🔐 Login en la SuperApp:"
echo "   - Ir a: http://localhost:3001/login"
echo "   - Usar: admin@gamifier.com / admin123"
echo ""
echo "4. 🎮 Navegar a UPlay:"
echo "   - Ir a: http://localhost:3001/uplay"
echo "   - Intentar abrir una Study Room"
echo ""
echo "5. 📋 Verificar logs del backend:"
echo "   - Buscar: '>>> StudyRoomsGateway constructor initialized'"
echo "   - Buscar: '>>> User [nombre] connected to study rooms WebSocket'"
echo "   - NO debe haber: 'Cannot read properties of undefined (reading verify)'"
echo ""

echo "💡 SÍNTOMAS DE ÉXITO:"
echo "- Logs del backend muestran 'JwtService injected: true'"
echo "- Conexiones WebSocket se establecen sin errores"
echo "- Chat en Study Rooms funciona correctamente"
echo ""

echo "❌ SÍNTOMAS DE FALLA:"
echo "- Logs muestran 'JwtService injected: false'"
echo "- Error 'Cannot read properties of undefined (reading verify)'"
echo "- WebSocket connections fallan constantemente"
echo ""

echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="

total_tests=4
passed_tests=$((total_tests - failed_tests))

echo "✅ Tests pasados: $passed_tests/$total_tests"
echo "❌ Tests fallados: $failed_tests/$total_tests"

if [ $failed_tests -eq 0 ]; then
    echo ""
    echo "🎉 ¡CONFIGURACIÓN CORRECTA!"
    echo ""
    echo "📋 PRÓXIMOS PASOS:"
    echo "1. Reiniciar el backend si está ejecutándose"
    echo "2. Verificar logs durante el inicio"
    echo "3. Probar conexión WebSocket manualmente"
    echo ""
    echo "🔧 Si el problema persiste:"
    echo "- Verificar variables de entorno JWT_SECRET"
    echo "- Revisar logs completos del backend"
    echo "- Verificar que no hay cached builds conflictivos"
    exit 0
else
    echo ""
    echo "⚠️  CONFIGURACIÓN INCOMPLETA"
    echo ""
    echo "📋 ACCIONES NECESARIAS:"
    if ! grep -q "import.*AuthModule" "$STUDY_ROOMS_MODULE"; then
        echo "• Asegurar que StudyRoomsModule importa AuthModule"
    fi
    if ! grep -q "JwtModule" "$AUTH_MODULE" | grep -q "exports"; then
        echo "• Asegurar que AuthModule exporta JwtModule"
    fi
    if ! curl -s "$BACKEND_URL/health" > /dev/null; then
        echo "• Iniciar el backend NestJS"
    fi
    echo ""
    echo "🔧 Después de corregir, ejecutar: bash scripts/test-websocket-auth-fix.sh"
    exit 1
fi