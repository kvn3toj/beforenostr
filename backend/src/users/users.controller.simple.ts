import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SimpleUsersService } from './users.service.simple';

@ApiTags('users-simple')
@Controller('users-simple')
export class SimpleUsersController {
  constructor(
    private readonly usersService: SimpleUsersService
  ) {
// // //     console.log('>>> SimpleUsersController CONSTRUCTOR: Initializing...');
// //     console.log('>>> SimpleUsersController CONSTRUCTOR: service:', this.usersService ? 'available' : 'undefined');
// //     console.log('>>> SimpleUsersController CONSTRUCTOR: service type:', typeof this.usersService);
// //     console.log('>>> SimpleUsersController CONSTRUCTOR: service constructor:', this.usersService?.constructor?.name);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint para verificar que el controlador simple funciona' })
  async test() {
//     console.log('>>> SimpleUsersController.test called');
    return { 
      message: 'Simple Users controller is working!', 
      timestamp: new Date().toISOString(),
      serviceAvailable: !!this.usersService
    };
  }

  @Get('db-test')
  @ApiOperation({ summary: 'Test directo de la base de datos con controlador simple' })
  async dbTest() {
    try {
//       console.log('>>> SimpleUsersController.dbTest called');
//       console.log('>>> SimpleUsersController.dbTest - service check:', !!this.usersService);
//       console.log('>>> SimpleUsersController.dbTest - service type:', typeof this.usersService);
//       console.log('>>> SimpleUsersController.dbTest - service constructor:', this.usersService?.constructor?.name);
      
      if (!this.usersService) {
//         console.log('>>> SimpleUsersController.dbTest - Service is undefined!');
        return { 
          message: 'Simple DB test endpoint working!', 
          timestamp: new Date().toISOString(),
          service: 'Service not available',
          error: 'SimpleUsersService is not injected'
        };
      }
      
      const users = await this.usersService.findAll();
//       console.log('>>> SimpleUsersController.dbTest - users found:', users.length);
      
      return { 
        message: 'Simple DB test endpoint working!', 
        timestamp: new Date().toISOString(),
        service: 'Service available',
        usersCount: users.length
      };
    } catch (error) {
//       console.error('>>> SimpleUsersController.dbTest - Error:', error);
      return { error: error.message };
    }
  }
} 