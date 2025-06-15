# 🤖 REGLAS PARA BACKGROUND AGENTS DE CURSOR + SLACK - PROYECTO COOMUNITY

## 🎯 **CONFIGURACIÓN ESPECÍFICA PARA COOMUNITY**

### **Información del Proyecto**
- **Nombre**: CoomÜnity SuperApp
- **Repositorio**: `kevinp/coomunity` (ajustar según tu repo real)
- **Rama Principal**: `gamifier2.0`
- **Arquitectura**: Monorepo con Turborepo
- **Ubicación Raíz**: `/Users/kevinp/Movies/GAMIFIER copy/`

### **Puertos Definitivos**
- **Backend NestJS**: Puerto 3002
- **SuperApp Frontend**: Puerto 3001 (FIJO)
- **Admin Frontend**: Puerto 3000

---

## 🔧 **COMANDOS SLACK OPTIMIZADOS PARA COOMUNITY**

### **Comandos Básicos**
```
@Cursor [branch=gamifier2.0] fix authentication issues in SuperApp
@Cursor [branch=gamifier2.0] add new CoomÜnity module to marketplace
@Cursor [branch=gamifier2.0] optimize ÜPlay video player performance
```

### **Comandos Específicos por Módulo**
```
# Marketplace (GMP - Gamified Match Place)
@Cursor [branch=gamifier2.0] implement Ayni reciprocity logic in marketplace transactions

# ÜPlay (GPL - Gamified Play List)  
@Cursor [branch=gamifier2.0] add interactive questions to video player with Mëritos rewards

# Social Module
@Cursor [branch=gamifier2.0] create Emprendedores Confiables verification system

# UStats Module
@Cursor [branch=gamifier2.0] implement Öndas tracking dashboard with real-time metrics
```

---

## 🏗️ **CONTEXTO ARQUITECTÓNICO PARA AGENTES**

### **Estructura del Monorepo**
- **Backend**: `./src/` (NestJS, Prisma, PostgreSQL)
- **SuperApp**: `Demo/apps/superapp-unified/src/` (React, TypeScript, MUI, Tailwind)
- **Admin**: `admin-frontend/src/` (React, TypeScript, MUI)

### **Tecnologías Clave**
- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL, Redis, JWT, RBAC
- **Frontend**: React 18+, TypeScript, Material UI v7, Tailwind CSS, React Query, Zustand
- **Testing**: Playwright 1.53.0, Jest, Vitest
- **Build**: Vite, Turborepo, npm workspaces

---

## 🎮 **COMANDOS DE DESARROLLO CANÓNICOS**

### **Regla Crítica**: TODOS los comandos desde la raíz del monorepo

```bash
# ✅ CORRECTO - Iniciar ecosistema completo
@Cursor [branch=gamifier2.0] run "turbo run dev" to start all services

# ✅ CORRECTO - Servicios específicos  
@Cursor [branch=gamifier2.0] run "npm run dev:backend" for backend only
@Cursor [branch=gamifier2.0] run "npm run dev:superapp" for SuperApp only

# ✅ CORRECTO - Tests E2E
@Cursor [branch=gamifier2.0] run "npm run test:e2e --workspace=coomunity-superapp"
```

---

## 🧠 **FILOSOFÍA COOMUNITY PARA AGENTES**

### **Conceptos Clave a Integrar**
- **Ayni**: Reciprocidad - intercambio equilibrado de valor
- **Mëritos**: Sistema de recompensas basado en mérito para el Bien Común
- **Bien Común**: Priorizar beneficio colectivo sobre individual
- **Lükas**: Moneda interna de CoomÜnity para intercambio de valor
- **Öndas**: Unidades de energía vibracional por contribuciones positivas
- **Emprendedores Confiables**: Emprendedores que han ganado credibilidad

### **Prompts Filosóficos**
```
@Cursor [branch=gamifier2.0] implement feature following Ayni principles - ensure balanced value exchange
@Cursor [branch=gamifier2.0] design UI that promotes Bien Común over individual gain
@Cursor [branch=gamifier2.0] add Mëritos reward system for positive community contributions
```

---

## 🔒 **CREDENCIALES Y AUTENTICACIÓN**

### **Credenciales de Desarrollo Verificadas**
- **Admin**: `admin@gamifier.com / admin123`
- **Usuario**: `user@gamifier.com / 123456`
- **Premium**: `premium@gamifier.com / 123456`

### **Configuración de Tests**
- **Variable**: `VITE_ENABLE_MOCK_AUTH=false`
- **Endpoint**: `POST /auth/login` (puerto 3002)
- **Storage**: `COOMUNITY_AUTH_TOKEN`, `COOMUNITY_USER_DATA`

---

## 🚨 **PROTOCOLO PRE-FLIGHT PARA AGENTES**

### **Verificaciones Obligatorias**
```bash
# 1. Verificar ubicación (debe ser raíz del monorepo)
pwd  # Debe mostrar: /Users/kevinp/Movies/GAMIFIER copy

# 2. Limpiar procesos múltiples
pkill -f "vite" && pkill -f "npm run dev" && pkill -f "turbo"

# 3. Verificar puertos libres
lsof -i :3001,3002 || echo "Puertos disponibles ✅"

# 4. Verificar servicios
curl http://localhost:3002/health  # Backend
curl http://localhost:3001 -I      # SuperApp
```

---

## 📋 **TEMPLATES DE PROMPTS PARA SLACK**

### **Desarrollo de Funcionalidades**
```
@Cursor [branch=gamifier2.0] 
Implementa [funcionalidad] en el módulo [ÜPlay/Marketplace/Social/UStats].
Sigue los principios de [Ayni/Bien Común/Mëritos].
Usa las credenciales de desarrollo verificadas.
Ejecuta todos los comandos desde la raíz del monorepo.
Incluye tests E2E con Playwright.
```

### **Debugging y Fixes**
```
@Cursor [branch=gamifier2.0]
Debug el error [descripción] en [SuperApp/Backend].
Verifica que los servicios estén ejecutándose en puertos correctos (3001/3002).
Limpia procesos múltiples si es necesario.
Usa las credenciales admin@gamifier.com/admin123 para testing.
```

### **Refactoring Arquitectónico**
```
@Cursor [branch=gamifier2.0]
Refactoriza [componente/servicio] siguiendo las reglas de separación arquitectónica.
Backend: solo archivos NestJS en ./src/
Frontend: solo archivos React en Demo/apps/superapp-unified/src/
Mantén la filosofía CoomÜnity en el diseño.
```

---

## 🎯 **CONFIGURACIÓN DE CANAL SLACK**

### **Configuración Recomendada por Canal**

#### **#coomunity-backend**
```
@Cursor settings
Repositorio: kevinp/coomunity
Rama: gamifier2.0
Modelo: claude-3.5-sonnet
Contexto: Backend NestJS, Prisma, PostgreSQL
```

#### **#coomunity-superapp**
```
@Cursor settings  
Repositorio: kevinp/coomunity
Rama: gamifier2.0
Modelo: claude-3.5-sonnet
Contexto: React, TypeScript, MUI, Tailwind, Playwright
```

#### **#coomunity-general**
```
@Cursor settings
Repositorio: kevinp/coomunity  
Rama: gamifier2.0
Modelo: claude-3.5-sonnet
Contexto: Monorepo completo, filosofía CoomÜnity
```

---

## 🔧 **HERRAMIENTAS Y INTEGRACIONES**

### **MCP Servers Recomendados**
- **Database MCP**: Para esquemas Prisma
- **GitHub MCP**: Para gestión de PRs y issues
- **Documentation MCP**: Para docs de CoomÜnity

### **Comandos con Herramientas**
```
@Cursor [branch=gamifier2.0] use database MCP to generate API routes from Prisma schema
@Cursor [branch=gamifier2.0] use web search to find latest Material UI v7 patterns
@Cursor [branch=gamifier2.0] use GitHub MCP to create PR with proper CoomÜnity labels
```

---

## ✅ **CHECKLIST DE IMPLEMENTACIÓN**

### **Antes de Usar Agentes**
- [ ] Verificar ubicación en raíz del monorepo
- [ ] Limpiar procesos múltiples
- [ ] Confirmar puertos 3001/3002 disponibles
- [ ] Verificar rama gamifier2.0 activa
- [ ] Confirmar credenciales de desarrollo

### **Durante el Desarrollo**
- [ ] Usar comandos desde raíz únicamente
- [ ] Integrar principios filosóficos CoomÜnity
- [ ] Mantener separación arquitectónica estricta
- [ ] Incluir tests apropiados
- [ ] Verificar funcionamiento en puertos correctos

### **Después de Cambios**
- [ ] Ejecutar tests E2E
- [ ] Verificar health checks
- [ ] Confirmar no hay procesos múltiples
- [ ] Revisar PR generado
- [ ] Validar alineación filosófica

---

## 🏆 **BENEFICIOS ESPERADOS**

### **Eficiencia**
- ⚡ Desarrollo 10x más rápido con contexto completo
- 🎯 Prompts optimizados para arquitectura CoomÜnity
- 🔄 Iteración automática hasta tests verdes
- 📋 Templates reutilizables por módulo

### **Calidad**
- 🏗️ Respeto automático de reglas arquitectónicas
- 🧠 Integración natural de filosofía CoomÜnity
- 🔒 Uso correcto de credenciales verificadas
- ✅ Tests E2E incluidos automáticamente

### **Colaboración**
- 👥 Contexto compartido en hilos de Slack
- 📊 Visibilidad de progreso en tiempo real
- 🔗 PRs automáticos con contexto completo
- 🎨 Consistencia entre desarrolladores

---

**Estas reglas aseguran que los Background Agents de Cursor trabajen de forma óptima con la arquitectura y filosofía específicas del proyecto CoomÜnity.** 