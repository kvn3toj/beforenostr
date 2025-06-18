#!/bin/bash

echo "🔍 VERIFICACIÓN ACTUAL DEL ESTADO DE MIGRACIÓN"
echo "=============================================="
echo ""

# Función para verificar si un archivo existe y mostrar su estado
check_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        echo "✅ $description: PRESENTE"
        return 0
    else
        echo "❌ $description: NO ENCONTRADO"
        return 1
    fi
}

# Función para verificar contenido específico en archivos
check_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        echo "✅ $description: ENCONTRADO"
        return 0
    else
        echo "❌ $description: NO ENCONTRADO"
        return 1
    fi
}

echo "📂 1. VERIFICANDO SERVICIOS REALES"
echo "-----------------------------------"

# Verificar servicios principales
check_file "src/services/auth.service.ts" "AuthService"
check_file "src/services/notifications.service.ts" "NotificationsService"

# Verificar contenido de servicios
if [ -f "src/services/auth.service.ts" ]; then
    check_content "src/services/auth.service.ts" "Real Backend Integration" "AuthService conectado al backend real"
    check_content "src/services/auth.service.ts" "apiService.post" "AuthService usando apiService"
fi

if [ -f "src/services/notifications.service.ts" ]; then
    check_content "src/services/notifications.service.ts" "Real Backend Integration" "NotificationsService conectado al backend real"
    check_content "src/services/notifications.service.ts" "apiService.get" "NotificationsService usando apiService"
fi

echo ""
echo "🔐 2. VERIFICANDO AUTHCONTEXT"
echo "-----------------------------"

# Verificar AuthContext
check_file "src/contexts/AuthContext.tsx" "AuthContext"

if [ -f "src/contexts/AuthContext.tsx" ]; then
    check_content "src/contexts/AuthContext.tsx" "authService" "AuthContext usando authService real"
    
    # Verificar que NO hay lógica de mock
    if ! grep -q "MOCK_AUTHENTICATED_USER\|simulateLoginAPI\|isMockAuthEnabled" "src/contexts/AuthContext.tsx"; then
        echo "✅ AuthContext sin lógica de mock"
    else
        echo "⚠️ AuthContext aún contiene lógica de mock"
    fi
fi

echo ""
echo "🌐 3. VERIFICANDO CONFIGURACIÓN"
echo "-------------------------------"

# Verificar archivos de configuración
for env_file in .env .env.backup .env.bak; do
    if [ -f "$env_file" ]; then
        echo "📄 Archivo encontrado: $env_file"
        if grep -q "VITE_API_BASE_URL=http://localhost:3002" "$env_file"; then
            echo "  ✅ Backend configurado en puerto 3002"
        fi
        if grep -q "VITE_ENABLE_MOCK_AUTH=false" "$env_file"; then
            echo "  ✅ Mock auth deshabilitado"
        fi
    fi
done

echo ""
echo "📱 4. VERIFICANDO PÁGINAS MIGRADAS"
echo "----------------------------------"

# Verificar páginas principales
check_file "src/pages/LoginPage.tsx" "LoginPage"
check_file "src/pages/NotificationsPage.tsx" "NotificationsPage"

if [ -f "src/pages/LoginPage.tsx" ]; then
    if grep -q "authService\|useAuth" "src/pages/LoginPage.tsx"; then
        echo "✅ LoginPage usando servicios reales"
    else
        echo "⚠️ LoginPage podría no estar usando servicios reales"
    fi
fi

echo ""
echo "🔍 5. VERIFICANDO ELIMINACIÓN DE MOCKS"
echo "--------------------------------------"

# Buscar referencias a funciones mock específicas
mock_functions=("simulateLoginAPI" "MOCK_AUTHENTICATED_USER" "fetchUserNotifications" "isMockAuthEnabled")

total_mock_refs=0
for func in "${mock_functions[@]}"; do
    count=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "$func" 2>/dev/null | wc -l)
    if [ "$count" -eq 0 ]; then
        echo "✅ Sin referencias a $func"
    else
        echo "⚠️ Encontradas $count referencias a $func"
        total_mock_refs=$((total_mock_refs + count))
    fi
done

echo ""
echo "📊 6. VERIFICANDO IMPORTACIONES"
echo "-------------------------------"

# Verificar que los servicios importan apiService
for service in "auth.service.ts" "notifications.service.ts"; do
    if [ -f "src/services/$service" ]; then
        if grep -q "import.*apiService" "src/services/$service"; then
            echo "✅ $service importa apiService"
        else
            echo "❌ $service NO importa apiService"
        fi
    fi
done

echo ""
echo "🎯 RESUMEN EJECUTIVO"
echo "===================="

# Contar verificaciones exitosas
success_count=0
total_checks=0

# Re-ejecutar verificaciones para conteo
files_to_check=(
    "src/services/auth.service.ts"
    "src/services/notifications.service.ts"
    "src/contexts/AuthContext.tsx"
    "src/pages/LoginPage.tsx"
    "src/pages/NotificationsPage.tsx"
)

for file in "${files_to_check[@]}"; do
    total_checks=$((total_checks + 1))
    if [ -f "$file" ]; then
        success_count=$((success_count + 1))
    fi
done

# Verificar contenido crítico
critical_checks=(
    "src/services/auth.service.ts:Real Backend Integration"
    "src/services/notifications.service.ts:Real Backend Integration"
    "src/contexts/AuthContext.tsx:authService"
)

for check in "${critical_checks[@]}"; do
    file=$(echo "$check" | cut -d: -f1)
    pattern=$(echo "$check" | cut -d: -f2)
    total_checks=$((total_checks + 1))
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        success_count=$((success_count + 1))
    fi
done

# Calcular porcentaje
if [ "$total_checks" -gt 0 ]; then
    percentage=$((success_count * 100 / total_checks))
else
    percentage=0
fi

echo "📈 Total de verificaciones: $total_checks"
echo "✅ Verificaciones exitosas: $success_count"
echo "📊 Tasa de éxito: $percentage%"

if [ "$total_mock_refs" -eq 0 ]; then
    echo "🧹 Estado de mocks: ELIMINADOS COMPLETAMENTE"
else
    echo "⚠️ Estado de mocks: $total_mock_refs referencias encontradas"
fi

echo ""
if [ "$percentage" -ge 80 ] && [ "$total_mock_refs" -eq 0 ]; then
    echo "🎉 ESTADO: MIGRACIÓN COMPLETADA EXITOSAMENTE"
    echo "✅ El sistema está usando conexiones reales al backend"
else
    echo "⚠️ ESTADO: MIGRACIÓN PARCIAL O INCOMPLETA"
    echo "🔧 Se requieren ajustes adicionales"
fi

echo ""
echo "🔗 Para verificar conectividad con el backend:"
echo "   curl http://localhost:3002/health"
echo ""
echo "🚀 Para iniciar la aplicación:"
echo "   npm run dev" 