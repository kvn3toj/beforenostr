# 🌍 CoomÜnity - Plataforma Gamificada de Bien Común

> **Transformando la economía colaborativa a través de la gamificación y la filosofía del Ayni**

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.1.1-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Material UI](https://img.shields.io/badge/Material--UI-7.0.1-0081CB.svg)](https://material-ui.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748.svg)](https://www.prisma.io/)

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [📦 Scripts Disponibles](#-scripts-disponibles)
- [🧪 Testing](#-testing)
- [🔧 Configuración](#-configuración)
- [📖 Documentación](#-documentación)

## 🎯 Descripción del Proyecto:

CoomÜnity es una plataforma revolucionaria que implementa los principios del **Bien Común** y la **reciprocidad (Ayni)** a través de una experiencia gamificada. Combina un marketplace colaborativo, un sistema de video interactivo, funcionalidades sociales y una economía interna basada en **Lükas** y **Mëritos**.

### 🌟 Módulos Principales

- **🎮 ÜPlay (GPL)** - Video player gamificado interactivo
- **🛒 Marketplace (GMP)** - Intercambio de productos y servicios
- **👥 Social** - Comunidad y colaboración
- **💰 Wallet** - Gestión de Lükas (moneda interna)
- **📊 Analytics** - Métricas y seguimiento de progreso

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura de **monorepo** con separación clara de responsabilidades:

```
📁 GAMIFIER-copy/ (RAÍZ DEL MONOREPO)
├── 📁 backend/src/              # 🔧 Backend NestJS
│   ├── auth/                    # Autenticación JWT
│   ├── users/                   # Gestión de usuarios
│   ├── marketplace/             # API Marketplace
│   ├── social/                  # API Social
│   ├── analytics/               # Métricas
│   └── [42+ módulos más]        # Funcionalidad completa
├── 📁 Demo/apps/superapp-unified/  # 📱 SuperApp Frontend
│   ├── src/components/          # Componentes React
│   ├── src/pages/              # 50+ páginas
│   ├── src/services/           # 29 servicios API
│   └── src/modules/            # Módulos por funcionalidad
├── 📁 apps/admin-frontend/      # 👨‍💼 Gamifier Admin
├── package.json                 # Configuración Turborepo
└── turbo.json                   # Orquestación
```

### 🛠️ Stack Tecnológico

**Frontend (SuperApp)**:

- React 19.1.0 + TypeScript 5.7.2
- Material UI 7.0.1 + Tailwind CSS
- Vite 6.3.5 + React Query + Zustand
- Playwright (Testing E2E)

**Backend**:

- NestJS 11.1.1 + TypeScript
- Prisma ORM + PostgreSQL + Redis
- JWT Authentication + WebSocket
- Swagger API Documentation

**DevOps**:

- Turborepo (Monorepo Management)
- Docker + Prometheus + Grafana
- GitHub Actions (CI/CD)

## 🚀 Inicio Rápido

### 📋 Prerequisitos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0
- **Redis** >= 6.0

### ⚡ Instalación

1. **Clonar el repositorio**:

```bash
git clone https://github.com/tu-usuario/coomunity.git
cd GAMIFIER-copy
```

2. **Instalar dependencias**:

```bash
npm install
```

3. **Configurar variables de entorno**:

```bash
# Crear archivo .env para la SuperApp
cp Demo/apps/superapp-unified/env.example Demo/apps/superapp-unified/.env

# Configurar variables de backend (crear backend/.env)
# Incluir configuración de PostgreSQL y Redis
```

4. **Inicializar base de datos**:

```bash
npm run db:reset
npm run db:seed
```

5. **Iniciar servicios**:

```bash
# Iniciar todo el ecosistema
npm run dev

# O iniciar servicios individuales
npm run dev:backend    # Backend en puerto 3002
npm run dev:superapp   # SuperApp en puerto 3001
npm run dev:admin      # Admin en puerto 3000
```

### 🔍 Verificación

- **Backend**: http://localhost:3002/health
- **SuperApp**: http://localhost:3001
- **API Docs**: http://localhost:3002/api
- **Admin Panel**: http://localhost:3000

## 📦 Scripts Disponibles

### 🎯 Desarrollo

```bash
npm run dev                 # Iniciar ecosistema completo
npm run dev:backend         # Solo backend NestJS
npm run dev:superapp        # Solo SuperApp
npm run dev:admin          # Solo Admin Panel
npm run preflight          # Verificación pre-desarrollo
```

### 🏗️ Build y Deploy

```bash
npm run build              # Build completo
npm run build:backend      # Build solo backend
npm run start:backend:prod # Producción backend
```

### 🧪 Testing

```bash
npm run test               # Tests unitarios
npm run test:e2e           # Tests E2E con Playwright
npm run test:e2e --workspace=coomunity-superapp  # E2E específico
```

### 🔧 Utilidades

```bash
npm run clean:processes    # Limpiar procesos
npm run port:status        # Estado de puertos
npm run db:reset           # Reset base de datos
npm run db:seed           # Poblar con datos de prueba
```

## 🧪 Testing

### 🎭 Tests E2E (Playwright)

El proyecto incluye +50 tests E2E que cubren:

- ✅ Autenticación completa
- ✅ Navegación entre módulos
- ✅ CRUD operations (Marketplace)
- ✅ Video player interactivo
- ✅ Funcionalidades sociales
- ✅ Wallet y transacciones

**Ejecutar tests**:

```bash
# Todos los tests
npm run test:e2e

# Test específico
npx playwright test --project=chromium --headed

# Modo debug
npx playwright test --debug

# Reporte HTML
npx playwright show-report
```

### 🔑 Credenciales de Testing

```typescript
// Credenciales verificadas para desarrollo y testing
admin@gamifier.com / admin123      // Administrador
user@gamifier.com / 123456         // Usuario regular
premium@gamifier.com / 123456      // Usuario premium
creator@gamifier.com / 123456      // Content creator
moderator@gamifier.com / 123456    // Moderador
```

## 🔧 Configuración

### 🌐 Variables de Entorno

**SuperApp** (`Demo/apps/superapp-unified/.env`):

```env
VITE_API_BASE_URL=http://localhost:3002
VITE_BASE_URL=http://localhost:3001
VITE_ENABLE_MOCK_AUTH=false
VITE_APP_ENV=development
```

**Backend** (`backend/.env`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/coomunity"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret"
PORT=3002
```

### 🐳 Docker

```bash
# Desarrollo con Docker
docker-compose -f docker-compose.dev.yml up

# Producción
docker-compose -f docker-compose.prod.yml up
```

## 📖 Documentación

### 📚 Documentación Adicional

- [📋 Guía de Desarrollo](docs/guides/DEVELOPMENT_GUIDE.md)
- [🏗️ Arquitectura Detallada](docs/architecture/ARCHITECTURE.md)
- [🧪 Guía de Testing](docs/testing/TESTING_GUIDE.md)
- [🚀 Deploy &amp; CI/CD](docs/deployment/DEPLOYMENT.md)
- [🎨 Design System](docs/design/DESIGN_SYSTEM.md)

### 🔗 Enlaces Útiles

- [API Documentation](http://localhost:3002/api) (Swagger)
- [Storybook](http://localhost:6006) (Component Library)
- [Admin Panel](http://localhost:3000)

## 🏆 Estado del Proyecto

- ✅ **SuperApp**: 95% completado
- ✅ **Backend**: 100% funcional
- ✅ **Testing**: Cobertura E2E extensa
- ✅ **Integración**: Frontend-Backend conectado
- ✅ **Arquitectura**: Limpia y escalable

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

---

**🌟 CoomÜnity - Construyendo el futuro de la economía colaborativa**
