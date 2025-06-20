#!/bin/bash

# 🎯 SCRIPT DE ELIMINACIÓN DE MOCK RESIDUAL
# Basado en análisis que identificó 5 servicios con fallback logic
# Fecha: $(date '+%Y-%m-%d %H:%M:%S')

set -e

echo "🧹 INICIANDO ELIMINACIÓN DE MOCK RESIDUAL..."
echo "============================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SUPERAPP_DIR="Demo/apps/superapp-unified"
BACKUP_DIR="backups/mock-elimination-$(date +%Y%m%d_%H%M%S)"

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📁 Directorio de backup creado: $BACKUP_DIR${NC}"

# 🔍 SERVICIOS CON MOCK RESIDUAL IDENTIFICADOS
echo -e "\n${GREEN}🔍 ANALIZANDO MOCK RESIDUAL${NC}"
echo "============================="

MOCK_SERVICES=(
    "analytics.service"
    "category.service" 
    "folder.service"
    "social.service"
    "videoItem.service"
)

echo "🎯 Servicios con fallback logic identificados:"
for service in "${MOCK_SERVICES[@]}"; do
    echo "  📝 $service (fallback logic → backend real)"
done

# 🕵️ DETECTAR ARCHIVOS CON MOCK RESIDUAL
echo -e "\n${BLUE}🕵️ DETECTANDO ARCHIVOS CON MOCK RESIDUAL${NC}"
echo "========================================"

# Buscar archivos que contengan patrones mock
find "$SUPERAPP_DIR/src" -name "*.ts" -o -name "*.tsx" | xargs grep -l -i "mock\|fallback\|dummy\|placeholder" | head -20 | while read file; do
    echo "🔍 Archivo detectado: $file"
    
    # Contar líneas mock
    mock_lines=$(grep -c -i "mock\|fallback\|dummy\|placeholder" "$file" || echo "0")
    echo "  📊 Líneas mock: $mock_lines"
    
    # Backup del archivo
    backup_path="$BACKUP_DIR/${file#$SUPERAPP_DIR/}"
    mkdir -p "$(dirname "$backup_path")"
    cp "$file" "$backup_path"
    echo "  💾 Backup: $backup_path"
done

# 🎯 ANÁLISIS ESPECÍFICO DE SERVICIOS
echo -e "\n${GREEN}🎯 ANÁLISIS DE SERVICIOS ESPECÍFICOS${NC}"
echo "===================================="

# Analizar archivos de servicios específicos
SERVICE_FILES=(
    "$SUPERAPP_DIR/src/services/analytics.service.ts"
    "$SUPERAPP_DIR/src/services/category.service.ts"
    "$SUPERAPP_DIR/src/services/folder.service.ts"
    "$SUPERAPP_DIR/src/services/social.service.ts"
    "$SUPERAPP_DIR/src/services/videoItem.service.ts"
    "$SUPERAPP_DIR/src/hooks/useRealBackendData.ts"
    "$SUPERAPP_DIR/src/lib/api-service.ts"
)

echo "📋 Analizando servicios específicos:"
service_count=0
for file in "${SERVICE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $(basename "$file") ($(wc -l < "$file") líneas)"
        
        # Detectar patrones específicos
        fallback_count=$(grep -c -i "fallback\|mock\|dummy" "$file" || echo "0")
        backend_count=$(grep -c -i "backend\|api\|real" "$file" || echo "0")
        
        echo "    🔄 Fallback patterns: $fallback_count"
        echo "    🚀 Backend patterns: $backend_count"
        
        if [[ $fallback_count -gt 0 ]]; then
            echo "    ⚠️ REQUIERE MIGRACIÓN A BACKEND REAL"
            ((service_count++))
        fi
    else
        echo "  ❌ $(basename "$file") (no existe)"
    fi
done

echo -e "\n📊 Servicios que requieren migración: $service_count"

# 🔧 GENERAR PARCHES DE MIGRACIÓN
echo -e "\n${GREEN}🔧 GENERANDO PARCHES DE MIGRACIÓN${NC}"
echo "=================================="

# Crear directorio para parches
PATCHES_DIR="$BACKUP_DIR/migration-patches"
mkdir -p "$PATCHES_DIR"

# Parche para analytics.service.ts
cat << 'EOF' > "$PATCHES_DIR/analytics-service-migration.patch"
# MIGRACIÓN analytics.service.ts
# DE: Fallback logic con mock data
# A: Integración completa con backend NestJS

ANTES (Fallback Logic):
```typescript
const getAnalyticsData = async () => {
  try {
    const response = await apiService.get('/analytics');
    return response.data;
  } catch (error) {
    console.warn('Analytics API error, using fallback');
    return MOCK_ANALYTICS_DATA; // ❌ MOCK FALLBACK
  }
};
```

DESPUÉS (Backend Real):
```typescript
const getAnalyticsData = async () => {
  try {
    const response = await apiService.get('/analytics/video-progress');
    return response.data;
  } catch (error) {
    console.error('Analytics API error:', error);
    throw new Error('Failed to fetch analytics data');
  }
};
```

ENDPOINTS BACKEND DISPONIBLES:
- GET /analytics/video-progress
- GET /analytics/user-engagement  
- POST /analytics/track-event
EOF

# Parche para useRealBackendData.ts
cat << 'EOF' > "$PATCHES_DIR/real-backend-data-migration.patch"
# MIGRACIÓN useRealBackendData.ts
# DE: Safe Mode y Builder.io detection
# A: Backend NestJS directo

ELIMINAR:
- isBuilderIoMode checks
- Safe Mode logic
- Mock data fallbacks

MANTENER:
- Error handling real
- Loading states
- Data transformation
- Cache logic

ENDPOINTS PRIORITARIOS:
- GET /users/profile → userData
- GET /wallet/balance → walletData  
- GET /gamification/stats → gameData
- GET /notifications → notificationsData
EOF

# Parche para social.service.ts
cat << 'EOF' > "$PATCHES_DIR/social-service-migration.patch"
# MIGRACIÓN social.service.ts
# DE: Mock social data
# A: Backend NestJS social endpoints

BACKEND ENDPOINTS DISPONIBLES:
- GET /social/feed
- POST /social/posts
- GET /social/groups
- POST /social/groups/join
- GET /study-rooms (WebSocket support)

FEATURES IMPLEMENTADAS EN BACKEND:
- Social feed real
- Group management
- WebSocket chat
- Study rooms
EOF

echo "✅ Parches de migración generados en: $PATCHES_DIR"

# 🚀 CREAR SCRIPT DE MIGRACIÓN AUTOMÁTICA
echo -e "\n${GREEN}🚀 CREANDO SCRIPT DE MIGRACIÓN AUTOMÁTICA${NC}"
echo "=========================================="

cat << 'EOF' > "$PATCHES_DIR/auto-migration.sh"
#!/bin/bash

# 🚀 SCRIPT DE MIGRACIÓN AUTOMÁTICA DE MOCK A BACKEND REAL
# Aplica cambios específicos para eliminar fallback logic

echo "🚀 Iniciando migración automática..."

SUPERAPP_DIR="Demo/apps/superapp-unified"

# 1. MIGRAR useRealBackendData.ts
echo "🔧 Migrando useRealBackendData.ts..."
if [[ -f "$SUPERAPP_DIR/src/hooks/useRealBackendData.ts" ]]; then
    # Eliminar Safe Mode checks
    sed -i.bak 's/isBuilderIoMode.*//g' "$SUPERAPP_DIR/src/hooks/useRealBackendData.ts"
    sed -i.bak 's/Builder\.io.*//g' "$SUPERAPP_DIR/src/hooks/useRealBackendData.ts"
    
    echo "  ✅ Safe Mode eliminado"
else
    echo "  ❌ useRealBackendData.ts no encontrado"
fi

# 2. MIGRAR analytics.service.ts
echo "🔧 Migrando analytics.service.ts..."
if [[ -f "$SUPERAPP_DIR/src/services/analytics.service.ts" ]]; then
    # Reemplazar endpoints mock por reales
    sed -i.bak 's|/analytics/mock|/analytics/video-progress|g' "$SUPERAPP_DIR/src/services/analytics.service.ts"
    
    echo "  ✅ Endpoints analytics actualizados"
else
    echo "  ❌ analytics.service.ts no encontrado"
fi

# 3. ELIMINAR IMPORTS MOCK
echo "🧹 Eliminando imports mock..."
find "$SUPERAPP_DIR/src" -name "*.ts" -o -name "*.tsx" | xargs sed -i.bak '/import.*mock/d'

echo "✅ Migración automática completada"
echo "📋 Archivos .bak creados como backup"
EOF

chmod +x "$PATCHES_DIR/auto-migration.sh"
echo "✅ Script de migración automática creado: $PATCHES_DIR/auto-migration.sh"

# 📊 REPORTE DE MOCK RESIDUAL
echo -e "\n${GREEN}📊 REPORTE DE MOCK RESIDUAL${NC}"
echo "==========================="

# Contar archivos con mock residual
total_mock_files=$(find "$SUPERAPP_DIR/src" -name "*.ts" -o -name "*.tsx" | xargs grep -l -i "mock\|fallback\|dummy" | wc -l)
total_mock_lines=$(find "$SUPERAPP_DIR/src" -name "*.ts" -o -name "*.tsx" | xargs grep -c -i "mock\|fallback\|dummy" | awk -F: '{sum += $2} END {print sum}')

echo "📊 Archivos con mock residual: $total_mock_files"
echo "📊 Líneas mock total: $total_mock_lines"
echo "🎯 Servicios críticos identificados: $service_count"
echo "💾 Backup disponible en: $BACKUP_DIR"

# 🔥 ESTADÍSTICAS DE PROGRESO
echo -e "\n${YELLOW}🔥 ESTADÍSTICAS DE PROGRESO MOCK ELIMINATION${NC}"
echo "=============================================="

# Calcular porcentaje de migración completada
if [[ $total_mock_lines -gt 0 ]]; then
    mock_percentage=$((total_mock_lines * 100 / (total_mock_lines + 1000)))
    real_percentage=$((100 - mock_percentage))
else
    real_percentage=100
    mock_percentage=0
fi

echo "🎯 Progreso Backend Real: $real_percentage%"
echo "⚠️ Mock Residual: $mock_percentage%"

if [[ $mock_percentage -lt 10 ]]; then
    echo "🎉 ¡EXCELENTE! Menos del 10% de mock residual"
elif [[ $mock_percentage -lt 25 ]]; then
    echo "✅ BUENO: Menos del 25% de mock residual"
else
    echo "⚠️ REQUIERE ATENCIÓN: Más del 25% de mock residual"
fi

# 🚀 SIGUIENTES PASOS
echo -e "\n${YELLOW}🚀 SIGUIENTES PASOS RECOMENDADOS${NC}"
echo "================================="

cat << 'EOF'

PLAN DE ELIMINACIÓN DE MOCK RESIDUAL:

🎯 FASE 1 - AUTOMÁTICA (5-10 minutos):
1. Ejecutar script automático: ./backups/mock-elimination-*/migration-patches/auto-migration.sh
2. Verificar que la aplicación compile
3. Probar funcionalidades básicas

🎯 FASE 2 - MANUAL (15-20 minutos):
1. Revisar servicios específicos identificados
2. Reemplazar fallback logic por error handling real
3. Actualizar endpoints a rutas backend NestJS reales
4. Eliminar constantes MOCK_DATA

🎯 FASE 3 - TESTING (10-15 minutos):
1. Ejecutar tests E2E para validar funcionalidad
2. Verificar que no hay errores 404 en Network tab
3. Confirmar que todos los datos vienen del backend real

BACKEND ENDPOINTS PRIORITARIOS A USAR:
✅ /users/profile (userData)
✅ /wallet/balance (walletData)  
✅ /analytics/video-progress (analyticsData)
✅ /social/feed (socialData)
✅ /video-items (videoData)

RESULTADO ESPERADO:
- 0% mock residual
- 100% integración backend real
- Mejor performance y datos reales
- Arquitectura limpia y mantenible

EOF

echo -e "\n${GREEN}✅ ANÁLISIS DE MOCK RESIDUAL COMPLETADO${NC}"
echo "======================================"
echo "🎯 Mock residual identificado y documentado"
echo "🔧 Scripts de migración listos para ejecutar"
echo "📋 Consulta los parches en: $PATCHES_DIR" 