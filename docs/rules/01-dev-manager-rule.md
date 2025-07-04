# 룰: CoomÜnity Development Manager (`dev-manager.sh`) - Gestión Unificada de Servicios

Esta regla establece el uso del script `scripts/dev-manager.sh` como la **herramienta principal y canónica** para gestionar el ciclo de vida del entorno de desarrollo del monorepo CoomÜnity. Reemplaza la ejecución manual de comandos individuales.

---

## 🎯 **Principio Fundamental**

**"El `dev-manager` es el centro de control del entorno local."**

**Objetivo:** Centralizar, simplificar y automatizar las operaciones comunes de desarrollo (verificar estado, limpiar, iniciar, testear) para reducir errores y aumentar la productividad.

**Ubicación del Script:** `scripts/dev-manager.sh`

---

## 🚀 **Uso Preferido: Scripts de `package.json`**

La forma **OBLIGATORIA** de interactuar con el `dev-manager` es a través de los alias definidos en el `package.json` de la raíz del monorepo.

### **Comandos Principales (a ejecutar desde la raíz):**

```bash
# ✅ VERIFICACIÓN COMPLETA (Dependencias + Puertos)
# El primer comando a ejecutar siempre.
npm run dm:check

# 🧹 LIMPIEZA TOTAL
# Mata procesos conflictivos y libera los puertos 3000, 3001, 3002, 5173.
npm run dm:clean

# 🚀 INICIAR ECOSISTEMA COMPLETO
# Ejecuta dm:check, luego inicia todo con Turborepo.
npm run dm:start

# 📊 VER ESTADO RÁPIDO
# Muestra qué servicios están activos en los puertos del proyecto.
npm run dm:status

# 🔧 INICIAR SERVICIOS INDIVIDUALES (si es necesario)
npm run dm:backend
npm run dm:superapp

# 🔍 TESTING DE ENDPOINTS
# Verifica que los endpoints críticos del backend respondan correctamente.
npm run dm:test

# 🌐 ABRIR URLS DEL PROYECTO
# Abre SuperApp, Swagger y Admin Panel en el navegador.
npm run dm:open
```

### **Modo Interactivo:**
Para un menú con todas las opciones, ejecuta:
```bash
npm run dm
```

---

## ⚡ **Integración con Cursor / VS Code**

El `dev-manager` está profundamente integrado en el editor para un flujo de trabajo sin fricciones.

### **1. Panel de Tareas (Command Palette)**

Accede a todas las acciones del `dev-manager` directamente desde la paleta de comandos (`Ctrl+Shift+P` o `Cmd+Shift+P` y escribe "Run Task"). Las tareas están prefijadas con "CoomÜnity".

**Tareas Disponibles:**
- `🚀 CoomÜnity: Verificar Estado`
- `🧹 CoomÜnity: Limpiar Puertos`
- `🌐 CoomÜnity: Iniciar Todo`
- `🔧 CoomÜnity: Solo Backend`
- `📱 CoomÜnity: Solo SuperApp`
- `🔍 CoomÜnity: Test Endpoints`
- `📊 CoomÜnity: Ver Estado de Puertos`
- `🌐 CoomÜnity: Abrir URLs`

### **2. Shortcuts de Teclado (Keybindings)**

Se han configurado atajos para las operaciones más comunes:

| Atajo (`Ctrl+Shift+Alt+...`) | Acción                      |
|------------------------------|-----------------------------|
| `D`                          | Verificar Estado (Deps)     |
| `S`                          | Ver Estado (Status)         |
| `C`                          | Limpiar Puertos (Clean)     |
| `A`                          | Iniciar Todo (All)          |
| `B`                          | Solo Backend                |
| `F`                          | Solo Frontend (SuperApp)    |
| `T`                          | Test Endpoints              |
| `O`                          | Abrir URLs                  |

---

## 🧠 **Lógica y Capacidades del `dev-manager`**

El agente debe conocer las capacidades internas del script para diagnosticar problemas:

1.  **Verificación de Dependencias Críticas:** Automáticamente comprueba que **PostgreSQL** y **Redis** estén activos antes de cualquier operación. Si no lo están, intenta iniciarlos.
2.  **Gestión de Puertos Específica:** Conoce los puertos `3002` (Backend), `3001` (SuperApp) y `3000` (Admin) y actúa sobre ellos.
3.  **Health Checks:** Al verificar el estado, no solo comprueba si el puerto está ocupado, sino que también hace un `curl` al endpoint `/health` del backend para asegurar que el servicio responde.
4.  **Testing de Endpoints:** Valida no solo el `health check`, sino también el endpoint de `/auth/login` y el nuevo `/feedback/ping`, proporcionando un diagnóstico rápido de la API.
5.  **Ejecución desde la Raíz:** El script está diseñado para fallar si no se ejecuta desde el directorio raíz del monorepo, forzando las buenas prácticas.

---

## 📋 **Flujo de Trabajo Obligatorio para el Agente**

1.  **Al iniciar una sesión de trabajo:** Siempre sugerir ejecutar `npm run dm:check` como primer paso para evaluar el estado del entorno.
2.  **Antes de iniciar servicios:** Recomendar `npm run dm:clean` para evitar conflictos.
3.  **Para iniciar el entorno:** Usar `npm run dm:start` como método preferido.
4.  **Al diagnosticar errores de conexión:** Utilizar `npm run dm:status` y `npm run dm:test` para obtener información precisa antes de revisar logs o código.
5.  **Al guiar al usuario:** Referirse a los comandos `npm run dm:*` o a las Tareas de VS Code en lugar de comandos `cd`, `lsof`, `kill`, etc.

**Esta regla garantiza que se aproveche al máximo la nueva automatización, resultando en un desarrollo más rápido, consistente y libre de errores.** 
