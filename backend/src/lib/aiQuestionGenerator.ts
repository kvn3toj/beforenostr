// Adaptación del generador de preguntas AI para el frontend
// Nota: Esta es una versión temporal que usa la función demo hasta que el backend esté listo

export interface QuestionGenerationConfig {
  numberOfQuestions: number;
  focusContext: 'general' | 'visual' | 'audio' | 'specific_moments';
  questionTypes: ('multiple-choice' | 'true-false' | 'short-answer')[];
  timeDistribution: 'beginning' | 'middle' | 'end' | 'distributed';
  difficultyLevel: 'easy' | 'medium' | 'hard';
  languageCode: string;
}

export interface GeneratedQuestion {
  timestamp: number;
  endTimestamp?: number;
  type: string;
  text: string;
  options?: string[];
  correctAnswer?: number | string;
  explanation?: string;
}

export interface GenerationResult {
  success: boolean;
  message: string;
  questions: GeneratedQuestion[];
  config: QuestionGenerationConfig;
  metadata: {
    videoItemId: number;
    generatedAt: string;
  };
}

// Simulamos un generador AI usando la lógica de demo
class AIQuestionGenerator {
  private apiKey: string;

  constructor() {
    // En producción, esto vendría de variables de entorno del backend
    this.apiKey = process.env.GOOGLE_AI_API_KEY || 'AIzaSyDXMoHjoHi8-xUfiD5QN6bFVIeoTMhK2z4';
  }

  async generateQuestions(
    videoItemId: number,
    config: QuestionGenerationConfig,
    videoData?: any
  ): Promise<GenerationResult> {
    try {
      console.log('🤖 Generando preguntas con IA para video ID:', videoItemId);
      console.log('⚙️ Configuración:', config);

      // Importar dinámicamente Google AI (solo cuando se necesite)
      const { GoogleGenerativeAI } = await import('@google/generative-ai');

      if (!this.apiKey) {
        throw new Error('API key de Google AI no configurada');
      }

      const genAI = new GoogleGenerativeAI(this.apiKey);

      // Datos simulados del video (en producción vendría de la API)
      const mockVideoData = this.getMockVideoData(videoItemId, videoData);

      // Construir el prompt
      const prompt = this.buildPrompt(mockVideoData, config);

      // Llamar a Google AI
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parsear respuesta
      const questions = this.parseAIResponse(text);

      const generationResult: GenerationResult = {
        success: true,
        message: `Generadas ${questions.length} preguntas exitosamente`,
        questions,
        config,
        metadata: {
          videoItemId,
          generatedAt: new Date().toISOString()
        }
      };

      console.log('✅ Preguntas generadas:', generationResult);
      return generationResult;

    } catch (error) {
      console.error('❌ Error generando preguntas:', error);
      throw new Error(`Error al generar preguntas: ${error.message}`);
    }
  }

  private getMockVideoData(videoItemId: number, providedData?: any) {
    // Si se proporciona data del video, usarla
    if (providedData) {
      return providedData;
    }

    // Datos simulados por defecto
    return {
      id: videoItemId,
      title: "Video de Gamificación",
      description: "Contenido educativo sobre mecánicas de gamificación",
      subtitles: [{
        languageCode: 'es-ES',
        content: `WEBVTT

00:00:00.000 --> 00:00:05.000
Bienvenidos a esta sesión sobre gamificación y engagement.

00:00:05.000 --> 00:00:12.000
Hoy vamos a explorar diferentes estrategias y mecánicas efectivas.

00:00:12.000 --> 00:00:18.000
La gamificación puede transformar la experiencia del usuario.

00:00:18.000 --> 00:00:25.000
Primero, hablemos de los elementos fundamentales: puntos, badges y leaderboards.

00:00:25.000 --> 00:00:32.000
Los puntos proporcionan feedback inmediato sobre el progreso del usuario.

00:00:32.000 --> 00:00:38.000
Los badges representan logros específicos y crean sentido de progreso.

00:00:38.000 --> 00:00:45.000
Las tablas de clasificación fomentan la competencia saludable.

00:00:45.000 --> 00:00:52.000
También debemos considerar las recompensas sorpresa para mantener el engagement.

00:00:52.000 --> 00:00:58.000
Finalmente, el timing de las recompensas es crucial para el éxito.

00:00:58.000 --> 00:01:05.000
Gracias por su atención y nos vemos en la próxima sesión.`
      }]
    };
  }

  private buildPrompt(videoData: any, config: QuestionGenerationConfig): string {
    const subtitlesText = videoData.subtitles
      ?.filter(s => s.languageCode === config.languageCode || s.languageCode.startsWith(config.languageCode.split('-')[0]))
      ?.map(s => s.content)
      ?.join('\n') || 'Sin subtítulos disponibles';

    const focusInstructions = this.getFocusInstructions(config.focusContext);
    const typeInstructions = this.getTypeInstructions(config.questionTypes);
    const distributionInstructions = this.getDistributionInstructions(config.timeDistribution);

    return `
Eres un asistente especializado en crear preguntas de ATENCIÓN para videos educativos.

OBJETIVO: Generar ${config.numberOfQuestions} preguntas que verifiquen si el usuario está prestando atención al video, NO preguntas educativas profundas.

INFORMACIÓN DEL VIDEO:
Título: ${videoData.title}
Descripción: ${videoData.description || 'Sin descripción'}

SUBTÍTULOS/TRANSCRIPCIÓN:
${subtitlesText}

CONFIGURACIÓN SOLICITADA:
- Número de preguntas: ${config.numberOfQuestions}
- Enfoque: ${config.focusContext}
- Tipos de pregunta: ${config.questionTypes.join(', ')}
- Distribución temporal: ${config.timeDistribution}
- Nivel: ${config.difficultyLevel}
- Idioma: ${config.languageCode}

INSTRUCCIONES ESPECÍFICAS:
${focusInstructions}
${typeInstructions}
${distributionInstructions}

FORMATO DE RESPUESTA (JSON válido):
{
  "questions": [
    {
      "timestamp": 30,
      "endTimestamp": 45,
      "type": "multiple-choice",
      "text": "¿Qué elemento menciona el presentador como fundamental para el feedback?",
      "options": ["Badges", "Puntos", "Leaderboards", "Recompensas"],
      "correctAnswer": 1,
      "explanation": "Se menciona que los puntos proporcionan feedback inmediato"
    }
  ]
}

IMPORTANTE:
- Las preguntas deben ser sobre detalles específicos del video
- Deben requerir que el usuario haya visto ESA parte específica
- No preguntes sobre conocimiento general
- Incluye timestamps precisos basados en los subtítulos
- Genera EXACTAMENTE ${config.numberOfQuestions} preguntas
`;
  }

  private getFocusInstructions(context: string): string {
    switch (context) {
      case 'visual':
        return '- Enfócate en elementos visuales: colores, objetos, gestos, texto en pantalla';
      case 'audio':
        return '- Enfócate en elementos auditivos: palabras específicas, tonos, música';
      case 'specific_moments':
        return '- Enfócate en momentos específicos: transiciones, cambios, eventos particulares';
      default:
        return '- Enfócate en una mezcla de elementos visuales, auditivos y momentos específicos';
    }
  }

  private getTypeInstructions(types: string[]): string {
    const instructions = types.map(type => {
      switch (type) {
        case 'multiple-choice':
          return '- Opción múltiple: 4 opciones, solo una correcta';
        case 'true-false':
          return '- Verdadero/Falso: afirmaciones sobre lo que ocurre en el video';
        case 'short-answer':
          return '- Respuesta corta: palabras o frases específicas mencionadas';
        default:
          return '';
      }
    }).filter(Boolean);

    return instructions.join('\n');
  }

  private getDistributionInstructions(distribution: string): string {
    switch (distribution) {
      case 'beginning':
        return '- Coloca todas las preguntas en los primeros 2-3 minutos del video';
      case 'middle':
        return '- Coloca todas las preguntas en la parte media del video';
      case 'end':
        return '- Coloca todas las preguntas en los últimos 2-3 minutos del video';
      default:
        return '- Distribuye las preguntas uniformemente a lo largo del video';
    }
  }

  private parseAIResponse(text: string): GeneratedQuestion[] {
    try {
      // Buscar JSON ya sea en formato plano o dentro de un bloque de código markdown
      let jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (!jsonMatch) {
        jsonMatch = text.match(/\{[\s\S]*\}/);
      }

      if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en la respuesta de IA');
      }

      const jsonText = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonText);
      return parsed.questions || [];
    } catch (error) {
      console.error('Error parseando respuesta de IA:', error);
      console.error('Texto completo:', text);
      throw new Error('Error al parsear la respuesta de la IA');
    }
  }
}

// Instancia singleton
export const aiQuestionGenerator = new AIQuestionGenerator();

// Configuraciones predefinidas para facilidad de uso
export const PRESET_CONFIGS: Record<string, Partial<QuestionGenerationConfig>> = {
  quick: {
    numberOfQuestions: 2,
    focusContext: 'general',
    questionTypes: ['multiple-choice'],
    timeDistribution: 'distributed',
    difficultyLevel: 'easy'
  },
  standard: {
    numberOfQuestions: 3,
    focusContext: 'general',
    questionTypes: ['multiple-choice', 'true-false'],
    timeDistribution: 'distributed',
    difficultyLevel: 'medium'
  },
  comprehensive: {
    numberOfQuestions: 5,
    focusContext: 'general',
    questionTypes: ['multiple-choice', 'true-false', 'short-answer'],
    timeDistribution: 'distributed',
    difficultyLevel: 'medium'
  }
};
