import { Controller, Get, Put, Body } from '@nestjs/common';
import { TrustVotingService } from './trust-voting.service';
import { UpdateTrustVotingDto } from './dto/update-trust-voting.dto';

@Controller('console/trust-voting')
export class TrustVotingController {
  constructor(private readonly trustVotingService: TrustVotingService) {}

  @Get()
  getTrustVotingSystem() {
    return this.trustVotingService.getTrustVotingSystem();
  }

  @Put()
  updateTrustVotingSystem(@Body() data: UpdateTrustVotingDto) {
    return this.trustVotingService.updateTrustVotingSystem(data);
  }

  @Get('analytics')
  getTrustVotingAnalytics() {
    return this.trustVotingService.getTrustVotingAnalytics();
  }
}
