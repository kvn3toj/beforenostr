import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../types/authenticated-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default_jwt_secret',
    });
    // // //     console.log('>>> JwtStrategy CONSTRUCTOR: Initializing...');
    // //     console.log('>>> JwtStrategy CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    // //     console.log('>>> JwtStrategy CONSTRUCTOR: JWT_SECRET IS', process.env.JWT_SECRET ? 'DEFINED' : 'USING_DEFAULT');
  }

  async validate(payload: any): Promise<AuthenticatedUser | null> {
    // //     console.log('>>> JwtStrategy VALIDATE: Payload received:', payload);

    if (!payload || !payload.sub) {
      //       console.error('>>> JwtStrategy VALIDATE: Invalid payload (missing sub)');
      throw new UnauthorizedException('Invalid token payload');
    }

    // //     console.log('>>> JwtStrategy VALIDATE: Looking for user with ID:', payload.sub);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      //       console.error('>>> JwtStrategy VALIDATE: User not found for ID:', payload.sub);
      throw new UnauthorizedException('User not found');
    }

    // //     console.log('>>> JwtStrategy VALIDATE: User found:', { id: user.id, email: user.email, name: user.name });
    //     console.log('>>> JwtStrategy VALIDATE: User roles count:', user.userRoles.length);

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = user.userRoles
      .flatMap((ur) => ur.role.rolePermissions)
      .map((rp) => rp.permission.name);

    const authenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      roles,
      permissions,
    };

    // //     console.log('>>> JwtStrategy VALIDATE: Authenticated user:', authenticatedUser);
    return authenticatedUser;
  }
}
