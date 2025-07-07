#!/bin/bash
# =================================================================
# PHOENIX: Script de Limpieza de Migraciones para Producción
# =================================================================

echo "🦅 PHOENIX: Iniciando limpieza de historial de migraciones..."

# Verificar que estamos en producción
if [ "$NODE_ENV" = "production" ]; then
    echo "✅ Entorno de producción detectado"

    # Limpiar el historial de migraciones corrupto
    echo "🧹 Limpiando historial de migraciones corrupto..."

    # Usar el esquema correcto desde el directorio backend
    cd backend
    npx prisma db execute --schema=./prisma/schema.prisma --stdin <<EOF
DELETE FROM "_prisma_migrations";
EOF

    if [ $? -eq 0 ]; then
        echo "✅ Historial de migraciones limpiado exitosamente"
    else
        echo "❌ Error al limpiar historial de migraciones"
        exit 1
    fi

    cd ..
else
    echo "⚠️ No estamos en producción, saltando limpieza de migraciones"
fi

echo "🦅 PHOENIX: Limpieza completada"
