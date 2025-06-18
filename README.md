# 🌟 CoomÜnity - Economía Colaborativa y Gamificación

Ecosistema completo de economía colaborativa que integra gamificación, desarrollo personal y comunidad a través de una SuperApp innovadora.

## 🚀 **Arquitectura del Proyecto**

Este es un monorepo que incluye:

- **🔧 Gamifier Admin**: Panel de administración para gamificar experiencias
- **🎮 SuperApp**: Aplicación principal para usuarios (CoomÜnity)  
- **⚙️ Backend NestJS**: API compartida con PostgreSQL y autenticación JWT

## 🌐 **Puertos de Desarrollo**

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **Backend NestJS** | `1111` | http://localhost:1111 | API principal compartida |
| **SuperApp** | `2222` | http://localhost:2222 | Aplicación CoomÜnity |
| **Gamifier Admin** | `3333` | http://localhost:3333 | Panel de administración |
| **API Docs** | `1111/api` | http://localhost:1111/api | Documentación Swagger |

## ⚡ **Quick Start**

### **Iniciar Todo el Ecosistema**
```bash
# Instalar dependencias (primera vez)
npm install

# Iniciar todos los servicios
npm run dev

# Verificar que todo funcione
npm run port:verify
```

### **Comandos Individuales**
```bash
# Backend únicamente
npm run dev:backend

# SuperApp únicamente
npm run dev:superapp

# Admin únicamente  
npm run dev:admin

# Ver resumen de migración
npm run port:summary
```

## 🔧 **Configuración Requerida**

### **Base de Datos**
- PostgreSQL ejecutándose en puerto `5432`
- Base de datos: `gamifier_db`

### **Variables de Entorno**
Configurar archivos `.env` según las plantillas en cada módulo.

## 🧪 **Testing**

```bash
# Tests E2E con Playwright
npm run test:e2e

# Tests específicos del SuperApp
npm run test:e2e --workspace=coomunity-superapp
```

## 📚 **Documentación**

- **📋 Migración de Puertos**: [docs/implementation/PORT_MIGRATION_SUMMARY.md](docs/implementation/PORT_MIGRATION_SUMMARY.md)
- **🚨 Troubleshooting**: [docs/troubleshooting/](docs/troubleshooting/)
- **🏗️ Arquitectura**: [docs/](docs/)

## 🌈 **Filosofía CoomÜnity**

Basado en principios de **Bien Común**, **Ayni** (reciprocidad), **Mëritos** y **economía sagrada**.

### **Conceptos Clave**
- **Ayni**: Reciprocidad equilibrada
- **Mëritos**: Sistema de recompensas por contribuir al Bien Común
- **Lükas**: Moneda interna de intercambio de valor
- **Öndas**: Unidades de energía vibracional por contribuciones positivas

## 🛠️ **Stack Tecnológico**

- **Frontend**: React 19, TypeScript, Material UI v7, Tailwind CSS
- **Backend**: NestJS, PostgreSQL, Prisma, Redis, JWT
- **Testing**: Playwright, Vitest
- **Build**: Vite, Turborepo (monorepo)
- **Deployment**: Docker, Docker Compose

## 📦 **Scripts Disponibles**

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar todo el ecosistema |
| `npm run port:verify` | Verificar puertos funcionando |
| `npm run port:summary` | Resumen de migración |
| `npm run stop:all` | Detener todos los procesos |
| `npm run preflight` | Verificación pre-vuelo |

## 🎯 **Para Desarrolladores**

### **Orden de Inicio Recomendado**
1. Verificar PostgreSQL ejecutándose
2. Ejecutar `npm run preflight` 
3. Iniciar con `npm run dev`
4. Acceder a URLs correspondientes

### **Puertos Históricos (OBSOLETOS)**
- ❌ Backend: 3002 → ✅ Ahora: 1111
- ❌ SuperApp: 3001 → ✅ Ahora: 2222  
- ❌ Admin: 3000 → ✅ Ahora: 3333

**Migración completada exitosamente** - Ver documentación de migración para detalles.

---

**🎊 ¡Bienvenido al ecosistema CoomÜnity!** 🎊
