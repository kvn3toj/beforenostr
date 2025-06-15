# 🌟 CoomÜnity SuperApp - Proyecto Unificado

**Versión:** v2.0 - ARQUITECTURA DEFINITIVA  
**Fecha:** 2025-01-19  
**Estado:** Backend 100% + Admin 100% + SuperApp 95%

---

## 🎯 **Visión General del Proyecto**

CoomÜnity Global es una plataforma gamificada que promueve la **economía colaborativa** basada en los principios de **Ayni** (reciprocidad), **Bien Común** y **cooperación consciente**. El proyecto incluye un ecosistema completo con backend robusto, panel administrativo y aplicación principal para usuarios.

## 🏗️ **Arquitectura del Sistema**

### 📊 **Diagrama Arquitectural Principal**

Para ver el diagrama completo y actualizado, consulta: [`ARQUITECTURA_DEFINITIVA.mmd`](./ARQUITECTURA_DEFINITIVA.mmd)

**Componentes Principales:**
- **🚀 Backend NestJS** (Puerto 3002) - ✅ 100% Funcional
- **🎛️ Gamifier Admin** (Puerto 3000) - ✅ 100% Integrado  
- **📱 SuperApp CoomÜnity** (Puerto 3001) - 🔄 95% Completado

### 📚 **Documentación Arquitectural**

| **Documento** | **Propósito** | **Estado** |
|---------------|---------------|------------|
| [`DOCUMENTACION_ARQUITECTURA_DEFINITIVA.md`](./DOCUMENTACION_ARQUITECTURA_DEFINITIVA.md) | Documentación completa con diagramas | ✅ Actualizada |
| [`INDICE_DIAGRAMAS_ARQUITECTURALES.md`](./INDICE_DIAGRAMAS_ARQUITECTURALES.md) | Índice maestro de todos los diagramas | ✅ Actualizado |
| [`REGLAS_AGENTE_IA_ACTUALIZADAS.md`](./REGLAS_AGENTE_IA_ACTUALIZADAS.md) | Reglas de desarrollo y arquitectura | ✅ Definitivas |

---

## 🚀 **Inicio Rápido**

### **Pre-requisitos:**
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### **Comandos de Desarrollo:**

```bash
# Backend NestJS (Puerto 3002)
cd backend/ && npm run dev

# SuperApp Frontend (Puerto 3001) 
cd apps/superapp-unified/ && npm run dev

# Gamifier Admin (Puerto 3000)
cd admin-frontend/ && npm run dev
```

### **Verificación de Estado:**
```bash
# Pre-flight check
ps aux | grep -E "(node|tsx|npm)" | grep -v grep
cat apps/superapp-unified/.env
curl http://localhost:3002/health -v
```

---

## 📁 **Estructura del Proyecto**

```
CoomÜnity-Global/
├── 🎯 apps/superapp-unified/        # SuperApp principal (este workspace)
├── 🏗️ backend/                     # Backend NestJS (fuera de workspace)
├── 🎛️ admin-frontend/              # Gamifier Admin (fuera de workspace)
├── 📊 ARQUITECTURA_DEFINITIVA.mmd   # Diagrama principal
├── 📚 DOCUMENTACION_*.md            # Documentación completa
└── 🔧 *.mmd                        # Diagramas especializados
```

### **Directorio Activo:** `apps/superapp-unified/`

```
apps/superapp-unified/
├── src/
│   ├── components/     # Componentes React reutilizables
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Servicios y utilidades
│   ├── pages/          # Páginas principales
│   ├── store/          # Estado global (Zustand)
│   └── types/          # Tipos TypeScript
├── tests/              # Tests E2E (Playwright)
├── package.json        # Dependencias y scripts
└── vite.config.ts      # Configuración Vite
```

---

## 🛠️ **Stack Tecnológico**

### **Backend (Completado 100%)**
- **Framework:** NestJS + TypeScript
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **Autenticación:** JWT + RBAC
- **Monitoring:** Prometheus + Grafana

### **Frontend SuperApp (95% Completado)**
- **Framework:** React 18 + TypeScript
- **UI:** Material-UI v7 + Tailwind CSS
- **Estado:** React Query + Zustand
- **Routing:** React Router v6
- **Build:** Vite 6.2.5
- **Testing:** Playwright 1.52.0 + Vitest

### **Frontend Admin (Completado 100%)**
- **Framework:** React + TypeScript
- **UI:** Material-UI + Design System
- **Estado:** React Query integrado
- **Testing:** E2E implementado

---

## 🧪 **Testing**

### **E2E Testing (Playwright):**
```bash
cd apps/superapp-unified/
npm run test:e2e          # Tests completos
npm run test:e2e:ui       # Con interfaz visual
npm run test:e2e:debug    # Modo debug
```

### **Unit Testing (Vitest):**
```bash
npm run test:unit         # Tests unitarios
npm run test:unit:watch   # Modo watch
npm run test:coverage     # Reporte de cobertura
```

---

## 🎯 **Estado del Desarrollo**

### ✅ **Completado (100%)**
- Backend NestJS con 15+ módulos
- Gamifier Admin Frontend integrado
- Autenticación JWT + RBAC
- Base de datos PostgreSQL + Prisma
- Cache Redis + Monitoring
- Testing infrastructure configurada

### 🔄 **En Desarrollo (95%)**
- SuperApp Frontend: Integración con Backend NestJS
- Migración de servicios temporales (Supabase → NestJS)
- Tests E2E completos contra backend real
- Limpieza de dependencias temporales

### 📋 **Próximos Pasos**
1. **Integración API SuperApp ↔ Backend NestJS**
2. **Autenticación JWT en SuperApp**
3. **Migración completa de datos**
4. **Testing E2E integrado**
5. **Deployment a producción**

---

## 🤖 **Desarrollo con IA**

Este proyecto utiliza un **Agente IA especializado** configurado con reglas específicas para CoomÜnity:

- **Filosofía:** Bien Común + Ayni + Cooperación Consciente
- **Arquitectura:** NestJS + React + TypeScript
- **Patrones:** SOLID + Clean Architecture + Testing
- **Documentación:** Diagramas Mermaid + Markdown

**Consulta:** [`REGLAS_AGENTE_IA_ACTUALIZADAS.md`](./REGLAS_AGENTE_IA_ACTUALIZADAS.md) para detalles completos.

---

## 🌟 **Filosofía CoomÜnity**

### **Principios Fundamentales:**
- **🤝 Ayni:** Reciprocidad justa en todas las interacciones
- **🌍 Bien Común:** Priorizar el beneficio colectivo
- **💫 Vocación:** Inspirar el crecimiento personal y profesional
- **🔄 Cooperación:** Colaborar conscientemente sobre competir

### **Elementos Naturales en Código:**
- **🌍 Tierra:** Seguridad y robustez (Backend + Auth)
- **💧 Agua:** Fluidez y claridad (UX + UI)
- **🔥 Fuego:** Acción y energía (Gamificación)
- **💨 Aire:** Visión y estructura (Arquitectura)

---

## 📞 **Soporte y Contribución**

### **Documentación Clave:**
- [Guía de Arquitectura Completa](./DOCUMENTACION_ARQUITECTURA_DEFINITIVA.md)
- [Índice de Diagramas](./INDICE_DIAGRAMAS_ARQUITECTURALES.md)
- [Reglas de Desarrollo](./REGLAS_AGENTE_IA_ACTUALIZADAS.md)

### **Contacto Técnico:**
- **Workspace Activo:** `apps/superapp-unified/`
- **Backend API:** `http://localhost:3002`
- **Admin Panel:** `http://localhost:3000`
- **SuperApp:** `http://localhost:3001`

---

**🌟 CoomÜnity Global - Transformando la Economía a través de la Tecnología Consciente**

---

**📌 Última Actualización:** 2025-01-19 - Arquitectura Definitiva v2.0
