# 🤝 Módulo Red Social (GÜS Gamified Ü Social)

## 📋 Descripción General

El módulo Red Social de CoomÜnity es una implementación completa de un sistema de chat/mensajería basado en matches del marketplace. Permite a los usuarios comunicarse directamente con otros usuarios con los que han hecho "match" en el sistema de intercambio.

## 🎯 Funcionalidades Implementadas

### ✅ Fase Actual (MVP)
- **Sistema de Chat Match-Based**: Chat directo entre usuarios que han hecho match
- **Lista de Conversaciones**: Vista de todos los matches activos con estados en tiempo real
- **Mensajería Completa**: Envío de mensajes de texto y emojis
- **Estados de Usuario**: Online, Away, Offline con indicadores visuales
- **Notificaciones**: Sistema de notificaciones para nuevos mensajes
- **Búsqueda de Conversaciones**: Filtrado de matches por nombre
- **Historial de Mensajes**: Persistencia y carga de mensajes históricos
- **Indicadores de Estado**: Entregado, leído, enviando
- **Auto-scroll**: Scroll automático a nuevos mensajes

### 🚧 Funcionalidades Futuras
- **Mensajes de Audio**: Grabación y reproducción de mensajes de voz
- **Feed Social**: Timeline de actividades de la comunidad
- **Grupos de Chat**: Conversaciones grupales
- **Media Sharing**: Compartir imágenes y videos
- **Gamificación Social**: Puntos y recompensas por interacciones
- **WebSocket Real-time**: Mensajería en tiempo real

## 🏗️ Arquitectura del Módulo

### 📁 Estructura de Archivos
```
src/components/modules/social/
├── SocialMain.tsx              # Componente principal
├── components/
│   ├── MatchesList.tsx         # Lista de conversaciones
│   ├── ChatArea.tsx            # Área de chat
│   ├── SocialHeader.tsx        # Header con notificaciones
│   └── index.ts                # Exportaciones
└── README.md                   # Esta documentación
```

### 🔧 Servicios y APIs
```
src/lib/
├── api-service.ts              # Servicios de API (socialAPI)
└── mockData/
    └── socialData.ts           # Datos mock para desarrollo

src/hooks/
└── useRealBackendData.ts       # Hooks React Query para Social
```

### 🎨 Tipos TypeScript
```typescript
// Definidos en src/types/index.ts
interface SocialMatch {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  userId: string;
  matchedAt: string;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'emoji' | 'audio';
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
}
```

## 🔌 Integración con Backend

### Endpoints Esperados
```typescript
// Matches
GET /social/matches                           # Lista de matches
GET /social/matches/:matchId                  # Detalles de match específico

// Mensajes
GET /social/matches/:matchId/messages         # Mensajes de un match
POST /social/matches/:matchId/messages        # Enviar mensaje

// Estados y Notificaciones
PATCH /social/status                          # Actualizar estado de usuario
GET /social/notifications                     # Obtener notificaciones
PATCH /social/notifications/:id/read          # Marcar como leída
```

### Mock Data Actual
Temporalmente usa datos mock en `src/lib/mockData/socialData.ts` que simula:
- 4 matches diferentes con distintos estados
- Conversaciones con mensajes de texto y emojis
- Notificaciones de nuevos mensajes y matches
- Simulación de delays de red y errores ocasionales

## 🎮 Hooks Disponibles

### Consultas (Queries)
```typescript
// Lista de matches
const { data: matches, isLoading, isError } = useSocialMatches();

// Mensajes de un match
const { data: messages } = useMatchMessages(matchId);

// Notificaciones
const { data: notifications } = useSocialNotifications();
```

### Mutaciones
```typescript
// Enviar mensaje
const sendMessage = useSendMessage();
await sendMessage.mutateAsync({ matchId, content, type });

// Actualizar estado
const updateStatus = useUpdateUserStatus();
await updateStatus.mutateAsync('online');
```

## 🎨 Componentes UI

### `<SocialMain />`
- Componente principal que orquesta toda la funcionalidad
- Maneja estado global del chat
- Integra todos los sub-componentes

### `<MatchesList />`
- Lista de conversaciones con búsqueda
- Estados de conexión visual (online/away/offline)
- Indicadores de mensajes no leídos
- Loading states con skeletons

### `<ChatArea />`
- Área de mensajería completa
- Header con información del match
- Lista de mensajes con auto-scroll
- Input con emojis y estados de envío
- Preparado para audio (botón de grabación)

### `<SocialHeader />`
- Header secundario con notificaciones
- Badge de conteo de notificaciones no leídas
- Loading states

## 🎯 Experiencia de Usuario

### Estados de Carga
- **Skeleton Loading**: Para matches y mensajes
- **Spinners**: Para acciones específicas
- **Progress Indicators**: En envío de mensajes
- **Error States**: Con opciones de reintento

### Feedback Visual
- **Estados de Mensaje**: ⏳ Enviando, ✓ Entregado, ✓✓ Leído
- **Estados de Usuario**: 🟢 Online, 🟡 Away, ⚫ Offline
- **Notificaciones**: Snackbars para confirmaciones
- **Hover Effects**: En elementos interactivos

### Responsive Design
- **Desktop**: Layout de 2 columnas (matches + chat)
- **Mobile**: Stack vertical adaptativo
- **Tablets**: Diseño híbrido

## 🔧 Configuración de Desarrollo

### Modo Mock (Actual)
```typescript
// En development, usa automáticamente mock data
if (import.meta.env.DEV) {
  return mockAPI.getMatches();
}
```

### Conexión Backend Real
```typescript
// Para producción, cambiar en socialAPI:
return apiService.get('/social/matches');
```

### WebSocket (Futuro)
```typescript
// Preparado para integración WebSocket
import { chatWebSocketService } from '../lib/api-service';

// En un componente:
useEffect(() => {
  chatWebSocketService.connect(matchId, userId, onMessage, onStatus);
  return () => chatWebSocketService.disconnect();
}, [matchId]);
```

## 🧪 Testing

### Datos de Prueba
- **Match ID Real**: `38000e9aad777d56` (del análisis extraído)
- **Usuario de Prueba**: `Juan Manuel Escobar Ramírez`
- **Emojis Populares**: `😊❤️👍😂🙏🔥💪🎉`

### Casos de Prueba Cubiertos
- ✅ Carga de matches con diferentes estados
- ✅ Envío de mensajes de texto y emojis
- ✅ Búsqueda de conversaciones
- ✅ Estados de conexión
- ✅ Notificaciones
- ✅ Error handling
- ✅ Loading states

## 🚀 Próximos Pasos

1. **Integración Backend Real**
   - Conectar con endpoints reales
   - Implementar autenticación JWT
   - Manejo de errores específicos

2. **WebSocket Real-time**
   - Mensajes en tiempo real
   - Estados de usuario dinámicos
   - Notificaciones push

3. **Funcionalidades Avanzadas**
   - Mensajes de audio
   - Feed social
   - Grupos de chat
   - Media sharing

4. **Optimizaciones**
   - Paginación de mensajes
   - Virtual scrolling
   - Cache offline
   - PWA notifications

## 🔗 Referencias

- [Análisis del Sistema Original](../../../modules/social/gossip_report.md)
- [Documentación de Tipos](../../../types/index.ts)
- [Agile Inception - Social Module](../../../../AGILE_INCEPTION_SUPERAPP.md)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Material UI Components](https://mui.com/material-ui/) 