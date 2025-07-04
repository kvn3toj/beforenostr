import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, CreateAnswerOptionDto } from './dto/create-question.dto';
import { UpdateQuestionDto, UpdateAnswerOptionDto } from './dto/update-question.dto';
import { FindAllQuestionsDto } from './dto/find-all-questions.dto';
import type { Question, AnswerOption } from '../generated/prisma';

// Type for Question with included AnswerOptions
type QuestionWithAnswers = Question & {
  answerOptions: AnswerOption[];
};

@Injectable()
export class QuestionService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> QuestionService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  // Helper method for validating answer options for multiple-choice
  private validateMultipleChoiceOptions(options: CreateAnswerOptionDto[] | UpdateAnswerOptionDto[]): void {
    if (!options || options.length === 0) {
      throw new BadRequestException('Multiple-choice questions must have at least one answer option.');
    }
    const hasCorrectAnswer = options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      throw new BadRequestException('Multiple-choice questions must have at least one correct answer.');
    }
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<QuestionWithAnswers> {
    console.log('>>> QuestionService.create: Starting with data:', createQuestionDto);
    console.log('>>> QuestionService.create: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const { answerOptions, ...questionData } = createQuestionDto;

      // Validate options if it's a multiple-choice question
      if (questionData.type === 'multiple-choice' && answerOptions) {
        this.validateMultipleChoiceOptions(answerOptions);
      } else if (questionData.type === 'multiple-choice' && !answerOptions) {
         throw new BadRequestException('Multiple-choice questions must have answer options.');
      }

      console.log('>>> QuestionService.create: About to call prisma.question.create');
      const result = await this.prisma.question.create({
        data: {
          ...questionData,
          answerOptions: answerOptions ? {
            create: answerOptions.map(option => ({
              text: option.text,
              isCorrect: option.isCorrect ?? false, // Default isCorrect to false
              order: option.order ?? 0,           // Default order to 0
            })),
          } : undefined,
        },
        include: {
          answerOptions: true, // Include options in the response
        },
      });
      console.log('>>> QuestionService.create: SUCCESS, result:', result);
      return result;
    } catch (error) {
      console.error('>>> QuestionService.create: ERROR:', error);
      throw error;
    }
  }

  async findAll(findAllDto: FindAllQuestionsDto): Promise<Question[]> {
    console.log('>>> QuestionService.findAll: Starting with params:', findAllDto);
    console.log('>>> QuestionService.findAll: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      if (!findAllDto.videoItemId) {
        throw new BadRequestException('videoItemId is required to find questions.');
      }

      // Convert videoItemId to number if it's a string
      const videoItemId = typeof findAllDto.videoItemId === 'string' 
        ? parseInt(findAllDto.videoItemId, 10) 
        : findAllDto.videoItemId;

      if (isNaN(videoItemId)) {
        throw new BadRequestException('videoItemId must be a valid number.');
      }

      console.log('>>> QuestionService.findAll: About to call prisma.question.findMany with videoItemId:', videoItemId);
      // Note: In a real app, you might want pagination here
      const result = await this.prisma.question.findMany({
        where: {
          videoItemId,
          ...(findAllDto.languageCode && { languageCode: findAllDto.languageCode }),
          ...(findAllDto.type && { type: findAllDto.type }),
          ...(findAllDto.isActive !== undefined && { isActive: findAllDto.isActive }),
        },
        include: {
           // Include options for all questions
           answerOptions: true,
        },
        orderBy: {
            timestamp: 'asc', // Order by timestamp by default
        }
      });
      console.log('>>> QuestionService.findAll: SUCCESS, found', result.length, 'questions');
      return result;
    } catch (error) {
      console.error('>>> QuestionService.findAll: ERROR:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Question> {
    console.log('>>> QuestionService.findOne: Starting with id:', id);
    console.log('>>> QuestionService.findOne: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      console.log('>>> QuestionService.findOne: About to call prisma.question.findUnique');
      const question = await this.prisma.question.findUnique({
        where: { id },
        include: {
          answerOptions: true, // Include options
        },
      });
      
      if (!question) {
        console.log('>>> QuestionService.findOne: Question not found');
        throw new NotFoundException(`Question with ID ${id} not found.`);
      }
      
      console.log('>>> QuestionService.findOne: SUCCESS, found question:', question);
      return question;
    } catch (error) {
      console.error('>>> QuestionService.findOne: ERROR:', error);
      throw error;
    }
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    console.log('>>> QuestionService.update: Starting with id:', id, 'data:', updateQuestionDto);
    console.log('>>> QuestionService.update: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const { answerOptions, ...questionData } = updateQuestionDto;

      // Validate options if updating options for a multiple-choice question
      if (questionData.type === 'multiple-choice' && answerOptions !== undefined) {
          this.validateMultipleChoiceOptions(answerOptions);
      }

      // Handle updating answer options: delete removed, create new, update existing
      if (answerOptions !== undefined) {
          console.log('>>> QuestionService.update: Handling answer options update');
          const existingOptions = await this.prisma.answerOption.findMany({
              where: { questionId: id }
          });
          const existingOptionIds = existingOptions.map(opt => opt.id);
          const updatedOptionIds = answerOptions.filter(opt => opt.id !== undefined).map(opt => opt.id as number);

          // 1. Delete options that exist in DB but are not in the update DTO
          const optionsToDelete = existingOptionIds.filter(existingId => !updatedOptionIds.includes(existingId));
          if (optionsToDelete.length > 0) {
              await this.prisma.answerOption.deleteMany({
                  where: {
                      id: { in: optionsToDelete },
                      questionId: id // Ensure we only delete options for this question
                  }
              });
          }

          // 2. Create new options and update existing ones
           const createOps = answerOptions.filter(opt => opt.id === undefined).map(opt => ({
              text: opt.text,
              isCorrect: opt.isCorrect ?? false,
              order: opt.order ?? 0,
           }));

           const updateOps = answerOptions.filter(opt => opt.id !== undefined).map(opt => ({
               where: { id: opt.id as number, questionId: id }, // Ensure update only for this question's option
               data: {
                   text: opt.text,
                   isCorrect: opt.isCorrect ?? false,
                   order: opt.order ?? 0,
               }
           }));

          // Use a transaction to ensure atomicity of question update + option changes
          console.log('>>> QuestionService.update: About to call prisma.$transaction');
           const result = await this.prisma.$transaction(async (prisma) => {
               // Update the question itself
               const updatedQuestion = await prisma.question.update({
                   where: { id },
                   data: questionData,
               });

               // Create new options
               if (createOps.length > 0) {
                   await prisma.answerOption.createMany({
                       data: createOps.map(op => ({ ...op, questionId: id }))
                   });
               }

               // Update existing options
               for (const updateOp of updateOps) {
                   await prisma.answerOption.update(updateOp);
               }

               // Fetch the updated question with all its options to return
                return prisma.question.findUnique({
                    where: { id },
                    include: { answerOptions: true }
                });
           });
           console.log('>>> QuestionService.update: SUCCESS, result:', result);
           return result;

      } else {
          // If answerOptions is not provided in the update DTO, just update the question data
          console.log('>>> QuestionService.update: About to call prisma.question.update (no options)');
          const result = await this.prisma.question.update({
            where: { id },
            data: questionData,
             include: { answerOptions: true } // Still include options in response
          });
          console.log('>>> QuestionService.update: SUCCESS, result:', result);
          return result;
      }
    } catch (error) {
      console.error('>>> QuestionService.update: ERROR:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    console.log('>>> QuestionService.remove: Starting with id:', id);
    console.log('>>> QuestionService.remove: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      console.log('>>> QuestionService.remove: About to check if question exists');
      const question = await this.prisma.question.findUnique({ where: { id } });
      if (!question) {
        throw new NotFoundException(`Question with ID ${id} not found.`);
      }

      console.log('>>> QuestionService.remove: About to call prisma.question.delete');
      // Prisma will handle cascading delete for AnswerOptions because of onDelete: Cascade in schema.prisma
      await this.prisma.question.delete({
        where: { id },
      });
      console.log('>>> QuestionService.remove: SUCCESS');
    } catch (error) {
      console.error('>>> QuestionService.remove: ERROR:', error);
      throw error;
    }
  }
} 