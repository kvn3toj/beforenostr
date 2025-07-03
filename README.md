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

CoomÜnity es una plataforma revolucionaria que implementa los principios del **Bien Común** y la **reciprocidad (Ayni)** a través de una experiencia gamificada. Combina un marketplace colaborativo, un sistema de video interactivo, funcionalidades sociales y una economía interna basada en **Ünits** y **Mëritos**.

### 🌟 Módulos Principales

- **🎮 ÜPlay (GPL)** - Video player gamificado interactivo
- **🛒 Marketplace (GMP)** - Intercambio de productos y servicios
- **👥 Social** - Comunidad y colaboración
- **💰 Wallet** - Gestión de Ünits (moneda interna)
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

## 🔧 Configuración

### Configuración del Monorepo TypeScript

Este proyecto utiliza **TypeScript Project References** para gestionar eficientemente el monorepo. Esta estrategia permite una compilación incremental y una separación lógica entre los distintos paquetes y aplicaciones.

**Punto Clave:** El archivo `tsconfig.json` ubicado en la raíz del proyecto es el **mapa maestro** que define las relaciones entre todos los sub-proyectos de TypeScript.

Si añades un nuevo paquete o aplicación (en `packages/` o `apps/`) que deba ser reconocido por el compilador de TypeScript, **es obligatorio** que lo añadas al array `references` en el `tsconfig.json` raíz.

**Ejemplo de Configuración Correcta (`tsconfig.json`):**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.backend.json" },
    { "path": "./Demo/apps/superapp-unified" },
    { "path": "./packages/shared-types" },
    { "path": "./packages/sync-engine" }
  ]
}
```

### Validación del Entorno

Para verificar que la configuración de TypeScript y los permisos del sistema de archivos son correctos, puedes usar el script de validación del entorno:

```bash
npx ts-node check-env.ts
```

Este comando ejecutará una serie de pruebas, incluyendo importaciones cruzadas entre paquetes, y confirmará si el entorno está estable y listo para el desarrollo.

## 📖 Documentación
