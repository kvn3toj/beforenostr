# Documentación de Integración de API: SuperApp CoomÜnity ↔ Backend NestJS

## 📋 Resumen Ejecutivo

Este documento mapea las funcionalidades de la **SuperApp CoomÜnity** (Frontend React/TypeScript) con los endpoints del **Backend NestJS** que consumen. Representa el estado actual post-Fase C de Auditoría de Mocks, donde se ha migrado la mayoría de funcionalidades a endpoints reales.

**🎯 Principio Arquitectónico:** *Real-Data-First Principle* - Priorizar datos reales del backend, usar mocks solo cuando el endpoint no funciona o no está implementado.

---

## ⚙️ Principios Generales de la API

### Configuración Base
- **BaseURL del Backend:** `http://localhost:1111`
- **Protocolo de Autenticación:** JWT Bearer Token
- **Headers Requeridos:** 
  - `Authorization: Bearer <JWT>`
  - `Content-Type: application/json`
  - `X-Requested-With: XMLHttpRequest`

### Gestión de Estado
- **Frontend:** React Query para gestión de estado del servidor
- **Caché:** Estrategias optimizadas por tipo de dato (Real-Time, Dynamic, Content, Standard, Semi-Static, Static)
- **Error Handling:** Categorización de errores (network, auth, validation, business, server)

### Estados de Endpoints
- ✅ **Funcional:** Endpoint implementado y funcionando correctamente
- ⚠️ **Error de Servicio (500):** Endpoint existe pero tiene errores internos
- ❌ **No Implementado (404):** Endpoint no existe en el backend
- 🔄 **Mock Temporal:** Frontend usa datos mock mientras se implementa el endpoint

---

## 🔐 Módulo de Autenticación (Auth)

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Verificar salud del backend | `useBackendHealth()` | `GET /health` | ✅ Funcional | No |
| Login con credenciales | `apiService.post('/auth/login')` | `POST /auth/login` | ✅ Funcional | No |
| Logout | `apiService.post('/auth/logout')` | `POST /auth/logout` | ✅ Funcional | No |
| Verificar token | `apiService.get('/auth/verify')` | `GET /auth/verify` | ✅ Funcional | No |
| Disponibilidad del backend | `useBackendAvailability()` | `GET /health` | ✅ Funcional | No |

**📌 Notas:** 
- Autenticación completamente migrada (Fase 2.2)
- Mock auth disponible vía `VITE_ENABLE_MOCK_AUTH=true` solo para desarrollo

---

## 👤 Módulo de Perfil de Usuario (Profile)

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Obtener perfil de usuario | `useUserProfile(userId)` | `GET /users/:userId` | ✅ Funcional | No |
| Obtener datos de gamificación | `useGameData(userId)` | `GET /users/:userId/game-data` | 🔄 Mock Temporal | Sí |
| Actualizar estado de usuario | `useUpdateUserStatus()` | `PATCH /users/:userId/status` | 🔄 Mock Temporal | Sí |
| Estadísticas de usuario | `useUserStats(userId)` | `GET /users/:userId/stats` | 🔄 Mock Temporal | Sí |

**📌 Notas:**
- Perfiles básicos funcionan con datos de autenticación
- Datos extendidos de gamificación y estadísticas usan fallback temporal

---

## 🎮 Módulo de Gamificación

### Méritos y Recompensas

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Obtener méritos de usuario | `useUserMerits(userId)` | `GET /merits/user/:userId` | 🔄 Mock Temporal | Sí |
| Listar todos los méritos | `useAllMerits()` | `GET /merits` | 🔄 Mock Temporal | Sí |
| Leaderboard de méritos | `useMeritsLeaderboard(limit)` | `GET /merits/leaderboard?limit=X` | 🔄 Mock Temporal | Sí |
| Historial de méritos | `useMeritHistory(userId, page)` | `GET /merits/user/:userId/history?page=X` | 🔄 Mock Temporal | Sí |
| Otorgar mérito | `useAwardMerit()` | `POST /merits/award` | 🔄 Mock Temporal | Sí |

### Sistema de Quests

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Obtener quests disponibles | `useQuests()` | `GET /quests` | 🔄 Mock Temporal | Sí |
| Actualizar progreso | `useUpdateGameProgress()` | `PATCH /users/:userId/progress` | 🔄 Mock Temporal | Sí |

**📌 Notas:**
- Sistema de gamificación implementado con fallbacks optimizados
- TODO: Migrar a endpoints reales cuando estén disponibles

---

## 💰 Módulo de Wallet

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Obtener datos de wallet | `useWalletData(userId)` | `GET /wallet/users/:userId` | 🔄 Mock Temporal | Sí |
| Obtener transacciones | `useWalletTransactions(userId)` | `GET /wallet/users/:userId/transactions` | 🔄 Mock Temporal | Sí |
| Añadir transacción | `useAddTransaction()` | `POST /wallet/transactions` | 🔄 Mock Temporal | Sí |

**📌 Notas:**
- Wallet implementado con fallbacks optimizados
- Datos persistentes en localStorage para consistencia

---

## 🎬 Módulo de Videos (ÜPlay)

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Obtener categorías de videos | `useVideoCategories()` | `GET /video-items/categories` | ✅ Funcional | No |
| Listar videos por categoría | `useVideos(category)` | `GET /video-items?category=X` | ✅ Funcional | No |
| Obtener playlists | `useVideoPlaylists()` | `GET /video-items/playlists` | ✅ Funcional | No |

**📌 Notas:**
- ✅ COMPLETAMENTE MIGRADO al Backend NestJS (sin fallbacks)
- Uno de los módulos más estables de la aplicación

---

## 🌍 Módulo de Mundos (Worlds)

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Listar todos los mundos | `useMundos()` | `GET /mundos` | ✅ Funcional | No |
| Obtener mundo por ID | `useMundo(mundoId)` | `GET /mundos/:id` | ✅ Funcional | No |
| Obtener mundo por slug | `useMundoBySlug(slug)` | `GET /mundos/slug/:slug` | ✅ Funcional | No |
| Obtener playlists de mundo | `useMundoPlaylists(mundoId)` | `GET /mundos/:id/playlists` | ✅ Funcional | No |
| Test de mundos | `useMundosTest()` | `GET /mundos/test` | ✅ Funcional | No |

**📌 Notas:**
- ✅ COMPLETAMENTE MIGRADO al Backend NestJS (sin fallbacks)
- Funcionalidad core completamente operativa

---

## 👥 Módulo de Grupos (CoPs - Communities of Practice)

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Listar todos los grupos | `useGroupsData()` | `GET /groups` | ✅ Funcional | No |
| Obtener detalles de grupo | `useGroupDetails(groupId)` | `GET /groups/:id` | ✅ Funcional | No |
| Unirse a un grupo | `useJoinGroup()` | `POST /groups/:id/join` | ✅ Funcional | No |
| Salir de un grupo | `useLeaveGroup()` | `DELETE /groups/:id/leave` | ✅ Funcional | No |
| Crear nuevo grupo | `useCreateGroup()` | `POST /groups` | ✅ Funcional | No |

**📌 Notas:**
- ✅ COMPLETAMENTE MIGRADO al Backend NestJS (sin fallbacks)
- CRUD completo implementado y funcional

---

## 🏆 Módulo de Challenges

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Listar challenges | `useChallenges(filters)` | `GET /challenges` | ⚠️ Error de Servicio (500) | Sí (Temporal) |
| Obtener challenge específico | `useChallenge(challengeId)` | `GET /challenges/:id` | ⚠️ Error de Servicio (500) | Sí (Temporal) |
| Challenges de usuario | `useUserChallenges(userId)` | `GET /challenges/user/:userId` | ⚠️ Error de Servicio (500) | Sí (Temporal) |
| Unirse a challenge | `useJoinChallenge()` | `POST /challenges/:id/join` | ⚠️ Error de Servicio (500) | Sí (Temporal) |
| Salir de challenge | `useLeaveChallenge()` | `DELETE /challenges/:id/leave` | ⚠️ Error de Servicio (500) | Sí (Temporal) |
| Actualizar progreso | `useUpdateChallengeProgress()` | `PATCH /challenges/:id/progress` | ⚠️ Error de Servicio (500) | Sí (Temporal) |

**📌 Notas:**
- ⚠️ Endpoint devuelve error 500 - requiere debugging en backend
- Mock temporal bien estructurado con datos de desarrollo
- TODO: Resolver errores de servidor en `/challenges`

---

## 🛒 Módulo de Marketplace (GMP - Gamified Match Place)

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Obtener datos de marketplace | `useMarketplaceData()` | `GET /marketplace` | ❌ No Implementado (404) | Sí (Temporal) |
| Perfil de comerciante | `useMerchantProfile()` | `GET /marketplace/profile` | ❌ No Implementado (404) | Sí (Temporal) |
| Listar productos | `useProducts()` | `GET /marketplace/products` | ❌ No Implementado (404) | Sí (Temporal) |

**📌 Notas:**
- ❌ Endpoints no implementados en backend
- Mock temporal para desarrollo de UI
- TODO: Implementar endpoints `/marketplace/*` en backend

---

## 💬 Módulo Social (GÜS - Gamified Social)

### Sistema de Matches

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Obtener matches sociales | `useSocialMatches()` | `GET /social/matches` | ❌ No Implementado (404) | Sí (Temporal) |
| Detalles de match | `useMatchDetails(matchId)` | `GET /social/matches/:id` | ❌ No Implementado (404) | Sí (Temporal) |
| Mensajes de match | `useMatchMessages(matchId)` | `GET /social/matches/:id/messages` | ❌ No Implementado (404) | Sí (Temporal) |
| Enviar mensaje | `useSendMessage()` | `POST /social/matches/:id/messages` | ❌ No Implementado (404) | Sí (Temporal) |
| Notificaciones sociales | `useSocialNotifications()` | `GET /social/notifications` | ❌ No Implementado (404) | Sí (Temporal) |
| Marcar notificación como leída | `useMarkNotificationAsRead()` | `PATCH /social/notifications/:id/read` | ❌ No Implementado (404) | Sí (Temporal) |

### Feed Social

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Feed de posts sociales | `useSocialPosts(page)` | `GET /social/posts?page=X` | ❌ No Implementado (404) | Sí (Temporal) |
| Post específico | `useSocialPost(postId)` | `GET /social/posts/:id` | ❌ No Implementado (404) | Sí (Temporal) |
| Crear post | `useCreatePost()` | `POST /social/posts` | ❌ No Implementado (404) | Sí (Temporal) |
| Eliminar post | `useDeletePost()` | `DELETE /social/posts/:id` | ❌ No Implementado (404) | Sí (Temporal) |
| Dar like a post | `useLikePost()` | `POST /social/posts/:id/like` | ❌ No Implementado (404) | Sí (Temporal) |
| Obtener likes de post | `usePostLikes(postId)` | `GET /social/posts/:id/likes` | ❌ No Implementado (404) | Sí (Temporal) |
| Comentarios de post | `usePostComments(postId)` | `GET /social/posts/:id/comments` | ❌ No Implementado (404) | Sí (Temporal) |
| Crear comentario | `useCreateComment()` | `POST /social/posts/:id/comments` | ❌ No Implementado (404) | Sí (Temporal) |
| Eliminar comentario | `useDeleteComment()` | `DELETE /social/comments/:id` | ❌ No Implementado (404) | Sí (Temporal) |
| Like en comentario | `useLikeComment()` | `POST /social/comments/:id/like` | ❌ No Implementado (404) | Sí (Temporal) |

### WebSocket para Chat en Tiempo Real

| Funcionalidad del Frontend | Servicio del Frontend | Protocolo y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------|----------------------------------|-------------------|-------------------|
| Conexión de chat en vivo | `ChatWebSocketService.connect()` | `WebSocket ws://localhost:1111/chat` | ❌ No Implementado | Sí (Temporal) |
| Envío de mensajes en vivo | `ChatWebSocketService.sendMessage()` | `WebSocket Message` | ❌ No Implementado | Sí (Temporal) |
| Actualización de estado | `ChatWebSocketService.updateStatus()` | `WebSocket Status Update` | ❌ No Implementado | Sí (Temporal) |

**📌 Notas:**
- ❌ Módulo social completamente sin implementar en backend
- Mock temporal inteligente con datos realistas
- TODO: Implementar endpoints `/social/*` y WebSocket `/chat` en backend

---

## 📊 Módulo de Estadísticas

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Estadísticas generales | `useGeneralStats()` | `GET /stats/general` | 🔄 Mock Temporal | Sí |
| Estadísticas de búsqueda | `useSearchStats()` | `GET /stats/search` | 🔄 Mock Temporal | Sí |
| Estadísticas de usuario | `useUserStats(userId)` | `GET /stats/user/:userId` | 🔄 Mock Temporal | Sí |
| Datos de dashboard | `useDashboardData(userId)` | `GET /dashboard/user/:userId` | 🔄 Mock Temporal | Sí |

**📌 Notas:**
- Stats implementadas con fallbacks optimizados
- TODO: Implementar endpoints `/stats/*` y `/dashboard/*` en backend

---

## 📝 Módulo de Formularios

| Funcionalidad del Frontend | Hook/Servicio del Frontend | Método y Endpoint del Backend | Estado del Endpoint | Usa Mock (Fallback) |
|---------------------------|---------------------------|-------------------------------|-------------------|-------------------|
| Enviar formulario | `useSubmitForm()` | `POST /forms/submit` | 🔄 Mock Temporal | Sí |

**📌 Notas:**
- Formularios básicos con mock temporal
- TODO: Implementar endpoint `/forms/submit` en backend

---

## 🔧 Servicios de Utilidad y Herramientas

### Configuración y Entorno

| Funcionalidad | Archivo/Servicio | Descripción |
|--------------|------------------|-------------|
| Variables de entorno | `src/lib/environment.ts` | Configuración centralizada de entorno |
| Feature flags | `src/lib/feature-flags.tsx` | Control de funcionalidades experimentales |
| Analytics | `src/lib/analytics.ts` | Seguimiento y métricas de uso |
| Monitoring | `src/lib/monitoring.ts` | Monitoreo y logging de errores |

### Testing y Debug

| Funcionalidad | Archivo/Servicio | Descripción |
|--------------|------------------|-------------|
| Debug API | `src/lib/api-service-debug.ts` | Herramientas de debugging para API |
| Test API simple | `src/lib/simple-api-test.ts` | Tests básicos de conectividad |

---

## 📈 Métricas de Migración (Post-Fase C)

### ✅ Módulos Completamente Migrados (Sin Mocks)
- **Videos (ÜPlay):** 100% funcional
- **Mundos (Worlds):** 100% funcional  
- **Grupos (CoPs):** 100% funcional
- **Autenticación:** 100% funcional

### 🔄 Módulos con Fallbacks Optimizados
- **Wallet:** Fallback inteligente con persistencia
- **Méritos:** Fallback optimizado con datos consistentes
- **Estadísticas:** Fallback temporal bien estructurado
- **Perfil Usuario:** Datos básicos reales + extensiones mock

### ⚠️ Módulos con Problemas de Backend
- **Challenges:** Error 500 - requiere debugging
  
### ❌ Módulos Pendientes de Implementación
- **Marketplace:** Endpoints no implementados (404)
- **Social Completo:** Endpoints no implementados (404)

---

## 🚀 Próximos Pasos de Desarrollo

### Prioridad Alta
1. **Resolver errores 500 en `/challenges`** - debugging backend
2. **Implementar endpoints sociales** - `/social/*` y WebSocket `/chat`
3. **Implementar marketplace** - `/marketplace/*`

### Prioridad Media  
4. **Migrar wallet a backend real** - `/wallet/*`
5. **Implementar sistema de méritos** - `/merits/*`
6. **Implementar estadísticas** - `/stats/*`

### Prioridad Baja
7. **Optimizar gamificación** - `/quests/*` y `/users/*/game-data`
8. **Implementar formularios** - `/forms/*`

---

## 📚 Referencias Técnicas

### Archivos Clave de Integración
- **Hook Principal:** `src/hooks/useRealBackendData.ts` (1943 líneas)
- **Servicio API:** `src/lib/api-service.ts` (1370 líneas)
- **Configuración:** `src/lib/environment.ts`
- **Query Inteligente:** `src/hooks/useSmartQuery.ts`
- **Query Flexible:** `src/hooks/useGracefulQuery.ts`

### Patrones de Implementación
- **Real-Data-First:** Priorizar endpoints reales sobre mocks
- **Graceful Degradation:** Fallbacks inteligentes cuando sea necesario
- **Smart Caching:** Estrategias de caché por tipo de datos
- **Error Categorization:** Manejo estructurado de errores HTTP

---

**📅 Última Actualización:** Post-Fase C (Auditoría y Refactorización de Mocks)  
**📝 Documento Vivo:** Este documento se actualiza con cada cambio en la integración backend-frontend  
**🎯 Objetivo:** Servir como "única fuente de verdad" para el equipo de desarrollo CoomÜnity 