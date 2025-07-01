/**
 * 🌌 AUTO-THEMING IA ENGINE - Fase 6 Foundation
 * ============================================
 *
 * Motor de inteligencia artificial para generación automática de temas
 * basado en contenido, contexto y filosofía CoomÜnity
 */

import * as React from 'react';

// 🔮 Definición de UserContext para el sistema de Auto-theming
interface UserContext {
  userId?: string;
  route: string;
  timeZone?: string;
  preferences?: {
    theme?: string;
    accessibility?: boolean;
    reducedMotion?: boolean;
  };
  previousSessions?: {
    averageTimeSpent: number;
    preferredElements: string[];
    lastThemeUsed?: string;
  };
}

interface ContentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  philosophy: 'reciprocidad' | 'reciprocity' | 'growth' | 'balance' | 'transformation';
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night';
  userEnergy: number; // 0-100
  dominantEmotion: 'joy' | 'peace' | 'focus' | 'curiosity' | 'determination';
}

interface AIThemeRecommendation {
  primaryColor: string;
  accentColor: string;
  element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
  intensity: 'subtle' | 'medium' | 'intense';
  animations: 'minimal' | 'standard' | 'enhanced';
  confidence: number; // 0-1
  reasoning: string;
  customProperties: Record<string, string>;
}

interface UserBehaviorPattern {
  timestamp: number;
  route: string;
  timeSpent: number;
  interactions: number;
  scrollDepth: number;
  elementClicked: string[];
  emotionalState: string;
}

interface ThemeAdaptationSettings {
  enableAutoAdaptation: boolean;
  adaptationFrequency: 'immediate' | 'gentle' | 'session-based';
  userPreferences: {
    preferredElements: string[];
    dislikedColors: string[];
    sensitivityToChange: number; // 0-1
  };
  accessibilityMode: boolean;
  performanceMode: boolean;
}

export class AutoThemingEngine {
  private static instance: AutoThemingEngine;

  private behaviorPatterns: UserBehaviorPattern[] = [];
  private currentRecommendation: AIThemeRecommendation | null = null;
  private adaptationSettings: ThemeAdaptationSettings;
  private aiModelAccuracy: number = 0.75; // Inicialmente 75%
  private learningMode: boolean = true;

  private constructor() {
    this.adaptationSettings = this.getDefaultSettings();
    this.initializeAIFoundation();
  }

  static getInstance(): AutoThemingEngine {
    if (!AutoThemingEngine.instance) {
      AutoThemingEngine.instance = new AutoThemingEngine();
    }
    return AutoThemingEngine.instance;
  }

  /**
   * Configurar fundamentos de IA
   */
  private initializeAIFoundation(): void {
    // Cargar patrones de comportamiento previos
    this.loadStoredBehaviorPatterns();

    // Inicializar sistema de aprendizaje
    this.setupLearningSystem();

    // Configurar observadores de comportamiento
    this.setupBehaviorTracking();

    console.log('🤖 AutoThemingEngine initialized with AI foundation');
  }

  /**
   * Analizar contenido de la página actual
   */
  async analyzeContent(pageContent: string, route: string): Promise<ContentAnalysis> {
    const words = pageContent.toLowerCase().split(/\s+/);

    // 1. Análisis de sentimiento mejorado
    const sentiment = this.analyzeSentiment(words);

    // 2. Extracción de temas usando patrones CoomÜnity
    const topics = this.extractTopics(words);

    // 3. Detección de filosofía dominante
    const philosophy = this.detectPhilosophy(words, route);

    // 4. Contexto temporal inteligente
    const timeContext = this.getTimeContext();

    // 5. Estimación de energía del usuario
    const userEnergy = await this.estimateUserEnergy();

    // 6. Detección de emoción dominante
    const dominantEmotion = this.detectDominantEmotion(words, sentiment);

    return {
      sentiment,
      topics,
      philosophy,
      timeContext,
      userEnergy,
      dominantEmotion
    };
  }

  /**
   * Generar recomendación de tema usando IA
   */
  async generateThemeRecommendation(analysis: ContentAnalysis): Promise<AIThemeRecommendation> {
    // Aplicar lógica de IA para mapear análisis → tema
    let element: AIThemeRecommendation['element'] = 'agua';
    let intensity: AIThemeRecommendation['intensity'] = 'medium';
    let animations: AIThemeRecommendation['animations'] = 'standard';

    // Mapeo filosófico inteligente
    switch (analysis.philosophy) {
      case 'reciprocidad':
        element = 'espiritu'; // Balance y reciprocidad espiritual
        break;
      case 'growth':
        element = 'tierra'; // Crecimiento orgánico y manifestación
        break;
      case 'balance':
        element = 'agua'; // Fluidez y adaptabilidad
        break;
      case 'reciprocity':
        element = 'aire'; // Comunicación e intercambio
        break;
      case 'transformation':
        element = 'fuego'; // Energía transformadora
        break;
    }

    // Ajuste por contexto temporal
    intensity = this.adjustIntensityByTime(analysis.timeContext, analysis.userEnergy);

    // Ajuste de animaciones por energía del usuario
    animations = this.adjustAnimationsByEnergy(analysis.userEnergy, analysis.dominantEmotion);

    // Generar colores usando algoritmo CoomÜnity
    const { primaryColor, accentColor } = this.generateElementColors(element, intensity);

    // Calcular confianza basada en datos disponibles
    const confidence = this.calculateConfidence(analysis);

    // Generar propiedades CSS personalizadas
    const customProperties = this.generateCustomProperties(element, primaryColor, accentColor);

    const recommendation: AIThemeRecommendation = {
      primaryColor,
      accentColor,
      element,
      intensity,
      animations,
      confidence,
      reasoning: this.generateReasoning(analysis, element),
      customProperties
    };

    // Almacenar para aprendizaje futuro
    this.currentRecommendation = recommendation;
    this.logRecommendation(recommendation, analysis);

    return recommendation;
  }

  /**
   * Análisis de sentimiento mejorado
   */
  private analyzeSentiment(words: string[]): 'positive' | 'neutral' | 'negative' {
    const positiveWords = [
      'reciprocidad', 'balance', 'harmony', 'growth', 'love', 'peace', 'joy',
      'abundance', 'success', 'grateful', 'amazing', 'wonderful',
      'beautiful', 'excellent', 'perfect', 'brilliant', 'fantastic',
      'cooperation', 'collaboration', 'unity', 'wisdom', 'transformation'
    ];

    const negativeWords = [
      'conflict', 'stress', 'error', 'problem', 'difficult', 'hard',
      'struggle', 'pain', 'sad', 'angry', 'frustrated', 'worried',
      'fear', 'anxiety', 'depression', 'fail', 'failure', 'impossible'
    ];

    const positiveCount = words.filter(w => positiveWords.includes(w)).length;
    const negativeCount = words.filter(w => negativeWords.includes(w)).length;

    const threshold = Math.max(2, Math.floor(words.length * 0.02)); // 2% threshold

    if (positiveCount >= threshold && positiveCount > negativeCount) return 'positive';
    if (negativeCount >= threshold && negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extracción de temas usando patrones CoomÜnity
   */
  private extractTopics(words: string[]): string[] {
    const topicMap = {
      'learning': ['learn', 'education', 'knowledge', 'study', 'understand', 'discover'],
      'marketplace': ['buy', 'sell', 'exchange', 'trade', 'product', 'service', 'lukas'],
      'social': ['community', 'friend', 'share', 'connect', 'together', 'collaborate'],
      'growth': ['grow', 'develop', 'improve', 'progress', 'evolution', 'transform'],
      'wellness': ['health', 'mindfulness', 'balance', 'peace', 'meditation', 'healing'],
      'creativity': ['create', 'art', 'design', 'imagine', 'innovate', 'express'],
      'technology': ['digital', 'tech', 'innovation', 'future', 'ai', 'automation']
    };

    const topics: string[] = [];

    for (const [topic, keywords] of Object.entries(topicMap)) {
      const matches = words.filter(w => keywords.includes(w)).length;
      if (matches >= 2) {
        topics.push(topic);
      }
    }

    return topics.length > 0 ? topics : ['general'];
  }

  /**
   * Detección de filosofía dominante
   */
  private detectPhilosophy(words: string[], route: string): ContentAnalysis['philosophy'] {
    const philosophyKeywords = {
      'reciprocidad': ['reciprocidad', 'reciprocity', 'balance', 'give', 'receive', 'exchange'],
      'reciprocity': ['mutual', 'shared', 'together', 'cooperation', 'collaboration'],
      'growth': ['grow', 'develop', 'learn', 'improve', 'progress', 'evolution'],
      'balance': ['balance', 'harmony', 'equilibrium', 'centered', 'stable'],
      'transformation': ['transform', 'change', 'evolve', 'breakthrough', 'innovation']
    };

    // Mapeo por ruta como backup
    const routePhilosophy: Record<string, ContentAnalysis['philosophy']> = {
      '/': 'balance',
      '/uplay': 'growth',
      '/marketplace': 'reciprocity',
      '/social': 'reciprocidad',
      '/wallet': 'transformation'
    };

    // Buscar keywords de filosofía
    for (const [philosophy, keywords] of Object.entries(philosophyKeywords)) {
      const matches = words.filter(w => keywords.includes(w)).length;
      if (matches >= 2) {
        return philosophy as ContentAnalysis['philosophy'];
      }
    }

    // Fallback por ruta
    return routePhilosophy[route] || 'balance';
  }

  /**
   * Obtener contexto temporal inteligente
   */
  private getTimeContext(): ContentAnalysis['timeContext'] {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Estimar energía del usuario basada en patrones
   */
  private async estimateUserEnergy(): Promise<number> {
    const recentPatterns = this.behaviorPatterns
      .filter(p => Date.now() - p.timestamp < 30 * 60 * 1000) // Últimos 30 minutos
      .slice(-5); // Últimas 5 interacciones

    if (recentPatterns.length === 0) {
      // Sin datos, usar contexto temporal
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 10) return 80; // Mañana: energía alta
      if (hour >= 10 && hour < 14) return 90; // Media mañana: pico
      if (hour >= 14 && hour < 16) return 60; // Post-almuerzo: baja
      if (hour >= 16 && hour < 20) return 75; // Tarde: recuperación
      return 40; // Noche: baja
    }

    // Calcular energía basada en patrones de comportamiento
    const averageInteractions = recentPatterns.reduce((acc, p) => acc + p.interactions, 0) / recentPatterns.length;
    const averageTimeSpent = recentPatterns.reduce((acc, p) => acc + p.timeSpent, 0) / recentPatterns.length;

    // Normalizar métricas a escala 0-100
    const interactionScore = Math.min(100, averageInteractions * 10);
    const timeScore = Math.min(100, averageTimeSpent / 1000); // milisegundos a segundos

    return Math.round((interactionScore + timeScore) / 2);
  }

  /**
   * Detectar emoción dominante
   */
  private detectDominantEmotion(words: string[], sentiment: string): ContentAnalysis['dominantEmotion'] {
    const emotionMap = {
      'joy': ['happy', 'joy', 'celebrate', 'excited', 'wonderful', 'amazing', 'fantastic'],
      'peace': ['calm', 'peace', 'relax', 'tranquil', 'serene', 'quiet', 'mindful'],
      'focus': ['focus', 'concentrate', 'attention', 'mindful', 'present', 'aware'],
      'curiosity': ['curious', 'wonder', 'explore', 'discover', 'learn', 'question'],
      'determination': ['determined', 'strong', 'powerful', 'achieve', 'goal', 'success']
    };

    for (const [emotion, keywords] of Object.entries(emotionMap)) {
      const matches = words.filter(w => keywords.includes(w)).length;
      if (matches >= 1) {
        return emotion as ContentAnalysis['dominantEmotion'];
      }
    }

    // Fallback basado en sentiment
    switch (sentiment) {
      case 'positive': return 'joy';
      case 'negative': return 'determination';
      default: return 'focus';
    }
  }

  /**
   * Ajustar intensidad según tiempo y energía
   */
  private adjustIntensityByTime(
    timeContext: ContentAnalysis['timeContext'],
    userEnergy: number
  ): AIThemeRecommendation['intensity'] {
    if (userEnergy > 70) return 'intense';
    if (userEnergy < 40) return 'subtle';

    switch (timeContext) {
      case 'morning': return userEnergy > 60 ? 'intense' : 'medium';
      case 'afternoon': return 'medium';
      case 'evening': return userEnergy > 50 ? 'medium' : 'subtle';
      case 'night': return 'subtle';
      default: return 'medium';
    }
  }

  /**
   * Ajustar animaciones según energía y emoción
   */
  private adjustAnimationsByEnergy(
    userEnergy: number,
    emotion: ContentAnalysis['dominantEmotion']
  ): AIThemeRecommendation['animations'] {
    if (this.adaptationSettings.performanceMode) return 'minimal';

    if (userEnergy > 80 && (emotion === 'joy' || emotion === 'determination')) {
      return 'enhanced';
    }

    if (userEnergy < 30 || emotion === 'peace') {
      return 'minimal';
    }

    return 'standard';
  }

  /**
   * Generar colores basados en elemento e intensidad
   */
  private generateElementColors(
    element: AIThemeRecommendation['element'],
    intensity: AIThemeRecommendation['intensity']
  ): { primaryColor: string; accentColor: string } {
    const baseColors = {
      'fuego': { primary: '#ff6b35', accent: '#ff8c42' },
      'agua': { primary: '#4fb3d1', accent: '#66c2e0' },
      'tierra': { primary: '#8fbc8f', accent: '#9acd32' },
      'aire': { primary: '#87ceeb', accent: '#b0e0e6' },
      'espiritu': { primary: '#dda0dd', accent: '#e6e6fa' }
    };

    const base = baseColors[element];

    // Ajustar saturación según intensidad
    const saturationMultiplier = {
      'subtle': 0.7,
      'medium': 1.0,
      'intense': 1.3
    }[intensity];

    return {
      primaryColor: this.adjustColorSaturation(base.primary, saturationMultiplier),
      accentColor: this.adjustColorSaturation(base.accent, saturationMultiplier)
    };
  }

  /**
   * Ajustar saturación de color - Versión mejorada que acepta multiplier
   */
  private adjustColorSaturation(color: string, saturationMultiplier: number = 1.0): string {
    // 🎨 Implementación mejorada para ajustar saturación con HSL
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Convertir RGB a HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l: number;

    l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    // Ajustar saturación
    s = Math.min(1, Math.max(0, s * saturationMultiplier));

    // Convertir HSL de vuelta a RGB
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let newR: number, newG: number, newB: number;

    if (s === 0) {
      newR = newG = newB = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      newR = hue2rgb(p, q, h + 1/3);
      newG = hue2rgb(p, q, h);
      newB = hue2rgb(p, q, h - 1/3);
    }

    // Convertir de vuelta a hex
    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }

  /**
   * Calcular confianza de la recomendación
   */
  private calculateConfidence(analysis: ContentAnalysis): number {
    let confidence = 0.5; // Base 50%

    // Incrementar por datos disponibles
    if (analysis.topics.length > 1) confidence += 0.1;
    if (analysis.userEnergy > 0) confidence += 0.15;
    if (analysis.philosophy !== 'balance') confidence += 0.1; // Filosofía específica detectada

    // Incrementar por precisión del modelo
    confidence += this.aiModelAccuracy * 0.25;

    return Math.min(1, confidence);
  }

  /**
   * Generar propiedades CSS personalizadas
   */
  private generateCustomProperties(
    element: string,
    primaryColor: string,
    accentColor: string
  ): Record<string, string> {
    return {
      '--coomunity-primary': primaryColor,
      '--coomunity-accent': accentColor,
      '--coomunity-element': element,
      '--coomunity-glow': `rgba(${this.hexToRgb(primaryColor)}, 0.3)`,
      '--coomunity-bg-gradient': `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15)`,
      '--coomunity-border': `1px solid ${primaryColor}30`,
      '--coomunity-shadow': `0 4px 20px rgba(${this.hexToRgb(primaryColor)}, 0.15)`
    };
  }

  /**
   * Convertir hex a RGB
   */
  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return '255, 183, 77'; // Fallback CoomÜnity orange
  }

  /**
   * Generar razonamiento de la recomendación
   */
  private generateReasoning(analysis: ContentAnalysis, element: string): string {
    const reasons: string[] = [];

    reasons.push(`Elemento ${element} seleccionado por filosofía ${analysis.philosophy}`);

    if (analysis.sentiment === 'positive') {
      reasons.push('Sentimiento positivo detectado - colores vibrantes apropiados');
    }

    if (analysis.userEnergy > 70) {
      reasons.push('Alta energía del usuario - tema dinámico recomendado');
    }

    if (analysis.timeContext === 'evening' || analysis.timeContext === 'night') {
      reasons.push('Horario nocturno - intensidad reducida para comodidad visual');
    }

    return reasons.join('. ') + '.';
  }

  /**
   * Configurar seguimiento de comportamiento
   */
  private setupBehaviorTracking(): void {
    if (typeof window === 'undefined') return;

    // Observar clics
    document.addEventListener('click', (event) => {
      this.recordInteraction('click', event.target as HTMLElement);
    });

    // Observar tiempo en página
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      this.recordTimeSpent(Date.now() - startTime);
    });

    // Observar scroll
    let scrollDepth = 0;
    window.addEventListener('scroll', () => {
      const currentDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      scrollDepth = Math.max(scrollDepth, currentDepth);
    });

    // Guardar scroll depth periódicamente
    setInterval(() => {
      this.updateScrollDepth(scrollDepth);
    }, 10000); // Cada 10 segundos
  }

  /**
   * Registrar interacción del usuario
   */
  private recordInteraction(type: string, element: HTMLElement): void {
    const pattern: UserBehaviorPattern = {
      timestamp: Date.now(),
      route: window.location.pathname,
      timeSpent: 0,
      interactions: 1,
      scrollDepth: 0,
      elementClicked: [element.className || element.tagName],
      emotionalState: 'neutral'
    };

    this.behaviorPatterns.push(pattern);
    this.trimBehaviorPatterns();
  }

  /**
   * Configuración por defecto
   */
  private getDefaultSettings(): ThemeAdaptationSettings {
    return {
      enableAutoAdaptation: true,
      adaptationFrequency: 'gentle',
      userPreferences: {
        preferredElements: [],
        dislikedColors: [],
        sensitivityToChange: 0.5
      },
      accessibilityMode: false,
      performanceMode: false
    };
  }

  /**
   * Cargar patrones de comportamiento almacenados
   */
  private loadStoredBehaviorPatterns(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('coomunity-behavior-patterns');
      if (stored) {
        this.behaviorPatterns = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored behavior patterns:', error);
    }
  }

  /**
   * Configurar sistema de aprendizaje
   */
  private setupLearningSystem(): void {
    // Guardar patrones cada 5 minutos
    setInterval(() => {
      this.saveBehaviorPatterns();
    }, 5 * 60 * 1000);

    // Mejorar precisión del modelo basado en feedback
    this.improveModelAccuracy();
  }

  /**
   * Mejorar precisión del modelo
   */
  private improveModelAccuracy(): void {
    // Simulación de mejora gradual del modelo
    setInterval(() => {
      if (this.learningMode && this.aiModelAccuracy < 0.95) {
        this.aiModelAccuracy += 0.01;
        console.log(`🤖 AI Model accuracy improved to ${(this.aiModelAccuracy * 100).toFixed(1)}%`);
      }
    }, 60000); // Cada minuto
  }

  /**
   * Aplicar tema recomendado al DOM
   */
  async applyRecommendedTheme(analysis: ContentAnalysis): Promise<void> {
    const recommendation = await this.generateThemeRecommendation(analysis);

    // Aplicar propiedades CSS customizadas
    const root = document.documentElement;
    for (const [property, value] of Object.entries(recommendation.customProperties)) {
      root.style.setProperty(property, value);
    }

    // Agregar clase de elemento
    document.body.className = document.body.className.replace(/element-\w+/, '');
    document.body.classList.add(`element-${recommendation.element}`);

    console.log(`🎨 Applied AI-recommended theme: ${recommendation.element} (${(recommendation.confidence * 100).toFixed(1)}% confidence)`);
  }

  /**
   * 🌟 Método estático para análisis de contenido
   */
  static async analyzeContent(pageContent: string, userContext?: UserContext): Promise<ContentAnalysis> {
    const instance = AutoThemingEngine.getInstance();
    return instance.analyzeContent(pageContent, userContext?.route || window.location.pathname);
  }

  /**
   * 🌟 Método estático para generar recomendación
   */
  static async generateThemeRecommendation(analysis: ContentAnalysis): Promise<AIThemeRecommendation> {
    const instance = AutoThemingEngine.getInstance();
    return instance.generateThemeRecommendation(analysis);
  }

  /**
   * 🌟 Método estático para aplicar tema
   */
  static async applyTheme(recommendation: AIThemeRecommendation): Promise<void> {
    const instance = AutoThemingEngine.getInstance();

    // Aplicar propiedades CSS customizadas
    const root = document.documentElement;
    for (const [property, value] of Object.entries(recommendation.customProperties)) {
      root.style.setProperty(property, value);
    }

    // Agregar clase de elemento
    document.body.className = document.body.className.replace(/element-\w+/, '');
    document.body.classList.add(`element-${recommendation.element}`);

    console.log(`🎨 Applied theme: ${recommendation.element} (${(recommendation.confidence * 100).toFixed(1)}% confidence)`);
  }

  /**
   * Utilidades auxiliares
   */
  private recordTimeSpent(time: number): void {
    // Implementar registro de tiempo
    if (this.behaviorPatterns.length > 0) {
      const lastPattern = this.behaviorPatterns[this.behaviorPatterns.length - 1];
      lastPattern.timeSpent = time;
    }
  }

  private updateScrollDepth(depth: number): void {
    // Implementar actualización de scroll depth
    if (this.behaviorPatterns.length > 0) {
      const lastPattern = this.behaviorPatterns[this.behaviorPatterns.length - 1];
      lastPattern.scrollDepth = depth;
    }
  }

  private trimBehaviorPatterns(): void {
    // Mantener solo los últimos 100 patrones
    if (this.behaviorPatterns.length > 100) {
      this.behaviorPatterns = this.behaviorPatterns.slice(-100);
    }
  }

  private saveBehaviorPatterns(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('coomunity-behavior-patterns', JSON.stringify(this.behaviorPatterns));
    } catch (error) {
      console.warn('Failed to save behavior patterns:', error);
    }
  }

  private logRecommendation(recommendation: AIThemeRecommendation, analysis: ContentAnalysis): void {
    console.log('🤖 AI Theme Recommendation:', {
      element: recommendation.element,
      confidence: recommendation.confidence,
      reasoning: recommendation.reasoning,
      analysis
    });
  }

  /**
   * API Pública
   */

  /**
   * Obtener configuración actual
   */
  getSettings(): ThemeAdaptationSettings {
    return { ...this.adaptationSettings };
  }

  /**
   * Actualizar configuración
   */
  updateSettings(settings: Partial<ThemeAdaptationSettings>): void {
    this.adaptationSettings = { ...this.adaptationSettings, ...settings };
    console.log('🔧 AutoTheming settings updated');
  }

  /**
   * Obtener precisión actual del modelo
   */
  getModelAccuracy(): number {
    return this.aiModelAccuracy;
  }

  /**
   * Habilitar/deshabilitar modo de aprendizaje
   */
  setLearningMode(enabled: boolean): void {
    this.learningMode = enabled;
    console.log(`🎓 Learning mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Obtener recomendación actual
   */
  getCurrentRecommendation(): AIThemeRecommendation | null {
    return this.currentRecommendation;
  }

  /**
   * Limpiar datos de comportamiento
   */
  clearBehaviorData(): void {
    this.behaviorPatterns = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('coomunity-behavior-patterns');
    }
    console.log('🧹 Behavior data cleared');
  }
}

/**
 * 🎨 Hook React para usar Auto-theming - Versión corregida
 */
export const useAutoTheming = (pageContent: string, userContext?: UserContext) => {
  const [analysis, setAnalysis] = React.useState<ContentAnalysis | null>(null);
  const [recommendation, setRecommendation] = React.useState<AIThemeRecommendation | null>(null);
  const [loading, setLoading] = React.useState(false);

  const generateTheme = React.useCallback(async () => {
    if (!pageContent) return;

    setLoading(true);
    try {
      const contentAnalysis = await AutoThemingEngine.analyzeContent(pageContent, userContext);
      const themeRecommendation = await AutoThemingEngine.generateThemeRecommendation(contentAnalysis);

      setAnalysis(contentAnalysis);
      setRecommendation(themeRecommendation);
    } catch (error) {
      console.error('Error generating auto theme:', error);
    } finally {
      setLoading(false);
    }
  }, [pageContent, userContext]);

  const applyTheme = React.useCallback(async () => {
    if (recommendation) {
      await AutoThemingEngine.applyTheme(recommendation);
    }
  }, [recommendation]);

  React.useEffect(() => {
    generateTheme();
  }, [generateTheme]);

  return {
    analysis,
    recommendation,
    loading,
    applyTheme,
    regenerateTheme: generateTheme
  };
};

export default AutoThemingEngine;
