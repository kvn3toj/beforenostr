# CoomÜnity Backend API Server

Backend API server para la plataforma CoomÜnity. Proporciona endpoints RESTful para servir datos mockeados y manejar operaciones del frontend.

## 📋 Características

- **Servidor Express.js** con arquitectura modular
- **APIs RESTful** para todas las secciones (Pilgrim, Merchant, Red Pill)
- **CORS configurado** para desarrollo con frontend en puerto 8080
- **Datos mockeados** realistas para desarrollo y testing
- **Manejo de errores** robusto con logging detallado
- **Documentación automática** de endpoints en `/api`
- **Seguridad básica** con Helmet.js

## 🚀 Inicio Rápido

### Instalación

1. **Instalar dependencias:**
```bash
cd backend/
npm install
```

2. **Configurar variables de entorno (opcional):**
```bash
cp env.example .env
# Edita .env si necesitas cambiar configuraciones
```

3. **Iniciar el servidor:**
```bash
# Modo desarrollo (con reinicio automático)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### Verificar Instalación

1. **Health Check:**
```bash
curl http://localhost:3000/health
```

2. **Documentación de API:**
```bash
curl http://localhost:3000/api
```

## 🌐 Endpoints Disponibles

### Core Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servidor |
| GET | `/api` | Documentación de endpoints |

### Sección Pilgrim

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pilgrim-data` | Datos principales de Pilgrim |
| GET | `/api/pilgrim/profile` | Perfil del usuario pilgrim |
| GET | `/api/pilgrim/journey` | Progreso del viaje personal |
| GET | `/api/pilgrim/quests` | Misiones disponibles y completadas |

### Sección Merchant

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/merchant-data` | Datos principales de Merchant |
| GET | `/api/merchant/profile` | Perfil del merchant |
| GET | `/api/merchant/products` | Productos del merchant |
| GET | `/api/merchant/matches` | Conexiones y matches |

### Sección Red Pill

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/red-pill-data` | Datos principales de Red Pill |
| GET | `/api/red-pill/questions` | Preguntas para quiz/challenge |
| GET | `/api/red-pill/results` | Resultados y análisis |

**Query Parameters para Questions:**
- `category`: Filtrar por categoría (critical-thinking, philosophy, logic)
- `difficulty`: Filtrar por dificultad (beginner, intermediate, advanced)

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/user-profile/:userId` | Perfil de usuario genérico |
| GET | `/api/user/preferences/:userId` | Preferencias del usuario |

### Datos y Formularios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/data/recommendations` | Archivo de recomendaciones |
| GET | `/api/shared-data/:filename` | Archivos de datos compartidos |
| POST | `/api/submit-form` | Envío de formularios genérico |

## 📡 Ejemplos de Uso

### Obtener Perfil de Pilgrim

```bash
curl http://localhost:3000/api/pilgrim/profile
```

**Respuesta:**
```json
{
  "id": "pilgrim_001",
  "name": "Alex Pilgrim",
  "level": 5,
  "experience": 1250,
  "journey": {
    "currentStage": "exploration",
    "completedQuests": 12,
    "totalQuests": 20
  },
  "stats": {
    "wisdom": 85,
    "courage": 92,
    "compassion": 78
  }
}
```

### Obtener Preguntas de Red Pill

```bash
# Todas las preguntas
curl http://localhost:3000/api/red-pill/questions

# Filtrar por categoría
curl "http://localhost:3000/api/red-pill/questions?category=critical-thinking"

# Filtrar por dificultad
curl "http://localhost:3000/api/red-pill/questions?difficulty=advanced"
```

### Enviar Formulario

```bash
curl -X POST http://localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "contact",
    "data": {
      "name": "Usuario Test",
      "email": "test@example.com",
      "message": "Mensaje de prueba"
    },
    "timestamp": "2024-03-15T10:00:00Z"
  }'
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | 3000 | Puerto del servidor |
| `NODE_ENV` | development | Entorno de ejecución |
| `FRONTEND_URL` | http://localhost:8080 | URL del frontend |

### CORS

El servidor está configurado para permitir requests desde:
- `http://localhost:8080` (frontend principal)
- `http://127.0.0.1:8080`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### Archivos de Datos

El servidor busca archivos de datos en:
```
../data/backups/my_recovered_website/shared/data/
```

Archivos disponibles:
- `mock-recommendations.json` - Recomendaciones principales

## 🛠️ Desarrollo

### Estructura de Archivos

```
backend/
├── server.js              # Servidor principal
├── package.json           # Dependencias y scripts
├── env.example            # Variables de entorno de ejemplo
├── README.md             # Esta documentación
└── logs/                 # Logs del servidor (auto-generado)
```

### Scripts Disponibles

```bash
# Iniciar en modo desarrollo (con nodemon)
npm run dev

# Iniciar en modo producción
npm start

# Instalar dependencias
npm install
```

### Añadir Nuevos Endpoints

1. **Crear nuevo método en la clase:**
```javascript
setupNewSectionRoutes() {
  this.app.get('/api/new-section/data', (req, res) => {
    const mockData = { message: 'New section data' };
    res.json(mockData);
  });
}
```

2. **Registrar en setupRoutes():**
```javascript
setupRoutes() {
  // ... existing routes
  this.setupNewSectionRoutes();
}
```

### Logging

El servidor incluye logging automático de:
- Todas las requests HTTP
- Errores del servidor
- Acceso a archivos de datos
- Submissions de formularios

## 🔄 Integración con Frontend

### Migración desde APIs Mockeadas

Para migrar el frontend existente:

1. **Cambiar URLs de API:**
```javascript
// Antes (localhost:8080)
fetch('/api/data')

// Después (localhost:3000)
fetch('http://localhost:3000/api/pilgrim-data')
```

2. **Manejar CORS:**
El backend ya incluye configuración CORS para el frontend.

3. **Actualizar manejo de errores:**
```javascript
try {
  const response = await fetch('http://localhost:3000/api/pilgrim/profile');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

## 🚦 Estados de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 404 | Endpoint o recurso no encontrado |
| 500 | Error interno del servidor |

## 📊 Monitoreo

### Health Check

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-15T10:00:00.000Z",
  "server": "CoomÜnity Backend API",
  "version": "1.0.0",
  "environment": "development"
}
```

### Logs

Los logs se muestran en consola con formato:
```
🌐 [2024-03-15T10:00:00.000Z] GET /api/pilgrim/profile
```

## 🛡️ Seguridad

- **Helmet.js** para headers de seguridad
- **CORS** configurado para orígenes específicos
- **Validación** básica de inputs
- **Rate limiting** (recomendado para producción)

## 📝 Notas para Desarrollo

1. **Separación de Responsabilidades:**
   - Backend (puerto 3000): APIs y lógica de datos
   - Frontend (puerto 8080): Archivos estáticos y UI

2. **Datos Mock:**
   - Todos los datos son simulados para desarrollo
   - Estructura realista preparada para migración a DB real

3. **Extensibilidad:**
   - Arquitectura modular para añadir nuevas funcionalidades
   - Configuración centralizada en constructor

## 🔮 Próximos Pasos

- [ ] Integración con base de datos real
- [ ] Autenticación y autorización
- [ ] Rate limiting y validación avanzada
- [ ] Tests automatizados
- [ ] Documentación OpenAPI/Swagger
- [ ] Deployment y CI/CD 