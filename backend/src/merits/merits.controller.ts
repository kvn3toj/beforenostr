import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
} from '@nestjs/common';
import { MeritsService } from './merits.service';
import { CreateMeritDto } from './dto/create-merit.dto';

@Controller('merits')
export class MeritsController {
  constructor(
    @Inject(MeritsService) private readonly meritsService: MeritsService
  ) {
    // //     console.log('>>> MeritsController CONSTRUCTOR: this.meritsService IS', this.meritsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post()
  create(@Body() createMeritDto: CreateMeritDto) {
    //     console.log('>>> MeritsController: POST /merits', createMeritDto);
    return this.meritsService.create(createMeritDto);
  }

  @Get()
  findAll() {
    //     console.log('>>> MeritsController: GET /merits');
    return this.meritsService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    //     console.log('>>> MeritsController: GET /merits/user/:userId', userId);
    return this.meritsService.findByUserId(userId);
  }

  @Get('user/:userId/balance')
  getUserMeritBalance(
    @Param('userId') userId: string,
    @Query('type') meritType?: string
  ) {
    //     console.log('>>> MeritsController: GET /merits/user/:userId/balance', { userId, meritType });
    return this.meritsService.getUserMeritBalance(userId, meritType);
  }

  @Get('leaderboard')
  getMeritLeaderboard(
    @Query('type') meritType?: string,
    @Query('limit') limit?: string
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    //     console.log('>>> MeritsController: GET /merits/leaderboard', { meritType, limit: limitNumber });
    return this.meritsService.getMeritLeaderboard(meritType, limitNumber);
  }

  @Post('award')
  awardMerit(
    @Body()
    body: {
      userId: string;
      type: string;
      amount: number;
      source: string;
      relatedEntityId?: string;
    }
  ) {
    //     console.log('>>> MeritsController: POST /merits/award', body);
    return this.meritsService.awardMerit(
      body.userId,
      body.type,
      body.amount,
      body.source,
      body.relatedEntityId
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //     console.log('>>> MeritsController: GET /merits/:id', id);
    return this.meritsService.findOne(id);
  }
}
