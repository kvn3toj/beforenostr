import { Injectable, Inject } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';
import {
  VideoItem,
  Subtitle,
  Question,
  AnswerOption,
} from '../generated/prisma';

// Tipo para VideoItem con subtítulos incluidos
type VideoItemWithSubtitles = VideoItem & {
  subtitles: Subtitle[];
};

// Tipo para Question con opciones incluidas (para el retorno de saveGeneratedQuestions)
type QuestionWithOptions = Question & {
  answerOptions?: AnswerOption[];
};

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

@Injectable()
export class QuestionGeneratorService {
  private genAI: GoogleGenerativeAI;

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // //     console.log('>>> QuestionGeneratorService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

    const apiKey = process.env.VITE_GOOGLE_AI_API_KEY;
    // //       console.log('>>> QuestionGeneratorService CONSTRUCTOR: API key exists:', !!apiKey);
    // //       console.log('>>> QuestionGeneratorService CONSTRUCTOR: API key length:', apiKey?.length || 0);

    if (!apiKey) {
      throw new Error('Google AI API key not found in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // // //       console.log('>>> QuestionGeneratorService CONSTRUCTOR: Google AI initialized successfully');
  }

  async generateAttentionQuestions(
    videoItemId: number,
    config: QuestionGenerationConfig
  ): Promise<GeneratedQuestion[]> {
    //     console.log('>>> QuestionGeneratorService.generateAttentionQuestions: Starting with videoItemId:', videoItemId);
    //     console.log('>>> QuestionGeneratorService.generateAttentionQuestions: Config:', JSON.stringify(config, null, 2));

    // 1. Obtener información del video y subtítulos
    //       console.log('>>> QuestionGeneratorService: Step 1 - Getting video data...');
    const videoData = await this.getVideoData(videoItemId);
    //       console.log('>>> QuestionGeneratorService: Video data retrieved:', !!videoData);
    //       console.log('>>> QuestionGeneratorService: Video title:', videoData?.title);
    //       console.log('>>> QuestionGeneratorService: Video subtitles count:', videoData?.subtitles?.length || 0);

    if (!videoData) {
      throw new Error(`Video with ID ${videoItemId} not found`);
    }

    // 2. Construir el prompt especializado
    //       console.log('>>> QuestionGeneratorService: Step 2 - Building prompt...');
    const prompt = this.buildAttentionQuestionsPrompt(videoData, config);
    //       console.log('>>> QuestionGeneratorService: Prompt length:', prompt.length);
    //       console.log('>>> QuestionGeneratorService: Prompt preview:', prompt.substring(0, 200) + '...');

    // 3. Llamar a Google AI
    //       console.log('>>> QuestionGeneratorService: Step 3 - Calling Google AI...');
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    //       console.log('>>> QuestionGeneratorService: Model created successfully');

    const result = await model.generateContent(prompt);
    //       console.log('>>> QuestionGeneratorService: AI call completed');

    const response = await result.response;
    //       console.log('>>> QuestionGeneratorService: Response received');

    const text = response.text();
    //       console.log('>>> QuestionGeneratorService: Response text length:', text.length);
    //       console.log('>>> QuestionGeneratorService: Response text preview:', text.substring(0, 300) + '...');

    // 4. Parsear la respuesta JSON
    //       console.log('>>> QuestionGeneratorService: Step 4 - Parsing AI response...');
    const questions = this.parseAIResponse(text);

    //       console.log('>>> QuestionGeneratorService: Generated', questions.length, 'questions');
    //       console.log('>>> QuestionGeneratorService: Questions preview:', JSON.stringify(questions, null, 2));
    return questions;
  }

  private async getVideoData(videoItemId: number) {
    return await this.prisma.videoItem.findUnique({
      where: { id: videoItemId },
      include: {
        subtitles: {
          where: { isActive: true },
          orderBy: { languageCode: 'asc' },
        },
      },
    });
  }

  private buildAttentionQuestionsPrompt(
    videoData: VideoItemWithSubtitles,
    config: QuestionGenerationConfig
  ): string {
    const subtitlesText =
      videoData.subtitles
        .filter(
          (s) =>
            s.languageCode === config.languageCode ||
            s.languageCode.startsWith(config.languageCode.split('-')[0])
        )
        .map((s) => s.content)
        .join('\n') || 'No subtitles available';

    const focusInstructions = this.getFocusInstructions(config.focusContext);
    const typeInstructions = this.getTypeInstructions(config.questionTypes);
    const distributionInstructions = this.getDistributionInstructions(
      config.timeDistribution
    );

    // Extraer información adicional del video
    const videoUrl = this.extractVideoUrl(videoData.content);
    const videoId = this.extractYouTubeId(videoUrl);
    const hasSubtitles = subtitlesText !== 'No subtitles available';

    // Construir instrucciones específicas basadas en si hay subtítulos o no
    const contentInstructions = hasSubtitles
      ? this.getSubtitleBasedInstructions(subtitlesText)
      : this.getNoSubtitleInstructions(videoData, videoId);

    return `
Eres un asistente especializado en crear preguntas de ATENCIÓN para videos educativos.

OBJETIVO: Generar ${config.numberOfQuestions} preguntas que verifiquen si el usuario está prestando atención al video específico, NO preguntas educativas profundas ni sobre temas generales.

INFORMACIÓN DEL VIDEO ESPECÍFICO:
Título: ${videoData.title}
Descripción: ${videoData.description || 'No description'}
URL del video: ${videoUrl || 'No URL available'}
ID de YouTube: ${videoId || 'No YouTube ID'}

${hasSubtitles ? 'SUBTÍTULOS/TRANSCRIPCIÓN:' : 'INSTRUCCIONES PARA VIDEO SIN SUBTÍTULOS:'}
${hasSubtitles ? subtitlesText : contentInstructions}

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

${hasSubtitles ? this.getSubtitleSpecificInstructions() : this.getNoSubtitleSpecificInstructions()}

FORMATO DE RESPUESTA (JSON válido):
{
  "questions": [
    {
      "timestamp": 30,
      "endTimestamp": 45,
      "type": "multiple-choice",
      "text": "${hasSubtitles ? '¿Qué palabra específica menciona el presentador en este momento?' : '¿Qué elemento visual se puede observar en esta parte del video?'}",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": 0,
      "explanation": "${hasSubtitles ? 'Se menciona claramente en los subtítulos' : 'Se puede observar visualmente en el video'}"
    }
  ]
}

IMPORTANTE:
- Las preguntas deben ser sobre detalles específicos de ESTE video en particular
- Deben requerir que el usuario haya visto ESA parte específica de ESTE video
- NO preguntes sobre conocimiento general de gamificación, educación o cualquier otro tema
- NO uses el contexto de la playlist o categoría para generar preguntas
- Enfócate ÚNICAMENTE en el contenido específico del video: "${videoData.title}"
- Incluye timestamps precisos ${hasSubtitles ? 'basados en los subtítulos' : 'distribuidos a lo largo del video'}
- Genera EXACTAMENTE ${config.numberOfQuestions} preguntas
- ${hasSubtitles ? 'Usa el contenido de los subtítulos para crear preguntas específicas' : 'Crea preguntas sobre elementos visuales, cambios de escena, gestos, objetos, colores, y otros detalles observables en ESTE video específico'}
`;
  }

  private extractVideoUrl(content: string): string | null {
    try {
      // Intentar extraer URL de iframe
      const iframeMatch = content.match(/src="([^"]*youtube[^"]*)"/);
      if (iframeMatch) return iframeMatch[1];

      // Intentar extraer URL de JSON
      const jsonMatch = content.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.url || null;
      }

      return null;
    } catch {
      // Error extracting video URL - returning null as fallback
      return null;
    }
  }

  private extractYouTubeId(url: string | null): string | null {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  private getSubtitleBasedInstructions(subtitlesText: string): string {
    return subtitlesText;
  }

  private getNoSubtitleInstructions(
    videoData: VideoItemWithSubtitles,
    videoId: string | null
  ): string {
    const durationMinutes = videoData.duration
      ? Math.floor(videoData.duration / 60)
      : null;
    const durationSeconds = videoData.duration || 180; // Default 3 minutes if unknown

    return `
IMPORTANTE: Debes generar preguntas específicas para el video titulado "${videoData.title}".

CONTEXTO DEL VIDEO:
- Título específico: ${videoData.title}
- Duración: ${durationMinutes ? durationMinutes + ' minutos' : 'Aproximadamente 3 minutos'} (${durationSeconds} segundos)
- ID de YouTube: ${videoId || 'No disponible'}

INSTRUCCIONES PARA GENERAR PREGUNTAS SIN SUBTÍTULOS:

IMPORTANTE: Aunque no tienes acceso a los subtítulos, debes generar preguntas que sean específicas para ESTE video en particular basándote en su título y características.

PARA EL VIDEO "${videoData.title}":

TIPOS DE PREGUNTAS APROPIADAS:
1. Preguntas sobre elementos visuales que probablemente aparezcan en un video con este título
2. Preguntas sobre la estructura narrativa típica de este tipo de contenido
3. Preguntas sobre momentos clave que se esperarían en un video de esta temática
4. Preguntas sobre elementos audiovisuales específicos relacionados con el tema del título

EJEMPLOS DE ENFOQUES VÁLIDOS PARA ESTE VIDEO:
- "¿Qué tipo de situación se presenta al inicio del video?"
- "¿Cómo se desarrolla la narrativa en la parte media del video?"
- "¿Qué mensaje o reflexión se presenta hacia el final?"
- "¿Qué elementos visuales apoyan la temática del video?"

DISTRIBUCIÓN DE TIMESTAMPS:
- Para un video de ${durationSeconds} segundos, distribuye las preguntas así:
  * Primera pregunta: alrededor de ${Math.floor(durationSeconds * 0.2)} segundos
  * Segunda pregunta: alrededor de ${Math.floor(durationSeconds * 0.5)} segundos
  * Tercera pregunta: alrededor de ${Math.floor(durationSeconds * 0.8)} segundos

NO HAGAS:
- Preguntas sobre gamificación, educación o temas generales
- Preguntas sobre categorías o playlists
- Preguntas sobre conocimiento previo no relacionado con este video específico
- Preguntas sobre colores o detalles visuales muy específicos que no puedes ver

SÍ PUEDES HACER:
- Preguntas sobre la narrativa y desarrollo del contenido de este video específico
- Preguntas sobre elementos que lógicamente aparecerían en un video con este título
- Preguntas sobre la estructura y progresión del mensaje del video
- Preguntas sobre elementos audiovisuales relacionados con la temática específica del título
`;
  }

  private extractCategory(videoData: VideoItemWithSubtitles): string | null {
    try {
      const jsonMatch = videoData.content?.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.category || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  private extractAuthor(videoData: VideoItemWithSubtitles): string | null {
    try {
      const jsonMatch = videoData.content?.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.author || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  private getSubtitleSpecificInstructions(): string {
    return `
INSTRUCCIONES ESPECÍFICAS PARA VIDEOS CON SUBTÍTULOS:
- Usa palabras, frases o conceptos específicos mencionados en los subtítulos
- Haz preguntas sobre el orden de los temas tratados
- Pregunta sobre detalles específicos del diálogo o narración
- Incluye timestamps precisos basados en el contenido de los subtítulos
`;
  }

  private getNoSubtitleSpecificInstructions(): string {
    return `
INSTRUCCIONES ESPECÍFICAS PARA VIDEOS SIN SUBTÍTULOS:
- Enfócate en el CONTEXTO CONOCIDO del video (título, autor, categoría, duración)
- Crea preguntas sobre patrones típicos de este tipo de contenido
- Pregunta sobre la estructura esperada de la presentación
- Usa timestamps distribuidos uniformemente a lo largo del video
- Las preguntas deben ser sobre elementos PROBABLES basados en el contexto
- Evita especular sobre detalles visuales específicos que no puedes ver
- Enfócate en el formato y estilo típico del tipo de contenido
- Pregunta sobre momentos clave esperados en este tipo de presentación

EJEMPLOS DE PREGUNTAS APROPIADAS:
- "¿En qué momento de la charla típicamente se presenta la idea principal?"
- "¿Qué formato suele seguir este tipo de presentación?"
- "¿Cuál es el estilo típico de conclusión en videos de esta categoría?"
- "¿Qué elemento es común al inicio de este tipo de contenido?"
`;
  }

  private getFocusInstructions(context: string): string {
    switch (context) {
      case 'visual':
        return '- Enfócate en elementos visuales: colores, objetos, gestos, texto en pantalla, gráficos';
      case 'audio':
        return '- Enfócate en elementos auditivos: palabras específicas, tonos, música, efectos de sonido';
      case 'specific_moments':
        return '- Enfócate en momentos específicos: transiciones, cambios, eventos particulares';
      default:
        return '- Enfócate en una mezcla de elementos visuales, auditivos y momentos específicos';
    }
  }

  private getTypeInstructions(types: string[]): string {
    const instructions = types
      .map((type) => {
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
      })
      .filter(Boolean);

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
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.questions || [];
    } catch {
      // Error parsing AI response - invalid JSON format
      throw new Error('Failed to parse AI response');
    }
  }

  async saveGeneratedQuestions(
    videoItemId: number,
    questions: GeneratedQuestion[],
    languageCode: string
  ): Promise<QuestionWithOptions[]> {
    const savedQuestions = [];

    for (const question of questions) {
      try {
        const savedQuestion = await this.prisma.question.create({
          data: {
            videoItemId,
            timestamp: question.timestamp,
            endTimestamp: question.endTimestamp,
            type: question.type,
            text: question.text,
            languageCode,
            isActive: true,
          },
        });

        // Si tiene opciones, crear AnswerOptions
        if (question.options && question.options.length > 0) {
          const answerOptions = await Promise.all(
            question.options.map((option, index) =>
              this.prisma.answerOption.create({
                data: {
                  questionId: savedQuestion.id,
                  text: option,
                  isCorrect: index === question.correctAnswer,
                  order: index,
                },
              })
            )
          );

          savedQuestions.push({
            ...savedQuestion,
            answerOptions,
          });
        } else {
          savedQuestions.push(savedQuestion);
        }
      } catch {
        // Error saving individual question - continue with remaining questions
      }
    }

    return savedQuestions;
  }
}
