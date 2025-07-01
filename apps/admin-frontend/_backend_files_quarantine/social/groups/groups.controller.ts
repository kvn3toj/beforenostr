import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(@Inject(GroupsService) private readonly groupsService: GroupsService) {
    console.log('>>> GroupsController CONSTRUCTOR: this.groupsService IS', this.groupsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    console.log('>>> GroupsController: POST /groups', createGroupDto);
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll() {
    console.log('>>> GroupsController: GET /groups');
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('>>> GroupsController: GET /groups/:id', id);
    return this.groupsService.findOne(id);
  }

  @Post('join')
  joinGroup(@Body() joinGroupDto: JoinGroupDto) {
    console.log('>>> GroupsController: POST /groups/join', joinGroupDto);
    return this.groupsService.joinGroup(joinGroupDto);
  }
} 