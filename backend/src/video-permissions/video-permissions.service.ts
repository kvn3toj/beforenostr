import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoPermissionsDto } from './dto/create-video-permissions.dto';
import { UpdateVideoPermissionsDto } from './dto/update-video-permissions.dto';
import type { VideoPermissions } from '../generated/prisma';

@Injectable()
export class VideoPermissionsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // //     console.log('>>> VideoPermissionsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async create(
    videoItemId: number,
    createDto: CreateVideoPermissionsDto
  ): Promise<VideoPermissions> {
    //     console.log('>>> VideoPermissionsService.create called with:', { videoItemId, createDto });

    // Verificar que el video item existe
    const videoItem = await this.prisma.videoItem.findUnique({
      where: { id: videoItemId, isDeleted: false },
    });

    if (!videoItem) {
      throw new NotFoundException(
        `Video item with ID ${videoItemId} not found`
      );
    }

    // Verificar que no existan permisos para este video
    const existingPermissions = await this.prisma.videoPermissions.findUnique({
      where: { videoItemId },
    });

    if (existingPermissions) {
      throw new ConflictException(
        `Permissions for video item ${videoItemId} already exist`
      );
    }

    // Crear los permisos
    const permissions = await this.prisma.videoPermissions.create({
      data: {
        videoItemId,
        ...createDto,
      },
      include: {
        videoItem: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    //     console.log('>>> VideoPermissionsService.create result:', permissions);
    return permissions;
  }

  async findByVideoItemId(
    videoItemId: number
  ): Promise<VideoPermissions | null> {
    //     console.log('>>> VideoPermissionsService.findByVideoItemId called with:', videoItemId);

    const permissions = await this.prisma.videoPermissions.findUnique({
      where: { videoItemId },
      include: {
        videoItem: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    //     console.log('>>> VideoPermissionsService.findByVideoItemId result:', permissions);
    return permissions;
  }

  async update(
    videoItemId: number,
    updateDto: UpdateVideoPermissionsDto
  ): Promise<VideoPermissions> {
    //     console.log('>>> VideoPermissionsService.update called with:', { videoItemId, updateDto });

    // Verificar que existen permisos para este video
    const existingPermissions = await this.prisma.videoPermissions.findUnique({
      where: { videoItemId },
    });

    if (!existingPermissions) {
      throw new NotFoundException(
        `Permissions for video item ${videoItemId} not found`
      );
    }

    // Actualizar los permisos
    const permissions = await this.prisma.videoPermissions.update({
      where: { videoItemId },
      data: {
        ...updateDto,
        updatedAt: new Date(),
      },
      include: {
        videoItem: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    //     console.log('>>> VideoPermissionsService.update result:', permissions);
    return permissions;
  }

  async upsert(
    videoItemId: number,
    data: CreateVideoPermissionsDto
  ): Promise<VideoPermissions> {
    //     console.log('>>> VideoPermissionsService.upsert called with:', { videoItemId, data });

    // Verificar que el video item existe
    const videoItem = await this.prisma.videoItem.findUnique({
      where: { id: videoItemId, isDeleted: false },
    });

    if (!videoItem) {
      throw new NotFoundException(
        `Video item with ID ${videoItemId} not found`
      );
    }

    // Usar upsert de Prisma para crear o actualizar
    const permissions = await this.prisma.videoPermissions.upsert({
      where: { videoItemId },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        videoItemId,
        ...data,
      },
      include: {
        videoItem: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    //     console.log('>>> VideoPermissionsService.upsert result:', permissions);
    return permissions;
  }

  async delete(videoItemId: number): Promise<void> {
    //     console.log('>>> VideoPermissionsService.delete called with:', videoItemId);

    // Verificar que existen permisos para este video
    const existingPermissions = await this.prisma.videoPermissions.findUnique({
      where: { videoItemId },
    });

    if (!existingPermissions) {
      throw new NotFoundException(
        `Permissions for video item ${videoItemId} not found`
      );
    }

    // Eliminar los permisos
    await this.prisma.videoPermissions.delete({
      where: { videoItemId },
    });

    //     console.log('>>> VideoPermissionsService.delete completed');
  }

  async findDrafts(userId?: string): Promise<VideoPermissions[]> {
    //     console.log('>>> VideoPermissionsService.findDrafts called with userId:', userId);

    const where: { isDraft: boolean; createdById?: string } = { isDraft: true };
    if (userId) {
      where.createdById = userId;
    }

    const drafts = await this.prisma.videoPermissions.findMany({
      where,
      include: {
        videoItem: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    //     console.log('>>> VideoPermissionsService.findDrafts result:', drafts.length, 'drafts found');
    return drafts;
  }

  async publishDraft(videoItemId: number): Promise<VideoPermissions> {
    //     console.log('>>> VideoPermissionsService.publishDraft called with:', videoItemId);

    // Verificar que existen permisos en borrador para este video
    const existingPermissions = await this.prisma.videoPermissions.findUnique({
      where: { videoItemId },
    });

    if (!existingPermissions) {
      throw new NotFoundException(
        `Permissions for video item ${videoItemId} not found`
      );
    }

    if (!existingPermissions.isDraft) {
      throw new ConflictException(
        `Permissions for video item ${videoItemId} are already published`
      );
    }

    // Publicar el borrador
    const permissions = await this.prisma.videoPermissions.update({
      where: { videoItemId },
      data: {
        isDraft: false,
        updatedAt: new Date(),
      },
      include: {
        videoItem: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    //     console.log('>>> VideoPermissionsService.publishDraft result:', permissions);
    return permissions;
  }
}
