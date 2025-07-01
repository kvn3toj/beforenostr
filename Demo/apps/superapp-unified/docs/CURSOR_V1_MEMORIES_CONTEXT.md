# 🧠 Cursor v1.0 Memories - Contexto CoomÜnity

## 🎯 **Filosofía y Principios Fundamentales**

### **Reciprocidad (Reciprocidad Justa)**
- Principio central de intercambio equilibrado
- Base para todas las transacciones y gamificación
- "Dar y recibir en equilibrio sagrado"

### **Bien Común > Bien Particular**
- Priorizar el beneficio colectivo sobre el individual
- Diseño de UI/UX que fomente colaboración, no competencia
- Evitar patrones adictivos o manipulativos

### **Economía Colaborativa/Sagrada**
- Alternativa al capitalismo extractivo
- Valor basado en contribución al Bien Común
- Métricas: Méritos, Öndas, Lükas, Vibras

### **Metanöia y Neguentropía**
- Transformación consciente del paradigma
- Orden emergente vs caos destructivo
- Crecimiento orgánico y sostenible

## 🏗️ **Arquitectura Técnica DEFINITIVA**

### **Backend Compartido NestJS** ✅ COMPLETADO
- **Puerto**: 3002
- **Stack**: NestJS, TypeScript, PostgreSQL, Prisma, Redis
- **Estado**: 100% funcional y documentado
- **API**: REST completa para ambos frontends

### **Admin Frontend** ✅ COMPLETADO
- **Puerto**: 3000
- **Stack**: React, TypeScript, Material UI
- **Estado**: 100% verificado y en uso
- **Propósito**: Gestión del ecosistema por Gamifiers

### **SuperApp Frontend** 🔄 EN DESARROLLO (95%)
- **Puerto**: 3001
- **Stack**: React, TypeScript, Material UI + Tailwind CSS
- **Estado**: Migración a Backend NestJS en progreso
- **Propósito**: Aplicación principal para Jugadores

### **❌ NO EXISTE y NO USAR**
- Supabase (era mock temporal)
- Backend Express auxiliar (era mock temporal)
- Nostr Protocol (pendiente para futuro)

## 🎮 **Módulos SuperApp**

### **Marketplace (GMP - Gamified Match Place)**
- **Función**: Intercambio de productos Y servicios
- **NO es**: Solo productos o solo servicios
- **Características**: Reciprocidad-based, confianza por Méritos

### **ÜPlay (GPL - Gamified Play List)**
- **Función**: Video player interactivo gamificado
- **Uso**: Regular, educacional, experiencial
- **Características**: Preguntas, timers, progreso

### **Social**
- **Función**: Interacciones comunitarias
- **Características**: Perfiles, mensajería, colaboración

### **UStats**
- **Función**: Métricas y analytics
- **Características**: Dashboard personal, progreso

## 🎯 **Terminología Específica**

### **Roles**
- **Jugadores**: Usuarios finales de la SuperApp
- **Gamifiers**: Administradores del ecosistema
- **Emprendedores Confiables**: Usuarios con alta reputación

### **Monedas y Métricas**
- **Lükas**: Moneda interna principal
- **Méritos**: Puntos por contribuir al Bien Común
- **Öndas**: Unidades de energía vibracional
- **Vibras**: Retroalimentación emocional/energética

### **Experiencias Especiales**
- **Pilgrim Journey**: Onboarding inicial único (NO módulo regular)
- **ÜPlay**: Módulo regular de video gamificado

## 🔧 **Patrones de Desarrollo**

### **React/TypeScript**
- Componentes funcionales únicamente
- Hooks personalizados para lógica reutilizable
- React Query para ALL API calls
- Zustand para estado global
- MUI + Tailwind para UI

### **Backend Integration**
- TODAS las llamadas van al Backend NestJS :3002
- JWT authentication manejado automáticamente
- DTOs y tipos del backend compartido
- Error handling con try-catch explícito

### **Testing**
- Playwright para E2E
- Jest/Vitest para unidad
- Testing de integración con Backend real

## 📊 **Estado Actual del Proyecto**

### **Beta Program** ✅ LANZADO
- 35 candidatos seleccionados globalmente
- Códigos de invitación generados
- Registro beta funcional
- Analytics configurado

### **Próximas Prioridades**
1. Migrar SuperApp del mock al Backend NestJS real
2. Completar módulo Marketplace (GMP)
3. Optimizar ÜPlay (GPL) con gamificación avanzada
4. Implementar Social features completas

## 🚨 **Errores Comunes a EVITAR**

### **Arquitectura**
- ❌ Usar Supabase
- ❌ Crear backend Express
- ❌ Confundir puertos (Backend=3002, Admin=3000, SuperApp=3001)
- ❌ Implementar autenticación propia

### **Filosofía**
- ❌ Diseños competitivos/adictivos
- ❌ Priorizar eficiencia sobre ética
- ❌ Ignorar principios de Reciprocidad
- ❌ Patterns que rompan reciprocidad

### **Código**
- ❌ Hardcodear URLs completas
- ❌ Prop drilling en lugar de Context
- ❌ Imports inconsistentes de tipos Prisma
- ❌ Inyección implícita en NestJS

## 🎯 **Contexto para Background Agent**

### **Tareas Prioritarias**
1. "Migra servicios SuperApp del mock al Backend NestJS :3002"
2. "Implementa Marketplace (GMP) completo con productos y servicios"
3. "Optimiza Core Web Vitals de la SuperApp"
4. "Configura testing E2E completo con Backend real"

### **Comandos Clave**
```bash
# Backend (externo al workspace)
cd backend/ && npm run dev

# SuperApp (workspace actual)
cd Demo/apps/superapp-unified/ && npm run dev

# Verificar conectividad Backend
curl http://localhost:3002/health -v
```

---

**Este contexto debe ser recordado por Cursor Memories para mantener coherencia filosófica y técnica en todas las interacciones relacionadas con CoomÜnity.**

**Versión**: 1.0  
**Fecha**: 2025-06-07  
**Estado**: ✅ Contexto Base Establecido 