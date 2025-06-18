# 🤖 REGLAS DE CONTEXTO PARA AGENTE IA - PROYECTO COOMÜNITY

## 📋 OBJETIVO

Este documento define las reglas críticas para el Agente IA de Cursor para evitar confusiones entre los diferentes componentes del proyecto CoomÜnity durante el desarrollo.

## 🏗️ ARQUITECTURA DEL PROYECTO

### Componentes Actuales:
- **[BACKEND]** - Backend NestJS compartido (Puerto 3002) - **EXTERNO** al workspace actual
- **[SUPERAPP]** - SuperApp Frontend (Puerto 3000/3001/5173) - `Demo/apps/superapp-unified/`

### Componentes No Existentes (Referencias Prohibidas):
- ❌ Supabase (era mock temporal)
- ❌ Backend Express (era mock temporal)
- ❌ Gamifier Admin Frontend (está en otro proyecto/workspace)

## 🔧 REGLAS IMPLEMENTADAS

### 1. **Prefijos Obligatorios**
- `[BACKEND]` - Para referencias al Backend NestJS externo
- `[SUPERAPP]` - Para el Frontend en `Demo/apps/superapp-unified/`
- `[GLOBAL]` - Para cambios que afectan múltiples componentes

### 2. **Estructura de Directorios**
```
workspace-root/
├── Demo/
│   └── apps/
│       └── superapp-unified/        [SUPERAPP]
│           ├── src/
│           ├── public/
│           └── package.json
├── backend/ (EXTERNO)               [BACKEND]
└── otros directorios...
```

### 3. **Comandos de Terminal**
```bash
# ✅ CORRECTO
[SUPERAPP] cd Demo/apps/superapp-unified/ && npm run dev

# ❌ INCORRECTO
npm run dev
```

### 4. **Referencias a Archivos**
```bash
# ✅ CORRECTO
[SUPERAPP] Demo/apps/superapp-unified/src/contexts/AuthContext.tsx

# ❌ INCORRECTO
AuthContext.tsx
```

### 5. **Comunicación API**
```bash
# ✅ CORRECTO
[SUPERAPP→BACKEND] Llamada desde SuperApp a http://localhost:1111/users

# ❌ INCORRECTO
La API no responde
```

## 📁 ARCHIVOS DE REGLAS

### Archivos Creados:
1. `.cursor/rules/context-clarity.cursorrules` - Reglas detalladas de contexto
2. `.cursor/rules/.cursorrules` - Reglas principales actualizadas
3. `Demo/REGLAS_CONTEXTO_AGENTE_IA.md` - Esta documentación

### Aplicación Automática:
- Las reglas se aplican automáticamente cuando el Agente IA trabaja en archivos del proyecto
- El Agente debe seguir los protocolos definidos en cada interacción

## 🎯 BENEFICIOS ESPERADOS

### ✅ Problemas Resueltos:
- ✅ Confusión entre Backend externo y SuperApp
- ✅ Comandos ejecutados en directorio incorrecto
- ✅ Referencias ambiguas a archivos
- ✅ Pérdida de tiempo en debugging por contexto incorrecto

### ✅ Mejoras Implementadas:
- ✅ Claridad absoluta en cada instrucción del Agente
- ✅ Rutas específicas y completas
- ✅ Comandos con directorio explícito
- ✅ Arquitectura real reforzada constantemente

## 🚨 PROTOCOLO DE VERIFICACIÓN

### Antes de cada respuesta del Agente, verificar:
- [ ] ¿Especificó el componente con [BACKEND]/[SUPERAPP]?
- [ ] ¿Incluyó ruta completa desde raíz del workspace?
- [ ] ¿Indicó el directorio Demo/apps/superapp-unified/ para comandos?
- [ ] ¿Clarificó que el Backend es externo al workspace?
- [ ] ¿Reforzó la arquitectura real (Backend NestJS externo)?
- [ ] ¿Evitó referencias a mocks temporales?

## 📈 IMPACTO EN EL DESARROLLO

### Eficiencia Esperada:
- 🚀 **Reducción de errores** por contexto incorrecto
- 🚀 **Aceleración del debugging** con rutas claras
- 🚀 **Mejor comunicación** entre desarrollador y Agente IA
- 🚀 **Prevención de confusiones** arquitectónicas

### Próximos Pasos:
1. ✅ Reglas implementadas y activas
2. 🔄 Monitoreo de aplicación en desarrollo actual
3. 🔄 Ajustes según feedback del uso real
4. 🔄 Documentación de casos de uso específicos

---

**Fecha de Implementación**: 2025-01-07  
**Estado**: Activo y aplicándose automáticamente  
**Mantenimiento**: Ajustar según evolución del proyecto 