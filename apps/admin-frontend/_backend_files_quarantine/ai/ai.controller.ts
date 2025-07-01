import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuestionGeneratorService } from './question-generator.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(
    @Inject(QuestionGeneratorService)
    private readonly questionGeneratorService: QuestionGeneratorService
  ) {
    console.log('>>> AiController CONSTRUCTOR: questionGeneratorService IS', 
      this.questionGeneratorService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post('generate-questions')
  async generateQuestions(@Body() body: any) {
    console.log('>>> AiController.generateQuestions: Starting with body:', body);

    try {
      // Validación básica
      if (!body.videoItemId) {
        throw new Error('videoItemId is required');
      }

      // Configuración con valores por defecto
      const config = {
        numberOfQuestions: body.numberOfQuestions || 2,
        focusContext: body.focusContext || 'general',
        questionTypes: body.questionTypes || ['multiple-choice'],
        timeDistribution: body.timeDistribution || 'distributed',
        difficultyLevel: body.difficultyLevel || 'medium',
        languageCode: body.languageCode || 'es-ES',
      };

      console.log('>>> AiController: Calling questionGeneratorService.generateAttentionQuestions');
      const questions = await this.questionGeneratorService.generateAttentionQuestions(
        parseInt(body.videoItemId),
        config
      );

      // Auto-guardar si se solicita
      let savedQuestions = null;
      if (body.autoSave) {
        console.log('>>> AiController: Auto-saving questions to database');
        savedQuestions = await this.questionGeneratorService.saveGeneratedQuestions(
          parseInt(body.videoItemId),
          questions,
          config.languageCode
        );
      }

      const response = {
        success: true,
        message: `Generated ${questions.length} questions successfully${body.autoSave ? ' and saved to database' : ''}`,
        questions: body.autoSave ? savedQuestions : questions,
        config: config,
        metadata: {
          videoItemId: parseInt(body.videoItemId),
          generatedAt: new Date().toISOString(),
          autoSaved: !!body.autoSave
        }
      };

      console.log('>>> AiController.generateQuestions: SUCCESS');
      return response;

    } catch (error) {
      console.error('>>> AiController.generateQuestions: ERROR:', error);
      throw error;
    }
  }

  @Post('save-questions')
  async saveQuestions(@Body() body: any) {
    console.log('>>> AiController.saveQuestions: Starting with body:', body);

    try {
      if (!body.videoItemId || !body.questions || !body.languageCode) {
        throw new Error('videoItemId, questions, and languageCode are required');
      }

      const savedQuestions = await this.questionGeneratorService.saveGeneratedQuestions(
        parseInt(body.videoItemId),
        body.questions,
        body.languageCode
      );

      console.log('>>> AiController.saveQuestions: SUCCESS');
      return {
        success: true,
        message: `Saved ${savedQuestions.length} questions successfully`,
        savedQuestions: savedQuestions
      };

    } catch (error) {
      console.error('>>> AiController.saveQuestions: ERROR:', error);
      throw error;
    }
  }
} 