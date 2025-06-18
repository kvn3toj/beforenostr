# 📚 **GAMIFIER API - Documentación Completa**

## 🎯 **Resumen del Proyecto**

La **Gamifier API** es el backend de la plataforma educativa gamificada que implementa la visión de **CoomÜnity** basada en el protocolo **Nostr**. Proporciona una arquitectura robusta para gestionar contenido educativo, gamificación, economía digital y comunicación descentralizada.

## 🚀 **Configuración y Acceso**

- **URL Base**: `http://localhost:1111`
- **Documentación Swagger**: `http://localhost:1111/api`
- **Endpoint Health Check**: `http://localhost:1111/health`

## 🏗️ **Arquitectura y Tecnologías**

### **Stack Tecnológico**
- **Framework**: NestJS + TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Cache**: Redis para optimización de rendimiento
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator + class-transformer
- **Autenticación**: JWT + RBAC (Role-Based Access Control)

### **Principios Arquitectónicos**
- **Modular**: Cada funcionalidad como módulo independiente
- **SOLID**: Inyección de dependencias y separación de responsabilidades
- **API-First**: Diseño orientado a API REST con documentación automática
- **Type-Safe**: TypeScript estricto con validación en runtime

## 📋 **Módulos Implementados**

### 🎮 **Módulos Core (Funcionales)**

#### **1. SubtitleModule** - `/subtitle`
Gestión de subtítulos para contenido de video
- `POST /subtitle/upload` - Subir archivo de subtítulos
- `GET /subtitle/:videoItemId` - Obtener subtítulos por video
- `DELETE /subtitle/:id` - Eliminar subtítulos

#### **2. QuestionModule** - `/questions`
Sistema de preguntas gamificadas
- `POST /questions` - Crear pregunta
- `GET /questions/search` - Buscar preguntas
- `POST /questions/bulk` - Crear múltiples preguntas

#### **3. VideoItemsModule** - `/video-items`
Gestión de elementos de video
- `GET /video-items` - Listar videos
- `GET /video-items/:id` - Obtener video específico
- `POST /video-items` - Crear nuevo video

#### **4. AiModule** - `/ai`
Generación de contenido con IA
- `POST /ai/generate-questions` - Generar preguntas automáticamente
- `POST /ai/save-questions` - Guardar preguntas generadas

#### **5. VideoPermissionsModule** - `/video-permissions`
Control de acceso a videos
- `GET /video-permissions/:videoItemId/users` - Usuarios con acceso
- `POST /video-permissions/grant` - Otorgar permisos
- `POST /video-permissions/revoke` - Revocar permisos

### 🌍 **Módulos de Contenido**

#### **6. MundosModule** - `/content/mundos`
Gestión de mundos gamificados
- `GET /content/mundos` - Listar mundos
- `POST /content/mundos` - Crear mundo
- `PUT /content/mundos/:id` - Actualizar mundo

#### **7. PlaylistsModule** - `/content/playlists`
Gestión de playlists educativas
- `GET /content/playlists` - Listar playlists
- `POST /content/playlists` - Crear playlist
- `DELETE /content/playlists/:id` - Eliminar playlist

#### **8. WorldsModule** - `/worlds`
Mundos gamificados de CoomÜnity
- `GET /worlds` - Listar mundos
- `POST /worlds` - Crear mundo
- `GET /worlds/creator/:creatorId` - Mundos por creador

#### **9. ExperiencesModule** - `/experiences`
Experiencias gamificadas
- `GET /experiences` - Listar experiencias
- `POST /experiences` - Crear experiencia
- `GET /experiences/stage/:stageId` - Experiencias por etapa

### 🎯 **Módulos de Gamificación**

#### **10. TokensModule** - `/tokens`
Gestión de tokens extrínsecos (Ünits, Töins)
- `GET /tokens` - Listar tokens
- `POST /tokens` - Crear token
- `GET /tokens/user/:userId/balance` - Balance de usuario

#### **11. NotificationsModule** - `/notifications`
Sistema de notificaciones
- `GET /notifications/user/:userId` - Notificaciones de usuario
- `POST /notifications` - Crear notificación
- `PUT /notifications/:id/read` - Marcar como leída

#### **12. MarketplaceModule** - `/marketplace`
Marketplace para productos y servicios
- `GET /marketplace/items` - Listar items
- `POST /marketplace/items` - Crear item
- `GET /marketplace/stats` - Estadísticas del marketplace

### 👥 **Módulos Sociales**

#### **13. GroupsModule** - `/groups`
Gestión de grupos y comunidades
- `GET /groups` - Listar grupos
- `POST /groups` - Crear grupo
- `POST /groups/join` - Unirse a grupo

### 🔧 **Módulos de Infraestructura**

#### **14. CacheModule**
Caché distribuido con Redis para optimización de rendimiento

#### **15. PrismaModule**
Gestión de base de datos con Prisma ORM

## 🔒 **Autenticación y Autorización**

### **JWT Authentication**
- Header: `Authorization: Bearer <token>`
- Endpoints protegidos requieren token válido

### **RBAC (Role-Based Access Control)**
- **Roles**: `user`, `admin`, `superadmin`
- **Decorador**: `@Roles('admin', 'superadmin')`
- **Guard**: `RolesGuard` para protección de endpoints

## 📊 **Módulos en Desarrollo**

### **PersonalityModule** - `/personality` ⚠️
Gestión de personalidades de usuarios (implementado, en testing)
- `GET /personality` - Listar personalidades
- `POST /personality` - Crear personalidad
- `POST /personality/assign` - Asignar a usuario

### **AnalyticsModule** - `/analytics` ⚠️
Sistema de analíticas y reportes (en desarrollo)
- `POST /analytics/data` - Registrar evento
- `GET /analytics/dashboard` - Métricas del dashboard
- `GET /analytics/rankings` - Rankings de usuarios

### **AdminModule** - `/admin` ⚠️
Panel de administración (en desarrollo)
- Gestión de configuración del sistema
- Logs de auditoría
- Herramientas de administración

## 🛠️ **Utilidades de Desarrollo**

### **Health Check**
```bash
curl http://localhost:1111/health
```

### **Testing de Endpoints**
```bash
# Ejemplo: Listar mundos
curl http://localhost:1111/content/mundos

# Ejemplo: Ping de notificaciones
curl http://localhost:1111/notifications/ping
```

### **Swagger Documentation**
Visita `http://localhost:1111/api` para la documentación interactiva completa.

## 🔧 **Configuración de Desarrollo**

### **Variables de Entorno (.env)**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
REDIS_URL="redis://localhost:6379"
PORT=3002
```

### **Comandos Útiles**
```bash
# Iniciar backend
npx tsx watch --no-cache --clear-screen=false --tsconfig tsconfig.backend.json src/main.ts

# Generar cliente Prisma
npx prisma generate

# Verificar compilación
npx tsc --noEmit --project tsconfig.backend.json
```

## 📈 **Roadmap y Próximos Pasos**

### **Fase Actual** ✅
- ✅ Módulos core implementados y funcionando
- ✅ Documentación Swagger completa
- ✅ Sistema de caché implementado
- ✅ Gestión de videos y preguntas funcional

### **Próxima Fase** 🚧
- 🚧 Finalización de AnalyticsModule
- 🚧 Implementación completa de RBAC
- 🚧 Optimización de rendimiento
- 🚧 Testing completo

### **Futuro** 📋
- 📋 Integración con protocolo Nostr
- 📋 Despliegue en producción
- 📋 Métricas avanzadas
- 📋 Escalabilidad horizontal

## 🤝 **Contribución**

La API está diseñada para ser modular y extensible. Cada módulo sigue las mejores prácticas de NestJS y puede ser desarrollado independientemente.

---

*Documentación generada automáticamente - Última actualización: Mayo 2025* 