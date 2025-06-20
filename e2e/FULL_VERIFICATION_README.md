# Verificación Funcional Completa - Gamifier Admin

Este archivo contiene la suite de pruebas automatizadas para verificar que toda la aplicación Gamifier Admin funciona correctamente después de las migraciones y cambios realizados.

## 🎯 Objetivo

Realizar una verificación completa y automatizada de:
- ✅ Todas las páginas principales del admin
- ✅ Carga correcta de datos del seeder
- ✅ Funcionalidad de login
- ✅ Navegación entre páginas
- ✅ Pestañas de configuración de video (Subtítulos y Preguntas)
- ✅ Páginas de administración (Config, Audit Logs, System Status)
- ✅ Conectividad con el backend
- ✅ Detección de errores de consola y red

## 🚀 Configuración Previa

### 1. Reemplazar el ID de VideoItem de Prueba

**IMPORTANTE**: Antes de ejecutar las pruebas, debes reemplazar el placeholder `TEST_VIDEO_ITEM_ID` en el archivo `e2e/full-app-verification.spec.ts`:

```typescript
// Línea 11 en el archivo
const TEST_VIDEO_ITEM_ID = 'TEST_VIDEO_ITEM_ID'; // ← REEMPLAZAR ESTO
```

**Opciones:**
- Si tu seeder usa IDs autoincrementales: `'1'`
- Si tu seeder usa UUIDs: `'d4e5cb8d-4e5c-48bf-cb73-08235c13baa64b'` (usar el UUID real)

### 2. Verificar que el Backend y Frontend estén ejecutándose

```bash
# Terminal 1: Backend
npm run start:dev

# Terminal 2: Frontend  
npm run dev
```

Verificar que:
- Backend: http://localhost:3002
- Frontend: http://localhost:3000

### 3. Verificar Datos del Seeder

Asegúrate de que tu base de datos tenga los datos del seeder:

```bash
# Ejecutar seeder si es necesario
npm run seed
```

## 🧪 Ejecución de Pruebas

### Opción 1: Modo Visual (Recomendado para desarrollo)
```bash
npm run test:e2e:full
```

### Opción 2: Modo Headless (Para CI/CD)
```bash
npm run test:e2e:full:headless
```

### Opción 3: Modo Debug (Para troubleshooting)
```bash
npm run test:e2e:full:debug
```

## 📊 Interpretación de Resultados

### ✅ Éxito
Si todas las pruebas pasan, verás:
```
🎉 ALL TESTS PASSED - NO CRITICAL ERRORS FOUND!
```

### ⚠️ Advertencias
Algunos errores no críticos son normales:
- Warnings de React
- Errores de favicon
- Errores de DevTools

### 🔴 Errores Críticos
Si hay errores críticos, el reporte mostrará:
- Console errors críticos
- Network errors críticos
- Páginas que no cargan
- Datos del seeder que no se encuentran

## 📋 Páginas Verificadas

| Página | URL | Verificación |
|--------|-----|-------------|
| Home | `/` | Título y contenido principal |
| Mundos | `/mundos` | Datos del seeder |
| Playlists Gamificadas | `/playlists` | Datos del seeder |
| Playlists Directo | `/playlists-direct` | Datos del seeder |
| Users | `/users` | Usuario admin |
| Roles | `/roles` | Rol admin |
| Permissions | `/permissions` | Permisos del seeder |
| Items | `/items` | VideoItems del seeder |
| Video Config | `/items/{id}/config` | Pestañas de Subtítulos y Preguntas |
| Admin Config | `/admin/config` | Configuraciones |
| Admin Audit Logs | `/admin/audit-logs` | Logs de auditoría |
| Admin System Status | `/admin/system/status` | Estado del sistema |

## 🔧 Troubleshooting

### Error: "TEST_VIDEO_ITEM_ID is still placeholder"
- Reemplaza `TEST_VIDEO_ITEM_ID` con un ID real de tu seeder

### Error: "Login failed"
- Verifica que el usuario admin existe: `admin@coomunity.co` / `123456`
- Verifica que el backend esté ejecutándose

### Error: "Data not found"
- Ejecuta el seeder: `npm run seed`
- Verifica que la base de datos tenga datos

### Error: "Network timeout"
- Verifica que backend y frontend estén ejecutándose
- Aumenta los timeouts en `playwright.config.ts`

### Error: "Page not found"
- Verifica las rutas en el frontend
- Verifica que todas las páginas estén implementadas

## 📈 Métricas de Éxito

Una verificación exitosa debe mostrar:
- ✅ 0 errores críticos de consola
- ✅ 0 errores críticos de red
- ✅ Todas las páginas cargan correctamente
- ✅ Todos los datos del seeder se encuentran
- ✅ Login funciona correctamente
- ✅ Backend responde correctamente

## 🔄 Integración Continua

Para usar en CI/CD:

```yaml
# .github/workflows/e2e-verification.yml
- name: Run Full App Verification
  run: npm run test:e2e:full:headless
```

## 📝 Notas Adicionales

- Las pruebas se ejecutan en modo serial para evitar conflictos
- Se usa un solo worker para mayor estabilidad
- Se capturan screenshots en caso de fallos
- Se genera un reporte HTML detallado
- Los errores se categorizan entre críticos y no críticos 