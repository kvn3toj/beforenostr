# 🟡 CoomÜnity SuperApp - Sistema Mock Completo

## 🎯 Propósito

Este sistema mock permite la **operación completa de la SuperApp sin necesidad de un backend activo**, facilitando:
- ✅ Pruebas de usuario en producción 
- ✅ Desarrollo frontend independiente
- ✅ Demostraciones sin dependencias
- ✅ Testing end-to-end estable

## 🚨 Estado Actual: ACTIVADO

El sistema mock está **TEMPORALMENTE ACTIVADO** para resolver problemas de backend en producción.

## 🔧 Configuración Actual

### Variables de Entorno (`.env`)

```bash
# Mock System - ACTIVADO
VITE_ENABLE_MOCK_AUTH=true
VITE_ENABLE_MOCK_DATA=true
VITE_MOCK_MODE=true
VITE_USE_BACKEND=false
VITE_MOCK_MARKETPLACE=true
VITE_MOCK_VIDEOS=true
VITE_MOCK_SOCIAL=true
VITE_MOCK_WALLET=true
VITE_MOCK_CHALLENGES=true
VITE_MOCK_UPLAY=true
```

## 📊 Datos Mock Disponibles

### 🔐 Autenticación
- **Usuario Mock**: `test@coomunity.com`
- **Token JWT**: Simulado con validación básica
- **Roles**: `['user']` con permisos estándar

### 🛒 Marketplace (GMP - Gamified Match Place)
- **5 Items realistas** con diversidad de tipos:
  - Servicios (Filosofía Andina, Desarrollo Web)
  - Productos (Quinoa Orgánica)
  - Experiencias (Meditación y Reconexión)
  - Intercambios de Habilidades (Permacultura x Diseño)

### 💰 Wallet
- **3 Monedas CoomÜnity**:
  - **LUKAS**: 1,250 (moneda de intercambio)
  - **ONDAS**: 2,800 (energía positiva) 
  - **MÉRITOS**: 450 (reconocimiento por contribuciones)
- **Historial de transacciones** realista

### 🎮 ÜPlay (GPL - Gamified Play List)
- **3 Videos educativos** con filosofía CoomÜnity:
  - "Introducción al Reciprocidad y la Reciprocidad"
  - "El Bien Común como Norte"  
  - "Generando Öndas Positivas"
- **Preguntas interactivas** con gamificación
- **Métricas**: views, likes, reciprocidadScore

### 🏆 Challenges
- **2 Desafíos activos**:
  - "Desafío de Reciprocidad Semanal" 
  - "Mes del Bien Común"
- **Recompensas**: MÉRITOS, ÖNDAS, LÜKAS, badges

### 👥 Social
- **Feed social** con posts de usuarios reales
- **Mensajes** de otros emprendedores
- **Interacciones** (likes, comments, shares)

## 🔄 Funcionamiento

### Detección Automática
El sistema detecta automáticamente cuando debe usar mocks basado en:
1. **Producción** + `VITE_USE_BACKEND=false` → Mocks activados
2. **Desarrollo** + cualquier `VITE_MOCK_*=true` → Mocks activados

### Interceptación de API
```typescript
// En api-service.ts
if (isMockMode()) {
  const mockData = getMockData(endpoint, method);
  return Promise.resolve(mockData);
}
```

### Fallback Automático
Los servicios tienen fallback a mocks en caso de errores del backend:
```typescript
// En marketplace.service.ts
catch (error) {
  if (!isMockMode()) {
    console.warn('Falling back to mock data due to backend error');
    return this.getItems({ ...filters, __forceMock: true });
  }
}
```

## 🧪 Testing y Verificación

### Script de Verificación
```bash
node verify-mock-system.js
```

### Tests E2E
Los tests E2E funcionan completamente con datos mock, permitiendo:
- Pruebas estables sin dependencias externas
- Validación de flujos completos
- Verificación de UI/UX

## 🚀 Para Despliegue

### Vercel/Netlify
La configuración actual está optimizada para despliegue en plataformas como Vercel:
- ✅ No requiere backend activo
- ✅ Todas las funcionalidades operativas
- ✅ Datos realistas para demostración
- ✅ Performance óptimo (sin llamadas de red)

### Variables de Producción
En producción, asegurar que:
```bash
VITE_USE_BACKEND=false  # Para usar mocks
VITE_APP_ENV=production
```

## 🔄 Volver al Modo Normal

Para restaurar el backend real:
```bash
# En .env
VITE_USE_BACKEND=true
VITE_MOCK_MODE=false
VITE_ENABLE_MOCK_DATA=false
```

## 📚 Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   API Service    │───▶│   Mock Data     │
│   Components    │    │   (isMockMode)   │    │   (Realistic)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Real Backend   │
                       │   (when enabled) │
                       └──────────────────┘
```

## 🎯 Características Destacadas

### Realismo
- **Datos auténticos** basados en la filosofía CoomÜnity
- **Interacciones reales** (Reciprocidad, Bien Común, Öndas)
- **Flujos completos** de usuario

### Performance
- **Carga instantánea** (sin llamadas de red)
- **Simulación de latencia** (300ms) para realismo
- **Caching** automático de datos

### Mantenibilidad
- **Código limpio** y bien documentado
- **Tipos TypeScript** estrictos
- **Extensible** para nuevas funcionalidades

## 🆘 Troubleshooting

### Mock no se activa
1. Verificar variables en `.env`
2. Ejecutar `node verify-mock-system.js`
3. Revisar console del navegador para logs `🟡 [MOCK]`

### Datos no aparecen
1. Verificar que `VITE_USE_BACKEND=false`
2. Limpiar cache del navegador
3. Restart del servidor de desarrollo

### Error en producción
1. Verificar variables de entorno en plataforma de deploy
2. Asegurar que `VITE_APP_ENV=production`
3. Revisar logs de build

## ✅ Estado Verificado

- ✅ **Configuración**: Todas las variables correctas
- ✅ **Datos Mock**: 5 marketplace items, 3 videos, 2 challenges
- ✅ **API Service**: Interceptación funcionando
- ✅ **Servicios**: Marketplace, Auth, Wallet operativos
- ✅ **Testing**: Script de verificación exitoso

---

**🎉 Sistema Mock listo para pruebas de usuario y despliegue en producción**

> **Nota**: Este es un sistema temporal mientras se resuelven los problemas del backend. El objetivo es mantener la aplicación operativa para los usuarios durante la transición. 
