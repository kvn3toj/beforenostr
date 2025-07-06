#!/bin/bash
# =================================================================
# CoomÜnity Backend - Script de Inicio Robusto para Producción
# Manejo de errores P1017 y conexiones PostgreSQL
# =================================================================

set -e

echo "🚀 Iniciando CoomÜnity Backend en modo producción..."
echo "🔧 Configurando variables de entorno..."

# Configurar timeouts de conexión más largos
export PRISMA_QUERY_ENGINE_LIBRARY_TIMEOUT=60000
export PRISMA_CLIENT_ENGINE_TYPE=library

# Función para verificar conexión a PostgreSQL
check_postgres_connection() {
    echo "🔍 Verificando conexión a PostgreSQL..."

    # Extraer componentes de la URL de la base de datos
    if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
        DB_USER="${BASH_REMATCH[1]}"
        DB_PASS="${BASH_REMATCH[2]}"
        DB_HOST="${BASH_REMATCH[3]}"
        DB_PORT="${BASH_REMATCH[4]}"
        DB_NAME="${BASH_REMATCH[5]}"

        echo "📊 Conexión a: $DB_HOST:$DB_PORT/$DB_NAME"
    else
        echo "❌ Error: No se pudo parsear DATABASE_URL"
        exit 1
    fi

    # Verificar conectividad con timeout
    timeout 30 nc -z "$DB_HOST" "$DB_PORT" || {
        echo "❌ Error: No se puede conectar a PostgreSQL en $DB_HOST:$DB_PORT"
        exit 1
    }

    echo "✅ Conexión a PostgreSQL verificada"
}

# Función para ejecutar migraciones con reintentos
run_migrations_with_retry() {
    echo "🔄 Ejecutando migraciones de base de datos..."

    local max_attempts=5
    local attempt=1
    local delay=10

    while [ $attempt -le $max_attempts ]; do
        echo "🔄 Intento $attempt de $max_attempts..."

        if npx prisma migrate deploy --schema=backend/prisma/schema.prisma --skip-generate; then
            echo "✅ Migraciones ejecutadas exitosamente"
            return 0
        else
            echo "❌ Fallo en intento $attempt"

            if [ $attempt -eq $max_attempts ]; then
                echo "💥 Error: Falló después de $max_attempts intentos"
                exit 1
            fi

            echo "⏳ Esperando $delay segundos antes del siguiente intento..."
            sleep $delay

            # Incrementar delay exponencialmente
            delay=$((delay * 2))
            attempt=$((attempt + 1))
        fi
    done
}

# Función para iniciar la aplicación
start_application() {
    echo "🚀 Iniciando aplicación NestJS..."
    exec node backend/dist/main.js
}

# Función principal
main() {
    echo "📋 Iniciando proceso de arranque..."

    # Verificar que las variables de entorno estén configuradas
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ Error: DATABASE_URL no está configurada"
        exit 1
    fi

    # Esperar un momento para que los servicios se estabilicen
    echo "⏳ Esperando estabilización de servicios..."
    sleep 5

    # Verificar conexión a PostgreSQL
    check_postgres_connection

    # Ejecutar migraciones con reintentos
    run_migrations_with_retry

    # Iniciar la aplicación
    start_application
}

# Ejecutar función principal
main "$@"
