import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: { // Mock Reflector
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        user: { // Simulate a user object attached by an auth guard (e.g., JwtAuthGuard)
          id: 'user-id',
          email: 'test@example.com',
          role: { name: 'user' }, // Simulate user with 'user' role
          roles: [{ name: 'user' }], // Assuming roles are an array for flexibility
        },
        // getHandler and getClass are needed by reflector.getAllAndOverride
        getHandler: jest.fn(),
        getClass: jest.fn(),
      };

      mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
        // Add other necessary mocked methods of ExecutionContext if the guard uses them
        // For RolesGuard, switchToHttp().getRequest(), getHandler(), and getClass() are most relevant.
      } as any; // Use as any to bypass full type checking for the mock
    });

    it('should return true if no roles are required for the route', async () => {
      // Mock Reflector to indicate no roles are required (getAllAndOverride returns undefined)
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = await rolesGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should return true if the user has the required role (single role)', async () => {
      const requiredRole = 'admin';
      // Mock Reflector to indicate 'admin' role is required
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([requiredRole]);

      // Simulate user having the 'admin' role
      mockRequest.user.role = { name: 'admin' };
      mockRequest.user.roles = [{ name: 'admin' }];

      const result = await rolesGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should return false if the user does not have the required role (single role)', async () => {
      const requiredRole = 'admin';
      // Mock Reflector to indicate 'admin' role is required
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([requiredRole]);

      // Simulate user having the 'user' role (which is not 'admin') - default mock user
      // mockRequest.user.role = { name: 'user' }; // Already set in beforeEach
      // mockRequest.user.roles = [{ name: 'user' }]; // Already set in beforeEach

      const result = await rolesGuard.canActivate(mockContext);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should return true if the user has one of the required roles (multiple roles)', async () => {
        const requiredRoles = ['admin', 'editor'];
        // Mock Reflector to indicate 'admin' or 'editor' roles are required
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

        // Simulate user having the 'editor' role
        mockRequest.user.role = { name: 'editor' };
        mockRequest.user.roles = [{ name: 'editor' }];
  
        const result = await rolesGuard.canActivate(mockContext);
  
        expect(result).toBe(true);
        expect(reflector.getAllAndOverride).toHaveBeenCalled();
      });
    
      it('should return false if the user does not have any of the required roles (multiple roles)', async () => {
        const requiredRoles = ['admin', 'editor'];
        // Mock Reflector to indicate 'admin' or 'editor' roles are required
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

        // Simulate user having the 'user' role
        mockRequest.user.role = { name: 'user' };
        mockRequest.user.roles = [{ name: 'user' }];
  
        const result = await rolesGuard.canActivate(mockContext);
  
        expect(result).toBe(false);
        expect(reflector.getAllAndOverride).toHaveBeenCalled();
      });

    it('should return false if no user is attached to the request', async () => {
      // Mock Reflector to require a role
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      // Simulate no user on the request
      mockRequest.user = undefined;

      const result = await rolesGuard.canActivate(mockContext);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

  });
}); 