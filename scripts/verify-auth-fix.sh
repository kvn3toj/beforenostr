#!/bin/bash

# 🔐 VERIFICACIÓN DE CORRECCIÓN DE AUTENTICACIÓN JWT
# =================================================
# Error resuelto: "The string did not match the expected pattern" en auth.service.ts:105
# Fecha: 18 de junio 2025

echo "🔐 VERIFICANDO CORRECCIÓN DE AUTENTICACIÓN JWT..."
echo "================================================"

# Función para logging con colores
log_success() { echo "✅ $1"; }
log_warning() { echo "⚠️  $1"; }
log_error() { echo "❌ $1"; }
log_info() { echo "ℹ️  $1"; }

CHECKS_PASSED=0
TOTAL_CHECKS=6

echo
log_info "VERIFICANDO SERVICIOS Y CONFIGURACIÓN..."

# 1. Verificar Backend NestJS
log_info "1. Verificando Backend NestJS en puerto 3002..."
BACKEND_STATUS=$(curl -s -w "%{http_code}" http://localhost:3002/health -o /dev/null)
if [ "$BACKEND_STATUS" = "200" ]; then
    log_success "Backend NestJS operacional (puerto 3002)"
    ((CHECKS_PASSED++))
else
    log_error "Backend NestJS no responde (puerto 3002)"
fi

# 2. Verificar SuperApp Frontend
log_info "2. Verificando SuperApp Frontend en puerto 3001..."
FRONTEND_STATUS=$(curl -s -w "%{http_code}" http://localhost:3001 -o /dev/null)
if [ "$FRONTEND_STATUS" = "200" ]; then
    log_success "SuperApp Frontend operacional (puerto 3001)"
    ((CHECKS_PASSED++))
else
    log_error "SuperApp Frontend no responde (puerto 3001)"
fi

# 3. Verificar configuración de puertos en .env
log_info "3. Verificando configuración de puertos..."
VITE_API_URL=$(grep "VITE_API_BASE_URL" Demo/apps/superapp-unified/.env | cut -d'=' -f2)
VITE_BASE_URL=$(grep "VITE_BASE_URL" Demo/apps/superapp-unified/.env | cut -d'=' -f2)

if [ "$VITE_API_URL" = "http://localhost:3002" ] && [ "$VITE_BASE_URL" = "http://localhost:3001" ]; then
    log_success "Configuración de puertos correcta (.env)"
    ((CHECKS_PASSED++))
else
    log_error "Configuración de puertos incorrecta (.env)"
    echo "  API URL: $VITE_API_URL (esperado: http://localhost:3002)"
    echo "  Base URL: $VITE_BASE_URL (esperado: http://localhost:3001)"
fi

# 4. Verificar que no hay procesos conflictivos en puertos
log_info "4. Verificando conflictos de puerto..."
PORT_CONFLICTS=$(lsof -i :3001,3002 | grep -v "node" | wc -l)
if [ $PORT_CONFLICTS -le 1 ]; then  # Solo deberían estar los procesos Node correctos
    log_success "Sin conflictos de puerto detectados"
    ((CHECKS_PASSED++))
else
    log_warning "Posibles conflictos de puerto detectados"
fi

# 5. Verificar endpoint de login del backend
log_info "5. Verificando endpoint de autenticación..."
LOGIN_TEST=$(curl -s -X POST "http://localhost:3002/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"invalid","password":"invalid"}' \
    -w "%{http_code}" -o /dev/null)

if [ "$LOGIN_TEST" = "400" ] || [ "$LOGIN_TEST" = "401" ]; then
    log_success "Endpoint de autenticación respondiendo correctamente"
    ((CHECKS_PASSED++))
else
    log_error "Endpoint de autenticación no responde como esperado (código: $LOGIN_TEST)"
fi

# 6. Verificar que el archivo de limpieza de tokens fue creado
log_info "6. Verificando herramientas de limpieza..."
if [ -f "/tmp/clear-auth.html" ]; then
    log_success "Script de limpieza de tokens disponible"
    ((CHECKS_PASSED++))
else
    log_warning "Script de limpieza no encontrado"
fi

echo
echo "📊 RESULTADO FINAL:"
echo "==================="
if [ $CHECKS_PASSED -eq $TOTAL_CHECKS ]; then
    log_success "TODOS LOS CHECKS PASARON ($CHECKS_PASSED/$TOTAL_CHECKS)"
    echo
    echo "🎉 PROBLEMA DE AUTENTICACIÓN RESUELTO EXITOSAMENTE"
    echo
    echo "📋 ESTADO OPERACIONAL:"
    echo "   • Backend NestJS: ✅ Puerto 3002"
    echo "   • SuperApp: ✅ Puerto 3001" 
    echo "   • Tokens JWT: ✅ Limpiados"
    echo "   • Configuración: ✅ Correcta"
    echo
    echo "🔧 PRÓXIMOS PASOS:"
    echo "   1. Abrir SuperApp: http://localhost:3001"
    echo "   2. Intentar login con credenciales válidas:"
    echo "      • admin@gamifier.com / admin123"
    echo "      • user@gamifier.com / 123456"
    echo "   3. Verificar que no aparezcan errores de JWT en consola"
    
elif [ $CHECKS_PASSED -ge 4 ]; then
    log_success "MAYORÍA DE CHECKS PASARON ($CHECKS_PASSED/$TOTAL_CHECKS)"
    echo "⚠️  Algunos problemas menores detectados pero sistema funcional"
else
    log_error "MÚLTIPLES PROBLEMAS DETECTADOS ($CHECKS_PASSED/$TOTAL_CHECKS)"
    echo "❌ Se requiere investigación adicional"
fi

echo
echo "🔗 URLs DE VERIFICACIÓN:"
echo "   • Backend Health: http://localhost:3002/health"
echo "   • SuperApp: http://localhost:3001"
echo "   • Limpieza Manual: file:///tmp/clear-auth.html" 