# Reproductor Interactivo Mejorado - CoomÜnity ÜPlay

## 🎯 Resumen de Mejoras

El reproductor interactivo de video ha sido completamente rediseñado para ofrecer una experiencia de aprendizaje gamificada más inmersiva y gratificante. Las mejoras incluyen preguntas fugaces sofisticadas, un sistema de recompensas dinámico, métricas en tiempo real, y integración completa con el backend de CoomÜnity.

## 🚀 Funcionalidades Principales

### 1. Sistema de Preguntas Fugaces Avanzado

#### Características:

- **Temporizadores visuales**: Barra de progreso que muestra el tiempo restante
- **Tipos de pregunta variados**: Opción múltiple, Verdadero/Falso, Respuesta rápida
- **Niveles de dificultad**: Fácil, Medio, Difícil con recompensas escaladas
- **Límites de tiempo dinámicos**: Cada pregunta puede tener su propio límite
- **Auto-omisión**: Las preguntas se omiten automáticamente si se agota el tiempo

#### Implementación:

```typescript
interface QuestionOverlay {
  id: number;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'true-false' | 'quick-response';
  question: string;
  options: {
    id: string;
    text: string;
    label: string;
    isCorrect?: boolean;
  }[];
  timeLimit?: number;
  reward?: { merits: number; ondas: number };
  difficulty?: 'easy' | 'medium' | 'hard';
}
```

### 2. Sistema de Recompensas Dinámico

#### Generación de Öndas:

- **Respuestas correctas**: Genera Öndas según la dificultad y velocidad
- **Bonificaciones por tiempo**: Respuestas rápidas obtienen multiplicadores
- **Bonificaciones por racha**: Respuestas consecutivas aumentan recompensas
- **Bonificaciones por dificultad**: Preguntas difíciles otorgan más recompensas

#### Fórmula de Recompensas:

```typescript
const calculateReward = (question, isCorrect, timeTaken, currentStreak) => {
  let multiplier = 1;

  // Bonificación por velocidad
  if (timeTaken <= timeLimit * 0.3) multiplier += 0.5;
  else if (timeTaken <= timeLimit * 0.6) multiplier += 0.2;

  // Bonificación por dificultad
  switch (difficulty) {
    case 'hard':
      multiplier += 0.5;
      break;
    case 'medium':
      multiplier += 0.2;
      break;
  }

  // Bonificación por racha
  if (currentStreak >= 5) multiplier += 0.3;
  else if (currentStreak >= 3) multiplier += 0.15;

  return {
    merits: Math.round(baseReward.merits * multiplier),
    ondas: Math.round(baseReward.ondas * multiplier),
  };
};
```

### 3. Métricas Avanzadas en Tiempo Real

#### Métricas del Jugador:

- **Mëritos y Öndas**: Monedas del ecosistema CoomÜnity
- **Nivel y Experiencia**: Sistema de progresión basado en participación
- **Rachas**: Respuestas consecutivas correctas
- **Nivel de Compromiso**: Basado en precisión y participación
- **Estadísticas de Sesión**: Tiempo activo, videos completados, puntuación

#### Componente de Métricas:

```typescript
interface VideoPlayerMetrics {
  merits: number;
  ondas: number;
  level: number;
  experience: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  sessionScore: number;
  engagementLevel: number;
  timeSpent: number;
  videosCompleted: number;
}
```

### 4. Sistema de Notificaciones Inmersivo

#### Tipos de Notificaciones:

- **Feedback de respuestas**: Confirmación inmediata de respuestas correctas/incorrectas
- **Animaciones de recompensa**: Efectos visuales para Mëritos y Öndas ganados
- **Notificaciones de logros**: Celebración de hitos y achievements
- **Animaciones de subida de nivel**: Efectos especiales para nuevos niveles
- **Indicadores de racha**: Animaciones cuando se mantienen rachas activas

#### Características Visuales:

- **Animaciones fluidas**: Transiciones suaves con Material-UI
- **Colores temáticos**: Paleta consistente con la identidad CoomÜnity
- **Posicionamiento inteligente**: No interfieren con el contenido del video
- **Auto-desaparición**: Control automático de duración y visibilidad

### 5. Integración con Backend

#### Endpoints Utilizados:

```typescript
// Autenticación y usuario
POST / auth / login;
GET / auth / me;
GET / users / { userId } / metrics;

// Video y preguntas
GET / videos / { videoId } / questions;
POST / analytics / question - answer;
POST / analytics / video - completion;
POST / analytics / video - progress;

// Métricas y logros
POST / merits / award;
GET / merits / user / { userId };
POST / achievements / unlock;
```

#### Persistencia de Datos:

- **Progreso de video**: Se guarda cada 30 segundos
- **Respuestas de preguntas**: Inmediatamente después de responder
- **Métricas de sesión**: Al completar el video
- **Logros desbloqueados**: En tiempo real cuando se alcanzan

### 6. Hook Personalizado `useInteractiveVideo`

#### Funcionalidades:

```typescript
const {
  metrics, // Métricas del jugador actualizadas
  questionsData, // Preguntas cargadas del backend
  isLoading, // Estado de carga
  error, // Manejo de errores
  handleQuestionAnswer, // Procesar respuesta de pregunta
  handleQuestionSkip, // Omitir pregunta
  handleVideoComplete, // Completar video
  progressToNextLevel, // Progreso hacia siguiente nivel
  experienceForNextLevel, // XP necesaria para próximo nivel
  accuracyRate, // Porcentaje de precisión
} = useInteractiveVideo({
  videoId,
  userId,
  enableAnalytics: true,
  onRewardEarned: (reward) => {
    /* manejar recompensa */
  },
  onLevelUp: (newLevel) => {
    /* manejar subida de nivel */
  },
  onAchievementUnlocked: (achievement) => {
    /* manejar logro */
  },
});
```

## 🎮 Controles del Reproductor Mejorados

### Controles Básicos:

- **Play/Pause**: Control principal de reproducción
- **Búsqueda**: Slider para navegar en el video
- **Volumen**: Control de audio con mute
- **Velocidad**: Cambio de velocidad de reproducción (0.5x - 2x)
- **Pantalla completa**: Modo inmersivo completo

### Controles Avanzados:

- **Atajos de teclado**: Espaciador (play/pause), F (fullscreen), M (mute), flechas (seek)
- **Auto-ocultación**: Controles se ocultan automáticamente durante reproducción
- **Indicadores de estado**: Tiempo transcurrido, duración total, progreso visual

### Indicadores de Actividad:

- **Métricas en vivo**: Mëritos, Öndas, nivel visible en todo momento
- **Progreso de sesión**: Tiempo activo, preguntas respondidas
- **Estado de racha**: Indicador visual de respuestas consecutivas

## 🏆 Sistema de Logros y Achievements

### Logros Implementados:

1. **Primera Respuesta** (Común): Responde tu primera pregunta
2. **Maestro de Rachas** (Raro): 5 respuestas consecutivas correctas
3. **Buscador de Conocimiento** (Épico): 10 preguntas respondidas correctamente
4. **Coleccionista de Energía** (Legendario): Acumula 100+ Öndas
5. **Estudiante Ejemplar** (Épico): Completa video con 80%+ precisión
6. **Completista** (Raro): Ve el 90%+ del video
7. **Aprendiz Veloz** (Raro): Responde en menos del 30% del tiempo límite

### Categorías de Rareza:

- **Común** (Verde): Logros básicos de participación
- **Raro** (Azul): Requieren constancia y habilidad
- **Épico** (Púrpura): Demuestran maestría y dedicación
- **Legendario** (Dorado): Los más difíciles de conseguir

## 📊 Analytics y Tracking

### Datos Recopilados:

```typescript
interface VideoAnalytics {
  videoId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  totalWatchTime: number;
  questionsAnswered: number;
  correctAnswers: number;
  skipCount: number;
  pauseCount: number;
  seekCount: number;
  completionRate: number;
  engagementScore: number;
}
```

### Métricas de Compromiso:

- **Tiempo de visualización**: Porcentaje del video visto
- **Participación en preguntas**: Ratio de preguntas respondidas vs. omitidas
- **Precisión**: Porcentaje de respuestas correctas
- **Velocidad de respuesta**: Tiempo promedio para responder
- **Interacciones**: Pausas, búsquedas, cambios de velocidad

## 🔧 Configuración y Personalización

### Props del Reproductor:

```typescript
interface InteractiveVideoPlayerOverlayProps {
  videoUrl: string; // URL del video
  videoId?: string; // ID único del video
  questions?: QuestionOverlay[]; // Preguntas personalizadas
  onQuestionAnswer?: Function; // Callback respuesta
  onVideoComplete?: Function; // Callback completar
  onMetricsUpdate?: Function; // Callback métricas
  onRewardEarned?: Function; // Callback recompensa
  isLandscape?: boolean; // Orientación
  autoplay?: boolean; // Reproducción automática
  enableAnalytics?: boolean; // Habilitar analytics
  userId?: string; // ID del usuario
}
```

### Personalización Visual:

- **Colores de marca**: Púrpura para controles, dorado para Mëritos, verde para Öndas
- **Animaciones**: Configurables y desactivables
- **Posición de elementos**: Adaptable a diferentes layouts
- **Responsividad**: Optimizado para móvil y desktop

## 🚀 Cómo Usar

### Implementación Básica:

```tsx
import InteractiveVideoPlayerOverlay from '../components/modules/uplay/components/InteractiveVideoPlayerOverlay';

const MyVideoPage = () => {
  return (
    <InteractiveVideoPlayerOverlay
      videoUrl="/assets/videos/mi-video.mp4"
      videoId="mi-video-id"
      userId="usuario-123"
      enableAnalytics={true}
      onRewardEarned={(reward) => {
        console.log(
          `Ganaste ${reward.merits} Mëritos y ${reward.ondas} Öndas!`
        );
      }}
      onLevelUp={(newLevel) => {
        console.log(`¡Subiste al nivel ${newLevel}!`);
      }}
    />
  );
};
```

### Con Hook Personalizado:

```tsx
import { useInteractiveVideo } from '../hooks/useInteractiveVideo';
import EnhancedPlayerMetrics from '../components/modules/uplay/components/EnhancedPlayerMetrics';

const AdvancedVideoPage = () => {
  const {
    metrics,
    handleQuestionAnswer,
    handleVideoComplete,
    progressToNextLevel,
    experienceForNextLevel,
    accuracyRate,
  } = useInteractiveVideo({
    videoId: 'mi-video-id',
    userId: 'usuario-123',
    enableAnalytics: true,
  });

  return (
    <div>
      <InteractiveVideoPlayerOverlay
        videoUrl="/assets/videos/mi-video.mp4"
        onQuestionAnswer={handleQuestionAnswer}
        onVideoComplete={handleVideoComplete}
      />
      <EnhancedPlayerMetrics
        metrics={metrics}
        progressToNextLevel={progressToNextLevel}
        experienceForNextLevel={experienceForNextLevel}
        accuracyRate={accuracyRate}
        sessionStartTime={new Date()}
      />
    </div>
  );
};
```

## 🎨 Filosofía de Diseño CoomÜnity

### Principios Aplicados:

1. **Ayni (Reciprocidad)**: El sistema recompensa la participación activa
2. **Bien Común**: Las preguntas educan sobre valores comunitarios
3. **Öndas Positivas**: Feedback positivo y celebración de logros
4. **Mëritos**: Reconocimiento tangible de contribuciones valiosas

### Elementos Visuales:

- **Colores**: Reflejan la identidad CoomÜnity (púrpura, verde, dorado)
- **Tipografía**: Roboto para legibilidad y modernidad
- **Iconografía**: Material Icons con elementos personalizados
- **Animaciones**: Suaves y celebratorias, nunca intrusivas

### Accesibilidad:

- **Contraste**: Cumple estándares WCAG 2.1
- **Navegación por teclado**: Totalmente accesible
- **Screen readers**: Etiquetas ARIA apropiadas
- **Reducción de movimiento**: Respeta preferencias del usuario

## 🔮 Futuras Mejoras

### Planificadas:

1. **Preguntas colaborativas**: Varios jugadores responden juntos
2. **Desafíos temporales**: Eventos especiales con recompensas únicas
3. **Insignias visuales**: Mostrar logros en el perfil público
4. **Replay interactivo**: Revisar respuestas anteriores
5. **Modo competitivo**: Leaderboards en tiempo real
6. **Integración con IA**: Preguntas generadas dinámicamente
7. **Subtítulos interactivos**: Definiciones y contexto en hover
8. **Notas del jugador**: Marcar momentos importantes del video

### Expansiones del Sistema:

- **Challenges diarios**: Objetivos rotativos con recompensas especiales
- **Sistema de mentores**: Jugadores experimentados guían nuevos usuarios
- **Playlist gamificadas**: Progresión a través de series de videos
- **Modo offline**: Funcionalidad básica sin conexión
- **Realidad aumentada**: Preguntas contextuales en 3D
- **Integración social**: Compartir logros y invitar amigos

## 📚 Recursos y Referencias

### Archivos Principales:

- `InteractiveVideoPlayerOverlay.tsx`: Componente principal del reproductor
- `useInteractiveVideo.ts`: Hook personalizado para lógica de video
- `EnhancedPlayerMetrics.tsx`: Sistema de métricas avanzado
- `VideoPlayerNotifications.tsx`: Sistema de notificaciones
- `InteractiveVideoEnhanced.tsx`: Página de demostración completa

### Dependencias:

- **@mui/material**: UI components y theming
- **@mui/icons-material**: Iconografía
- **React**: Framework base
- **TypeScript**: Tipado estático
- **API Service**: Integración con backend CoomÜnity

### Documentación Relacionada:

- [Guía de Filosofía CoomÜnity](./COOMUNITY_PHILOSOPHY.md)
- [API Reference](./API_REFERENCE.md)
- [Guía de Contribución](./CONTRIBUTING.md)
- [Tests E2E](./E2E_TESTING.md)

---

## 🎯 Conclusión

El reproductor interactivo mejorado representa un paso significativo hacia una experiencia de aprendizaje verdaderamente gamificada y alineada con los valores de CoomÜnity. La combinación de preguntas fugaces, recompensas inmediatas, métricas en tiempo real y un sistema de logros crea un entorno que no solo educa sino que también celebra y motiva la participación activa.

La arquitectura modular permite futuras expansiones mientras mantiene la compatibilidad con el ecosistema existente de CoomÜnity. Cada elemento ha sido diseñado pensando en la filosofía de reciprocidad (Ayni) y el bien común, asegurando que la tecnología sirva a los valores humanos fundamentales que guían nuestra comunidad.

_"En CoomÜnity, cada pregunta respondida es una Önda positiva que se expande por toda la comunidad, creando conocimiento colectivo y fortaleciendo nuestros lazos de reciprocidad."_
