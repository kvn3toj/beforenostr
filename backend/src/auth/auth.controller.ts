import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { AuthService } from './auth.service'; // Temporarily commented
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('AuthService') private readonly authService: any) {
    // //     console.log('>>> AuthController initialized');
    //     console.log('>>> AuthController - this.authService:', this.authService);
    if (this.authService === undefined) {
      //       console.error('>>> AuthController - ERROR: AuthService is undefined!');
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  test() {
    return {
      message: 'Auth controller is working',
      service: !!this.authService,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido correctamente' })
  async getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
