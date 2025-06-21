import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        // PrismaService is no longer directly used by AuthService, but by UsersService
        // which is mocked. So we can provide a minimal mock or omit if not needed.
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object if validation is successful', async () => {
      const user = { id: 'user-id', email: 'test@example.com', password: 'hashed-password' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await authService.validateUser('test@example.com', 'correct-password');

      const { password, ...userWithoutPassword } = user;
      expect(result).toEqual(userWithoutPassword);
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcryptCompareSpy).toHaveBeenCalledWith('correct-password', 'hashed-password');

      bcryptCompareSpy.mockRestore();
    });

    it('should return null if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      const result = await authService.validateUser('nonexistent@example.com', 'any-password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
        const user = { id: 'user-id', email: 'test@example.com', password: 'hashed-password' };
        (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

        const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

        const result = await authService.validateUser('test@example.com', 'wrong-password');

        expect(result).toBeNull();
        expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(bcryptCompareSpy).toHaveBeenCalledWith('wrong-password', 'hashed-password');

        bcryptCompareSpy.mockRestore();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { userId: 'user-id', email: 'test@example.com', roles: ['user'] };
      const result = await authService.login(user as any);
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-jwt-token');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = { email: 'new@example.com', password: 'password123', name: 'New User' };
      const hashedPassword = 'hashed-new-password';
      const createdUser = { id: 'new-user-id', ...registerDto, password: hashedPassword };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));

      (usersService.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual(createdUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(bcryptHashSpy).toHaveBeenCalledWith('password123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });

      bcryptHashSpy.mockRestore();
    });

    it('should throw an error if email already exists', async () => {
      const registerDto = { email: 'existing@example.com', password: 'password123', name: 'Existing User' };
      const existingUser = { id: 'existing-user-id', ...registerDto };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow('User with this email already exists');
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });
});
