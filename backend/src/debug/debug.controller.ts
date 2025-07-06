import { Controller, Get, Post, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('debug')
export class DebugController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get('marketplace-table')
  async checkMarketplaceTable() {
    try {
      const testQuery = await this.prisma.marketplaceItem.findFirst();
      return {
        status: 'success',
        tableExists: true,
        message: 'marketplace_items table is working correctly',
        sampleData: testQuery,
      };
    } catch (error) {
      return {
        status: 'error',
        tableExists: false,
        error: error.message,
        errorCode: error.code,
        message: 'marketplace_items table has issues',
      };
    }
  }

  @Post('fix-marketplace-emergency')
  async fixMarketplaceEmergency() {
    try {
      console.log('🚨 [EMERGENCY] Iniciando reparación de marketplace...');

      // 1. Verificar usuarios existentes
      const users = await this.prisma.user.findMany();
      if (users.length === 0) {
        return {
          status: 'error',
          message: 'No hay usuarios en la base de datos',
        };
      }

      const adminUser = await this.prisma.user.findFirst({
        where: { email: 'admin@gamifier.com' }
      });
      const regularUser = await this.prisma.user.findFirst({
        where: { email: 'user@gamifier.com' }
      });
      const premiumUser = await this.prisma.user.findFirst({
        where: { email: 'premium@gamifier.com' }
      });

      const defaultSellerId = adminUser?.id || regularUser?.id || users[0]?.id;

      // 2. Crear items del marketplace
      const marketplaceItems = [
        {
          name: 'Taller de Huerto Urbano Orgánico',
          description: 'Aprende a cultivar tus propios alimentos en espacios pequeños.',
          fullDescription: 'Taller intensivo de huerto orgánico urbano.',
          itemType: 'SERVICE',
          price: 35,
          priceToins: 15,
          currency: 'LUKAS',
          status: 'ACTIVE',
          category: 'Sostenibilidad',
          tags: ['huerto', 'orgánico', 'taller'],
          images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
          location: 'Online',
          stock: 15,
          rating: 4.8,
          reviewCount: 2,
          sellerId: defaultSellerId,
          metadata: JSON.stringify({ duration: '3 horas' }),
        },
        {
          name: 'Kombucha Artesanal de Jengibre',
          description: 'Bebida probiótica fermentada artesanalmente.',
          fullDescription: 'Kombucha orgánica fermentada en pequeños lotes.',
          itemType: 'PRODUCT',
          price: 15,
          priceToins: 8,
          currency: 'LUKAS',
          status: 'ACTIVE',
          category: 'Salud',
          tags: ['kombucha', 'probiótico'],
          images: ['https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600'],
          location: 'Medellín',
          stock: 50,
          rating: 5.0,
          reviewCount: 1,
          sellerId: premiumUser?.id || defaultSellerId,
          metadata: JSON.stringify({ volume: '500ml' }),
        },
        {
          name: 'Sesión de Sound Healing',
          description: 'Viaje sonoro de 60 minutos con cuencos tibetanos.',
          fullDescription: 'Sesión de sanación con sonido para equilibrar energía.',
          itemType: 'SERVICE',
          price: 60,
          priceToins: 25,
          currency: 'LUKAS',
          status: 'ACTIVE',
          category: 'Bienestar',
          tags: ['sound healing', 'meditación'],
          images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
          location: 'Online',
          stock: 10,
          rating: 4.9,
          reviewCount: 1,
          sellerId: regularUser?.id || defaultSellerId,
          metadata: JSON.stringify({ duration: '60 minutos' }),
        },
      ];

      const createdItems = [];
      for (const item of marketplaceItems) {
        try {
          const existingItem = await this.prisma.marketplaceItem.findFirst({
            where: { name: item.name }
          });

          if (!existingItem) {
            const created = await this.prisma.marketplaceItem.create({
              data: item
            });
            createdItems.push(created.name);
          }
        } catch (error) {
          console.log(`Error creando ${item.name}: ${error.message}`);
        }
      }

      // 3. Verificar resultado
      const totalItems = await this.prisma.marketplaceItem.count();

      return {
        status: 'success',
        message: 'Marketplace reparado exitosamente',
        createdItems,
        totalItems,
        defaultSellerId,
      };

    } catch (error) {
      return {
        status: 'error',
        message: 'Error reparando marketplace',
        error: error.message,
        errorCode: error.code,
      };
    }
  }
}
