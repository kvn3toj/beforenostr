import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {
// // //     console.log('>>> TestService CONSTRUCTOR: Initializing...');
// //     console.log('>>> TestService CONSTRUCTOR: prisma:', !!this.prisma);
// //     console.log('>>> TestService CONSTRUCTOR: prisma.user:', !!this.prisma?.user);
  }

  async testDatabase() {
//     console.log('>>> TestService.testDatabase called');
    
    if (!this.prisma) {
      throw new Error('PrismaService is not available');
    }
    
    if (!this.prisma.user) {
      throw new Error('User model is not available in PrismaService');
    }
    
    const users = await this.prisma.user.findMany();
    return {
      message: 'Database test successful',
      userCount: users.length,
      users: users.map(u => ({ id: u.id, email: u.email, name: u.name }))
    };
  }
} 