import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
// import { UsersModule } from '../users/users.module'; // COMENTADO TEMPORALMENTE - DEPENDENCIA CIRCULAR
// import { AuditLogsModule } from '../admin/audit-logs/audit-logs.module'; // COMENTADO TEMPORALMENTE - CARPETA MOVIDA

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    // UsersModule, // COMENTADO TEMPORALMENTE - DEPENDENCIA CIRCULAR
    // AuditLogsModule, // COMENTADO TEMPORALMENTE - CARPETA MOVIDA
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gamifier-secret-key',
      signOptions: { expiresIn: '24h' },
    }), // RE-ENABLED PARA PRUEBA
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 