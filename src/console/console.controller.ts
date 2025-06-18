/**
 * 🎮 Console Controller - Main Analytics & Overview
 * 
 * Controller principal para analytics generales y overview de la Consola
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConsoleService } from './console.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@Controller('console')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ConsoleController {
  constructor(private readonly consoleService: ConsoleService) {}

  @Get('analytics')
  async getConsoleAnalytics() {
    return this.consoleService.getConsoleAnalytics();
  }

  @Get('overview')
  async getConsoleOverview() {
    return this.consoleService.getConsoleOverview();
  }

  @Get('notifications')
  async getConsoleNotifications() {
    return this.consoleService.getConsoleNotifications();
  }
}