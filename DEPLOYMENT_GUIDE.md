# 🚀 CoomÜnity - Guía de Deployment en Producción

## **Fase F.1: Configuración de Deployment Completada**

Esta guía describe cómo desplegar el ecosistema completo de CoomÜnity utilizando Docker y Docker Compose en un entorno de producción.

## 📋 **Requisitos Previos**

### **Sistema**
- Docker Engine 20.10+
- Docker Compose 2.0+
- Sistema Linux/macOS/Windows con WSL2
- Mínimo 4GB RAM, 20GB espacio en disco

### **Puertos Requeridos**
- `3000`: Gamifier Admin Frontend
- `3001`: SuperApp Frontend  
- `3002`: Backend NestJS API
- `5432`: PostgreSQL Database
- `6379`: Redis Cache
- `9090`: Prometheus (opcional)
- `3003`: Grafana (opcional)

## 🏗️ **Arquitectura de Deployment**

```
┌─────────────────────────────────────────────────────────────┐
│                   CoomÜnity Ecosystem                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Gamifier    │  │ SuperApp    │  │    Backend NestJS   │  │
│  │ Admin       │  │ Frontend    │  │                     │  │
│  │ :3000       │  │ :3001       │  │    :3002            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                      │           │
│         └────────────────┼──────────────────────┘           │
│                          │                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ PostgreSQL  │  │   Redis     │  │    Monitoring       │  │
│  │ Database    │  │   Cache     │  │  (Opcional)         │  │
│  │ :5432       │  │   :6379     │  │  Grafana:3003       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 **Deployment Rápido**

### **1. Configuración Inicial**

```bash
# Clonar el repositorio (si no está ya clonado)
git clone <repository-url>
cd coomunity-monorepo

# Configurar variables de entorno
npm run deploy:setup
```

### **2. Configurar Variables de Entorno**

Editar el archivo `.env.prod` generado:

```bash
# Configurar valores seguros
nano .env.prod
```

**⚠️ IMPORTANTE:** Cambiar todos los valores por defecto, especialmente:
- `DB_PASSWORD`: Contraseña segura para PostgreSQL
- `JWT_SECRET`: Clave secreta para JWT (mínimo 256 bits)
- `REDIS_PASSWORD`: Contraseña para Redis

### **3. Deployment Completo**

```bash
# Deployment completo (build + start)
npm run deploy:full

# O usando el script directo
./scripts/docker-deploy.sh full
```

### **4. Verificar Deployment**

```bash
# Verificar estado de servicios
npm run docker:ps

# Verificar logs
npm run docker:logs

# Verificar salud del sistema
npm run health:all
```

## 🎯 **URLs de Acceso**

Después del deployment exitoso:

- **SuperApp (Usuarios)**: http://localhost:3001
- **Gamifier Admin**: http://localhost:3000  
- **Backend API Docs**: http://localhost:3002/api
- **Grafana** (si monitoring habilitado): http://localhost:3003
- **Prometheus** (si monitoring habilitado): http://localhost:9090

## 📚 **Comandos de Deployment**

### **Build Commands**
```bash
npm run docker:build              # Build todos los servicios
npm run docker:build:backend      # Build solo backend
npm run docker:build:superapp     # Build solo SuperApp
npm run docker:build:admin        # Build solo Admin
```

### **Deployment Commands**
```bash
npm run deploy:full               # Deployment completo
npm run deploy:start              # Solo iniciar servicios
npm run deploy:stop               # Detener servicios
npm run deploy:restart            # Reiniciar servicios
```

### **Monitoring Commands**
```bash
npm run deploy:monitoring         # Iniciar con monitoring
npm run monitoring:start          # Solo monitoring stack
```

### **Logs y Debugging**
```bash
npm run docker:logs               # Logs de todos los servicios
npm run docker:logs:backend       # Logs solo del backend
npm run docker:logs:superapp      # Logs solo de SuperApp
npm run docker:logs:admin         # Logs solo del Admin
```

## 🔧 **Configuración Avanzada**

### **Variables de Entorno Críticas**

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DB_PASSWORD` | Contraseña PostgreSQL | ✅ |
| `JWT_SECRET` | Clave secreta JWT | ✅ |
| `REDIS_PASSWORD` | Contraseña Redis | ✅ |
| `ALLOWED_ORIGINS` | Dominios permitidos CORS | ✅ |
| `VITE_API_BASE_URL` | URL del backend para frontends | ✅ |

### **Profiles de Docker Compose**

**Base Profile** (por defecto):
- Backend NestJS
- SuperApp Frontend  
- Gamifier Admin Frontend
- PostgreSQL Database
- Redis Cache

**Monitoring Profile**:
```bash
npm run deploy:monitoring
```
Incluye:
- Prometheus para métricas
- Grafana para dashboards

**Proxy Profile**:
```bash
./scripts/docker-deploy.sh proxy
```
Incluye:
- Nginx como reverse proxy
- SSL/TLS termination

## 🛠️ **Maintenance**

### **Backup de Base de Datos**

```bash
# Backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U coomunity_user coomunity_prod > backup.sql

# Restore
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U coomunity_user coomunity_prod < backup.sql
```

### **Actualización de Servicios**

```bash
# Update código y rebuild
git pull origin main
npm run docker:build
npm run deploy:restart
```

### **Monitoreo de Logs**

```bash
# Logs en tiempo real
npm run docker:logs

# Logs de servicio específico
npm run docker:logs:backend

# Buscar errores
docker-compose -f docker-compose.prod.yml logs | grep -i error
```

## 🚨 **Troubleshooting**

### **Problemas Comunes**

**1. Servicios no inician:**
```bash
# Verificar logs
npm run docker:logs

# Verificar estado
npm run docker:ps

# Verificar recursos
docker system df
```

**2. Base de datos no conecta:**
```bash
# Verificar PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Verificar variables de entorno
docker-compose -f docker-compose.prod.yml exec backend env | grep DATABASE
```

**3. Frontend no carga:**
```bash
# Verificar build
npm run docker:build:superapp

# Verificar configuración de Nginx
docker-compose -f docker-compose.prod.yml exec superapp nginx -t
```

### **Comandos de Diagnostico**

```bash
# Estado del sistema Docker
docker system info

# Uso de recursos
docker stats

# Verificar networks
docker network ls | grep coomunity

# Verificar volumes
docker volume ls | grep coomunity
```

## 📈 **Escalabilidad**

### **Horizontal Scaling**

Para escalar servicios horizontalmente:

```bash
# Escalar SuperApp a 3 instancias
docker-compose -f docker-compose.prod.yml up -d --scale superapp=3

# Escalar Backend a 2 instancias  
docker-compose -f docker-compose.prod.yml up -d --scale backend=2
```

### **Load Balancing**

Para producción con alta disponibilidad, considerar:
- Nginx como load balancer
- Multiple instancias de cada servicio
- Database clustering
- Redis clustering

## 🔒 **Seguridad**

### **Configuraciones de Seguridad**

1. **Cambiar contraseñas por defecto**
2. **Usar HTTPS en producción**
3. **Configurar firewall**
4. **Regular security updates**
5. **Monitoring de seguridad**

### **SSL/TLS Setup**

Para HTTPS, configurar en `.env.prod`:
```bash
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

## 📞 **Soporte**

Para problemas de deployment:

1. **Verificar logs**: `npm run docker:logs`
2. **Revisar estado**: `npm run docker:ps`  
3. **Verificar configuración**: Revisar `.env.prod`
4. **Consultar documentación**: Este archivo
5. **Restart services**: `npm run deploy:restart`

---

## ✅ **Fase F.1 Completada**

La configuración de deployment está lista para:
- ✅ Contenerización completa del ecosistema
- ✅ Orquestación con Docker Compose
- ✅ Scripts automatizados de deployment
- ✅ Monitoring opcional con Prometheus/Grafana
- ✅ Configuración de seguridad básica
- ✅ Documentación completa

**Próximos pasos**: Fase F.2 - Configuración de CI/CD y automatización avanzada. 