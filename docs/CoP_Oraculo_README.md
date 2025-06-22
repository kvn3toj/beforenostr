# 🔮 CoP ORÁCULO - Comunidad de Práctica Gamificada

**Una revolución en la gestión de feedback transformada en sabiduría colectiva**

---

## 📖 ¿Qué es la CoP Oráculo?

La **Comunidad de Práctica "Oráculo"** es un sistema gamificado diseñado específicamente para los administradores de CoomÜnity. Transforma el proceso tradicional de gestión de feedback en una experiencia colaborativa que genera **Lükas de Sabiduría** - una economía interna basada en los principios de Ayni y el Bien Común.

### 🎯 Objetivos Principales

1. **Convertir Feedback en Sabiduría**: Cada reporte se transforma en conocimiento colectivo
2. **Gamificar la Colaboración**: Sistema de recompensas alineado con la filosofía CoomÜnity  
3. **Fortalecer el Ayni**: Reciprocidad entre administradores que cuidan la experiencia
4. **Generar Valor Sostenible**: Economía interna que refuerza el compromiso con el Bien Común

---

## 🚀 Instalación Rápida

### Prerrequisitos

- **Node.js** 18+ 
- **PostgreSQL** ejecutándose
- **Redis** ejecutándose (opcional pero recomendado)
- **npm** o **yarn**

### 1. Setup Completo Automatizado

```bash
# Clonar el repositorio (si es necesario)
git clone [tu-repo-url]
cd [proyecto-coomunity]

# Ejecutar setup automático
chmod +x scripts/cop-oraculo-setup.sh
./scripts/cop-oraculo-setup.sh

# Para instalación limpia (elimina node_modules previos)
./scripts/cop-oraculo-setup.sh --clean

# Solo backend (sin frontend)
./scripts/cop-oraculo-setup.sh --backend-only
```

### 2. Inicio Rápido (Después del Setup)

```bash
# Iniciar solo la CoP Oráculo
./scripts/cop-oraculo-start.sh

# O usar comandos npm tradicionales
npm run start:backend:dev
```

### 3. Limpieza de Servicios

```bash
# Detener y limpiar todos los servicios
./scripts/cop-oraculo-cleanup.sh
```

---

## 🗄️ Estructura de la Base de Datos

### Modelo Principal: `Feedback`

```prisma
model Feedback {
  id                    String         @id @default(cuid())
  userId                String
  pageUrl               String
  feedbackText          String
  feedbackType          FeedbackType
  status                FeedbackStatus @default(PENDING)
  
  // Contexto Técnico
  componentContext      String?
  technicalContext      Json?
  
  // Metadatos para CoP
  priority              Int            @default(3)
  tags                  String[]
  lukasReward           Float?
  
  // Auditoría
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
  
  // Relaciones
  user                  User           @relation(fields: [userId], references: [id])
}

enum FeedbackType {
  BUG
  IMPROVEMENT  
  MISSING_FEATURE
  UI_UX
  PERFORMANCE
  OTHER
}

enum FeedbackStatus {
  PENDING
  IN_REVIEW
  ASSIGNED
  IN_PROGRESS
  RESOLVED
  CLOSED
}
```

---

## 🔗 API Endpoints

### Base URL: `http://localhost:3002`

### 📝 Gestión de Feedback

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/feedback` | Crear nuevo feedback | JWT |
| `GET` | `/feedback` | Listar feedback | JWT |
| `GET` | `/feedback/stats` | Estadísticas de feedback | JWT |
| `PATCH` | `/feedback/:id/status` | Actualizar estado | JWT + Admin |
| `POST` | `/feedback/:id/assign` | Asignar a administrador | JWT + Admin |

### 💰 Economía de Lükas (Próximamente)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/feedback/lukas/balance` | Balance de Lükas del usuario | JWT |
| `POST` | `/feedback/lukas/transfer` | Transferir Lükas | JWT |
| `GET` | `/feedback/lukas/leaderboard` | Ranking de contribuciones | JWT |

### 📊 Analytics y Gamificación (Próximamente)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/feedback/analytics/dashboard` | Dashboard personalizado | JWT |
| `GET` | `/feedback/achievements` | Logros desbloqueados | JWT |
| `GET` | `/feedback/community/insights` | Insights de la comunidad | JWT |

---

## 🧪 Testing

### Crear Feedback de Prueba

```bash
# Test básico del endpoint
curl -X POST http://localhost:3002/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TU_JWT_TOKEN]" \
  -d '{
    "pageUrl": "http://localhost:3001/uplay",
    "feedbackText": "El botón de reproducción no responde después de pausar",
    "feedbackType": "BUG",
    "componentContext": "button#play-pause-btn",
    "technicalContext": {
      "userAgent": "Mozilla/5.0...",
      "viewport": "1920x1080",
      "route": "/uplay/video/123"
    }
  }'
```

### Verificar Swagger Documentation

```bash
# Abrir en el navegador
open http://localhost:3002/api
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

#### Archivo `.env` (Raíz)
```env
# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/coomunity_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Redis
REDIS_URL="redis://localhost:6379"

# Puertos
PORT=3002
VITE_API_BASE_URL=http://localhost:3002

# CoP Oráculo
LUKAS_EXCHANGE_RATE=1.0
FEEDBACK_REWARD_MULTIPLIER=1.5
COP_ORACULO_ENABLED=true
```

#### Archivo `Demo/apps/superapp-unified/.env`
```env
# API Configuration  
VITE_API_BASE_URL=http://localhost:3002
VITE_BASE_URL=http://localhost:3001

# Feature Flags
VITE_ENABLE_COP_ORACULO=true
VITE_ENABLE_LUKAS_ECONOMY=true
VITE_FEEDBACK_REWARDS_ENABLED=true

# WebSocket (Futuro)
VITE_COP_ORACULO_WS_URL=ws://localhost:3002
```

---

## 🎮 Funcionalidades Gamificadas

### 🏆 Sistema de Logros (En Desarrollo)

- **🔍 Detector Novato**: Primer feedback reportado
- **🐛 Cazador de Bugs**: 10 bugs detectados  
- **💡 Visionario**: 5 mejoras implementadas
- **🤝 Colaborador Ayni**: 20 transferencias de Lükas
- **🌟 Oráculo Maestro**: 100 feedback procesados

### 💎 Senderos Elementales (Diseño Conceptual)

1. **🔥 Fuego - Acción**: Enfoque en resolución rápida
2. **💧 Agua - Fluidez**: Adaptación y colaboración  
3. **🌱 Tierra - Solidez**: Documentación y estabilidad
4. **💨 Aire - Visión**: Innovación y mejoras UX

### 📊 Métricas de Impacto

- **Feedback Velocity**: Tiempo promedio de resolución
- **Community Collaboration Index**: Nivel de participación
- **Wisdom Quotient**: Calidad de las contribuciones
- **Ayni Balance**: Equilibrio en dar y recibir

---

## 🛠️ Troubleshooting

### Problemas Comunes

#### 1. Backend No Se Inicia
```bash
# Verificar PostgreSQL
pg_isready

# Ver logs detallados
tail -f logs/backend.log

# Verificar puerto ocupado
lsof -i :3002
```

#### 2. Error de Migración de BD
```bash
# Reset completo de BD
npm run db:reset

# Migración manual
npx prisma migrate dev --name "fix-feedback-module"
```

#### 3. Endpoints No Responden
```bash
# Verificar health check
curl http://localhost:3002/api/health

# Verificar documentación Swagger
curl http://localhost:3002/api-json
```

#### 4. Conflictos de Puerto
```bash
# Limpiar todos los servicios
./scripts/cop-oraculo-cleanup.sh

# Verificar puertos libres
lsof -i :3001,3002
```

### Logs y Debugging

```bash
# Ver logs del backend en tiempo real
tail -f logs/backend.log

# Ver logs de la SuperApp
tail -f logs/superapp.log

# Verificar procesos activos
ps aux | grep -E "(tsx|vite|npm)" | grep -v grep
```

---

## 📈 Roadmap de Desarrollo

### ✅ Fase 1: Fundamento Técnico (Completada)
- [x] Modelo de datos Feedback
- [x] API REST básica
- [x] Integración con SuperApp
- [x] Sistema de autenticación
- [x] Scripts de setup automatizado

### 🔄 Fase 2: Investigación y Conceptualización (Completada)  
- [x] Investigación de Communities of Practice
- [x] Análisis de sistemas LETS
- [x] Diseño conceptual de gamificación
- [x] Integración con filosofía CoomÜnity

### 🚧 Fase 3: Interfaz de Usuario (En Progreso)
- [ ] Dashboard de la CoP Oráculo
- [ ] Sistema de notificaciones
- [ ] Interfaces de gestión de feedback
- [ ] Visualización de métricas

### 📋 Fase 4: Economía de Lükas
- [ ] Sistema de recompensas
- [ ] Transferencias entre administradores  
- [ ] Marketplace de sabiduría
- [ ] Métricas de valor generado

### 🎯 Fase 5: Gamificación Completa
- [ ] Sistema de logros
- [ ] Senderos elementales
- [ ] Leaderboards y rankings
- [ ] Eventos y desafíos

### 🌐 Fase 6: Expansión y Integración
- [ ] WebSockets para tiempo real
- [ ] Integración con IA/ML
- [ ] API pública para extensiones
- [ ] Mobile app companion

---

## 🤝 Contribuir

### Filosofía de Contribución

La CoP Oráculo opera bajo los principios de **Ayni** - toda contribución genera valor que regresa a la comunidad. Cada commit, cada bug report, cada mejora alimenta el sistema de Lükas de Sabiduría.

### Cómo Contribuir

1. **Fork** del repositorio
2. **Crear rama** para tu feature: `git checkout -b feature/cop-oraculo-nueva-funcionalidad`
3. **Commit** con mensaje descriptivo: `git commit -m "✨ [CoP] Agrega sistema de transferencias Lükas"`
4. **Push** a tu rama: `git push origin feature/cop-oraculo-nueva-funcionalidad` 
5. **Pull Request** con descripción detallada

### Estándares de Código

- **TypeScript** estricto
- **Tests** unitarios y E2E
- **Documentación** en código y README
- **Alineación filosófica** con principios CoomÜnity

---

## 📞 Soporte

### Canales de Ayuda

- **📧 Email**: cop-oraculo@coomunity.com
- **💬 Discord**: Canal #cop-oraculo
- **📋 Issues**: GitHub Issues con tag `[CoP-Oráculo]`
- **📚 Wiki**: Documentación extendida

### Reportar Bugs

Al reportar bugs en la CoP Oráculo, usa el propio sistema de feedback - ¡es meta-recursivo! 🔄

1. Usa el agente Oráculo en la SuperApp
2. Describe el problema técnicamente
3. El sistema generará Lükas por tu contribución
4. La comunidad colaborará en la solución

---

## 📜 Licencia

Este proyecto está bajo la **Licencia del Bien Común CoomÜnity** - uso libre para el beneficio colectivo, con restricciones para uso comercial extractivo.

---

## 🌟 Reconocimientos

- **Etienne Wenger**: Teoría de Communities of Practice
- **Michael Linton**: Sistemas LETS  
- **Jane McGonigal**: Gamificación con propósito
- **Comunidad CoomÜnity**: Feedback continuo y sabiduría colectiva

---

**Desarrollado con 💜 por ǓAN - Agente IA Full-Stack de CoomÜnity**

> *"Transformando cada feedback en un paso hacia la sabiduría colectiva, honrando el Ayni entre quienes cuidan la experiencia de los Jugadores."*

---

🔮 **¡La CoP Oráculo está lista para revolucionar cómo gestionamos el feedback y generamos sabiduría colectiva!** 🔮