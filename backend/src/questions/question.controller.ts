import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
  ValidationPipe,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FindAllQuestionsDto } from './dto/find-all-questions.dto';
import type { Question } from '../generated/prisma';

// Assuming you have AuthGuard and RolesGuard/Roles decorator for admin routes
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../rbac/guards/roles.guard';
// import { Roles } from '../rbac/decorators/roles.decorator';
// import { AuthenticatedUser } from '../auth/types/authenticated-user.interface'; // If needed to pass user to service

@ApiTags('questions') // Tag for Swagger
// @ApiBearerAuth() // Indicate if authentication is required for ALL endpoints in this controller
// @UseGuards(AuthGuard('jwt'), RolesGuard) // Apply JWT and RolesGuard to all endpoints
// @Roles('admin') // Restrict ALL endpoints to admin role by default

@Controller('questions')
export class QuestionController {
  constructor(@Inject(QuestionService) private readonly questionService: QuestionService) {
//     console.log('>>> QuestionController CONSTRUCTOR called');
// //     console.log('>>> QuestionController CONSTRUCTOR: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    if (!this.questionService) {
//       console.error('>>> QuestionController CONSTRUCTOR: QuestionService is not available!');
    }
  }

  @Get('ping')
  async ping() {
//     console.log('>>> QuestionController.ping: Starting - no dependencies');
    return { 
      message: 'QuestionController is working', 
      timestamp: new Date().toISOString(),
      controller: 'QuestionController'
    };
  }

  @Get('test')
  async test() {
//     console.log('>>> QuestionController.test: Starting');
//     console.log('>>> QuestionController.test: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    return { message: 'Question controller is working', serviceAvailable: !!this.questionService };
  }

  @Get('test-service')
  async testService() {
//     console.log('>>> QuestionController.testService: Starting');
//     console.log('>>> QuestionController.testService: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      if (!this.questionService) {
        return { error: 'QuestionService not available' };
      }
      
      // Test service method with hardcoded parameters
//       console.log('>>> QuestionController.testService: About to call service.findAll with hardcoded params');
      const result = await this.questionService.findAll({ videoItemId: 1 });
//       console.log('>>> QuestionController.testService: SUCCESS, result:', result);
      
      return { 
        message: 'Service test successful',
        data: result,
        count: result.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
//       console.error('>>> QuestionController.testService: ERROR:', error);
      return { 
        error: 'Service test failed', 
        details: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'Question created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  // @UseGuards(AuthGuard('jwt'), RolesGuard) // Protect this endpoint
  // @Roles('admin') // Only admin can create questions
  async create(@Body() createQuestionDto: CreateQuestionDto) {
//     console.log('>>> QuestionController.create: Starting with data:', createQuestionDto);
//     console.log('>>> QuestionController.create: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      // TODO: Pass AuthenticatedUser to service for audit logging if needed
      const result = await this.questionService.create(createQuestionDto);
//       console.log('>>> QuestionController.create: SUCCESS');
      return result;
    } catch (error) {
//       console.error('>>> QuestionController.create: ERROR:', error);
      throw error;
    }
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all questions for a video item' })
  @ApiResponse({ status: 200, description: 'List of questions for the specified video item.' })
  @ApiQuery({ name: 'videoItemId', required: true, type: Number, description: 'ID of the video item' })
  @ApiQuery({ name: 'languageCode', required: false, type: String, description: 'Filter by language code' })
  @ApiQuery({ name: 'type', required: false, enum: ['multiple-choice', 'short-answer', 'true-false'], description: 'Filter by question type' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  // This endpoint might be public or authenticated depending on requirements
  // @UseGuards(AuthGuard('jwt')) // Example: Only authenticated users can view
  async findAll(@Query() findAllDto: FindAllQuestionsDto) {
//     console.log('>>> QuestionController.findAll: Starting with params:', findAllDto);
//     console.log('>>> QuestionController.findAll: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      // Ensure videoItemId is always present because the DTO requires it
      if (findAllDto.videoItemId === undefined || isNaN(findAllDto.videoItemId)) {
        throw new BadRequestException('videoItemId is required.');
      }
      
      if (!this.questionService) {
//         console.error('>>> QuestionController.findAll: QuestionService is not available!');
        throw new Error('QuestionService is not available');
      }
      
//       console.log('>>> QuestionController.findAll: About to call service.findAll');
      const result = await this.questionService.findAll(findAllDto);
//       console.log('>>> QuestionController.findAll: SUCCESS, found', result.length, 'questions');
      return result;
    } catch (error) {
//       console.error('>>> QuestionController.findAll: ERROR:', error);
      throw error;
    }
  }

  @Get('all-debug')
  async getAllDebug() {
//     console.log('>>> QuestionController.getAllDebug: Starting');
//     console.log('>>> QuestionController.getAllDebug: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      if (!this.questionService) {
        return { error: 'QuestionService not available' };
      }
      
      // Get all questions without filter to see what videoItemIds exist
//       console.log('>>> QuestionController.getAllDebug: About to call prisma.question.findMany without filter');
      const result = await this.questionService['prisma'].question.findMany({
        include: {
          answerOptions: true,
        },
        orderBy: { createdAt: 'asc' },
      });
//       console.log('>>> QuestionController.getAllDebug: SUCCESS, found', result.length, 'questions');
      
      return { 
        message: 'All questions retrieved successfully',
        data: result,
        count: result.length,
        videoItemIds: [...new Set(result.map(q => q.videoItemId))],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
//       console.error('>>> QuestionController.getAllDebug: ERROR:', error);
      return { 
        error: 'Failed to retrieve all questions', 
        details: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a question by ID' })
  @ApiResponse({ status: 200, description: 'The question found by ID.' })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  // This endpoint might be public or authenticated
  // @UseGuards(AuthGuard('jwt')) // Example: Only authenticated users can view
  async findOne(@Param('id') id: string) {
//     console.log('>>> QuestionController.findOne: Starting with id:', id);
//     console.log('>>> QuestionController.findOne: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new BadRequestException('Invalid ID format');
      }
      
      const result = await this.questionService.findOne(numericId);
//       console.log('>>> QuestionController.findOne: SUCCESS');
      return result;
    } catch (error) {
//       console.error('>>> QuestionController.findOne: ERROR:', error);
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a question by ID' })
  @ApiResponse({ status: 200, description: 'The updated question.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  // @UseGuards(AuthGuard('jwt'), RolesGuard) // Protect this endpoint
  // @Roles('admin') // Only admin can update questions
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
//     console.log('>>> QuestionController.update: Starting with id:', id, 'data:', updateQuestionDto);
//     console.log('>>> QuestionController.update: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      // TODO: Pass AuthenticatedUser to service for audit logging
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new BadRequestException('Invalid ID format');
      }
      
      const result = await this.questionService.update(numericId, updateQuestionDto);
//       console.log('>>> QuestionController.update: SUCCESS');
      return result;
    } catch (error) {
//       console.error('>>> QuestionController.update: ERROR:', error);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a question by ID' })
  @ApiResponse({ status: 204, description: 'Question deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  // @UseGuards(AuthGuard('jwt'), RolesGuard) // Protect this endpoint
  // @Roles('admin') // Only admin can delete questions
  async remove(@Param('id') id: string) {
//     console.log('>>> QuestionController.remove: Starting with id:', id);
//     console.log('>>> QuestionController.remove: this.questionService IS', this.questionService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      // TODO: Pass AuthenticatedUser to service for audit logging
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new BadRequestException('Invalid ID format');
      }
      
      await this.questionService.remove(numericId);
//       console.log('>>> QuestionController.remove: SUCCESS');
      return; // Return 204 No Content
    } catch (error) {
//       console.error('>>> QuestionController.remove: ERROR:', error);
      throw error;
    }
  }
} 