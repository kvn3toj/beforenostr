import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { GplContentService } from './gpl-content.service';

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
  updateGPLContent(@Param('contentId') contentId: string, @Body() data: any) {
    return this.gplContentService.updateGPLContent(contentId, data);
  }

  @Get(':contentId/analytics')
  getGPLContentAnalytics(@Param('contentId') contentId: string) {
    return this.gplContentService.getGPLContentAnalytics(contentId);
  }
}