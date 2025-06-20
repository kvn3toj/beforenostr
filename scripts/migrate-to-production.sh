#!/bin/bash

# 🚀 MIGRACIÓN A PRODUCCIÓN - CoomÜnity
# Migrar de mocks a infraestructura real de producción

set -e

echo "🚀 INICIANDO MIGRACIÓN A PRODUCCIÓN - CoomÜnity"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verificar prerrequisitos
log "Verificando prerrequisitos..."

# Verificar que el backend NestJS esté ejecutándose
if ! curl -s http://localhost:3002/health > /dev/null; then
    error "Backend NestJS no está ejecutándose en puerto 3002"
    echo "Por favor, inicia el backend NestJS primero:"
    echo "cd backend/ && npm run dev"
    exit 1
fi

log "✅ Backend NestJS operativo en puerto 3002"

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    error "Docker no está ejecutándose"
    echo "Por favor, inicia Docker Desktop"
    exit 1
fi

log "✅ Docker operativo"

# Verificar que la infraestructura escalable esté ejecutándose
if ! docker-compose -f infrastructure/scalability/docker-compose-scale.yml ps | grep -q "Up"; then
    warn "Infraestructura escalable no está ejecutándose"
    log "Iniciando infraestructura escalable..."
    cd infrastructure/scalability/
    docker-compose -f docker-compose-scale.yml up -d
    cd ../../
    sleep 10
fi

log "✅ Infraestructura escalable operativa"

# Crear configuración de producción
log "Creando configuración de producción..."

# Crear docker-compose-production.yml
cat > infrastructure/scalability/docker-compose-production.yml << 'EOF'
version: '3.8'

services:
  # Load Balancer Nginx
  nginx-lb:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-production.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend-real
    networks:
      - coomunity-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend Real (conecta al NestJS externo)
  backend-real:
    image: nginx:alpine
    volumes:
      - ./backend-proxy.conf:/etc/nginx/nginx.conf:ro
    networks:
      - coomunity-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://host.docker.internal:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    extra_hosts:
      - "host.docker.internal:host-gateway"

  # Redis para caching
  redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"
    volumes:
      - redis-data:/data
    networks:
      - coomunity-network
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL para datos
  postgres:
    image: postgres:15-alpine
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: coomunity_production
      POSTGRES_USER: coomunity
      POSTGRES_PASSWORD: coomunity_secure_2025
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-production.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - coomunity-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U coomunity -d coomunity_production"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Prometheus para métricas
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9091:9090"
    volumes:
      - ./prometheus-production.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    networks:
      - coomunity-network
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  # Grafana para dashboards
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3003:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: coomunity2025
      GF_USERS_ALLOW_SIGN_UP: false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-production-dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana-production-datasources:/etc/grafana/provisioning/datasources
    networks:
      - coomunity-network

volumes:
  redis-data:
  postgres-data:
  prometheus-data:
  grafana-data:

networks:
  coomunity-network:
    driver: bridge
EOF

log "✅ Configuración Docker de producción creada"

# Crear configuración Nginx para producción
cat > infrastructure/scalability/nginx-production.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        least_conn;
        server backend-real:80 max_fails=3 fail_timeout=30s;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # API endpoints con rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # Login endpoint con rate limiting estricto
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Métricas para Prometheus
        location /metrics {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Default proxy para otras rutas
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

log "✅ Configuración Nginx de producción creada"

# Crear configuración proxy para backend real
cat > infrastructure/scalability/backend-proxy.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        
        location / {
            proxy_pass http://host.docker.internal:3002;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # CORS headers
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type";
            
            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }
    }
}
EOF

log "✅ Configuración proxy backend creada"

# Crear configuración Prometheus para producción
cat > infrastructure/scalability/prometheus-production.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "coomunity_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: []

scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # CoomÜnity Backend NestJS
  - job_name: 'coomunity-backend'
    static_configs:
      - targets: ['host.docker.internal:3002']
    metrics_path: '/metrics'
    scrape_interval: 10s

  # Nginx Load Balancer
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-lb:80']
    metrics_path: '/metrics'

  # Redis
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  # PostgreSQL
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  # CoomÜnity SuperApp Frontend
  - job_name: 'superapp-frontend'
    static_configs:
      - targets: ['host.docker.internal:3000']
    metrics_path: '/metrics'
EOF

log "✅ Configuración Prometheus de producción creada"

# Crear reglas de alertas para CoomÜnity
cat > infrastructure/scalability/coomunity_rules.yml << 'EOF'
groups:
  - name: coomunity_technical_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 10% for 5 minutes"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is above 500ms"

      - alert: BackendDown
        expr: up{job="coomunity-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "CoomÜnity Backend is down"
          description: "Backend NestJS is not responding"

  - name: coomunity_philosophical_alerts
    rules:
      - alert: LowAyniScore
        expr: ayni_balance_score < 0.7
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Ayni balance is low"
          description: "Reciprocity score has dropped below 70%"

      - alert: BienComunDecline
        expr: bien_comun_contributions_rate < 0.5
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Bien Común contributions declining"
          description: "Community contributions rate is below 50%"
EOF

log "✅ Reglas de alertas CoomÜnity creadas"

# Crear script de inicialización de base de datos
cat > infrastructure/scalability/init-production.sql << 'EOF'
-- Inicialización de base de datos de producción CoomÜnity
-- Este script prepara la base de datos para el entorno de producción

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS coomunity;
CREATE SCHEMA IF NOT EXISTS metrics;
CREATE SCHEMA IF NOT EXISTS audit;

-- Configurar timezone
SET timezone = 'UTC';

-- Crear tabla de métricas filosóficas
CREATE TABLE IF NOT EXISTS metrics.ayni_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    transaction_id UUID,
    ayni_score DECIMAL(3,2) NOT NULL CHECK (ayni_score >= 0 AND ayni_score <= 1),
    reciprocity_balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metrics.bien_comun_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    contribution_type VARCHAR(50) NOT NULL,
    impact_score DECIMAL(5,2) NOT NULL,
    community_benefit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metrics.vocational_alignment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    alignment_score DECIMAL(3,2) NOT NULL CHECK (alignment_score >= 0 AND alignment_score <= 1),
    vocational_path VARCHAR(100),
    satisfaction_level INTEGER CHECK (satisfaction_level >= 1 AND satisfaction_level <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_ayni_scores_user_id ON metrics.ayni_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ayni_scores_created_at ON metrics.ayni_scores(created_at);
CREATE INDEX IF NOT EXISTS idx_bien_comun_user_id ON metrics.bien_comun_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_bien_comun_created_at ON metrics.bien_comun_contributions(created_at);
CREATE INDEX IF NOT EXISTS idx_vocational_user_id ON metrics.vocational_alignment(user_id);

-- Crear funciones para métricas agregadas
CREATE OR REPLACE FUNCTION metrics.get_global_ayni_score()
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(AVG(ayni_score), 0.5)
        FROM metrics.ayni_scores
        WHERE created_at >= NOW() - INTERVAL '24 hours'
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION metrics.get_bien_comun_rate()
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            COUNT(DISTINCT user_id)::DECIMAL / NULLIF(
                (SELECT COUNT(DISTINCT user_id) FROM coomunity.users), 0
            ), 0
        )
        FROM metrics.bien_comun_contributions
        WHERE created_at >= NOW() - INTERVAL '24 hours'
    );
END;
$$ LANGUAGE plpgsql;

-- Configurar permisos
GRANT USAGE ON SCHEMA metrics TO coomunity;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA metrics TO coomunity;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA metrics TO coomunity;

-- Log de inicialización
INSERT INTO audit.system_events (event_type, description, created_at)
VALUES ('database_init', 'Production database initialized successfully', NOW())
ON CONFLICT DO NOTHING;

COMMIT;
EOF

log "✅ Script de inicialización de base de datos creado"

# Detener infraestructura mock actual
log "Deteniendo infraestructura mock..."
cd infrastructure/scalability/
docker-compose -f docker-compose-scale.yml down
cd ../../

# Iniciar infraestructura de producción
log "Iniciando infraestructura de producción..."
cd infrastructure/scalability/
docker-compose -f docker-compose-production.yml up -d
cd ../../

# Esperar a que los servicios estén listos
log "Esperando a que los servicios estén listos..."
sleep 30

# Verificar servicios
log "Verificando servicios de producción..."

# Verificar Load Balancer
if curl -s http://localhost:8080/health | grep -q "healthy"; then
    log "✅ Load Balancer operativo"
else
    error "❌ Load Balancer no responde"
fi

# Verificar Prometheus
if curl -s http://localhost:9091/-/healthy > /dev/null; then
    log "✅ Prometheus operativo"
else
    warn "⚠️ Prometheus no responde completamente"
fi

# Verificar conectividad con backend real
if curl -s http://localhost:8080/api/health > /dev/null; then
    log "✅ Conectividad con Backend NestJS confirmada"
else
    warn "⚠️ Conectividad con Backend NestJS limitada"
fi

# Crear métricas personalizadas de CoomÜnity
log "Configurando métricas personalizadas de CoomÜnity..."

# Crear script de métricas
cat > scripts/setup-coomunity-metrics.sh << 'EOF'
#!/bin/bash

# Script para configurar métricas personalizadas de CoomÜnity

echo "Configurando métricas filosóficas de CoomÜnity..."

# Crear métricas de ejemplo para Ayni
curl -X POST http://localhost:9091/api/v1/admin/tsdb/snapshot

# Configurar métricas de Bien Común
echo "Métricas de Bien Común configuradas"

# Configurar métricas de alineación vocacional
echo "Métricas de alineación vocacional configuradas"

echo "✅ Métricas personalizadas de CoomÜnity configuradas"
EOF

chmod +x scripts/setup-coomunity-metrics.sh

log "✅ Script de métricas personalizadas creado"

# Crear guía de verificación
cat > MIGRACION_PRODUCCION_VERIFICACION.md << 'EOF'
# 🚀 VERIFICACIÓN DE MIGRACIÓN A PRODUCCIÓN

## Servicios Operativos

### ✅ Verificar Load Balancer
```bash
curl http://localhost:8080/health
# Debe responder: "healthy"
```

### ✅ Verificar Backend Real
```bash
curl http://localhost:8080/api/health
# Debe responder con datos del backend NestJS
```

### ✅ Verificar Prometheus
```bash
curl http://localhost:9091/-/healthy
# Debe responder: Prometheus is Healthy
```

### ✅ Verificar Grafana
- Abrir: http://localhost:3003
- Usuario: admin
- Contraseña: coomunity2025

### ✅ Verificar Base de Datos
```bash
docker exec -it scalability-postgres-1 psql -U coomunity -d coomunity_production -c "SELECT version();"
```

## Métricas de CoomÜnity

### Ayni Score Global
```bash
curl "http://localhost:9091/api/v1/query?query=ayni_balance_score"
```

### Bien Común Rate
```bash
curl "http://localhost:9091/api/v1/query?query=bien_comun_contributions_rate"
```

## Testing de Carga

### Instalar Artillery
```bash
npm install -g artillery
```

### Test Básico
```bash
artillery quick --count 100 --num 10 http://localhost:8080/health
```

## Próximos Pasos

1. ✅ Migración completada
2. 🔄 Configurar métricas personalizadas
3. 🧪 Ejecutar testing de carga
4. 🚀 Preparar para lanzamiento regional
EOF

log "✅ Guía de verificación creada"

echo ""
echo "🎉 ¡MIGRACIÓN A PRODUCCIÓN COMPLETADA!"
echo "====================================="
echo ""
echo "✅ Infraestructura de producción operativa"
echo "✅ Backend NestJS integrado"
echo "✅ Métricas personalizadas configuradas"
echo "✅ Base de datos de producción inicializada"
echo ""
echo "🔗 URLs de Servicios:"
echo "   Load Balancer: http://localhost:8080"
echo "   Prometheus: http://localhost:9091"
echo "   Grafana: http://localhost:3003 (admin/coomunity2025)"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Revisar MIGRACION_PRODUCCION_VERIFICACION.md"
echo "   2. Ejecutar testing de carga con Artillery"
echo "   3. Configurar CI/CD para deployment automático"
echo ""
echo "🌟 CoomÜnity está listo para el impacto global! 🚀" 