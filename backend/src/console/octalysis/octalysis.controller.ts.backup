import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { OctalysisService } from './octalysis.service';
import { UpdateOctalysisElementDto } from './dto/update-octalysis-element.dto';

@Controller('console/octalysis')
export class OctalysisController {
  constructor(private readonly octalysisService: OctalysisService) {}

  @Get()
  getOctalysisConfig() {
    return this.octalysisService.getOctalysisConfig();
  }

  @Put('elements/:elementId')
  updateOctalysisElement(
    @Param('elementId') elementId: string,
    @Body() element: UpdateOctalysisElementDto
  ) {
    return this.octalysisService.updateOctalysisElement(elementId, element);
  }

  @Get('analytics')
  getOctalysisAnalytics() {
    return this.octalysisService.getOctalysisAnalytics();
  }
}
