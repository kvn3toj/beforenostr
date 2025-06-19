/**
 * 🧠 AI AUTO-THEMING ENGINE
 * =========================
 *
 * Sistema de inteligencia artificial para theming automático y adaptativo
 * Analiza contenido, comportamiento del usuario y contexto para aplicar
 * temas optimales basados en la filosofía CoomÜnity
 *
 * Fase 6: Innovación AI - Q4 2025
 */

interface ContentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  energy: 'low' | 'medium' | 'high';
  topics: string[];
  coomunityPhilosophy: {
    ayni: number; // 0-1 reciprocity detection
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

export class AIThemingEngine {
  private static instance: AIThemingEngine;
  private modelAccuracy: number = 0.75; // Starts at 75%, improves with learning
  private learningData: LearningData[] = [];
  private currentAnalysis: ContentAnalysis | null = null;
  private currentContext: UserContext | null = null;
  private elementMappings: Map<string, ElementMapping> = new Map();
  private themeCache: Map<string, ThemeRecommendation> = new Map();
  private isLearningEnabled: boolean = true;

  private constructor() {
    this.initializeElementMappings();
    this.loadLearningData();
  }

  static getInstance(): AIThemingEngine {
    if (!AIThemingEngine.instance) {
      AIThemingEngine.instance = new AIThemingEngine();
    }
    return AIThemingEngine.instance;
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
    const sentences = content.split(/[.!?]+/);

    // Análisis de sentimiento básico
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'ayni', 'cooperation', 'harmony'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'competition', 'conflict'];

    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    let sentiment: ContentAnalysis['sentiment'] = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Análisis de energía
    const energyWords = ['action', 'energy', 'exciting', 'dynamic', 'powerful', 'transform'];
    const calmWords = ['peaceful', 'calm', 'relaxing', 'gentle', 'quiet', 'meditate'];

    const energyCount = words.filter(word => energyWords.includes(word)).length;
    const calmCount = words.filter(word => calmWords.includes(word)).length;

    let energy: ContentAnalysis['energy'] = 'medium';
    if (energyCount > calmCount * 2) energy = 'high';
    else if (calmCount > energyCount * 2) energy = 'low';

    // Análisis de filosofía CoomÜnity
    const ayniWords = ['reciprocity', 'balance', 'give', 'receive', 'ayni', 'exchange'];
    const cooperationWords = ['cooperation', 'collaborate', 'together', 'community', 'team'];
    const sustainabilityWords = ['sustainable', 'environment', 'green', 'future', 'planet'];
    const bienComunWords = ['common good', 'bien común', 'collective', 'community benefit'];

    const philosophy = {
      ayni: Math.min(1, words.filter(word => ayniWords.includes(word)).length / 10),
      bienComun: Math.min(1, words.filter(word => bienComunWords.some(phrase => content.includes(phrase))).length / 5),
      cooperation: Math.min(1, words.filter(word => cooperationWords.includes(word)).length / 10),
      sustainability: Math.min(1, words.filter(word => sustainabilityWords.includes(word)).length / 10)
    };

    // Determinar tono emocional
    let emotionalTone: ContentAnalysis['emotionalTone'] = 'focused';
    if (energy === 'high' && sentiment === 'positive') emotionalTone = 'energetic';
    else if (philosophy.ayni > 0.5 || philosophy.bienComun > 0.5) emotionalTone = 'inspiring';
    else if (energy === 'low') emotionalTone = 'calm';
    else if (energyWords.some(word => words.includes(word))) emotionalTone = 'playful';

    // Extraer tópicos principales
    const topics = this.extractTopics(words);

    this.currentAnalysis = {
      sentiment,
      energy,
      topics,
      coomunityPhilosophy: philosophy,
      emotionalTone
    };

    return this.currentAnalysis;
  }

  /**
   * Analizar contexto del usuario
   */
  async analyzeUserContext(): Promise<UserContext> {
    const hour = new Date().getHours();
    let timeOfDay: UserContext['timeOfDay'] = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else if (hour >= 21 || hour < 6) timeOfDay = 'night';

    // Obtener datos de performance y conexión
    const connection = (navigator as any).connection;
    const memory = (performance as any).memory;

    // Detectar preferencias de accesibilidad
    const accessibility = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      largeText: window.matchMedia('(prefers-font-size: large)').matches,
      screenReader: this.detectScreenReader()
    };

    // Obtener datos almacenados de comportamiento
    const storedData = localStorage.getItem('coomunity-user-behavior');
    const behaviorData = storedData ? JSON.parse(storedData) : {};

    this.currentContext = {
      timeOfDay,
      sessionDuration: this.getSessionDuration(),
      activityLevel: this.calculateActivityLevel(),
      interactionPatterns: {
        clickRate: behaviorData.clickRate || 0,
        scrollSpeed: behaviorData.scrollSpeed || 0,
        timePerPage: behaviorData.timePerPage || 0,
        returnVisits: behaviorData.returnVisits || 0
      },
      preferences: {
        brightness: localStorage.getItem('coomunity-brightness') as any || 'auto',
        contrast: localStorage.getItem('coomunity-contrast') as any || 'medium',
        animation: localStorage.getItem('coomunity-animation') as any || 'normal',
        focus: localStorage.getItem('coomunity-focus') as any || 'learning'
      },
      accessibility
    };

    return this.currentContext;
  }

  /**
   * Generar recomendación de tema basada en análisis
   */
  async generateThemeRecommendation(
    content?: string,
    forceAnalysis: boolean = false
  ): Promise<ThemeRecommendation> {

    // Analizar contenido si es necesario
    if (content && (forceAnalysis || !this.currentAnalysis)) {
      await this.analyzeContent(content);
    }

    // Analizar contexto del usuario
    if (forceAnalysis || !this.currentContext) {
      await this.analyzeUserContext();
    }

    if (!this.currentAnalysis || !this.currentContext) {
      throw new Error('Missing analysis data for theme recommendation');
    }

    // Generar clave de cache
    const cacheKey = this.generateCacheKey(this.currentAnalysis, this.currentContext);

    // Verificar cache
    if (this.themeCache.has(cacheKey) && !forceAnalysis) {
      return this.themeCache.get(cacheKey)!;
    }

    // Calcular elemento más apropiado
    const elementScores = this.calculateElementScores(this.currentAnalysis, this.currentContext);
    const bestElement = Array.from(elementScores.entries())
      .sort((a, b) => b[1] - a[1])[0];

    const [element, confidence] = bestElement;
    const mapping = this.elementMappings.get(element)!;

    // Adaptar tema según contexto
    const adaptations = this.generateAdaptations(element, this.currentContext);

    // Generar CSS crítico
    const criticalCSS = this.generateCriticalCSS(element, adaptations);

    const recommendation: ThemeRecommendation = {
      themeId: `ai-${element}-${Date.now()}`,
      element,
      confidence: confidence * this.modelAccuracy,
      reasons: this.generateReasons(this.currentAnalysis, this.currentContext, element),
      adaptations,
      accessibility: this.generateAccessibilityAdaptations(this.currentContext),
      performance: {
        criticalCSS,
        deferredCSS: this.generateDeferredCSS(element),
        estimatedLoadTime: this.estimateLoadTime(criticalCSS)
      }
    };

    // Guardar en cache
    this.themeCache.set(cacheKey, recommendation);

    return recommendation;
  }

  /**
   * Aplicar tema recomendado al DOM
   */
  async applyTheme(recommendation: ThemeRecommendation): Promise<void> {
    const root = document.documentElement;

    // Aplicar propiedades CSS principales
    Object.entries(recommendation.adaptations.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    Object.entries(recommendation.adaptations.typography).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    Object.entries(recommendation.adaptations.spacing).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    Object.entries(recommendation.adaptations.animations).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Aplicar adaptaciones de accesibilidad
    Object.entries(recommendation.accessibility).forEach(([property, value]) => {
      root.style.setProperty(property, String(value));
    });

    // Inyectar CSS crítico
    this.injectCriticalCSS(recommendation.performance.criticalCSS);

    // Guardar preferencia del usuario
    this.saveUserPreference(recommendation);

    // Registrar aplicación para aprendizaje
    if (this.isLearningEnabled) {
      this.recordThemeApplication(recommendation);
    }

    console.log(`🎨 AI Theme Applied: ${recommendation.element} (confidence: ${Math.round(recommendation.confidence * 100)}%)`);
  }

  /**
   * Entrenar el modelo con feedback del usuario
   */
  async trainModel(feedback: {
    themeId: string;
    satisfaction: number; // 1-5
    usageDuration: number;
    interactions: number;
    completedTasks: boolean;
  }): Promise<void> {

    if (!this.isLearningEnabled) return;

    const learningEntry: LearningData = {
      sessionId: this.getCurrentSessionId(),
      interactions: this.getSessionInteractions(),
      preferences: this.currentContext?.preferences || {} as any,
      outcomes: {
        engagement: feedback.interactions / feedback.usageDuration,
        taskCompletion: feedback.completedTasks ? 1 : 0,
        returnRate: this.calculateReturnRate(),
        satisfactionScore: feedback.satisfaction / 5
      }
    };

    this.learningData.push(learningEntry);

    // Actualizar precisión del modelo
    await this.updateModelAccuracy();

    // Guardar datos de aprendizaje
    this.saveLearningData();

    console.log(`🧠 Model trained with feedback. New accuracy: ${Math.round(this.modelAccuracy * 100)}%`);
  }

  // ... Métodos auxiliares ...

  private extractTopics(words: string[]): string[] {
    // Simplificado - en producción usaría NLP más avanzado
    const topicKeywords = {
      'learning': ['learn', 'education', 'study', 'course', 'tutorial'],
      'marketplace': ['buy', 'sell', 'product', 'service', 'exchange'],
      'social': ['community', 'friend', 'share', 'connect', 'social'],
      'gaming': ['game', 'play', 'challenge', 'achievement', 'compete'],
      'wellness': ['health', 'wellness', 'meditation', 'balance', 'mindful']
    };

    const detectedTopics: string[] = [];
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => words.includes(keyword))) {
        detectedTopics.push(topic);
      }
    }

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
    if (analysis.topics.includes('gaming')) fuegoScore += 0.2;
    if (context.timeOfDay === 'morning') fuegoScore += 0.1;

    // Agua - Fluidez y adaptabilidad
    let aguaScore = 0;
    if (analysis.emotionalTone === 'calm') aguaScore += 0.3;
    if (analysis.coomunityPhilosophy.ayni > 0.5) aguaScore += 0.3;
    if (context.preferences.focus === 'entertainment') aguaScore += 0.2;
    if (context.timeOfDay === 'evening') aguaScore += 0.2;

    // Tierra - Estabilidad y crecimiento
    let tierraScore = 0;
    if (analysis.topics.includes('learning')) tierraScore += 0.4;
    if (analysis.coomunityPhilosophy.sustainability > 0.5) tierraScore += 0.3;
    if (context.preferences.focus === 'productivity') tierraScore += 0.2;
    if (context.sessionDuration > 1800) tierraScore += 0.1; // Sesiones largas

    // Aire - Comunicación e ideas
    let aireScore = 0;
    if (analysis.topics.includes('social')) aireScore += 0.4;
    if (analysis.emotionalTone === 'inspiring') aireScore += 0.3;
    if (context.timeOfDay === 'afternoon') aireScore += 0.2;
    if (analysis.topics.includes('learning')) aireScore += 0.1;

    // Espíritu - Conexión y propósito
    let espirituScore = 0;
    if (analysis.coomunityPhilosophy.bienComun > 0.5) espirituScore += 0.4;
    if (analysis.emotionalTone === 'inspiring') espirituScore += 0.3;
    if (context.timeOfDay === 'night') espirituScore += 0.2;
    if (analysis.topics.includes('wellness')) espirituScore += 0.1;

    scores.set('fuego', Math.min(1, fuegoScore));
    scores.set('agua', Math.min(1, aguaScore));
    scores.set('tierra', Math.min(1, tierraScore));
    scores.set('aire', Math.min(1, aireScore));
    scores.set('espiritu', Math.min(1, espirituScore));

    return scores;
  }

  private generateAdaptations(element: string, context: UserContext) {
    const baseMapping = this.elementMappings.get(element)!;
    const adaptations = {
      colors: { ...baseMapping.cssProperties },
      typography: {},
      spacing: {},
      animations: {}
    };

    // Adaptaciones por accesibilidad
    if (context.accessibility.highContrast) {
      adaptations.colors['--contrast-ratio'] = '7:1';
    }

    if (context.accessibility.reducedMotion) {
      adaptations.animations['--animation-duration'] = '0s';
    }

    // Adaptaciones por tiempo del día
    if (context.timeOfDay === 'night') {
      adaptations.colors['--brightness'] = '0.8';
    }

    // Adaptaciones por preferencias
    if (context.preferences.brightness === 'dark') {
      adaptations.colors['--background-luminance'] = '0.1';
    }

    return adaptations;
  }

  private generateCriticalCSS(element: string, adaptations: any): string[] {
    // CSS crítico específico del elemento
    const criticalRules = [
      `:root { ${Object.entries(adaptations.colors).map(([k, v]) => `${k}: ${v}`).join('; ')} }`,
      `body { transition: all 0.3s ease; }`,
      `.${element}-theme { opacity: 1; }`
    ];

    return criticalRules;
  }

  private generateReasons(
    analysis: ContentAnalysis,
    context: UserContext,
    element: string
  ): string[] {
    const reasons: string[] = [];

    if (element === 'fuego' && analysis.energy === 'high') {
      reasons.push('High energy content detected');
    }

    if (element === 'agua' && analysis.coomunityPhilosophy.ayni > 0.5) {
      reasons.push('Strong Ayni philosophy presence');
    }

    if (element === 'tierra' && analysis.topics.includes('learning')) {
      reasons.push('Learning-focused content');
    }

    if (element === 'aire' && analysis.topics.includes('social')) {
      reasons.push('Social interaction content');
    }

    if (element === 'espiritu' && analysis.coomunityPhilosophy.bienComun > 0.5) {
      reasons.push('Common good philosophy detected');
    }

    reasons.push(`Time of day: ${context.timeOfDay}`);
    reasons.push(`User focus: ${context.preferences.focus}`);

    return reasons;
  }

  // Métodos auxiliares adicionales (simplificados)
  private detectScreenReader(): boolean {
    return window.speechSynthesis !== undefined;
  }

  private getSessionDuration(): number {
    const start = sessionStorage.getItem('coomunity-session-start');
    return start ? Date.now() - parseInt(start) : 0;
  }

  private calculateActivityLevel(): UserContext['activityLevel'] {
    // Simplificado - basado en interacciones recientes
    return 'medium';
  }

  private generateCacheKey(analysis: ContentAnalysis, context: UserContext): string {
    return `${analysis.emotionalTone}-${context.timeOfDay}-${context.preferences.focus}`;
  }

  private generateAccessibilityAdaptations(context: UserContext) {
    const adaptations: Record<string, any> = {};

    if (context.accessibility.reducedMotion) {
      adaptations['--animation-duration'] = '0s';
    }

    if (context.accessibility.highContrast) {
      adaptations['--min-contrast-ratio'] = '7';
    }

    return adaptations;
  }

  private generateDeferredCSS(element: string): string[] {
    return [`${element}-enhanced.css`, `${element}-animations.css`];
  }

  private estimateLoadTime(criticalCSS: string[]): number {
    return criticalCSS.join('').length / 1000; // Estimación simplificada
  }

  private injectCriticalCSS(css: string[]): void {
    const style = document.createElement('style');
    style.textContent = css.join('\n');
    document.head.appendChild(style);
  }

  private saveUserPreference(recommendation: ThemeRecommendation): void {
    localStorage.setItem('coomunity-ai-theme-preference', JSON.stringify({
      element: recommendation.element,
      timestamp: Date.now()
    }));
  }

  private recordThemeApplication(recommendation: ThemeRecommendation): void {
    // Registro para aprendizaje del modelo
    const application = {
      themeId: recommendation.themeId,
      timestamp: Date.now(),
      context: this.currentContext,
      analysis: this.currentAnalysis
    };

    const applications = JSON.parse(localStorage.getItem('coomunity-theme-applications') || '[]');
    applications.push(application);
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
    // Simplificado - debería rastrear interacciones reales
    return [];
  }

  private calculateReturnRate(): number {
    // Simplificado - calcular tasa de retorno del usuario
    return 0.5;
  }

  private async updateModelAccuracy(): Promise<void> {
    if (this.learningData.length < 10) return;

    // Calcular precisión basada en feedback reciente
    const recentData = this.learningData.slice(-20);
    const avgSatisfaction = recentData.reduce((sum, data) => sum + data.outcomes.satisfactionScore, 0) / recentData.length;

    // Mejorar precisión gradualmente
    this.modelAccuracy = Math.min(0.95, this.modelAccuracy + (avgSatisfaction - 0.5) * 0.05);
  }

  private loadLearningData(): void {
    const stored = localStorage.getItem('coomunity-ai-learning-data');
    if (stored) {
      this.learningData = JSON.parse(stored);
    }
  }

  private saveLearningData(): void {
    localStorage.setItem('coomunity-ai-learning-data', JSON.stringify(this.learningData.slice(-100))); // Mantener últimos 100
  }

  // Métodos públicos para obtener información del sistema
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
    this.learningData = [];
    this.themeCache.clear();
    this.modelAccuracy = 0.75;
    this.currentAnalysis = null;
    this.currentContext = null;
    localStorage.removeItem('coomunity-ai-learning-data');
    localStorage.removeItem('coomunity-theme-applications');
  }
}

// Hook para usar el AI Theming Engine en componentes React
export const useAITheming = () => {
  const [engine] = useState(() => AIThemingEngine.getInstance());
  const [currentTheme, setCurrentTheme] = useState<ThemeRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAndApplyTheme = useCallback(async (content?: string) => {
    setIsAnalyzing(true);
    try {
      const recommendation = await engine.generateThemeRecommendation(content);
      await engine.applyTheme(recommendation);
      setCurrentTheme(recommendation);
    } catch (error) {
      console.error('Error applying AI theme:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [engine]);

  const provideFeedback = useCallback(async (feedback: {
    satisfaction: number;
    usageDuration: number;
    interactions: number;
    completedTasks: boolean;
  }) => {
    if (currentTheme) {
      await engine.trainModel({
        themeId: currentTheme.themeId,
        ...feedback
      });
    }
  }, [engine, currentTheme]);

  return {
    currentTheme,
    isAnalyzing,
    analyzeAndApplyTheme,
    provideFeedback,
    modelStats: engine.getModelStats()
  };
};

export default AIThemingEngine;
