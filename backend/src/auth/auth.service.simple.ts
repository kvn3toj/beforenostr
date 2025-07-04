import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class SimpleAuthService {
  constructor() {
    // //     console.log('>>> SimpleAuthService initialized');
    //     console.log('>>> SimpleAuthService constructor complete');
  }

  test() {
    return { message: 'Simple auth service working' };
  }

  async login(dto: LoginDto) {
    console.log('[SimpleAuthService] Login called');
    return {
      access_token: 'fake_token',
      user: { id: '1', email: dto.email, name: 'Test User', avatarUrl: null },
    };
  }

  async register(dto: RegisterDto) {
    console.log('[SimpleAuthService] Register called');
    return {
      access_token: 'fake_token',
      user: {
        id: '1',
        email: dto.email,
        name: dto.name || 'Test User',
        avatarUrl: null,
      },
    };
  }

  async getCurrentUser() {
    console.log('[SimpleAuthService] GetCurrentUser called');
    return {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
    };
  }
}
