#!/bin/bash

# 🐳 CoomÜnity Monorepo - Docker Build Script
# Construye todas las aplicaciones del monorepo para producción

set -e

echo "🚀 Iniciando construcción Docker del Monorepo CoomÜnity..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[DOCKER-BUILD]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que Docker esté corriendo
if ! docker info >/dev/null 2>&1; then
    error "Docker no está corriendo. Por favor inicia Docker Desktop."
fi

# Verificar que existan los Dockerfiles
SUPERAPP_DOCKERFILE="Demo/apps/superapp-unified/Dockerfile"
if [ ! -f "$SUPERAPP_DOCKERFILE" ]; then
    warn "Dockerfile de SuperApp no encontrado. Creándolo..."
    # El script creará el Dockerfile si no existe
fi

# Variables
IMAGE_PREFIX="${IMAGE_PREFIX:-coomunity}"
VERSION="${VERSION:-latest}"
BUILD_ARGS="${BUILD_ARGS:-}"

log "Configuración de construcción:"
log "  - Prefijo de imágen: $IMAGE_PREFIX"
log "  - Versión: $VERSION"
log "  - Argumentos adicionales: $BUILD_ARGS"

# Construir SuperApp
log "Construyendo SuperApp Frontend..."
if [ -f "$SUPERAPP_DOCKERFILE" ]; then
    docker build \
        -t "${IMAGE_PREFIX}/superapp:${VERSION}" \
        -f "$SUPERAPP_DOCKERFILE" \
        --build-arg NODE_ENV=production \
        $BUILD_ARGS \
        ./Demo/apps/superapp-unified/
    success "SuperApp Frontend construida exitosamente"
else
    error "No se pudo encontrar el Dockerfile de SuperApp"
fi

# Construir imagen de desarrollo (multi-stage opcional)
log "Construyendo imagen de desarrollo..."
docker build \
    -t "${IMAGE_PREFIX}/superapp:${VERSION}-dev" \
    -f "$SUPERAPP_DOCKERFILE" \
    --target development \
    --build-arg NODE_ENV=development \
    $BUILD_ARGS \
    ./Demo/apps/superapp-unified/ 2>/dev/null || warn "No se pudo construir imagen de desarrollo (opcional)"

# Limpiar imágenes intermedias
log "Limpiando imágenes intermedias..."
docker image prune -f >/dev/null 2>&1 || true

# Mostrar resumen
log "Construcción completada. Imágenes creadas:"
docker images | grep "$IMAGE_PREFIX" | head -10

success "🎉 Construcción Docker completada exitosamente!"

echo ""
echo "Para ejecutar la SuperApp:"
echo "  docker run -p 3000:3000 ${IMAGE_PREFIX}/superapp:${VERSION}"
echo ""
echo "Para desarrollo:"
echo "  docker run -p 3000:3000 -v \$(pwd)/Demo/apps/superapp-unified:/app ${IMAGE_PREFIX}/superapp:${VERSION}-dev" 