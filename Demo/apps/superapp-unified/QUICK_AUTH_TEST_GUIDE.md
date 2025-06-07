# 🚀 Guía Rápida - Tests de Autenticación (Fase 49)

## ⚡ Ejecutar Verificación Automatizada

### 1. **Ejecutar Script de Verificación**

```bash
cd apps/superapp-unified
./run-auth-verification.sh
```

### 2. **Ver Resultados**

El script generará:
- **Reporte HTML:** `test-results/auth-verification/index.html`
- **Resumen:** `FASE_49_VERIFICATION_SUMMARY.md`
- **Output en terminal:** Resultados en tiempo real

---

## 🔧 Configuración Previa (Opcional)

### **Para Tests con Backend Real:**

1. **Crear archivo de configuración:**
```bash
# Crear .env.local
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_MOCK_AUTH=false
VITE_DEV_MODE=true
VITE_DEBUG_BACKEND=true
EOF
```

2. **Iniciar backend** (en puerto 3000 con endpoints):
   - `POST /auth/login`
   - `POST /auth/register`
   - `GET /auth/me`
   - `GET /health`

3. **Iniciar frontend:**
```bash
npm run dev
```

### **Para Tests Solo con Mock:**

No necesitas configuración adicional. Los tests verificarán el modo fallback automáticamente.

---

## 📊 Qué Verifican los Tests

### ✅ **Tests Automáticos:**

1. **📋 Configuración:** Variables de entorno y estado inicial
2. **🔐 Login:** Credenciales válidas/inválidas, validación de formulario
3. **🆕 Registro:** Datos válidos/inválidos, emails duplicados
4. **🛡️ Protección:** Rutas protegidas, redirección automática
5. **🔄 Persistencia:** Sesión después de recargar página
6. **🐛 Errores:** Backend offline, tokens inválidos, edge cases
7. **📊 Health Check:** Estado general del sistema

### 🎯 **Escenarios Cubiertos:**

- ✅ Backend disponible → Tests con autenticación real
- ✅ Backend no disponible → Tests con modo fallback
- ✅ Configuración incorrecta → Manejo gracioso de errores
- ✅ Datos corruptos → Limpieza automática

---

## 🚀 Comandos Rápidos

```bash
# Ejecutar verificación completa
./run-auth-verification.sh

# Solo tests específicos
npx playwright test tests/auth-real-backend.spec.ts --grep "Login"
npx playwright test tests/auth-real-backend.spec.ts --grep "Registro"
npx playwright test tests/auth-real-backend.spec.ts --grep "Protección"

# Modo debug (ver navegador)
npx playwright test tests/auth-real-backend.spec.ts --headed --debug

# Reporte HTML
npx playwright test tests/auth-real-backend.spec.ts --reporter=html
```

---

## 📝 Interpretar Resultados

### **✅ Todo Verde:** 
Autenticación real implementada correctamente y lista para producción.

### **⚠️ Amarillo (Advertencias):**
- Backend no disponible → Verifica configuración y endpoints
- Algunos tests fallaron → Revisa reporte HTML para detalles
- Configuración por defecto → Considera crear .env.local

### **❌ Rojo (Errores):**
- Tests de protección fallaron → Problema crítico de seguridad
- Configuración inicial falló → Verificar archivos del proyecto
- Frontend no carga → Problema con npm run dev

---

## 🎯 Próximos Pasos

Una vez que los tests pasen exitosamente:

1. **✅ Fase 49 Completada** - Autenticación real funcional
2. **🔄 Fase 50** - Implementar refresh tokens
3. **📱 Fase 51** - Autenticación social (Google, Facebook)
4. **🔐 Fase 52** - Two-factor authentication

---

## 🆘 Solución de Problemas

### **Error: "Test file not found"**
```bash
# Verificar que estás en el directorio correcto
pwd  # Debe mostrar: .../apps/superapp-unified
ls tests/auth-real-backend.spec.ts  # Debe existir
```

### **Error: "npm run dev not working"**
```bash
# Instalar dependencias
npm install

# Verificar puerto
lsof -i :3000  # Ver qué está usando el puerto 3000
```

### **Tests siempre fallan**
```bash
# Limpiar cache de Playwright
npx playwright test --clear-cache

# Reinstalar Playwright
npx playwright install
```

---

**¡Listo!** Ejecuta `./run-auth-verification.sh` y verifica que tu implementación de autenticación real esté funcionando perfectamente. 🚀 