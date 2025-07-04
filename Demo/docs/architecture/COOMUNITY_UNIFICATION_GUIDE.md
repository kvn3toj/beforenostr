# 🌟 Guía Completa de Unificación del Sitio Web CoomÜnity

Esta guía te llevará paso a paso para unificar y ejecutar localmente todo el sitio web CoomÜnity recuperado.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 16+** (incluye npm y npx)
- **Las carpetas de código recuperado:**
  - `recovered_code/pilgrim_demo/`
  - `recovered_code/merchant_dev/`
  - `recovered_code/red_pill_interactive/`

## 🚀 Método 1: Setup Automático (Recomendado)

### Paso 1: Ejecutar Script de Setup
```bash
./setup-coomunity-website.sh
```

Este script automatiza todo el proceso:
- ✅ Verifica prerrequisitos
- ✅ Instala dependencias
- ✅ Ejecuta la unificación
- ✅ Configura el servidor
- ✅ Crea scripts de conveniencia

### Paso 2: Iniciar el Sitio
```bash
./start-server.sh
```

### Paso 3: Abrir en Navegador
Visita: http://localhost:8080/public/

## 🔧 Método 2: Setup Manual

Si prefieres control total sobre el proceso:

### Paso 1: Instalar Dependencias
```bash
npm init -y
npm install express cors fs-extra glob @types/node typescript ts-node
```

### Paso 2: Ejecutar Unificación
```bash
npx ts-node unify-coomunity-website.ts
```

### Paso 3: Iniciar Servidor
```bash
cd my_recovered_website
node ../coomunity-local-server.js
```

## 📁 Estructura del Proyecto Unificado

```
my_recovered_website/
├── public/                     # Página principal de navegación
│   └── index.html
├── sections/                   # Demos organizados por sección
│   ├── pilgrim/               # Demo del Pilgrim
│   │   ├── index.html
│   │   ├── assets/           # CSS, JS, imágenes, datos
│   │   └── inline/           # Archivos inline procesados
│   ├── merchant/             # Demo del Merchant
│   │   ├── index.html
│   │   ├── variations/       # Estados alternativos capturados
│   │   ├── assets/
│   │   └── inline/
│   └── red-pill/             # Demo Red Pill Interactivo
│       ├── index.html
│       ├── journey/          # Pasos del flujo interactivo
│       ├── assets/
│       ├── inline/
│       └── analytics/        # Mapas de interacción
├── shared/                   # Recursos compartidos
├── api/                      # Configuración de APIs mockeadas
├── docs/                     # Documentación y reportes
└── server.js                 # Servidor local con APIs
```

## 🌐 URLs Disponibles

| Sección | URL | Descripción |
|---------|-----|-------------|
| **Navegación Principal** | http://localhost:8080/public/ | Página de inicio con enlaces a todas las secciones |
| **Pilgrim Demo** | http://localhost:8080/sections/pilgrim/ | Experiencia del usuario Pilgrim |
| **Merchant Demo** | http://localhost:8080/sections/merchant/ | Interfaz del usuario Merchant |
| **Red Pill Demo** | http://localhost:8080/sections/red-pill/ | Experiencia interactiva Red Pill |
| **API Health** | http://localhost:8080/api/health | Estado del servidor y APIs |

### Variaciones del Merchant
- Estado inicial: `/sections/merchant/variations/initial_load.html`
- Después de scroll: `/sections/merchant/variations/after_scroll.html`
- Botón clickeado: `/sections/merchant/variations/button_clicked.html`

### Journey del Red Pill
- Inicial: `/sections/red-pill/journey/initial.html`
- Camino izquierdo: `/sections/red-pill/journey/left_path.html`
- Camino derecho: `/sections/red-pill/journey/right_path.html`
- Final: `/sections/red-pill/journey/final.html`

## 📡 APIs Mockeadas Disponibles

El servidor incluye APIs completamente funcionales para cada sección:

### Pilgrim APIs
- `GET /api/pilgrim/profile` - Perfil del usuario pilgrim
- `GET /api/pilgrim/quests` - Misiones disponibles

### Merchant APIs
- `GET /api/merchant/profile` - Perfil del merchant
- `GET /api/merchant/matches` - Conexiones y matches
- `GET /api/merchant/products` - Catálogo de productos

### Red Pill APIs
- `GET /api/red-pill/journey/:sessionId?` - Estado del journey
- `POST /api/red-pill/journey/:sessionId/choice` - Registrar elección
- `GET /api/red-pill/videos` - Videos disponibles

### APIs Generales
- `GET /api/health` - Estado del servidor
- `GET /api/data/:section/:filename` - Archivos de datos específicos

## 🔧 Scripts de Desarrollo

### Scripts Creados Automáticamente
```bash
./start-server.sh      # Servidor completo con APIs (recomendado)
./start-static.sh      # Servidor estático simple
```

### Scripts NPM (si usas package.json)
```bash
npm run unify         # Solo ejecutar unificación
npm run serve         # Solo iniciar servidor
```

## 🐛 Resolución de Problemas

### Problema: Puerto 8080 en uso
```bash
# Verificar qué proceso usa el puerto
lsof -i :8080

# Cambiar puerto (opcional)
PORT=3000 ./start-server.sh
```

### Problema: Rutas de archivos rotas
- Verifica que la unificación se completó sin errores
- Revisa los logs en `my_recovered_website/docs/unification_log.txt`
- Comprueba que las rutas en HTML fueron reescritas correctamente

### Problema: APIs no responden
- Verifica que estés usando `./start-server.sh` (no el estático)
- Comprueba `http://localhost:8080/api/health`
- Revisa logs del servidor en la consola

### Problema: Archivos JavaScript no funcionan
- Verifica que las rutas a assets fueron corregidas
- Abre Developer Tools para ver errores de consola
- Comprueba que los archivos inline fueron procesados correctamente

## 📊 Características del Sistema de Unificación

### Reescritura Automática de Rutas
- **HTML**: Convierte rutas absolutas (`/assets/...`) a relativas (`assets/...`)
- **CSS**: Ajusta `url()` para imágenes y fuentes
- **JavaScript**: Corrige referencias a archivos de datos e imágenes

### Preservación de Funcionalidad
- **Archivos inline**: Se mantienen organizados en carpetas separadas
- **Estados capturados**: Variaciones del merchant se preservan como archivos independientes
- **Análisis de interacciones**: Mapas y sesiones del red-pill se conservan

### Mocking Inteligente de APIs
- **Respuestas realistas**: APIs devuelven datos coherentes con cada sección
- **Simulación de estado**: Journey del red-pill mantiene progreso por sesión
- **Fallbacks**: Archivos JSON originales disponibles como respaldo

## 📝 Archivos de Configuración Generados

### package.json
Configuración NPM con dependencias y scripts necesarios.

### README.md
Documentación específica del proyecto unificado.

### setup-report.txt
Reporte detallado del proceso de unificación con estadísticas.

## 🚀 Próximos Pasos Sugeridos

1. **Explorar cada sección** para verificar que funciona correctamente
2. **Probar las APIs** usando las Developer Tools del navegador
3. **Personalizar el mocking** editando `server.js` según necesites
4. **Documentar problemas** para futuras mejoras
5. **Considerar despliegue** a un servidor de producción si es necesario

## 🎯 Casos de Uso del Sitio Unificado

### Para Desarrollo
- **Prototipado rápido**: Base sólida para nuevas funcionalidades
- **Testing de UX**: Validar flujos de usuario en entorno controlado
- **Demostración**: Mostrar capacidades de la plataforma CoomÜnity

### Para Análisis
- **Comparación de estados**: Ver evolución del merchant en diferentes momentos
- **Análisis de interacciones**: Estudiar patrones del red-pill journey
- **Evaluación de assets**: Inventario completo de recursos visuales

### Para Documentación
- **Archivo histórico**: Preservar versiones funcionales del sitio
- **Referencia de diseño**: Ejemplos de implementación de la identidad CoomÜnity
- **Base de conocimiento**: Entender decisiones de UX y arquitectura

---

## 💡 Tips Avanzados

### Personalizar APIs
Edita `server.js` para añadir nuevos endpoints o modificar respuestas:

```javascript
// Añadir nueva API personalizada
this.app.get('/api/custom/endpoint', (req, res) => {
  res.json({ message: 'Mi API personalizada' });
});
```

### Añadir Nueva Sección
1. Crea carpeta en `sections/nueva-seccion/`
2. Añade archivos HTML, CSS, JS
3. Actualiza la página de navegación principal
4. Opcionalmente añade APIs mockeadas específicas

### Optimizar Performance
- Habilita compresión gzip en el servidor
- Implementa caché para assets estáticos
- Minifica CSS y JS si es necesario

---

¡Disfruta explorando el sitio web CoomÜnity unificado! 🌟 