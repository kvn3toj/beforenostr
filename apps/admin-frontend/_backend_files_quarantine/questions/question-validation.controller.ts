import { Controller, Get, Post, Param, Inject, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { QuestionValidationService, ValidationSummary, QuestionValidationResult } from './question-validation.service';

@ApiTags('question-validation')
@Controller('questions/validation')
export class QuestionValidationController {
  constructor(
    @Inject(QuestionValidationService) private readonly questionValidationService: QuestionValidationService,
  ) {
    console.log('>>> QuestionValidationController CONSTRUCTOR: this.questionValidationService IS', this.questionValidationService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get question validation statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Question validation statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalQuestions: { type: 'number' },
        questionsWithValidTimestamps: { type: 'number' },
        questionsWithInvalidTimestamps: { type: 'number' },
        videosWithoutDuration: { type: 'number' },
        lastValidationRun: { type: 'string', nullable: true }
      }
    }
  })
  async getValidationStats() {
    console.log('>>> QuestionValidationController.getValidationStats: Starting');
    console.log('>>> QuestionValidationController.getValidationStats: this.questionValidationService IS', this.questionValidationService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const stats = await this.questionValidationService.getValidationStats();
      console.log('>>> QuestionValidationController.getValidationStats: SUCCESS, stats:', stats);
      
      return {
        success: true,
        message: 'Question validation statistics retrieved successfully',
        data: stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('>>> QuestionValidationController.getValidationStats: ERROR:', error);
      throw error;
    }
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Validate question timestamps for a specific video' })
  @ApiParam({ name: 'videoId', description: 'Video item ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Question validation completed for video',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            videoId: { type: 'number' },
            totalQuestions: { type: 'number' },
            validQuestions: { type: 'number' },
            invalidQuestions: { type: 'number' },
            validationResults: { type: 'array' }
          }
        }
      }
    }
  })
  async validateVideoQuestions(@Param('videoId', ParseIntPipe) videoId: number) {
    console.log(`>>> QuestionValidationController.validateVideoQuestions: Starting validation for video ${videoId}`);
    console.log('>>> QuestionValidationController.validateVideoQuestions: this.questionValidationService IS', this.questionValidationService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const validationResults = await this.questionValidationService.validateQuestionTimestamps(videoId);
      
      const summary = {
        videoId,
        totalQuestions: validationResults.length,
        validQuestions: validationResults.filter(r => r.isValid).length,
        invalidQuestions: validationResults.filter(r => !r.isValid).length,
        validationResults
      };

      console.log(`>>> QuestionValidationController.validateVideoQuestions: SUCCESS, validated ${summary.totalQuestions} questions`);
      
      return {
        success: true,
        message: `Question validation completed for video ${videoId}`,
        data: summary,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`>>> QuestionValidationController.validateVideoQuestions: ERROR for video ${videoId}:`, error);
      throw error;
    }
  }

  @Post('run-all')
  @ApiOperation({ summary: 'Run validation for all questions in the system' })
  @ApiResponse({ 
    status: 200, 
    description: 'Global question validation completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            totalQuestionsChecked: { type: 'number' },
            validQuestions: { type: 'number' },
            invalidQuestions: { type: 'number' },
            questionsWithoutVideoDuration: { type: 'number' },
            executionTime: { type: 'number' },
            timestamp: { type: 'string' },
            alertsSent: { type: 'boolean' }
          }
        }
      }
    }
  })
  async runGlobalValidation() {
    console.log('>>> QuestionValidationController.runGlobalValidation: Starting global validation');
    console.log('>>> QuestionValidationController.runGlobalValidation: this.questionValidationService IS', this.questionValidationService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const validationSummary = await this.questionValidationService.validateAllQuestionTimestamps();
      
      console.log(`>>> QuestionValidationController.runGlobalValidation: SUCCESS, validated ${validationSummary.totalQuestionsChecked} questions`);
      
      return {
        success: true,
        message: 'Global question validation completed successfully',
        data: {
          ...validationSummary,
          alertsSent: validationSummary.invalidQuestions > 0
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('>>> QuestionValidationController.runGlobalValidation: ERROR:', error);
      throw error;
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test question validation service connectivity' })
  @ApiResponse({ status: 200, description: 'Question validation service test completed' })
  async testValidationService() {
    console.log('>>> QuestionValidationController.testValidationService: Testing service connectivity');
    
    try {
      const stats = await this.questionValidationService.getValidationStats();
      
      return {
        success: true,
        message: 'Question validation service is working correctly',
        serviceConnected: !!this.questionValidationService,
        data: {
          totalQuestions: stats.totalQuestions,
          videosWithoutDuration: stats.videosWithoutDuration
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('>>> QuestionValidationController.testValidationService: ERROR:', error);
      return {
        success: false,
        message: 'Question validation service test failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
} 