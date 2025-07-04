# 🤖 Gemini Modular Code Reviewer Dashboard

Dashboard interactivo para la revisión de código del proyecto CoomÜnity usando Google Gemini AI. Este sistema proporciona análisis en tiempo real de la calidad del código, detección de issues y métricas de rendimiento por módulos.

## ✨ Características

- **📊 Dashboard en Tiempo Real**: Visualización de métricas de calidad del código
- **🔍 Análisis por Módulos**: Revisión detallada de 11 módulos del proyecto CoomÜnity
- **📈 Tendencias Históricas**: Gráficos de evolución de issues y mejoras
- **🚨 Sistema de Alertas**: Notificaciones automáticas para issues críticos
- **🎯 Integración CI/CD**: Automatización con GitHub Actions
- **🔄 Actualizaciones Automáticas**: Polling cada 60 segundos para datos frescos

## 🏗️ Arquitectura

```
├── src/
│   ├── hooks/useReportData.ts    # API & Data Management
│   ├── pages/
│   │   ├── Dashboard.tsx         # Vista principal con métricas
│   │   ├── ModuleView.tsx        # Vista detallada por módulo
│   │   ├── TrendsView.tsx        # Análisis de tendencias
│   │   └── SettingsView.tsx      # Configuración y alertas
│   └── components/Layout/        # Componentes de navegación
├── test-data/                    # Datos mock para desarrollo
└── reports/                      # Reportes reales de Gemini
```

## 🚀 Instalación Rápida

### 1. Configurar Gemini API Key

**En GitHub Secrets (Obligatorio para CI/CD):**

1. Ve a `Settings` > `Secrets and variables` > `Actions`
2. Click en "New repository secret"
3. Nombre: `GEMINI_API_KEY`
4. Valor: Tu API key de Google Gemini
5. Click "Add secret"

**Para desarrollo local:**

```bash
# Crear archivo .env en tools/modular-review-dashboard/
echo "GEMINI_API_KEY=tu_api_key_aqui" > .env
```

### 2. Instalar dependencias

```bash
cd tools/modular-review-dashboard
npm install --legacy-peer-deps
```

### 3. Ejecutar dashboard

```bash
npm run dev
```

Dashboard disponible en: http://localhost:5173

## 🔑 Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Click en "Create API Key"
4. Copia la clave generada
5. Configúrala en GitHub Secrets (para CI/CD) y/o `.env` (para desarrollo local)

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia dashboard en modo desarrollo

# Producción
npm run build            # Build para producción
npm run preview          # Vista previa del build

# Análisis de código
npm run review:all       # Ejecuta revisión completa (requiere GEMINI_API_KEY)
npm run review:module    # Ejecuta revisión de módulo específico
npm run generate:trends  # Genera análisis de tendencias
npm run send:alerts      # Envía alertas configuradas
```

## 🎯 Módulos Analizados

| Módulo         | Prioridad | Descripción                      |
| -------------- | --------- | -------------------------------- |
| **HOME**       | 🔴 High   | Dashboard principal y navegación |
| **USOCIAL**    | 🔴 High   | Sistema social y comunidad       |
| **UPLAY**      | 🔴 High   | Videos educativos y gamificación |
| **WALLET**     | 🔴 High   | Sistema económico y Ünits        |
| **AUTH**       | 🔴 High   | Autenticación y autorización     |
| **USTATS**     | 🟡 Medium | Estadísticas y métricas          |
| **UMARKET**    | 🟡 Medium | Marketplace y transacciones      |
| **CHALLENGES** | 🟡 Medium | Desafíos y logros                |
| **LETS**       | 🟡 Medium | Sistema Let's colaborativo       |
| **PROFILE**    | 🟡 Medium | Perfiles de usuario              |
| **SHARED**     | 🟢 Low    | Utilidades y tipos compartidos   |

## 📊 Métricas Analizadas

### Severidad

- **Error**: Issues críticos que rompen funcionalidad
- **Warning**: Problemas que afectan rendimiento o mantenibilidad
- **Suggestion**: Mejoras recomendadas
- **Info**: Información y optimizaciones

### Categorías

- **Performance**: Optimización de rendimiento
- **Security**: Vulnerabilidades y seguridad
- **Accessibility**: Accesibilidad y UX
- **Code Quality**: Calidad y legibilidad del código
- **Architecture**: Estructura y patrones
- **Philosophy**: Alineación con filosofía CoomÜnity
- **Best Practices**: Mejores prácticas de desarrollo

## 🔔 Sistema de Alertas

### Umbrales Configurados

- **🚨 Critical**: >5 issues totales o >2 errores por módulo
- **⚠️ Warning**: >3 issues totales o >1 error por módulo
- **ℹ️ Info**: Issues de tipo Suggestion o Info

### Canales de Alerta

- **Dashboard**: Alertas en tiempo real en la interfaz
- **Slack**: Integración con webhook (configurar en SettingsView)
- **Discord**: Integración con webhook (configurar en SettingsView)
- **GitHub Actions**: Comentarios automáticos en PRs

## 🛠️ Configuración Avanzada

### Variables de Entorno

```bash
# .env file
GEMINI_API_KEY=your_api_key_here
SLACK_WEBHOOK_URL=https://hooks.slack.com/...  # Opcional
DISCORD_WEBHOOK_URL=https://discord.com/api/... # Opcional
REVIEW_DELAY=1000                              # Delay entre requests (ms)
MAX_RETRIES=3                                  # Reintentos en caso de error
```

### Configuración de CI/CD

El workflow de GitHub Actions ejecuta automáticamente en:

- Push a `main`, `master`, `develop`
- Pull Requests a las ramas principales
- Ejecución manual desde GitHub Actions

### Personalización de Módulos

Para agregar/modificar módulos, editar:

```javascript
// scripts/utilities/gemini-modular-review.js
const MODULES = {
  NEW_MODULE: {
    name: 'Nuevo Módulo',
    description: 'Descripción del módulo',
    priority: 'medium',
    paths: ['path/to/module/**/*.{ts,tsx}'],
  },
};
```

## 🧪 Testing y Desarrollo

### Datos Mock

Durante desarrollo, el dashboard usa datos mock si no hay reportes reales disponibles en `/test-data/`.

### Generar Datos de Prueba

```bash
# Generar reporte mock completo
node scripts/utilities/gemini-modular-review.js --mock

# Generar solo para módulo específico
node scripts/utilities/gemini-modular-review.js --module=HOME --mock
```

### Debugging

```bash
# Verificar configuración
node scripts/utilities/setup-modular-review.sh --check

# Logs detallados
npm run review:all --verbose

# Verificar API key
curl -H "x-goog-api-key: $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models
```

## 🔄 Flujo de Trabajo

1. **Desarrollo**: Código se modifica en algún módulo
2. **CI/CD**: GitHub Actions detecta cambios y ejecuta revisión
3. **Análisis**: Gemini AI analiza el código y genera reporte
4. **Dashboard**: Métricas se actualizan automáticamente
5. **Alertas**: Sistema envía notificaciones si hay issues críticos
6. **Revisión**: Developers revisan issues en el dashboard
7. **Corrección**: Issues se resuelven y el ciclo continúa

## 🏆 Filosofía CoomÜnity

Este sistema está alineado con los principios de CoomÜnity:

- **🌱 Mejora Continua**: Análisis constante para elevar la calidad
- **🤝 Colaboración**: Visibilidad compartida del estado del código
- **💫 Excelencia**: Estándares altos de calidad técnica
- **🔄 Reciprocidad**: Cada mejora beneficia a toda la comunidad

## 📞 Soporte y Contribución

Para issues, mejoras o preguntas:

1. Crear issue en el repositorio
2. Incluir logs relevantes y pasos para reproducir
3. Especificar módulo afectado y versión del dashboard

---

**Último Update**: Julio 2025 | **Versión**: 1.0.0 | **Estado**: ✅ Production Ready
