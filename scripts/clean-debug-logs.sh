#!/bin/bash

echo "🧹 CLEANING DEBUG LOGS - CoomÜnity Backend"
echo "========================================="

# Función para limpiar logs de un archivo
clean_logs() {
    local file="$1"
    echo "🔧 Cleaning logs in: $file"

    # Comentar líneas con console.log que contengan ">>>"
    sed -i.bak 's/^[[:space:]]*console\.log.*>>>.*$/\/\/ &/' "$file"

    # Comentar líneas con console.error que contengan ">>>"
    sed -i.bak2 's/^[[:space:]]*console\.error.*>>>.*$/\/\/ &/' "$file"

    # Remover archivos backup
    rm -f "$file.bak" "$file.bak2" 2>/dev/null
}

# Archivos principales con logs excesivos
echo "📁 Targeting main files with excessive logs..."

# AuthService (backend principal)
if [ -f "backend/src/auth/auth.service.ts" ]; then
    clean_logs "backend/src/auth/auth.service.ts"
fi

# JwtStrategy (backend principal)
if [ -f "backend/src/auth/strategies/jwt.strategy.ts" ]; then
    clean_logs "backend/src/auth/strategies/jwt.strategy.ts"
fi

# RolesGuard (backend principal)
if [ -f "backend/src/rbac/guards/roles.guard.ts" ]; then
    clean_logs "backend/src/rbac/guards/roles.guard.ts"
fi

# Controllers con logs excesivos
for controller in "backend/src/rbac/roles/roles.controller.ts" \
                  "backend/src/rbac/roles/roles.service.ts" \
                  "backend/src/users/users.controller.ts" \
                  "backend/src/users/users-test.controller.ts"; do
    if [ -f "$controller" ]; then
        clean_logs "$controller"
    fi
done

# Buscar y limpiar TODOS los archivos con logs >>> en backend
echo "🔍 Searching for all files with >>> debug logs in backend..."
find backend/src -name "*.ts" -type f -exec grep -l "console\.log.*>>>" {} \; | while read file; do
    echo "   🧹 Cleaning: $file"
    clean_logs "$file"
done

# Verificación final
echo ""
echo "✅ VERIFICATION:"
remaining_logs=$(find backend/src -name "*.ts" -type f -exec grep -l "console\.log.*>>>" {} \; | wc -l)
echo "📊 Remaining files with >>> debug logs: $remaining_logs"

if [ "$remaining_logs" -eq 0 ]; then
    echo "🎉 SUCCESS: All debug logs cleaned!"
    echo "🚀 Backend should now run with minimal logging"
    echo ""
    echo "💡 RECOMMENDATION: Restart backend to see the difference:"
    echo "   npm run dev:backend"
else
    echo "⚠️  Some files still contain debug logs:"
    find backend/src -name "*.ts" -type f -exec grep -l "console\.log.*>>>" {} \;
fi

echo ""
echo "🔄 NEXT STEPS:"
echo "1. Restart backend: npm run dev:backend"
echo "2. Test login in SuperApp - should see dramatically fewer logs"
echo "3. Monitor console - should be much cleaner"
echo ""
echo "📋 LOGS CLEANED:"
echo "   ✅ AuthService login/register debugging"
echo "   ✅ JwtStrategy token validation debugging"
echo "   ✅ RolesGuard permissions debugging"
echo "   ✅ Controllers constructor debugging"
echo "   ✅ Services initialization debugging"
