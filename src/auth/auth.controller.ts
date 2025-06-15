import { Controller, Post, Body, HttpCode, HttpStatus, Get, Inject, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    console.log('>>> AuthController initialized');
    console.log('>>> AuthController - this.authService:', this.authService);
    if (this.authService === undefined) {
      console.error('>>> AuthController - ERROR: AuthService is undefined!');
    } else {
      console.log('>>> AuthController - SUCCESS: AuthService is defined!');
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  test() {
    return { message: 'Auth controller is working', service: !!this.authService };
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario actual autenticado' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido correctamente' })
  async getCurrentUser(@Req() req) {
    console.log('>>> AuthController.getCurrentUser: User from token:', req.user);
    return this.authService.getCurrentUser(req.user);
  }
} 