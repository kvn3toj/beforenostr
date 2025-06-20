# 🔐 CREDENCIALES VERIFICADAS DEL BACKEND - REGLA OBLIGATORIA

## 🚨 REGLA CRÍTICA PARA DESARROLLO Y TESTING

**SIEMPRE usar estas credenciales verificadas del backend NestJS. NO inventar credenciales.**

---

## ✅ CREDENCIALES OFICIALES VERIFICADAS

### 🔑 **Administrador Principal**
```
Email: admin@gamifier.com
Password: admin123
Roles: ['admin']
Uso: Tests de funcionalidades administrativas, debugging avanzado
```

### 👤 **Usuario Regular**
```
Email: user@gamifier.com
Password: 123456
Roles: ['user']
Uso: Tests de funcionalidades básicas, flujos de usuario estándar
```

### 💎 **Usuario Premium**
```
Email: premium@gamifier.com
Password: 123456
Roles: ['user', 'premium']
Uso: Tests de funcionalidades premium
```

### 🎨 **Content Creator**
```
Email: creator@gamifier.com
Password: 123456
Roles: ['user', 'creator']
Uso: Tests de creación de contenido
```

### 🛡️ **Moderador**
```
Email: moderator@gamifier.com
Password: 123456
Roles: ['user', 'moderator']
Uso: Tests de moderación
```

---

## 🎯 CONFIGURACIÓN OBLIGATORIA

### Variables de Entorno
```bash
# En Demo/apps/superapp-unified/.env
VITE_ENABLE_MOCK_AUTH=false
VITE_API_BASE_URL=http://localhost:3002
```

### Endpoints Verificados
```
Backend: http://localhost:3002
Login: POST /auth/login
Health: GET /health
```

---

## ❌ CREDENCIALES PROHIBIDAS

**NUNCA usar estas credenciales que causan errores:**
- `invalid@example.com`
- `test@test.com`
- `fake@fake.com`
- `nonexistent@domain.com`
- Cualquier email inventado

---

## 🧪 EJEMPLOS DE USO EN TESTS

### Playwright E2E Test
```typescript
// ✅ CORRECTO
await page.fill('[data-testid="login-email-input"] input', 'admin@gamifier.com');
await page.fill('[data-testid="login-password-input"] input', 'admin123');

// ❌ INCORRECTO - Causa errores 400/401
await page.fill('[data-testid="login-email-input"] input', 'invalid@example.com');
```

### cURL Testing
```bash
# ✅ CORRECTO
curl -X POST "http://localhost:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}'

# ❌ INCORRECTO - Desperdicia tokens
curl -X POST "http://localhost:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "fake@test.com", "password": "wrong"}'
```

---

## 💰 BENEFICIOS DE ESTA REGLA

### ✅ **Previene:**
- ❌ Errores 400 Bad Request
- ❌ Errores 401 Unauthorized  
- ❌ Reprocesos costosos
- ❌ Gasto innecesario de tokens de API
- ❌ Tiempo perdido en debugging

### ✅ **Garantiza:**
- ✅ Tests confiables y reproducibles
- ✅ Desarrollo eficiente
- ✅ Debugging efectivo
- ✅ Ahorro de recursos
- ✅ Flujos de trabajo optimizados

---

## 🔍 VERIFICACIÓN RÁPIDA

### Comando de Verificación
```bash
# Verificar que el backend esté funcionando
curl http://localhost:3002/health

# Test rápido de login
curl -X POST "http://localhost:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' | jq
```

### Respuesta Esperada
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "admin@gamifier.com",
    "roles": ["admin"]
  }
}
```

---

## 📋 CHECKLIST DE CUMPLIMIENTO

Antes de cualquier test o desarrollo, verificar:

- [ ] ✅ Backend ejecutándose en puerto 3002
- [ ] ✅ `VITE_ENABLE_MOCK_AUTH=false` configurado
- [ ] ✅ Usando credenciales de la lista oficial
- [ ] ✅ NO usando credenciales inventadas
- [ ] ✅ Endpoint `/auth/login` responde correctamente

---

## 🚨 RECORDATORIO CRÍTICO

**Esta regla es OBLIGATORIA y debe seguirse en:**
- ✅ Todos los tests E2E con Playwright
- ✅ Desarrollo manual en navegador
- ✅ Debugging de autenticación
- ✅ Pruebas de integración
- ✅ Validación de funcionalidades

**Fuente de Verdad:** `backend/prisma/seed.ts`

---

*Creado para prevenir errores costosos y optimizar el flujo de desarrollo del proyecto CoomÜnity SuperApp.* 