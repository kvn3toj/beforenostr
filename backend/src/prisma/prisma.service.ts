// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient, MarketplaceItemType } from '../generated/prisma';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private isMockMode = false; // ✅ REAL DATABASE: Usar base de datos PostgreSQL real

  constructor() {
    super();
    //     console.log('>>> PrismaService Constructor Executed (REAL DATABASE MODE)');
    //     console.log('>>> PrismaService Constructor - MOCK_MODE:', this.isMockMode);
  }

  async onModuleInit() {
    if (this.isMockMode) {
      //       console.log('>>> PrismaService onModuleInit - MOCK MODE: Skipping database connection');
      //       console.log('>>> PrismaService onModuleInit - Backend will use mock data');
      return;
    }

    //     console.log('>>> PrismaService onModuleInit - Connecting to database...');
    try {
      await this.$connect();
      //       console.log('>>> PrismaService onModuleInit - Database connection established');
      //       console.log('>>> PrismaService onModuleInit - Backend using REAL PostgreSQL database');
      await this.seedDatabase(); // Llama al seeder aquí
    } catch (error) {
      //       console.error('>>> PrismaService onModuleInit - Database connection failed:', error.message);
      //       console.log('>>> PrismaService onModuleInit - Falling back to MOCK MODE');
      this.isMockMode = true;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    // Note: beforeExit event is not available in the current Prisma version
    // This method is kept for compatibility but doesn't do anything
    // The connection will be closed when the app shuts down
  }

  // Getter para verificar el estado desde otros servicios
  get isUsingMockMode(): boolean {
    return this.isMockMode;
  }

  async seedDatabase() {
    const userCount = await this.user.count();
    if (userCount > 0) {
      return;
    }

    console.log('Database is empty. Seeding...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('123456', 10);

    const rolesData = [
      { name: 'admin', description: 'Administrator role' },
      { name: 'user', description: 'Standard user role' },
      { name: 'premium', description: 'Premium user role' },
      { name: 'creator', description: 'Content creator role' },
      { name: 'moderator', description: 'Moderator role' },
    ];
    for (const role of rolesData) {
      await this.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
    }

    const usersData = [
      {
        email: 'admin@gamifier.com',
        password: adminPassword,
        name: 'Admin User',
        roles: ['admin'],
      },
      {
        email: 'user@gamifier.com',
        password: userPassword,
        name: 'Regular User',
        roles: ['user'],
      },
      {
        email: 'premium@gamifier.com',
        password: userPassword,
        name: 'Premium User',
        roles: ['user', 'premium'],
      },
      {
        email: 'creator@gamifier.com',
        password: userPassword,
        name: 'Content Creator',
        roles: ['user', 'creator'],
      },
      {
        email: 'moderator@gamifier.com',
        password: userPassword,
        name: 'Moderator',
        roles: ['user', 'moderator'],
      },
    ];

    for (const u of usersData) {
      const user = await this.user.upsert({
        where: { email: u.email },
        update: {},
        create: { email: u.email, password: u.password, name: u.name },
      });
      for (const roleName of u.roles) {
        const role = await this.role.findUnique({ where: { name: roleName } });
        if (role) {
          await this.userRole.create({
            data: { userId: user.id, roleId: role.id },
          });
        }
      }
    }

    const sellerUser1 = await this.user.upsert({
      where: { email: 'elena.guardian@coomunity.com' },
      update: {},
      create: {
        email: 'elena.guardian@coomunity.com',
        password: userPassword,
        name: 'Elena, Guardiana de la Tierra',
      },
    });
    await this.profile.upsert({
      where: { userId: sellerUser1.id },
      update: {},
      create: {
        userId: sellerUser1.id,
        bio: 'Apasionada por la permacultura y la vida sostenible. Creo en el poder de la comunidad para regenerar nuestro planeta.',
        isEmprendedorConfiable: true,
        avatar: 'https://source.unsplash.com/500x500/?woman,nature',
      },
    });

    const sellerUser2 = await this.user.upsert({
      where: { email: 'marco.artesano@coomunity.com' },
      update: {},
      create: {
        email: 'marco.artesano@coomunity.com',
        password: userPassword,
        name: 'Marco, Artesano del Bienestar',
      },
    });
    await this.profile.upsert({
      where: { userId: sellerUser2.id },
      update: {},
      create: {
        userId: sellerUser2.id,
        bio: 'Artista y terapeuta de sonido. Mi misión es crear herramientas y experiencias que ayuden a las personas a conectar con su interior.',
        isEmprendedorConfiable: true,
        avatar: 'https://source.unsplash.com/500x500/?man,craft',
      },
    });

    const marketplaceItemsData = [
      {
        name: 'Taller de Huerto Urbano Orgánico',
        description:
          'Aprende a cultivar tus propios alimentos en espacios pequeños.',
        fullDescription:
          'Este taller intensivo cubre todo lo que necesitas para iniciar tu propio huerto orgánico en casa.',
        itemType: MarketplaceItemType.SERVICE,
        price: 35,
        category: 'Sostenibilidad',
        tags: ['huerto', 'orgánico', 'taller', 'diy', 'sostenibilidad'],
        images: [
          'https://source.unsplash.com/800x600/?urban,garden',
          'https://source.unsplash.com/800x600/?seedlings',
        ],
        stock: 15,
        sellerId: sellerUser1.id,
        rating: 4.8,
        reviewCount: 2,
      },
      {
        name: 'Kombucha Artesanal de Jengibre y Cúrcuma',
        description:
          'Bebida probiótica fermentada artesanalmente con ingredientes 100% orgánicos.',
        fullDescription:
          'Nuestra kombucha es un elixir vivo, fermentado en pequeños lotes para garantizar su máxima calidad.',
        itemType: MarketplaceItemType.PRODUCT,
        price: 15,
        category: 'Salud & Bienestar',
        tags: ['kombucha', 'probiótico', 'orgánico', 'salud'],
        images: [
          'https://source.unsplash.com/800x600/?kombucha',
          'https://source.unsplash.com/800x600/?ginger,turmeric',
        ],
        stock: 50,
        sellerId: sellerUser1.id,
        rating: 5,
        reviewCount: 1,
      },
      {
        name: 'Sesión de Terapia de Sonido (Sound Healing)',
        description:
          'Viaje sonoro de 60 minutos con cuencos tibetanos y gongs.',
        fullDescription:
          'Permítete un reseteo completo del sistema nervioso a través de las vibraciones sanadoras.',
        itemType: MarketplaceItemType.SERVICE,
        price: 60,
        category: 'Salud & Bienestar',
        tags: ['sonoterapia', 'meditación', 'bienestar', 'relajación'],
        images: [
          'https://source.unsplash.com/800x600/?sound,healing',
          'https://source.unsplash.com/800x600/?singing,bowl',
        ],
        stock: 10,
        sellerId: sellerUser2.id,
        rating: 4.9,
        reviewCount: 1,
      },
      {
        name: 'Kit de Sahumerios de Limpieza Energética',
        description:
          'Atado de salvia blanca de cultivo ético y palo santo sostenible.',
        fullDescription:
          'Este kit contiene todo lo necesario para realizar rituales de limpieza energética.',
        itemType: MarketplaceItemType.PRODUCT,
        price: 25,
        category: 'Desarrollo Consciente',
        tags: ['sahumerio', 'limpieza', 'ritual', 'espiritual'],
        images: [
          'https://source.unsplash.com/800x600/?smudge,stick',
          'https://source.unsplash.com/800x600/?palo,santo',
        ],
        stock: 40,
        sellerId: sellerUser2.id,
        rating: 0,
        reviewCount: 0,
      },
      {
        name: 'Intercambio: Clases de Guitarra por Diseño Gráfico',
        description:
          'Ofrezco clases de guitarra para principiantes a cambio de ayuda con el diseño de un logo.',
        fullDescription:
          'Soy músico con 15 años de experiencia y estoy lanzando mi proyecto como solista. Necesito una identidad visual potente.',
        itemType: MarketplaceItemType.SERVICE,
        price: 0,
        category: 'Educación',
        tags: ['trueque', 'música', 'diseño', 'reciprocidad'],
        images: [
          'https://source.unsplash.com/800x600/?guitar,lesson',
          'https://source.unsplash.com/800x600/?graphic,design',
        ],
        stock: 1,
        sellerId: sellerUser2.id,
        rating: 0,
        reviewCount: 0,
      },
    ];

    for (const item of marketplaceItemsData) {
      await this.marketplaceItem.create({ data: item });
    }

    const itemsToReview = {
      huerto: await this.marketplaceItem.findFirst({
        where: { name: { contains: 'Huerto' } },
      }),
      kombucha: await this.marketplaceItem.findFirst({
        where: { name: { contains: 'Kombucha' } },
      }),
      sonido: await this.marketplaceItem.findFirst({
        where: { name: { contains: 'Sonido' } },
      }),
    };

    const regularUser = await this.user.findUnique({
      where: { email: 'user@gamifier.com' },
    });

    if (
      itemsToReview.huerto &&
      itemsToReview.kombucha &&
      itemsToReview.sonido &&
      regularUser
    ) {
      await this.review.createMany({
        data: [
          {
            rating: 5,
            comment:
              '¡Increíble taller! Elena es una maestra maravillosa, explica con una claridad y una pasión que contagian.',
            marketplaceItemId: itemsToReview.huerto.id,
            userId: regularUser.id,
            communication: 5,
            quality: 5,
            delivery: 5,
            value: 5,
          },
          {
            rating: 5,
            comment:
              'La mejor kombucha que he probado, se nota que está hecha con amor y con ingredientes de primera.',
            marketplaceItemId: itemsToReview.kombucha.id,
            userId: regularUser.id,
            communication: 5,
            quality: 5,
            delivery: 5,
            value: 5,
          },
          {
            rating: 5,
            comment:
              'La sesión con Marco fue mágica. Sentí una paz profunda y una claridad que no había experimentado antes.',
            marketplaceItemId: itemsToReview.sonido.id,
            userId: regularUser.id,
            communication: 5,
            quality: 5,
            delivery: 5,
            value: 5,
          },
        ],
      });
    }

    console.log('Database seeding completed successfully.');
  }
}
