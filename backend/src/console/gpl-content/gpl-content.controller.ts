import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { GplContentService } from './gpl-content.service.js.js';
import { UpdateGplContentDto } from './dto/update-gpl-content.dto.js.js';

@Controller('console/gpl-content')
export class GplContentController {
  constructor(private readonly gplContentService: GplContentService) {}

  @Get()
  getAllGPLContent() {
    return this.gplContentService.getAllGPLContent();
  }

  @Get(':contentId')
  getGPLContentById(@Param('contentId') contentId: string) {
    return this.gplContentService.getGPLContentById(contentId);
  }

  @Put(':contentId')
  updateGPLContent(
    @Param('contentId') contentId: string,
    @Body() updateGplContentDto: UpdateGplContentDto
  ) {
    return this.gplContentService.updateGPLContent(
      contentId,
      updateGplContentDto
    );
  }

  @Get(':contentId/analytics')
  getGPLContentAnalytics(@Param('contentId') contentId: string) {
    return this.gplContentService.getGPLContentAnalytics(contentId);
  }
}
