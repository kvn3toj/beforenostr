import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsService } from './invitations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

// Mock crypto
jest.mock('crypto');
const mockCrypto = crypto as jest.Mocked<typeof crypto>;

// Mock bcrypt
jest.mock('bcryptjs');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('InvitationsService', () => {
  let service: InvitationsService;
  let prismaService: PrismaService;
  let notificationsService: NotificationsService;

  const mockUser = {
    id: 'user-123',
    email: 'inviter@example.com',
    name: 'Inviter User',
    wallet: {
      id: 'wallet-123',
      userId: 'user-123',
      balanceUnits: 1000,
      balanceMerits: 500,
    },
  };

  const mockGiftCard = {
    id: 'gift-card-123',
    userId: 'user-123',
    content: JSON.stringify({
      type: 'GIFT_CARD',
      invitedName: 'John Doe',
      invitedEmail: 'john@example.com',
      unitsAmount: 100,
      suggestions: ['Welcome to the platform!'],
      token: 'mock-token-123',
      status: 'SENT',
      templateId: 'template-1',
    }),
    type: 'GIFT_CARD',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            publication: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            wallet: {
              update: jest.fn(),
              create: jest.fn(),
            },
            transaction: {
              create: jest.fn(),
            },
            $transaction: mockTransaction,
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            createNotification: jest.fn(),
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGiftCard', () => {
    const createGiftCardDto = {
      inviterId: 'user-123',
      invitedName: 'John Doe',
      invitedEmail: 'john@example.com',
      unitsAmount: 100,
      suggestions: ['Welcome to the platform!'],
      templateId: 'template-1',
    };

    it('should create a gift card successfully', async () => {
      // Arrange
      const mockToken = 'mock-token-123';
      mockCrypto.randomBytes = jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue(mockToken),
      } as any);

      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      mockTransaction.mockImplementation(async (callback) => {
        return await callback({
          publication: {
            create: jest.fn().mockResolvedValue(mockGiftCard),
          },
          wallet: {
            update: jest.fn().mockResolvedValue({}),
          },
          transaction: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });
      notificationsService.createNotification = jest.fn().mockResolvedValue({});

      // Act
      const result = await service.createGiftCard(createGiftCardDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBe(mockToken);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: createGiftCardDto.inviterId },
        include: { wallet: true },
      });
      expect(notificationsService.createNotification).toHaveBeenCalled();
    });

    it('should throw NotFoundException when inviter not found', async () => {
      // Arrange
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.createGiftCard(createGiftCardDto)).rejects.toThrow(
        NotFoundException
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: createGiftCardDto.inviterId },
        include: { wallet: true },
      });
    });

    it('should throw BadRequestException when insufficient balance', async () => {
      // Arrange
      const userWithLowBalance = {
        ...mockUser,
        wallet: { ...mockUser.wallet, balanceUnits: 50 },
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(userWithLowBalance);

      // Act & Assert
      await expect(service.createGiftCard(createGiftCardDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException when user has no wallet', async () => {
      // Arrange
      const userWithoutWallet = { ...mockUser, wallet: null };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(userWithoutWallet);

      // Act & Assert
      await expect(service.createGiftCard(createGiftCardDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('redeemGiftCard', () => {
    const redeemGiftCardDto = {
      token: 'mock-token-123',
      redeemerEmail: 'john@example.com',
      redeemerName: 'John Doe',
    };

    it('should redeem a gift card successfully for new user', async () => {
      // Arrange
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(mockGiftCard);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null); // New user
      
      const mockNewUser = {
        id: 'new-user-123',
        email: redeemGiftCardDto.redeemerEmail,
        name: redeemGiftCardDto.redeemerName,
      };

      mockTransaction.mockImplementation(async (callback) => {
        return await callback({
          user: {
            create: jest.fn().mockResolvedValue(mockNewUser),
          },
          wallet: {
            create: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
          },
          publication: {
            update: jest.fn().mockResolvedValue({}),
          },
          transaction: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      // Act
      const result = await service.redeemGiftCard(redeemGiftCardDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(prismaService.publication.findUnique).toHaveBeenCalledWith({
        where: { id: expect.any(String) },
      });
    });

    it('should throw NotFoundException when gift card not found', async () => {
      // Arrange
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.redeemGiftCard(redeemGiftCardDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException when gift card already redeemed', async () => {
      // Arrange
      const redeemedGiftCard = {
        ...mockGiftCard,
        content: JSON.stringify({
          ...JSON.parse(mockGiftCard.content),
          status: 'REDEEMED',
        }),
      };
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(redeemedGiftCard);

      // Act & Assert
      await expect(service.redeemGiftCard(redeemGiftCardDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getGiftCardByToken', () => {
    it('should return gift card by token', async () => {
      // Arrange
      const token = 'mock-token-123';
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(mockGiftCard);

      // Act
      const result = await service.getGiftCardByToken(token);

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBe(token);
      expect(prismaService.publication.findUnique).toHaveBeenCalled();
    });

    it('should throw NotFoundException when gift card not found by token', async () => {
      // Arrange
      const token = 'nonexistent-token';
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.getGiftCardByToken(token)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getUserInvitations', () => {
    it('should return user invitations', async () => {
      // Arrange
      const userId = 'user-123';
      const mockInvitations = [mockGiftCard];
      prismaService.publication.findMany = jest.fn().mockResolvedValue(mockInvitations);

      // Act
      const result = await service.getUserInvitations(userId);

      // Assert
      expect(result).toEqual(mockInvitations);
      expect(prismaService.publication.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: 'GIFT_CARD',
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no invitations found', async () => {
      // Arrange
      const userId = 'user-123';
      prismaService.publication.findMany = jest.fn().mockResolvedValue([]);

      // Act
      const result = await service.getUserInvitations(userId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getInvitationStats', () => {
    it('should return invitation statistics', async () => {
      // Arrange
      const userId = 'user-123';
      const mockStats = [
        { status: 'SENT', count: 5 },
        { status: 'REDEEMED', count: 3 },
      ];
      
      // Mock the aggregation query
      prismaService.publication.findMany = jest.fn().mockResolvedValue([
        mockGiftCard,
        { ...mockGiftCard, id: 'gift-card-456' },
      ]);

      // Act
      const result = await service.getInvitationStats(userId);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result.totalSent).toBe('number');
      expect(typeof result.totalRedeemed).toBe('number');
      expect(typeof result.totalPending).toBe('number');
    });
  });

  describe('updateGiftCard', () => {
    const updateGiftCardDto = {
      suggestions: ['Updated welcome message'],
    };

    it('should update gift card successfully', async () => {
      // Arrange
      const giftCardId = 'gift-card-123';
      const userId = 'user-123';
      
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(mockGiftCard);
      
      const updatedGiftCard = {
        ...mockGiftCard,
        content: JSON.stringify({
          ...JSON.parse(mockGiftCard.content),
          suggestions: updateGiftCardDto.suggestions,
        }),
      };
      
      prismaService.publication.update = jest.fn().mockResolvedValue(updatedGiftCard);

      // Act
      const result = await service.updateGiftCard(giftCardId, userId, updateGiftCardDto);

      // Assert
      expect(result).toBeDefined();
      expect(prismaService.publication.update).toHaveBeenCalledWith({
        where: { id: giftCardId },
        data: { content: expect.any(String) },
      });
    });

    it('should throw NotFoundException when gift card not found', async () => {
      // Arrange
      const giftCardId = 'nonexistent-id';
      const userId = 'user-123';
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateGiftCard(giftCardId, userId, updateGiftCardDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user is not the owner', async () => {
      // Arrange
      const giftCardId = 'gift-card-123';
      const wrongUserId = 'wrong-user-456';
      prismaService.publication.findUnique = jest.fn().mockResolvedValue(mockGiftCard);

      // Act & Assert
      await expect(
        service.updateGiftCard(giftCardId, wrongUserId, updateGiftCardDto)
      ).rejects.toThrow(BadRequestException);
    });
  });
}); 