import { Controller, Get } from '@nestjs/common';

@Controller('system')
export class SystemController {
  
  @Get('settings')
  getSettings() {
    return {
      id: '1',
      app_name: 'Gamifier Admin',
      default_role_id: 'user',
      maintenance_mode: false,
      max_upload_size_mb: 10,
      allowed_file_types: ['mp4', 'avi', 'mov'],
    };
  }

  @Get('backups/recent')
  getRecentBackups() {
    return [];
  }

  @Get('health')
  getHealth() {
    return [];
  }
} 