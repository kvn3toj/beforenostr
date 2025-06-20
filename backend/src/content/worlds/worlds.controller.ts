import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject } from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';

@Controller('worlds')
export class WorldsController {
  constructor(@Inject(WorldsService) private readonly worldsService: WorldsService) {
// //     console.log('>>> WorldsController CONSTRUCTOR: this.worldsService IS', this.worldsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post()
  create(@Body() createWorldDto: CreateWorldDto) {
//     console.log('>>> WorldsController: POST /worlds', createWorldDto);
    return this.worldsService.create(createWorldDto);
  }

  @Get()
  findAll() {
//     console.log('>>> WorldsController: GET /worlds');
    return this.worldsService.findAll();
  }

  @Get('creator/:creatorId')
  findByCreatorId(@Param('creatorId') creatorId: string) {
//     console.log('>>> WorldsController: GET /worlds/creator/:creatorId', creatorId);
    return this.worldsService.findByCreatorId(creatorId);
  }

  @Get('status/:status')
  getWorldsByStatus(@Param('status') status: string) {
//     console.log('>>> WorldsController: GET /worlds/status/:status', status);
    return this.worldsService.getWorldsByStatus(status);
  }

  @Get('type/:type')
  getWorldsByType(@Param('type') type: string) {
//     console.log('>>> WorldsController: GET /worlds/type/:type', type);
    return this.worldsService.getWorldsByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
//     console.log('>>> WorldsController: GET /worlds/:id', id);
    return this.worldsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorldDto: UpdateWorldDto) {
//     console.log('>>> WorldsController: PATCH /worlds/:id', { id, updateWorldDto });
    return this.worldsService.update(id, updateWorldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
//     console.log('>>> WorldsController: DELETE /worlds/:id', id);
    return this.worldsService.remove(id);
  }
} 