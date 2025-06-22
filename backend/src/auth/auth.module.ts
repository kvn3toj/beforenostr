import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SimpleAuthService } from './auth.service.simple';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuditLogsModule } from '../admin/audit-logs/audit-logs.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    AuditLogsModule,
    JwtModule.registerAsync({
      useFactory: () => {
        //         console.log('>>> JwtModule.registerAsync: JWT_SECRET IS', process.env.JWT_SECRET ? 'DEFINED' : 'UNDEFINED');
        //         console.log('>>> JwtModule.registerAsync: JWT_SECRET value:', process.env.JWT_SECRET || 'USING_DEFAULT');
        return {
          secret: process.env.JWT_SECRET || 'default_jwt_secret',
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthService',
      useClass: AuthService,
    },
    AuthService,
    JwtStrategy,
  ],
  exports: ['AuthService', AuthService, JwtStrategy, JwtModule],
})
export class AuthModule {
  constructor() {
    // //     console.log('>>> AuthModule initialized with REAL JWT support and audit logs');
    //     console.log('>>> JWT_SECRET from env:', process.env.JWT_SECRET ? 'DEFINED' : 'UNDEFINED');
    //     console.log('>>> JWT_SECRET value:', process.env.JWT_SECRET || 'USING_DEFAULT');
  }
}
