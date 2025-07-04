# 📂 **REFERENCIA: UBICACIÓN DE IMPLEMENTACIONES CoomÜnity**

## ⚠️ **REGLA CRÍTICA**

**TODAS las implementaciones de mejoras UX/UI deben hacerse ÚNICAMENTE en:**

```bash
/Users/kevinp/Movies/Demo/data/backups/my_recovered_website/
```

## 🎯 **¿Por Qué Esta Ubicación?**

Esta es la **página CoomÜnity unificada** que contiene:
- ✅ **GA4 integrado** (`G-COOMUNITY123`)
- ✅ **24+ archivos CSS** de heurísticas UX
- ✅ **17+ managers JavaScript** implementados
- ✅ **Navegación unificada** (`.unified-navbar`, `.nav-links`)
- ✅ **Estructura completa** de secciones mejoradas

## 🚫 **UBICACIONES INCORRECTAS**

**NO implementar en:**
- ❌ `apps/` - Son proyectos de desarrollo futuro
- ❌ `data/extracted/` - Archivos originales sin mejoras
- ❌ `data/backups/recovered_code/` - Código de respaldo sin unificar

## 🔍 **Verificación Antes de Implementar**

**SIEMPRE ejecutar antes de hacer cambios:**

```bash
./scripts/verify-implementation-location.sh
```

Este script verifica:
- 📂 Directorio correcto
- 🎨 CSS de heurísticas presentes
- 📊 GA4 integrado
- 🧭 Navegación unificada
- 🌐 Servidores funcionando

## 🌐 **URLs de Acceso**

La página unificada está disponible en:
- **Puerto 8080:** `http://localhost:8080/` (Servidor Python)
- **Puerto 3001:** `http://localhost:3001/` (Servidor Node.js)

**Ambos sirven el mismo contenido desde:**
`data/backups/my_recovered_website/`

## 📁 **Estructura de Archivos Clave**

```
data/backups/my_recovered_website/
├── index.html                 # ← GA4 integrado
├── public/                    # ← Página principal unificada
├── sections/
│   ├── pilgrim/
│   │   └── index-mejorado.html # ← Navegación unificada
│   ├── merchant/              # ← Navegación implementada
│   └── red-pill/              # ← Experiencia interactiva única
├── shared/
│   ├── css/                   # ← 24+ archivos de heurísticas
│   └── js/                    # ← 17+ managers UX
└── server.js                  # ← Servidor Node.js
```

## ✅ **Tests de Validación**

Los tests de Playwright están configurados para validar esta ubicación:

```bash
# Tests apuntan a puerto 3001
npx playwright test tests/e2e/ux-heuristics/02-consistency-standards.spec.ts
```

**Configuración en `playwright.config.ts`:**
- `baseURL: 'http://localhost:3001'`
- `webServer: cd data/backups/my_recovered_website && PORT=3001 node server.js`

## 🎯 **Resultados Confirmados**

**Heurística "Consistencia y Estándares": 100% ✅**
- ✅ 6/6 tests pasando
- ✅ Navegación unificada detectada
- ✅ Variables CSS globales consistentes
- ✅ Todas las implementaciones funcionando

---

## 🚨 **PROTOCOLO DE EMERGENCIA**

Si tienes dudas sobre dónde implementar:

1. **PARAR** cualquier implementación
2. **EJECUTAR** `./scripts/verify-implementation-location.sh`
3. **CONFIRMAR** que todos los checks pasan
4. **PROCEDER** solo si la verificación es 100% exitosa

---

**📅 Última verificación:** Junio 4, 2025  
**👨‍💻 Responsable:** Kevin P.  
**🎯 Estado:** ✅ Página unificada funcionando al 100% 