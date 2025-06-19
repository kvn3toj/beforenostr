/**
 * 🌌 AUTO-THEMING IA ENGINE
 * ========================
 * 
 * Motor de IA para generación automática de temas
 * Parte de la Fase 6: Inteligencia Artificial del Design System
 */

import * as React from 'react';

interface ContentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  philosophy: 'ayni' | 'reciprocity' | 'growth' | 'balance';
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night';
  userEnergy: number; // 0-100
  dominantEmotions: string[];
  contentComplexity: 'simple' | 'medium' | 'complex';
}

interface AIThemeRecommendation {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
  intensity: 'subtle' | 'medium' | 'intense';
  animations: 'minimal' | 'standard' | 'enhanced';
  spacing: 'compact' | 'comfortable' | 'spacious';
  borderRadius: number;
  confidence: number; // 0-1
  reasoning: string[];
}

interface UserContext {
  timeOfDay: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionSpeed: 'slow' | 'medium' | 'fast';
  batteryLevel?: number;
  preferredContrast: 'low' | 'medium' | 'high';
  motionPreference: 'none' | 'reduced' | 'full';
}

export class AutoThemingEngine {
  private static readonly ELEMENT_CHARACTERISTICS = {
    fuego: {
      colors: ['#FF6B35', '#FF8A50', '#FFB74D', '#FF9800'],
      emotions: ['energetic', 'passionate', 'dynamic', 'warm'],
      contexts: ['action', 'urgency', 'excitement', 'creativity']
    },
    agua: {
      colors: ['#2196F3', '#64B5F6', '#81C784', '#4FC3F7'],
      emotions: ['calm', 'flowing', 'adaptive', 'peaceful'],
      contexts: ['learning', 'reflection', 'communication', 'growth']
    },
    tierra: {
      colors: ['#8BC34A', '#AED581', '#FFCC02', '#689F38'],
      emotions: ['grounded', 'stable', 'nurturing', 'patient'],
      contexts: ['building', 'foundation', 'security', 'abundance']
    },
    aire: {
      colors: ['#E1BEE7', '#F3E5F5', '#FFE082', '#CE93D8'],
      emotions: ['light', 'inspiring', 'free', 'innovative'],
      contexts: ['ideas', 'communication', 'inspiration', 'change']
    },
    espiritu: {
      colors: ['#9C27B0', '#BA68C8', '#FF9800', '#673AB7'],
      emotions: ['transcendent', 'wise', 'balanced', 'unified'],
      contexts: ['meditation', 'wisdom', 'integration', 'purpose']
    }
  };

  /**
   * Analiza el contenido de la página para determinar contexto
   */
  static async analyzeContent(pageContent: string, userContext?: UserContext): Promise<ContentAnalysis> {
    console.log('🤖 Analyzing content for AI theming...');
    
    const words = pageContent.toLowerCase().split(/\s+/);
    
    // Análisis de sentimiento usando palabras clave
    const sentiment = this.analyzeSentiment(words);
    
    // Detección de temas principales
    const topics = this.extractTopics(words);
    
    // Filosofía dominante
    const philosophy = this.detectPhilosophy(words);
    
    // Contexto temporal
    const timeContext = this.getTimeContext(userContext?.timeOfDay);
    
    // Energía del usuario basada en patrones de uso
    const userEnergy = this.calculateUserEnergy(words, timeContext, userContext);
    
    // Emociones dominantes
    const dominantEmotions = this.extractEmotions(words);
    
    // Complejidad del contenido
    const contentComplexity = this.assessContentComplexity(words, pageContent);

    return {
      sentiment,
      topics,
      philosophy,
      timeContext,
      userEnergy,
      dominantEmotions,
      contentComplexity
    };
  }

  /**
   * Genera recomendación de tema basada en análisis de contenido
   */
  static async generateThemeRecommendation(
    analysis: ContentAnalysis,
    userContext?: UserContext
  ): Promise<AIThemeRecommendation> {
    console.log('🎨 Generating AI theme recommendation...');
    
    // Seleccionar elemento base según la filosofía y contexto
    let element = this.selectElement(analysis);
    
    // Ajustar elemento según contexto de usuario
    element = this.adjustElementForContext(element, analysis, userContext);
    
    // Ajustar intensidad basada en energía y tiempo
    const intensity = this.calculateIntensity(analysis, userContext);
    
    // Generar paleta de colores
    const colorPalette = this.generateColorPalette(element, analysis, userContext);
    
    // Determinar configuraciones de UI
    const uiConfig = this.generateUIConfig(analysis, userContext);
    
    // Calcular confianza en la recomendación
    const confidence = this.calculateConfidence(analysis, userContext);
    
    // Generar reasoning para transparencia
    const reasoning = this.generateReasoning(element, analysis, userContext);

    return {
      primaryColor: colorPalette.primary,
      accentColor: colorPalette.accent,
      backgroundColor: colorPalette.background,
      textColor: colorPalette.text,
      element,
      intensity,
      animations: uiConfig.animations,
      spacing: uiConfig.spacing,
      borderRadius: uiConfig.borderRadius,
      confidence,
      reasoning
    };
  }

  /**
   * Analiza sentimiento del contenido
   */
  private static analyzeSentiment(words: string[]): ContentAnalysis['sentiment'] {
    const positiveWords = [
      'ayni', 'balance', 'harmony', 'growth', 'love', 'peace', 'joy', 'success',
      'beautiful', 'amazing', 'wonderful', 'excellent', 'fantastic', 'great',
      'collaboration', 'community', 'sharing', 'giving', 'helping'
    ];
    
    const negativeWords = [
      'conflict', 'stress', 'error', 'problem', 'issue', 'difficulty', 'challenge',
      'pain', 'struggle', 'failure', 'bad', 'terrible', 'awful', 'horrible',
      'competition', 'fight', 'against', 'versus'
    ];
    
    const positiveCount = words.filter(w => positiveWords.some(pw => w.includes(pw))).length;
    const negativeCount = words.filter(w => negativeWords.some(nw => w.includes(nw))).length;
    
    if (positiveCount > negativeCount * 1.5) return 'positive';
    if (negativeCount > positiveCount * 1.5) return 'negative';
    return 'neutral';
  }

  /**
   * Extrae temas principales del contenido
   */
  private static extractTopics(words: string[]): string[] {
    const topicKeywords = {
      learning: ['learn', 'study', 'education', 'knowledge', 'teach', 'course', 'lesson'],
      social: ['friend', 'community', 'share', 'connect', 'social', 'together', 'group'],
      marketplace: ['buy', 'sell', 'trade', 'exchange', 'product', 'service', 'offer'],
      wellness: ['health', 'wellness', 'meditation', 'balance', 'mindful', 'peace'],
      creativity: ['create', 'art', 'design', 'imagine', 'innovative', 'creative'],
      technology: ['tech', 'digital', 'app', 'software', 'platform', 'online'],
      nature: ['nature', 'earth', 'water', 'fire', 'air', 'natural', 'organic'],
      spirituality: ['spirit', 'soul', 'consciousness', 'wisdom', 'enlighten']
    };

    const topics: string[] = [];
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      const matches = keywords.filter(keyword => 
        words.some(word => word.includes(keyword))
      ).length;
      
      if (matches >= 2) { // Requiere al menos 2 coincidencias
        topics.push(topic);
      }
    });

    return topics.length > 0 ? topics : ['general'];
  }

  /**
   * Detecta filosofía dominante
   */
  private static detectPhilosophy(words: string[]): ContentAnalysis['philosophy'] {
    const philosophyKeywords = {
      ayni: ['ayni', 'reciprocity', 'give', 'receive', 'balance', 'exchange'],
      growth: ['grow', 'evolve', 'improve', 'develop', 'progress', 'advance'],
      balance: ['balance', 'harmony', 'equilibrium', 'center', 'stable'],
      reciprocity: ['mutual', 'shared', 'together', 'collaborative', 'cooperative']
    };

    let maxScore = 0;
    let dominantPhilosophy: ContentAnalysis['philosophy'] = 'balance';

    Object.entries(philosophyKeywords).forEach(([philosophy, keywords]) => {
      const score = keywords.reduce((acc, keyword) => 
        acc + words.filter(w => w.includes(keyword)).length, 0
      );
      
      if (score > maxScore) {
        maxScore = score;
        dominantPhilosophy = philosophy as ContentAnalysis['philosophy'];
      }
    });

    return dominantPhilosophy;
  }

  /**
   * Determina contexto temporal
   */
  private static getTimeContext(timeOfDay?: number): ContentAnalysis['timeContext'] {
    const hour = timeOfDay || new Date().getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Calcula energía del usuario
   */
  private static calculateUserEnergy(
    words: string[], 
    timeContext: ContentAnalysis['timeContext'],
    userContext?: UserContext
  ): number {
    let baseEnergy = 50;
    
    // Ajuste por tiempo del día
    switch (timeContext) {
      case 'morning': baseEnergy += 20; break;
      case 'afternoon': baseEnergy += 10; break;
      case 'evening': baseEnergy -= 5; break;
      case 'night': baseEnergy -= 15; break;
    }
    
    // Ajuste por contenido energético
    const energeticWords = ['action', 'quick', 'fast', 'energy', 'active', 'dynamic'];
    const calmWords = ['calm', 'peaceful', 'slow', 'relax', 'meditate', 'rest'];
    
    const energeticCount = words.filter(w => energeticWords.some(ew => w.includes(ew))).length;
    const calmCount = words.filter(w => calmWords.some(cw => w.includes(cw))).length;
    
    baseEnergy += (energeticCount - calmCount) * 5;
    
    // Ajuste por batería del dispositivo
    if (userContext?.batteryLevel && userContext.batteryLevel < 20) {
      baseEnergy -= 20; // Modo ahorro de energía
    }
    
    return Math.max(0, Math.min(100, baseEnergy));
  }

  /**
   * Extrae emociones dominantes
   */
  private static extractEmotions(words: string[]): string[] {
    const emotionKeywords = {
      joy: ['happy', 'joy', 'celebrate', 'smile', 'laugh', 'fun'],
      calm: ['calm', 'peaceful', 'serene', 'tranquil', 'quiet'],
      excitement: ['excited', 'amazing', 'awesome', 'incredible', 'fantastic'],
      focus: ['focus', 'concentrate', 'attention', 'mindful', 'present'],
      creativity: ['creative', 'artistic', 'imaginative', 'innovative', 'original'],
      wisdom: ['wise', 'knowledge', 'understanding', 'insight', 'enlighten']
    };

    const emotions: string[] = [];
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => 
        words.some(word => word.includes(keyword))
      ).length;
      
      if (matches > 0) {
        emotions.push(emotion);
      }
    });

    return emotions.length > 0 ? emotions : ['neutral'];
  }

  /**
   * Evalúa complejidad del contenido
   */
  private static assessContentComplexity(
    words: string[], 
    fullContent: string
  ): ContentAnalysis['contentComplexity'] {
    const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / words.length;
    const sentenceCount = fullContent.split(/[.!?]+/).length;
    const wordsPerSentence = words.length / sentenceCount;
    
    if (avgWordLength > 6 || wordsPerSentence > 20) return 'complex';
    if (avgWordLength > 4 || wordsPerSentence > 12) return 'medium';
    return 'simple';
  }

  /**
   * Selecciona elemento base según análisis
   */
  private static selectElement(analysis: ContentAnalysis): AIThemeRecommendation['element'] {
    // Mapeo directo de filosofía a elemento
    const philosophyElementMap: Record<ContentAnalysis['philosophy'], AIThemeRecommendation['element']> = {
      ayni: 'espiritu',
      growth: 'tierra',
      balance: 'agua',
      reciprocity: 'aire'
    };
    
    let element = philosophyElementMap[analysis.philosophy];
    
    // Ajustar según temas dominantes
    if (analysis.topics.includes('creativity') || analysis.topics.includes('technology')) {
      element = 'fuego';
    } else if (analysis.topics.includes('nature') || analysis.topics.includes('wellness')) {
      element = 'tierra';
    } else if (analysis.topics.includes('learning') || analysis.topics.includes('social')) {
      element = 'agua';
    }
    
    return element;
  }

  /**
   * Ajusta elemento según contexto de usuario
   */
  private static adjustElementForContext(
    element: AIThemeRecommendation['element'],
    analysis: ContentAnalysis,
    userContext?: UserContext
  ): AIThemeRecommendation['element'] {
    // Ajustar por tiempo del día
    if (analysis.timeContext === 'night' && element === 'fuego') {
      return 'agua'; // Más calmante para la noche
    }
    
    // Ajustar por nivel de batería
    if (userContext?.batteryLevel && userContext.batteryLevel < 20) {
      return 'tierra'; // Colores más conservadores
    }
    
    // Ajustar por velocidad de conexión
    if (userContext?.connectionSpeed === 'slow') {
      return element === 'fuego' ? 'aire' : element; // Evitar animaciones pesadas
    }
    
    return element;
  }

  /**
   * Calcula intensidad del tema
   */
  private static calculateIntensity(
    analysis: ContentAnalysis,
    userContext?: UserContext
  ): AIThemeRecommendation['intensity'] {
    let intensityScore = 5; // Base neutral
    
    // Ajuste por energía del usuario
    if (analysis.userEnergy > 80) intensityScore += 2;
    else if (analysis.userEnergy < 30) intensityScore -= 2;
    
    // Ajuste por tiempo del día
    if (analysis.timeContext === 'morning') intensityScore += 1;
    else if (analysis.timeContext === 'night') intensityScore -= 2;
    
    // Ajuste por preferencias de movimiento
    if (userContext?.motionPreference === 'reduced') intensityScore -= 2;
    else if (userContext?.motionPreference === 'full') intensityScore += 1;
    
    // Ajuste por complejidad del contenido
    if (analysis.contentComplexity === 'complex') intensityScore -= 1;
    
    if (intensityScore >= 7) return 'intense';
    if (intensityScore <= 3) return 'subtle';
    return 'medium';
  }

  /**
   * Genera paleta de colores
   */
  private static generateColorPalette(
    element: AIThemeRecommendation['element'],
    analysis: ContentAnalysis,
    userContext?: UserContext
  ) {
    const elementColors = this.ELEMENT_CHARACTERISTICS[element].colors;
    
    // Seleccionar color primario basado en sentimiento
    let primaryIndex = 0;
    if (analysis.sentiment === 'positive') primaryIndex = 1;
    else if (analysis.sentiment === 'negative') primaryIndex = 3;
    
    const primary = elementColors[primaryIndex];
    const accent = elementColors[(primaryIndex + 2) % elementColors.length];
    
    // Generar colores de fondo y texto basados en contraste preferido
    const contrastLevel = userContext?.preferredContrast || 'medium';
    
    let background: string;
    let text: string;
    
    switch (contrastLevel) {
      case 'high':
        background = '#FFFFFF';
        text = '#000000';
        break;
      case 'low':
        background = '#F8F9FA';
        text = '#495057';
        break;
      default:
        background = '#FFFEFB';
        text = '#2D3436';
    }
    
    // Ajustar para modo nocturno
    if (analysis.timeContext === 'night') {
      background = '#1A1A1A';
      text = '#E0E0E0';
    }
    
    return { primary, accent, background, text };
  }

  /**
   * Genera configuración de UI
   */
  private static generateUIConfig(
    analysis: ContentAnalysis,
    userContext?: UserContext
  ) {
    // Configuración de animaciones
    let animations: AIThemeRecommendation['animations'] = 'standard';
    
    if (userContext?.motionPreference === 'reduced' || userContext?.connectionSpeed === 'slow') {
      animations = 'minimal';
    } else if (analysis.userEnergy > 70 && userContext?.motionPreference === 'full') {
      animations = 'enhanced';
    }
    
    // Configuración de espaciado
    let spacing: AIThemeRecommendation['spacing'] = 'comfortable';
    
    if (userContext?.deviceType === 'mobile') {
      spacing = 'compact';
    } else if (analysis.contentComplexity === 'complex') {
      spacing = 'spacious';
    }
    
    // Radio de bordes
    let borderRadius = 12;
    
    if (analysis.contentComplexity === 'simple') {
      borderRadius = 16; // Más amigable
    } else if (analysis.contentComplexity === 'complex') {
      borderRadius = 8; // Más profesional
    }
    
    return { animations, spacing, borderRadius };
  }

  /**
   * Calcula confianza en la recomendación
   */
  private static calculateConfidence(
    analysis: ContentAnalysis,
    userContext?: UserContext
  ): number {
    let confidence = 0.7; // Base
    
    // Aumentar confianza con más datos
    if (analysis.topics.length > 2) confidence += 0.1;
    if (analysis.dominantEmotions.length > 1) confidence += 0.05;
    if (userContext) confidence += 0.1;
    
    // Reducir confianza si hay incertidumbre
    if (analysis.sentiment === 'neutral') confidence -= 0.05;
    if (analysis.contentComplexity === 'medium') confidence -= 0.05;
    
    return Math.max(0.5, Math.min(1.0, confidence));
  }

  /**
   * Genera explicación del reasoning
   */
  private static generateReasoning(
    element: AIThemeRecommendation['element'],
    analysis: ContentAnalysis,
    userContext?: UserContext
  ): string[] {
    const reasoning: string[] = [];
    
    reasoning.push(`Elemento ${element} seleccionado por filosofía ${analysis.philosophy}`);
    reasoning.push(`Sentimiento ${analysis.sentiment} detectado en el contenido`);
    reasoning.push(`Contexto temporal ${analysis.timeContext} considerado`);
    reasoning.push(`Nivel de energía ${analysis.userEnergy}/100 calculado`);
    
    if (analysis.topics.length > 0) {
      reasoning.push(`Temas detectados: ${analysis.topics.join(', ')}`);
    }
    
    if (userContext?.deviceType) {
      reasoning.push(`Optimizado para dispositivo ${userContext.deviceType}`);
    }
    
    if (userContext?.motionPreference === 'reduced') {
      reasoning.push('Animaciones reducidas por preferencia de accesibilidad');
    }
    
    return reasoning;
  }

  /**
   * Aplica tema generado al design system
   */
  static async applyTheme(recommendation: AIThemeRecommendation): Promise<void> {
    console.log('🎨 Applying AI-generated theme...', recommendation);
    
    // En una implementación real, esto actualizaría el theme provider
    // Por ahora, simular la aplicación
    
    try {
      // Aplicar variables CSS
      const root = document.documentElement;
      root.style.setProperty('--ai-primary-color', recommendation.primaryColor);
      root.style.setProperty('--ai-accent-color', recommendation.accentColor);
      root.style.setProperty('--ai-background-color', recommendation.backgroundColor);
      root.style.setProperty('--ai-text-color', recommendation.textColor);
      root.style.setProperty('--ai-border-radius', `${recommendation.borderRadius}px`);
      
      // Guardar tema aplicado
      localStorage.setItem('ai-generated-theme', JSON.stringify(recommendation));
      
      console.log('✅ AI theme applied successfully');
    } catch (error) {
      console.error('❌ Error applying AI theme:', error);
    }
  }
}

/**
 * Hook React para usar Auto-theming
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
      const themeRecommendation = await AutoThemingEngine.generateThemeRecommendation(contentAnalysis, userContext);
      
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