import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuestionGeneratorService } from './question-generator.service';
import {
  GenerateQuestionsDto,
  SaveQuestionsDto,
  FocusContext,
  QuestionType,
  TimeDistribution,
  DifficultyLevel,
} from './dto/generate-questions.dto';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(
    @Inject(QuestionGeneratorService)
    private readonly questionGeneratorService: QuestionGeneratorService
  ) {
    // console.log('>>> AiController CONSTRUCTOR: questionGeneratorService IS',
    //   this.questionGeneratorService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post('generate-questions')
  @ApiOperation({
    summary: 'Generar preguntas de atención para un video',
    description:
      'Utiliza IA para generar preguntas contextuales basadas en el contenido del video',
  })
  @ApiResponse({
    status: 201,
    description: 'Preguntas generadas exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        questions: { type: 'array' },
        config: { type: 'object' },
        metadata: { type: 'object' },
      },
    },
  })
  async generateQuestions(@Body() body: GenerateQuestionsDto) {
    //     console.log('>>> AiController.generateQuestions: Starting with body:', body);

    // Validación básica
    if (!body.videoItemId) {
      throw new Error('videoItemId is required');
    }

    // Configuración con valores por defecto aplicados por el DTO
    const config = {
      numberOfQuestions: body.numberOfQuestions ?? 2,
      focusContext: body.focusContext ?? FocusContext.GENERAL,
      questionTypes: body.questionTypes ?? [QuestionType.MULTIPLE_CHOICE],
      timeDistribution: body.timeDistribution ?? TimeDistribution.DISTRIBUTED,
      difficultyLevel: body.difficultyLevel ?? DifficultyLevel.MEDIUM,
      languageCode: body.languageCode ?? 'es-ES',
    };

    //       console.log('>>> AiController: Calling questionGeneratorService.generateAttentionQuestions');
    const questions =
      await this.questionGeneratorService.generateAttentionQuestions(
        body.videoItemId,
        config
      );

    // Auto-guardar si se solicita
    let savedQuestions = null;
    if (body.autoSave) {
      //         console.log('>>> AiController: Auto-saving questions to database');
      savedQuestions =
        await this.questionGeneratorService.saveGeneratedQuestions(
          body.videoItemId,
          questions,
          config.languageCode
        );
    }

    const response = {
      success: true,
      message: `Generated ${questions.length} questions successfully${body.autoSave ? ' and saved to database' : ''}`,
      questions: body.autoSave ? savedQuestions : questions,
      config,
      metadata: {
        videoItemId: body.videoItemId,
        generatedAt: new Date().toISOString(),
        autoSaved: !!body.autoSave,
      },
    };

    //       console.log('>>> AiController.generateQuestions: SUCCESS');
    return response;
  }

  @Post('save-questions')
  @ApiOperation({
    summary: 'Guardar preguntas generadas',
    description: 'Persiste preguntas generadas en la base de datos',
  })
  @ApiResponse({
    status: 201,
    description: 'Preguntas guardadas exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        savedQuestions: { type: 'array' },
      },
    },
  })
  async saveQuestions(@Body() body: SaveQuestionsDto) {
    //     console.log('>>> AiController.saveQuestions: Starting with body:', body);

    if (!body.videoItemId || !body.questions || !body.languageCode) {
      throw new Error('videoItemId, questions, and languageCode are required');
    }

    const savedQuestions =
      await this.questionGeneratorService.saveGeneratedQuestions(
        body.videoItemId,
        body.questions,
        body.languageCode
      );

    //       console.log('>>> AiController.saveQuestions: SUCCESS');
    return {
      success: true,
      message: `Saved ${savedQuestions.length} questions successfully`,
      savedQuestions,
    };
  }
}
