import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('PermissionsGuard', () => {
  let permissionsGuard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: { // Mock Reflector
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    permissionsGuard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(permissionsGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        user: { // Simulate a user object with permissions
          id: 'user-id',
          email: 'test@example.com',
          // Assuming permissions are an array of strings or objects on the user object
          permissions: ['read:users', 'create:users'],
        },
        getHandler: jest.fn(),
        getClass: jest.fn(),
      };

      mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any; // Use as any to bypass full type checking for the mock
    });

    it('should return true if no permissions are required for the route', async () => {
      // Mock Reflector to indicate no permissions are required
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = await permissionsGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should return true if the user has the required permission (single permission)', async () => {
      const requiredPermission = 'read:users';
      // Mock Reflector to indicate 'read:users' permission is required
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([requiredPermission]);

      // User already mocked with 'read:users'

      const result = await permissionsGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should return false if the user does not have the required permission (single permission)', async () => {
      const requiredPermission = 'delete:users';
      // Mock Reflector to indicate 'delete:users' permission is required
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([requiredPermission]);

      // User mocked with 'read:users', 'create:users' (does NOT have 'delete:users')

      const result = await permissionsGuard.canActivate(mockContext);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should return true if the user has all required permissions (multiple permissions)', async () => {
        const requiredPermissions = ['read:users', 'create:users'];
        // Mock Reflector to indicate required permissions
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredPermissions);
  
        // User mocked with both 'read:users' and 'create:users'
  
        const result = await permissionsGuard.canActivate(mockContext);
  
        expect(result).toBe(true);
        expect(reflector.getAllAndOverride).toHaveBeenCalled();
      });
    
      it('should return false if the user is missing any of the required permissions (multiple permissions)', async () => {
        const requiredPermissions = ['read:users', 'delete:users'];
        // Mock Reflector to indicate required permissions
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredPermissions);
  
        // User mocked with 'read:users', but missing 'delete:users'
  
        const result = await permissionsGuard.canActivate(mockContext);
  
        expect(result).toBe(false);
        expect(reflector.getAllAndOverride).toHaveBeenCalled();
      });

    it('should return false if no user is attached to the request', async () => {
      // Mock Reflector to require a permission
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['read:users']);

      // Simulate no user on the request
      mockRequest.user = undefined;

      const result = await permissionsGuard.canActivate(mockContext);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });
  });
}); 