import { Injectable } from '@nestjs/common';

@Injectable()
export class MinimalUsersService {
  constructor() {
    // // //     console.log('>>> MinimalUsersService CONSTRUCTOR: Initializing...');
  }

  async getUsers() {
    //     console.log('>>> MinimalUsersService.getUsers called');
    return [
      { id: '1', email: 'test1@example.com', name: 'Test User 1' },
      { id: '2', email: 'test2@example.com', name: 'Test User 2' },
    ];
  }

  async getUsersCount() {
    //     console.log('>>> MinimalUsersService.getUsersCount called');
    return { count: 2 };
  }
}
