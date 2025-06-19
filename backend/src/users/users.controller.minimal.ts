import { Controller, Get } from '@nestjs/common';
import { MinimalUsersService } from './users.service.minimal';

@Controller('users-minimal')
export class MinimalUsersController {
  constructor(private readonly usersService: MinimalUsersService) {
// // //     console.log('>>> MinimalUsersController CONSTRUCTOR: Initializing...');
// //     console.log('>>> MinimalUsersController CONSTRUCTOR: service:', !!this.usersService);
// //     console.log('>>> MinimalUsersController CONSTRUCTOR: service type:', typeof this.usersService);
  }

  @Get('test')
  test() {
//     console.log('>>> MinimalUsersController.test called');
    return { 
      message: 'Minimal Users controller is working!', 
      timestamp: new Date().toISOString(),
      serviceAvailable: !!this.usersService
    };
  }

  @Get('users')
  async getUsers() {
    try {
//       console.log('>>> MinimalUsersController.getUsers called');
//       console.log('>>> MinimalUsersController.getUsers - service check:', !!this.usersService);
      
      if (!this.usersService) {
        return { 
          message: 'Minimal Users endpoint working!', 
          timestamp: new Date().toISOString(),
          service: 'Service not available',
          error: 'MinimalUsersService is not injected'
        };
      }
      
      const users = await this.usersService.getUsers();
//       console.log('>>> MinimalUsersController.getUsers - users:', users);
      
      return { 
        message: 'Minimal Users endpoint working!', 
        timestamp: new Date().toISOString(),
        service: 'Service available',
        users
      };
    } catch (error) {
//       console.log('>>> MinimalUsersController.getUsers - Error:', error);
      return { 
        message: 'Minimal Users endpoint working!', 
        timestamp: new Date().toISOString(),
        service: 'Service available but failed',
        error: error.message
      };
    }
  }
} 