import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('experiences')
export class ExperiencesController {
  constructor(@Inject(ExperiencesService) private readonly experiencesService: ExperiencesService) {
// //     console.log('>>> ExperiencesController CONSTRUCTOR: this.experiencesService IS', this.experiencesService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto) {
//     console.log('>>> ExperiencesController: POST /experiences', createExperienceDto);
    return this.experiencesService.create(createExperienceDto);
  }

  @Get()
  findAll() {
//     console.log('>>> ExperiencesController: GET /experiences');
    return this.experiencesService.findAll();
  }

  @Get('stage/:stageId')
  findByStageId(@Param('stageId') stageId: string) {
//     console.log('>>> ExperiencesController: GET /experiences/stage/:stageId', stageId);
    return this.experiencesService.findByStageId(stageId);
  }

  @Get('creator/:creatorId')
  findByCreatorId(@Param('creatorId') creatorId: string) {
//     console.log('>>> ExperiencesController: GET /experiences/creator/:creatorId', creatorId);
    return this.experiencesService.findByCreatorId(creatorId);
  }

  @Get('type/:type')
  getExperiencesByType(@Param('type') type: string) {
//     console.log('>>> ExperiencesController: GET /experiences/type/:type', type);
    return this.experiencesService.getExperiencesByType(type);
  }

  @Get('framework/:framework')
  getExperiencesByFramework(@Param('framework') framework: string) {
//     console.log('>>> ExperiencesController: GET /experiences/framework/:framework', framework);
    return this.experiencesService.getExperiencesByFramework(framework);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
//     console.log('>>> ExperiencesController: GET /experiences/:id', id);
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
//     console.log('>>> ExperiencesController: PATCH /experiences/:id', { id, updateExperienceDto });
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
//     console.log('>>> ExperiencesController: DELETE /experiences/:id', id);
    return this.experiencesService.remove(id);
  }
} 