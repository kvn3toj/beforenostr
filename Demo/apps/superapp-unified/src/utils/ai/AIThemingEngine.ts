/**
 * 🧠 AI AUTO-THEMING ENGINE - BACKEND CONNECTED
 * ===========================================
 *
 * Sistema de inteligencia artificial para theming automático y adaptativo
 * CONECTADO AL BACKEND NESTJS con persistencia real y analytics
 * Analiza contenido, comportamiento del usuario y contexto para aplicar
 * temas optimales basados en la filosofía CoomÜnity
 *
 * Fase 6: Innovación AI - Q4 2025 - BACKEND INTEGRATED
 */

// Importar servicio API real del proyecto
import { apiService } from '../../lib/api-service';

interface ContentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  energy: 'low' | 'medium' | 'high';
  topics: string[];
  coomunityPhilosophy: {
    reciprocidad: number; // 0-1 reciprocity detection
    bienComun: number; // 0-1 common good detection
    cooperation: number; // 0-1 cooperation vs competition
    sustainability: number; // 0-1 sustainability focus
  };
  emotionalTone: 'calm' | 'energetic' | 'inspiring' | 'focused' | 'playful';
}

interface UserContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionDuration: number;
  activityLevel: 'low' | 'medium' | 'high';
  interactionPatterns: {
    clickRate: number;
    scrollSpeed: number;
    timePerPage: number;
    returnVisits: number;
  };
  preferences: {
    brightness: 'auto' | 'light' | 'dark';
    contrast: 'low' | 'medium' | 'high';
    animation: 'minimal' | 'normal' | 'enhanced';
    focus: 'productivity' | 'entertainment' | 'learning';
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
}

interface ElementMapping {
  element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
  confidence: number;
  reasons: string[];
  cssProperties: Record<string, string>;
}

interface ThemeRecommendation {
  themeId: string;
  element: string;
  confidence: number;
  reasons: string[];
  adaptations: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    spacing: Record<string, string>;
    animations: Record<string, string>;
  };
  accessibility: Record<string, any>;
  performance: {
    criticalCSS: string[];
    deferredCSS: string[];
    estimatedLoadTime: number;
  };
}

interface LearningData {
  userId?: string;
  sessionId: string;
  interactions: Array<{
    timestamp: number;
    action: string;
    element: string;
    satisfaction?: number; // 1-5 rating
    duration: number;
  }>;
  preferences: UserContext['preferences'];
  outcomes: {
    engagement: number;
    taskCompletion: number;
    returnRate: number;
    satisfactionScore: number;
  };
}

// NUEVOS TIPOS PARA BACKEND INTEGRATION
interface BackendThemeData {
  userId: string;
  themePreferences: any;
  behaviorPatterns: any;
  performanceMetrics: any;
  learningHistory: LearningData[];
}

interface BackendAnalyticsPayload {
  eventType: 'theme_applied' | 'user_interaction' | 'performance_metric';
  userId: string;
  sessionId: string;
  data: any;
  timestamp: number;
}

export class AIThemingEngine {
  private static instance: AIThemingEngine;
  private modelAccuracy: number = 0.75; // Starts at 75%, improves with learning
  private learningData: LearningData[] = [];
  private currentAnalysis: ContentAnalysis | null = null;
  private currentContext: UserContext | null = null;
  private elementMappings: Map<string, ElementMapping> = new Map();
  private themeCache: Map<string, ThemeRecommendation> = new Map();
  private isLearningEnabled: boolean = true;
  private userId: string | null = null;

  private constructor() {
    this.initializeElementMappings();
    this.loadUserIdFromAuth();
    this.loadBackendData();
  }

  static getInstance(): AIThemingEngine {
    if (!AIThemingEngine.instance) {
      AIThemingEngine.instance = new AIThemingEngine();
    }
    return AIThemingEngine.instance;
  }

  /**
   * 🔗 BACKEND CONNECTION: Cargar ID de usuario desde autenticación
   */
  private loadUserIdFromAuth(): void {
    try {
      const userData = localStorage.getItem('COOMUNITY_USER_DATA');
      if (userData) {
        const user = JSON.parse(userData);
        this.userId = user.id;
        console.log('AIThemingEngine: Usuario conectado:', this.userId);
      }
    } catch (error) {
      console.warn('AIThemingEngine: No se pudo cargar usuario:', error);
    }
  }

  /**
   * 🔗 BACKEND CONNECTION: Cargar datos de theming desde backend
   */
  private async loadBackendData(): Promise<void> {
    if (!this.userId) {
      this.loadLocalFallback();
      return;
    }

    try {
      // Cargar preferencias de tema del backend
      const response = await apiService.get(`/analytics/user-theme-preferences/${this.userId}`);
      if (response.success && response.data) {
        this.modelAccuracy = response.data.modelAccuracy || 0.75;
        this.learningData = response.data.learningHistory || [];
        console.log('AIThemingEngine: Datos cargados desde backend');
      }
    } catch (error) {
      console.warn('AIThemingEngine: Fallback a datos locales:', error);
      this.loadLocalFallback();
    }
  }

  /**
   * 🔗 BACKEND CONNECTION: Fallback a datos locales si backend no disponible
   */
  private loadLocalFallback(): void {
    const stored = localStorage.getItem('coomunity-ai-learning-data');
    if (stored) {
      try {
        this.learningData = JSON.parse(stored);
      } catch (error) {
        console.warn('AIThemingEngine: Error cargando datos locales:', error);
      }
    }
  }

  /**
   * 🔗 BACKEND CONNECTION: Guardar datos de theming en backend
   */
  private async saveToBackend(data: BackendThemeData): Promise<boolean> {
    if (!this.userId) return false;

    try {
      const response = await apiService.post('/analytics/user-theme-data', {
        userId: this.userId,
        themeData: data,
        timestamp: Date.now()
      });

      return response.success;
    } catch (error) {
      console.warn('AIThemingEngine: Error guardando en backend:', error);
      // Fallback a localStorage
      this.saveLocalFallback();
      return false;
    }
  }

  /**
   * 🔗 BACKEND CONNECTION: Enviar analytics de performance a backend
   */
  private async sendAnalytics(payload: BackendAnalyticsPayload): Promise<void> {
    if (!this.userId) return;

    try {
      // Usar endpoint existente de analytics del backend
      await apiService.post('/analytics/events', {
        userId: this.userId,
        eventType: payload.eventType,
        sessionId: payload.sessionId,
        eventData: payload.data,
        timestamp: payload.timestamp,
        module: 'ai-theming-engine'
      });
    } catch (error) {
      console.warn('AIThemingEngine: Error enviando analytics:', error);
    }
  }

  /**
   * Inicializar mapeos de elementos CoomÜnity
   */
  private initializeElementMappings(): void {
    // Fuego - Acción, Energía, Transformación
    this.elementMappings.set('fuego', {
      element: 'fuego',
      confidence: 1.0,
      reasons: ['energy', 'action', 'transformation', 'motivation'],
      cssProperties: {
        '--primary-color': '#FF6B35',
        '--accent-color': '#FF8E53',
        '--energy-gradient': 'linear-gradient(45deg, #FF6B35, #FF8E53)',
        '--animation-speed': '0.3s',
        '--border-radius': '8px',
        '--box-shadow': '0 4px 20px rgba(255, 107, 53, 0.3)'
      }
    });

    // Agua - Fluidez, Adaptabilidad, Emociones
    this.elementMappings.set('agua', {
      element: 'agua',
      confidence: 1.0,
      reasons: ['flow', 'adaptability', 'emotion', 'intuition'],
      cssProperties: {
        '--primary-color': '#4A90E2',
        '--accent-color': '#5BA3F5',
        '--flow-gradient': 'linear-gradient(135deg, #4A90E2, #5BA3F5)',
        '--animation-speed': '0.5s',
        '--border-radius': '16px',
        '--box-shadow': '0 8px 32px rgba(74, 144, 226, 0.2)'
      }
    });

    // Tierra - Estabilidad, Crecimiento, Fundamento
    this.elementMappings.set('tierra', {
      element: 'tierra',
      confidence: 1.0,
      reasons: ['stability', 'growth', 'foundation', 'sustainability'],
      cssProperties: {
        '--primary-color': '#8B4513',
        '--accent-color': '#A0522D',
        '--earth-gradient': 'linear-gradient(180deg, #8B4513, #A0522D)',
        '--animation-speed': '0.7s',
        '--border-radius': '4px',
        '--box-shadow': '0 2px 16px rgba(139, 69, 19, 0.25)'
      }
    });

    // Aire - Comunicación, Ideas, Claridad
    this.elementMappings.set('aire', {
      element: 'aire',
      confidence: 1.0,
      reasons: ['communication', 'ideas', 'clarity', 'inspiration'],
      cssProperties: {
        '--primary-color': '#E6F3FF',
        '--accent-color': '#CCE7FF',
        '--air-gradient': 'linear-gradient(90deg, #E6F3FF, #CCE7FF)',
        '--animation-speed': '0.4s',
        '--border-radius': '24px',
        '--box-shadow': '0 6px 24px rgba(230, 243, 255, 0.4)'
      }
    });

    // Espíritu - Conexión, Propósito, Trascendencia
    this.elementMappings.set('espiritu', {
      element: 'espiritu',
      confidence: 1.0,
      reasons: ['connection', 'purpose', 'transcendence', 'wisdom'],
      cssProperties: {
        '--primary-color': '#9B59B6',
        '--accent-color': '#AF7AC5',
        '--spirit-gradient': 'linear-gradient(45deg, #9B59B6, #AF7AC5)',
        '--animation-speed': '0.6s',
        '--border-radius': '50%',
        '--box-shadow': '0 10px 40px rgba(155, 89, 182, 0.3)'
      }
    });
  }

  /**
   * Analizar contenido de la página actual
   */
  async analyzeContent(content: string, metadata?: any): Promise<ContentAnalysis> {
    const words = content.toLowerCase().split(/\s+/);

    // Análisis de sentimiento (simplificado)
    const positiveWords = ['bien', 'excelente', 'bueno', 'positivo', 'éxito', 'reciprocidad', 'colaborar', 'cooperar', 'compartir'];
    const negativeWords = ['mal', 'terrible', 'malo', 'negativo', 'fracaso', 'competir', 'individual'];

    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    let sentiment: ContentAnalysis['sentiment'] = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';

    // Análisis de energía
    const energyWords = ['acción', 'rápido', 'inmediato', 'ahora', 'urgente', 'dinámico'];
    const energyCount = words.filter(word => energyWords.includes(word)).length;
    const energy: ContentAnalysis['energy'] = energyCount > 3 ? 'high' : energyCount > 1 ? 'medium' : 'low';

    // Análisis de filosofía CoomÜnity
    const reciprocidadWords = ['reciprocidad', 'reciprocidad', 'intercambio', 'dar', 'recibir', 'equilibrio'];
    const bienComunWords = ['bien común', 'comunidad', 'colectivo', 'todos', 'juntos', 'compartir'];
    const cooperationWords = ['cooperar', 'colaborar', 'equipo', 'unir', 'conjunto'];
    const sustainabilityWords = ['sostenible', 'sustentable', 'futuro', 'preservar', 'cuidar'];

    const coomunityPhilosophy = {
      reciprocidad: Math.min(1, words.filter(word => reciprocidadWords.includes(word)).length / 10),
      bienComun: Math.min(1, words.filter(word => bienComunWords.includes(word)).length / 10),
      cooperation: Math.min(1, words.filter(word => cooperationWords.includes(word)).length / 10),
      sustainability: Math.min(1, words.filter(word => sustainabilityWords.includes(word)).length / 10)
    };

    // Tono emocional
    const calmWords = ['tranquilo', 'paz', 'calma', 'serenidad', 'meditación'];
    const energeticWords = ['energía', 'fuerza', 'poder', 'intenso', 'vibrante'];
    const inspiringWords = ['inspirar', 'motivar', 'despertar', 'iluminar', 'transformar'];
    const focusedWords = ['concentrar', 'enfocar', 'preciso', 'detalle', 'específico'];
    const playfulWords = ['jugar', 'divertir', 'alegre', 'entretenido', 'lúdico'];

    const toneScores = {
      calm: words.filter(word => calmWords.includes(word)).length,
      energetic: words.filter(word => energeticWords.includes(word)).length,
      inspiring: words.filter(word => inspiringWords.includes(word)).length,
      focused: words.filter(word => focusedWords.includes(word)).length,
      playful: words.filter(word => playfulWords.includes(word)).length
    };

    const emotionalTone = Object.entries(toneScores).reduce((a, b) =>
      toneScores[a[0]] > toneScores[b[0]] ? a : b
    )[0] as ContentAnalysis['emotionalTone'];

    const analysis: ContentAnalysis = {
      sentiment,
      energy,
      topics: this.extractTopics(words),
      coomunityPhilosophy,
      emotionalTone
    };

    this.currentAnalysis = analysis;

    // 🔗 BACKEND: Enviar análisis de contenido a analytics
    await this.sendAnalytics({
      eventType: 'user_interaction',
      userId: this.userId || 'anonymous',
      sessionId: this.getCurrentSessionId(),
      data: {
        contentAnalysis: analysis,
        contentLength: content.length,
        wordCount: words.length
      },
      timestamp: Date.now()
    });

    return analysis;
  }

  /**
   * 🔗 BACKEND CONNECTION: Analizar contexto del usuario con datos del backend
   */
  async analyzeUserContext(): Promise<UserContext> {
    // Cargar datos de contexto del backend si están disponibles
    let backendContext = null;
    if (this.userId) {
      try {
        const response = await apiService.get(`/analytics/user-context/${this.userId}`);
        if (response.success) {
          backendContext = response.data;
        }
      } catch (error) {
        console.warn('AIThemingEngine: Error cargando contexto del backend:', error);
      }
    }

    // Determinar hora del día
    const hour = new Date().getHours();
    let timeOfDay: UserContext['timeOfDay'] = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else if (hour >= 21 || hour < 6) timeOfDay = 'night';

    // Usar datos del backend si están disponibles, sino fallback a localStorage
    const storedData = localStorage.getItem('coomunity-user-behavior');
    const localData = storedData ? JSON.parse(storedData) : {};

    const context: UserContext = {
      timeOfDay,
      sessionDuration: this.getSessionDuration(),
      activityLevel: backendContext?.activityLevel || this.calculateActivityLevel(),
      interactionPatterns: backendContext?.interactionPatterns || {
        clickRate: localData.clickRate || 0.5,
        scrollSpeed: localData.scrollSpeed || 1.0,
        timePerPage: localData.timePerPage || 30,
        returnVisits: backendContext?.returnVisits || 1
      },
      preferences: {
        brightness: localStorage.getItem('coomunity-brightness') as any || 'auto',
        contrast: localStorage.getItem('coomunity-contrast') as any || 'medium',
        animation: localStorage.getItem('coomunity-animation') as any || 'normal',
        focus: localStorage.getItem('coomunity-focus') as any || 'learning'
      },
      accessibility: {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        largeText: false, // Detectar del sistema o configuración del usuario
        screenReader: this.detectScreenReader()
      }
    };

    this.currentContext = context;
    return context;
  }

  /**
   * 🔗 BACKEND CONNECTION: Generar recomendación con datos mejorados
   */
  async generateThemeRecommendation(
    content?: string,
    forceAnalysis: boolean = false
  ): Promise<ThemeRecommendation> {
    let analysis = this.currentAnalysis;
    if (!analysis || forceAnalysis) {
      analysis = await this.analyzeContent(content || document.body.textContent || '');
    }

    const context = await this.analyzeUserContext();
    const cacheKey = this.generateCacheKey(analysis, context);

    // Verificar caché local primero
    if (this.themeCache.has(cacheKey) && !forceAnalysis) {
      return this.themeCache.get(cacheKey)!;
    }

    // 🔗 BACKEND: Intentar obtener recomendación del backend con IA mejorada
    if (this.userId) {
      try {
        const response = await apiService.post('/analytics/ai-theme-recommendation', {
          userId: this.userId,
          contentAnalysis: analysis,
          userContext: context,
          currentAccuracy: this.modelAccuracy
        });

        if (response.success && response.data.recommendation) {
          const backendRecommendation = response.data.recommendation;
          this.themeCache.set(cacheKey, backendRecommendation);

          // Aplicar tema inmediatamente
          await this.applyTheme(backendRecommendation);

          return backendRecommendation;
        }
      } catch (error) {
        console.warn('AIThemingEngine: Backend recommendation failed, using local AI:', error);
      }
    }

    // Fallback a IA local si backend no disponible
    const elementScores = this.calculateElementScores(analysis, context);
    const bestElement = Array.from(elementScores.entries()).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    const recommendation: ThemeRecommendation = {
      themeId: `${bestElement}-${Date.now()}`,
      element: bestElement,
      confidence: this.modelAccuracy * elementScores.get(bestElement)!,
      reasons: this.generateReasons(analysis, context, bestElement),
      adaptations: this.generateAdaptations(bestElement, context),
      accessibility: this.generateAccessibilityAdaptations(context),
      performance: {
        criticalCSS: this.generateCriticalCSS(bestElement, this.generateAdaptations(bestElement, context)),
        deferredCSS: this.generateDeferredCSS(bestElement),
        estimatedLoadTime: this.estimateLoadTime(this.generateCriticalCSS(bestElement, this.generateAdaptations(bestElement, context)))
      }
    };

    this.themeCache.set(cacheKey, recommendation);

    // Aplicar tema inmediatamente
    await this.applyTheme(recommendation);

    return recommendation;
  }

  /**
   * 🔗 BACKEND CONNECTION: Aplicar tema y registrar en analytics
   */
  async applyTheme(recommendation: ThemeRecommendation): Promise<void> {
    // Aplicar CSS variables
    const root = document.documentElement;
    const mapping = this.elementMappings.get(recommendation.element);

    if (mapping) {
      Object.entries(mapping.cssProperties).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }

    // Aplicar adaptaciones adicionales
    Object.entries(recommendation.adaptations.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Inyectar CSS crítico
    this.injectCriticalCSS(recommendation.performance.criticalCSS);

    // 🔗 BACKEND: Registrar aplicación de tema en analytics
    await this.sendAnalytics({
      eventType: 'theme_applied',
      userId: this.userId || 'anonymous',
      sessionId: this.getCurrentSessionId(),
      data: {
        themeId: recommendation.themeId,
        element: recommendation.element,
        confidence: recommendation.confidence,
        loadTime: recommendation.performance.estimatedLoadTime,
        accessibility: recommendation.accessibility
      },
      timestamp: Date.now()
    });

    // Guardar preferencia del usuario
    this.saveUserPreference(recommendation);

    // Registrar aplicación para aprendizaje
    this.recordThemeApplication(recommendation);

    console.log('AIThemingEngine: Tema aplicado:', recommendation.element, 'Confianza:', recommendation.confidence);
  }

  /**
   * 🔗 BACKEND CONNECTION: Entrenar modelo con feedback del usuario
   */
  async trainModel(feedback: {
    themeId: string;
    satisfaction: number; // 1-5
    usageDuration: number;
    interactions: number;
    completedTasks: boolean;
  }): Promise<void> {
    const learningPoint: LearningData = {
      userId: this.userId || undefined,
      sessionId: this.getCurrentSessionId(),
      interactions: this.getSessionInteractions(),
      preferences: this.currentContext?.preferences || {} as any,
      outcomes: {
        engagement: feedback.interactions / feedback.usageDuration * 60, // interactions per minute
        taskCompletion: feedback.completedTasks ? 1 : 0,
        returnRate: this.calculateReturnRate(),
        satisfactionScore: feedback.satisfaction / 5 // normalize to 0-1
      }
    };

    this.learningData.push(learningPoint);

    // 🔗 BACKEND: Enviar datos de entrenamiento al backend
    if (this.userId) {
      try {
        await apiService.post('/analytics/ai-model-training', {
          userId: this.userId,
          themeId: feedback.themeId,
          learningData: learningPoint,
          feedback: feedback,
          timestamp: Date.now()
        });

        console.log('AIThemingEngine: Datos de entrenamiento enviados al backend');
      } catch (error) {
        console.warn('AIThemingEngine: Error enviando datos de entrenamiento:', error);
      }
    }

    // Actualizar precisión del modelo
    await this.updateModelAccuracy();

    // Guardar datos localmente como fallback
    this.saveLearningData();
  }

  // ... existing code ...

  private saveLocalFallback(): void {
    const data = JSON.stringify(this.learningData.slice(-100));
    localStorage.setItem('coomunity-ai-learning-data', data);
  }

  private extractTopics(words: string[]): string[] {
    const topicWords = {
      'educación': ['educación', 'aprender', 'enseñar', 'estudio', 'conocimiento'],
      'tecnología': ['tecnología', 'digital', 'software', 'aplicación', 'sistema'],
      'comunidad': ['comunidad', 'social', 'grupo', 'personas', 'colectivo'],
      'sostenibilidad': ['sostenible', 'ambiente', 'ecología', 'natural', 'futuro'],
      'economía': ['economía', 'dinero', 'intercambio', 'valor', 'comercio'],
      'bienestar': ['bienestar', 'salud', 'equilibrio', 'armonía', 'paz']
    };

    const detectedTopics: string[] = [];

    Object.entries(topicWords).forEach(([topic, keywords]) => {
      const matches = words.filter(word => keywords.includes(word)).length;
      if (matches > 0) {
        detectedTopics.push(topic);
      }
    });

    return detectedTopics;
  }

  private calculateElementScores(
    analysis: ContentAnalysis,
    context: UserContext
  ): Map<string, number> {
    const scores = new Map<string, number>();

    // Fuego - Acción y energía
    let fuegoScore = 0;
    if (analysis.energy === 'high') fuegoScore += 0.4;
    if (analysis.emotionalTone === 'energetic') fuegoScore += 0.3;
    if (context.activityLevel === 'high') fuegoScore += 0.2;
    if (context.timeOfDay === 'morning') fuegoScore += 0.1;

    // Agua - Fluidez y adaptabilidad
    let aguaScore = 0;
    if (analysis.sentiment === 'positive') aguaScore += 0.3;
    if (analysis.emotionalTone === 'calm') aguaScore += 0.4;
    if (context.preferences.animation === 'enhanced') aguaScore += 0.2;
    if (analysis.coomunityPhilosophy.reciprocidad > 0.5) aguaScore += 0.1;

    // Tierra - Estabilidad y crecimiento
    let tierraScore = 0;
    if (analysis.topics.includes('sostenibilidad')) tierraScore += 0.4;
    if (context.preferences.focus === 'productivity') tierraScore += 0.3;
    if (analysis.coomunityPhilosophy.sustainability > 0.5) tierraScore += 0.2;
    if (context.timeOfDay === 'afternoon') tierraScore += 0.1;

    // Aire - Comunicación e ideas
    let aireScore = 0;
    if (analysis.topics.includes('educación')) aireScore += 0.4;
    if (analysis.emotionalTone === 'inspiring') aireScore += 0.3;
    if (context.preferences.brightness === 'light') aireScore += 0.2;
    if (analysis.coomunityPhilosophy.cooperation > 0.5) aireScore += 0.1;

    // Espíritu - Conexión y propósito
    let espirituScore = 0;
    if (analysis.coomunityPhilosophy.bienComun > 0.7) espirituScore += 0.4;
    if (analysis.emotionalTone === 'inspiring') espirituScore += 0.3;
    if (context.timeOfDay === 'evening' || context.timeOfDay === 'night') espirituScore += 0.2;
    if (analysis.topics.includes('comunidad')) espirituScore += 0.1;

    scores.set('fuego', fuegoScore);
    scores.set('agua', aguaScore);
    scores.set('tierra', tierraScore);
    scores.set('aire', aireScore);
    scores.set('espiritu', espirituScore);

    return scores;
  }

  private generateAdaptations(element: string, context: UserContext) {
    const baseMapping = this.elementMappings.get(element);
    if (!baseMapping) return {};

    const adaptations = {
      colors: { ...baseMapping.cssProperties },
      typography: {},
      spacing: {},
      animations: {}
    };

    // Adaptaciones por accesibilidad
    if (context.accessibility.highContrast) {
      adaptations.colors['--contrast-multiplier'] = '1.5';
    }

    if (context.accessibility.reducedMotion) {
      adaptations.animations['--animation-duration'] = '0s';
    }

    // Adaptaciones por preferencias
    if (context.preferences.brightness === 'dark') {
      adaptations.colors['--background-opacity'] = '0.8';
    }

    return adaptations;
  }

  private generateCriticalCSS(element: string, adaptations: any): string[] {
    const mapping = this.elementMappings.get(element);
    if (!mapping) return [];

    return [
      `body { ${Object.entries(mapping.cssProperties).map(([k, v]) => `${k}: ${v}`).join('; ')} }`,
      `.theme-${element} { opacity: 1; transition: all 0.3s ease; }`
    ];
  }

  private generateReasons(
    analysis: ContentAnalysis,
    context: UserContext,
    element: string
  ): string[] {
    const reasons: string[] = [];

    if (element === 'fuego') {
      if (analysis.energy === 'high') reasons.push('Alto nivel de energía detectado');
      if (context.activityLevel === 'high') reasons.push('Usuario muy activo');
    }

    if (element === 'agua') {
      if (analysis.sentiment === 'positive') reasons.push('Contenido positivo');
      if (analysis.coomunityPhilosophy.reciprocidad > 0.5) reasons.push('Principios de reciprocidad presentes');
    }

    // ... más lógica de razones

    return reasons;
  }

  private detectScreenReader(): boolean {
    return window.navigator.userAgent.includes('NVDA') ||
           window.navigator.userAgent.includes('JAWS') ||
           window.speechSynthesis !== undefined;
  }

  private getSessionDuration(): number {
    const start = sessionStorage.getItem('coomunity-session-start');
    if (!start) {
      sessionStorage.setItem('coomunity-session-start', Date.now().toString());
      return 0;
    }
    return (Date.now() - parseInt(start)) / 1000; // seconds
  }

  private calculateActivityLevel(): UserContext['activityLevel'] {
    // Simplificado - en producción usaría métricas reales
    return 'medium';
  }

  private generateCacheKey(analysis: ContentAnalysis, context: UserContext): string {
    return `${analysis.sentiment}-${analysis.energy}-${context.timeOfDay}-${context.activityLevel}`;
  }

  private generateAccessibilityAdaptations(context: UserContext) {
    const adaptations: any = {};

    if (context.accessibility.reducedMotion) {
      adaptations.animation = 'none';
    }

    if (context.accessibility.highContrast) {
      adaptations.contrast = 'high';
    }

    return adaptations;
  }

  private generateDeferredCSS(element: string): string[] {
    return [
      `.${element}-enhanced { /* enhanced styling */ }`,
      `.${element}-animations { /* complex animations */ }`
    ];
  }

  private estimateLoadTime(criticalCSS: string[]): number {
    return criticalCSS.length * 10; // Estimación simplificada en ms
  }

  private injectCriticalCSS(css: string[]): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = css.join('\n');
    document.head.appendChild(styleElement);
  }

  private saveUserPreference(recommendation: ThemeRecommendation): void {
    localStorage.setItem('coomunity-ai-theme-preference', JSON.stringify({
      themeId: recommendation.themeId,
      element: recommendation.element,
      timestamp: Date.now()
    }));
  }

  private recordThemeApplication(recommendation: ThemeRecommendation): void {
    const applications = JSON.parse(localStorage.getItem('coomunity-theme-applications') || '[]');
    applications.push({ ...recommendation, appliedAt: Date.now() });
    localStorage.setItem('coomunity-theme-applications', JSON.stringify(applications.slice(-50))); // Mantener últimas 50
  }

  private getCurrentSessionId(): string {
    let sessionId = sessionStorage.getItem('coomunity-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('coomunity-session-id', sessionId);
    }
    return sessionId;
  }

  private getSessionInteractions(): LearningData['interactions'] {
    // En producción esto vendría del backend o se trackearía en tiempo real
    return [];
  }

  private calculateReturnRate(): number {
    // Cálculo simplificado
    return 0.7;
  }

  private async updateModelAccuracy(): Promise<void> {
    const stored = localStorage.getItem('coomunity-ai-learning-data');
    if (stored) {
      const data = JSON.parse(stored);
      // Algoritmo simplificado de mejora de precisión
      const avgSatisfaction = data.reduce((acc: number, curr: LearningData) =>
        acc + curr.outcomes.satisfactionScore, 0) / data.length;
      this.modelAccuracy = Math.min(0.95, this.modelAccuracy + (avgSatisfaction - 0.5) * 0.1);
    }
  }

  private loadLearningData(): void {
    // Este método ahora se maneja por loadBackendData()
  }

  private saveLearningData(): void {
    localStorage.setItem('coomunity-ai-learning-data', JSON.stringify(this.learningData.slice(-100))); // Mantener últimos 100
  }

  getModelStats(): {
    accuracy: number;
    learningDataPoints: number;
    cacheSize: number;
    elementMappings: number;
  } {
    return {
      accuracy: this.modelAccuracy,
      learningDataPoints: this.learningData.length,
      cacheSize: this.themeCache.size,
      elementMappings: this.elementMappings.size
    };
  }

  async reset(): Promise<void> {
    this.modelAccuracy = 0.75;
    this.learningData = [];
    this.themeCache.clear();
    this.currentAnalysis = null;
    this.currentContext = null;

    // 🔗 BACKEND: Limpiar datos del usuario en backend
    if (this.userId) {
      try {
        await apiService.delete(`/analytics/user-theme-data/${this.userId}`);
      } catch (error) {
        console.warn('AIThemingEngine: Error limpiando datos del backend:', error);
      }
    }

    localStorage.removeItem('coomunity-ai-learning-data');
    localStorage.removeItem('coomunity-theme-applications');
  }
}

// React Hook para usar el AI Theming Engine
export const useAITheming = () => {
  const [engine] = useState(() => AIThemingEngine.getInstance());
  const [currentTheme, setCurrentTheme] = useState<ThemeRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelStats, setModelStats] = useState(engine.getModelStats());

  const analyzeAndApplyTheme = useCallback(async (content?: string, forceAnalysis = false) => {
    setIsAnalyzing(true);
    try {
      const recommendation = await engine.generateThemeRecommendation(content, forceAnalysis);
      setCurrentTheme(recommendation);
      setModelStats(engine.getModelStats());
      return recommendation;
    } catch (error) {
      console.error('Error aplicando tema AI:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [engine]);

  const trainModel = useCallback(async (feedback: any) => {
    try {
      await engine.trainModel(feedback);
      setModelStats(engine.getModelStats());
    } catch (error) {
      console.error('Error entrenando modelo AI:', error);
    }
  }, [engine]);

  const resetEngine = useCallback(async () => {
    await engine.reset();
    setCurrentTheme(null);
    setModelStats(engine.getModelStats());
  }, [engine]);

  return {
    currentTheme,
    isAnalyzing,
    modelStats,
    analyzeAndApplyTheme,
    trainModel,
    resetEngine
  };
};

export default AIThemingEngine;
