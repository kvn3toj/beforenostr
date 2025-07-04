import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VideoItemsService } from '../../video-items/video-items.service';
import { NotificationService } from '../notifications/notification.service';
import type { Question, ActivityQuestion, VideoItem } from '../../generated/prisma';

export interface QuestionValidationResult {
  questionId: string | number;
  questionType: 'video_question' | 'activity_question';
  videoItemId: number;
  videoTitle: string;
  videoDuration: number | null;
  questionTimestamp: number;
  isValid: boolean;
  issue?: string;
  severity: 'warning' | 'error';
}

export interface ValidationSummary {
  totalQuestionsChecked: number;
  validQuestions: number;
  invalidQuestions: number;
  questionsWithoutVideoDuration: number;
  validationResults: QuestionValidationResult[];
  executionTime: number;
  timestamp: string;
}

@Injectable()
export class QuestionValidationService {
  private readonly logger = new Logger(QuestionValidationService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(VideoItemsService) private readonly videoItemsService: VideoItemsService,
    @Inject(NotificationService) private readonly notificationService: NotificationService,
  ) {
    this.logger.log('QuestionValidationService initialized with NotificationService');
  }

  /**
   * Valida los timestamps de todas las preguntas de un video específico
   */
  async validateQuestionTimestamps(videoItemId: number): Promise<QuestionValidationResult[]> {
    this.logger.log(`Validating question timestamps for video ${videoItemId}`);

    try {
      // Obtener el video y su duración
      const videoItem = await this.videoItemsService.findOne(videoItemId);
      if (!videoItem) {
        throw new Error(`Video item ${videoItemId} not found`);
      }

      const results: QuestionValidationResult[] = [];

      // Validar preguntas de VideoItem (tabla questions)
      const videoQuestions = await this.prisma.question.findMany({
        where: { 
          videoItemId,
          isActive: true 
        },
        orderBy: { timestamp: 'asc' }
      });

      for (const question of videoQuestions) {
        const validationResult = this.validateSingleQuestion(
          question.id,
          'video_question',
          videoItem,
          question.timestamp,
          question.endTimestamp
        );
        results.push(validationResult);
      }

      // Validar preguntas de Activity que referencian este video
      const activities = await this.prisma.activity.findMany({
        where: { videoItemId },
        include: { questions: true }
      });

      for (const activity of activities) {
        for (const activityQuestion of activity.questions) {
          if (activityQuestion.displayTimeSeconds !== null) {
            const validationResult = this.validateSingleQuestion(
              activityQuestion.id,
              'activity_question',
              videoItem,
              activityQuestion.displayTimeSeconds,
              activityQuestion.optionalDisplaySeconds
            );
            results.push(validationResult);
          }
        }
      }

      this.logger.log(`Validation completed for video ${videoItemId}: ${results.length} questions checked`);
      return results;

    } catch (error) {
      this.logger.error(`Error validating questions for video ${videoItemId}:`, error);
      throw error;
    }
  }

  /**
   * Valida los timestamps de todas las preguntas en el sistema
   */
  async validateAllQuestionTimestamps(): Promise<ValidationSummary> {
    const startTime = Date.now();
    this.logger.log('Starting validation of all question timestamps in the system');

    try {
      const allResults: QuestionValidationResult[] = [];

      // Obtener todos los videos con preguntas
      const videosWithQuestions = await this.prisma.videoItem.findMany({
        where: {
          isActive: true,
          isDeleted: { not: true },
          OR: [
            { questions: { some: { isActive: true } } },
            { activities: { some: { questions: { some: {} } } } }
          ]
        },
        select: { id: true }
      });

      this.logger.log(`Found ${videosWithQuestions.length} videos with questions to validate`);

      // Validar cada video
      for (const video of videosWithQuestions) {
        try {
          const videoResults = await this.validateQuestionTimestamps(video.id);
          allResults.push(...videoResults);
        } catch (error) {
          this.logger.error(`Error validating video ${video.id}:`, error);
          // Continuar con el siguiente video
        }
      }

      const executionTime = Date.now() - startTime;
      const invalidQuestions = allResults.filter(r => !r.isValid);
      const questionsWithoutDuration = allResults.filter(r => r.videoDuration === null);

      const summary: ValidationSummary = {
        totalQuestionsChecked: allResults.length,
        validQuestions: allResults.length - invalidQuestions.length,
        invalidQuestions: invalidQuestions.length,
        questionsWithoutVideoDuration: questionsWithoutDuration.length,
        validationResults: allResults,
        executionTime,
        timestamp: new Date().toISOString()
      };

      this.logger.log(`Validation summary: ${summary.validQuestions}/${summary.totalQuestionsChecked} valid questions`);

      // Enviar alerta si hay problemas significativos
      if (invalidQuestions.length > 0) {
        await this.sendQuestionValidationAlert(summary);
      }

      return summary;

    } catch (error) {
      this.logger.error('Error during global question validation:', error);
      throw error;
    }
  }

  /**
   * Valida una pregunta individual
   */
  private validateSingleQuestion(
    questionId: string | number,
    questionType: 'video_question' | 'activity_question',
    videoItem: VideoItem,
    timestamp: number,
    endTimestamp?: number | null
  ): QuestionValidationResult {
    const result: QuestionValidationResult = {
      questionId,
      questionType,
      videoItemId: videoItem.id,
      videoTitle: videoItem.title,
      videoDuration: videoItem.duration,
      questionTimestamp: timestamp,
      isValid: true,
      severity: 'warning'
    };

    // Si el video no tiene duración, no podemos validar
    if (!videoItem.duration) {
      result.isValid = false;
      result.issue = 'Video duration not available - cannot validate question timestamp';
      result.severity = 'warning';
      return result;
    }

    // Validar timestamp de inicio
    if (timestamp > videoItem.duration) {
      result.isValid = false;
      result.issue = `Question start time (${timestamp}s) exceeds video duration (${videoItem.duration}s)`;
      result.severity = 'error';
      return result;
    }

    // Validar timestamp de fin si existe
    if (endTimestamp && endTimestamp > videoItem.duration) {
      result.isValid = false;
      result.issue = `Question end time (${endTimestamp}s) exceeds video duration (${videoItem.duration}s)`;
      result.severity = 'error';
      return result;
    }

    // Validar que el timestamp de fin sea mayor que el de inicio
    if (endTimestamp && endTimestamp <= timestamp) {
      result.isValid = false;
      result.issue = `Question end time (${endTimestamp}s) must be greater than start time (${timestamp}s)`;
      result.severity = 'error';
      return result;
    }

    // Advertencia si la pregunta aparece muy cerca del final del video
    const timeFromEnd = videoItem.duration - timestamp;
    if (timeFromEnd < 10) { // Menos de 10 segundos del final
      result.issue = `Question appears very close to video end (${timeFromEnd}s remaining)`;
      result.severity = 'warning';
    }

    return result;
  }

  /**
   * Valida una pregunta antes de crearla o actualizarla
   */
  async validateQuestionBeforeSave(
    videoItemId: number,
    timestamp: number,
    endTimestamp?: number
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      const videoItem = await this.videoItemsService.findOne(videoItemId);
      if (!videoItem) {
        return { isValid: false, error: `Video item ${videoItemId} not found` };
      }

      const validationResult = this.validateSingleQuestion(
        'temp',
        'video_question',
        videoItem,
        timestamp,
        endTimestamp
      );

      if (!validationResult.isValid && validationResult.severity === 'error') {
        return { isValid: false, error: validationResult.issue };
      }

      return { isValid: true };

    } catch (error) {
      this.logger.error('Error validating question before save:', error);
      return { isValid: false, error: 'Validation error occurred' };
    }
  }

  /**
   * Envía una alerta cuando se detectan problemas de validación
   */
  private async sendQuestionValidationAlert(summary: ValidationSummary): Promise<void> {
    try {
      const threshold = parseInt(process.env.QUESTION_VALIDATION_ALERT_THRESHOLD || '5');
      
      if (summary.invalidQuestions < threshold) {
        this.logger.log(`Invalid questions (${summary.invalidQuestions}) below threshold (${threshold}) - no alert sent`);
        return;
      }

      const alertMessage = this.buildQuestionValidationAlertMessage(summary);
      
      // Usar el NotificationService para enviar la alerta
      const alertSent = await this.notificationService.sendQuestionValidationAlert(alertMessage, {
        totalQuestionsChecked: summary.totalQuestionsChecked,
        invalidQuestions: summary.invalidQuestions,
        questionsWithoutVideoDuration: summary.questionsWithoutVideoDuration,
        executionTime: summary.executionTime
      });
      
      if (alertSent) {
        this.logger.log('Question validation alert sent successfully');
      } else {
        this.logger.warn('Question validation alert was not sent');
      }

    } catch (error) {
      this.logger.error('Error sending question validation alert:', error);
    }
  }

  /**
   * Construye el mensaje de alerta para problemas de validación
   */
  private buildQuestionValidationAlertMessage(summary: ValidationSummary): string {
    const invalidResults = summary.validationResults.filter(r => !r.isValid);
    
    let message = `🚨 GAMIFIER Question Validation Alert\n\n`;
    message += `Validation Summary:\n`;
    message += `- Total Questions Checked: ${summary.totalQuestionsChecked}\n`;
    message += `- Invalid Questions Found: ${summary.invalidQuestions}\n`;
    message += `- Questions Without Video Duration: ${summary.questionsWithoutVideoDuration}\n`;
    message += `- Execution Time: ${summary.executionTime}ms\n`;
    message += `- Timestamp: ${summary.timestamp}\n\n`;

    if (invalidResults.length > 0) {
      message += `Top Invalid Questions:\n`;
      invalidResults.slice(0, 10).forEach((result, index) => {
        message += `${index + 1}. ${result.questionType} ID ${result.questionId}\n`;
        message += `   Video: "${result.videoTitle}" (ID: ${result.videoItemId})\n`;
        message += `   Issue: ${result.issue}\n`;
        message += `   Timestamp: ${result.questionTimestamp}s, Video Duration: ${result.videoDuration}s\n\n`;
      });

      if (invalidResults.length > 10) {
        message += `... and ${invalidResults.length - 10} more invalid questions\n\n`;
      }
    }

    message += `Please review the question timestamps and video durations to ensure consistency.\n`;
    
    return message;
  }

  /**
   * Obtiene estadísticas de validación para el dashboard
   */
  async getValidationStats(): Promise<{
    totalQuestions: number;
    questionsWithValidTimestamps: number;
    questionsWithInvalidTimestamps: number;
    videosWithoutDuration: number;
    lastValidationRun: string | null;
  }> {
    try {
      // Contar preguntas de VideoItem
      const videoQuestions = await this.prisma.question.count({
        where: { isActive: true }
      });

      // Contar preguntas de Activity
      const activityQuestions = await this.prisma.activityQuestion.count();

      // Contar videos sin duración que tienen preguntas
      const videosWithoutDuration = await this.prisma.videoItem.count({
        where: {
          duration: null,
          isActive: true,
          isDeleted: { not: true },
          OR: [
            { questions: { some: { isActive: true } } },
            { activities: { some: { questions: { some: {} } } } }
          ]
        }
      });

      return {
        totalQuestions: videoQuestions + activityQuestions,
        questionsWithValidTimestamps: 0, // Se calculará en la próxima validación completa
        questionsWithInvalidTimestamps: 0, // Se calculará en la próxima validación completa
        videosWithoutDuration,
        lastValidationRun: null // Se actualizará cuando se implemente el almacenamiento de resultados
      };

    } catch (error) {
      this.logger.error('Error getting validation stats:', error);
      throw error;
    }
  }

  async validateQuestionConsistency(videoItemId: number): Promise<void> {
    const questions = await this.prisma.question.findMany({
      where: { videoItemId, isActive: true }
    });

    // Validaciones básicas
    if (questions.length === 0) {
      this.logger.log(`No questions found for video ${videoItemId}`);
      // Opcionalmente enviar una notificación
      await this.notificationService.sendQuestionValidationAlert(
        `No questions found for video ${videoItemId}`,
        { videoItemId }
      );
      return;
    }

    // Más validaciones pueden ir aquí
    this.logger.log(`Questions validation completed for video ${videoItemId}`);
  }
} 