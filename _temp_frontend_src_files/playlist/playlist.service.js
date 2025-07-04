"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_1 = require("../generated/prisma");
let PlaylistService = class PlaylistService {
    constructor(prisma) {
        this.prisma = prisma;
        console.log('>>> PlaylistService Constructor Executed');
        console.log('>>> PlaylistService Constructor - this.prisma:', this.prisma);
        if (this.prisma === undefined) {
            console.error('>>> PlaylistService Constructor - ERROR: PrismaService is undefined!');
        }
        else {
            console.log('>>> PlaylistService Constructor - PrismaService is defined.');
        }
    }
    async onModuleInit() {
        console.log('>>> PlaylistService onModuleInit - Starting...');
        console.log('>>> PlaylistService onModuleInit - this.prisma:', this.prisma);
        if (this.prisma === undefined) {
            console.error('>>> PlaylistService onModuleInit - ERROR: PrismaService is still undefined!');
            return;
        }
        console.log('PlaylistService initializing. Testing Prisma connection...');
        try {
            await this.prisma.$queryRaw(prisma_1.Prisma.sql `SELECT 1 as result`);
            console.log('PlaylistService: Prisma connection test successful.');
        }
        catch (error) {
            console.error('PlaylistService: Prisma connection test failed:', error);
        }
    }
    async testPrismaConnection() {
        console.log('PlaylistService.testPrismaConnection: Testing Prisma connection...');
        try {
            const result = await this.prisma.$queryRaw(prisma_1.Prisma.sql `SELECT 1 as result`);
            console.log('PlaylistService.testPrismaConnection: Prisma connection test successful. Result:', result);
            return true;
        }
        catch (error) {
            console.error('PlaylistService.testPrismaConnection: Prisma connection test failed:', error);
            return false;
        }
    }
    async create(createPlaylistDto) {
        try {
            // Verificar que el mundo existe
            const mundo = await this.prisma.mundo.findUnique({
                where: { id: createPlaylistDto.mundoId }
            });
            if (!mundo) {
                throw new common_1.NotFoundException(`Mundo with ID ${createPlaylistDto.mundoId} not found`);
            }
            // Crear la playlist
            const playlist = await this.prisma.playlist.create({
                data: {
                    mundoId: createPlaylistDto.mundoId,
                    name: createPlaylistDto.name,
                    description: createPlaylistDto.description,
                    imageUrl: createPlaylistDto.imageUrl,
                    orderInMundo: createPlaylistDto.orderInMundo || 0,
                    isActive: createPlaylistDto.isActive ?? true,
                },
                include: {
                    mundo: true,
                    videoItems: {
                        where: { isActive: true },
                        orderBy: { order: 'asc' }
                    }
                }
            });
            return playlist;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            // Si es un error de foreign key constraint, convertirlo a NotFoundException
            if (error.code === 'P2003') {
                throw new common_1.NotFoundException(`Mundo with ID ${createPlaylistDto.mundoId} not found`);
            }
            throw error;
        }
    }
    async findAll(findAllDto) {
        console.log('PlaylistService.findAll: Inicio');
        console.log('PlaylistService.findAll: Parámetros recibidos:', findAllDto);
        console.log('PlaylistService.findAll: Prisma client exists:', !!this.prisma);
        if (this.prisma === undefined) {
            console.error('PlaylistService.findAll: ERROR - PrismaService is undefined. Cannot proceed.');
            throw new Error('PrismaService is not available in PlaylistService');
        }
        const { page = 1, limit = 10, mundoId, name, description, isActive, orderBy = 'createdAt', orderDirection = 'desc', includeItems, includeMundo, } = findAllDto;
        const skip = (page - 1) * limit;
        const take = limit;
        const where = {};
        if (mundoId)
            where.mundoId = mundoId;
        if (name)
            where.name = { contains: name };
        if (description)
            where.description = { contains: description };
        if (isActive !== undefined)
            where.isActive = isActive;
        const include = {};
        if (includeItems) {
            include.videoItems = {
                where: { isActive: true },
                orderBy: { order: 'asc' },
            };
        }
        if (includeMundo) {
            include.mundo = true;
        }
        const orderByCondition = {};
        if (orderBy && orderDirection) {
            if (orderBy === 'mundoName') {
                orderByCondition.mundo = { name: orderDirection };
            }
            else {
                orderByCondition[orderBy] = orderDirection;
            }
        }
        try {
            console.log('PlaylistService.findAll: Querying database with:', { where, skip, take, include, orderBy: orderByCondition });
            const [playlists, count] = await this.prisma.$transaction([
                this.prisma.playlist.findMany({
                    where,
                    skip,
                    take,
                    include,
                    orderBy: orderByCondition,
                }),
                this.prisma.playlist.count({ where }),
            ]);
            console.log('PlaylistService.findAll: Playlists encontradas:', playlists.length);
            console.log('PlaylistService.findAll: Count total:', count);
            return { data: playlists, count };
        }
        catch (error) {
            console.error('PlaylistService.findAll: Error en consulta Prisma:', error);
            console.error('PlaylistService.findAll: Error stack:', error.stack);
            console.error('PlaylistService.findAll: Error code:', error.code);
            console.error('PlaylistService.findAll: Error message:', error.message);
            throw error; // Re-lanzar el error para que el controlador lo capture
        }
    }
    async findOne(id) {
        const playlist = await this.prisma.playlist.findUnique({
            where: { id },
            include: {
                mundo: true,
                videoItems: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                    include: {
                        subtitles: {
                            where: { isActive: true }
                        },
                        questions: {
                            where: { isActive: true },
                            include: {
                                answerOptions: {
                                    orderBy: { order: 'asc' }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!playlist) {
            throw new common_1.NotFoundException(`Playlist with ID ${id} not found`);
        }
        return playlist;
    }
    async update(id, updatePlaylistDto) {
        // Verificar que la playlist existe
        const existingPlaylist = await this.prisma.playlist.findUnique({
            where: { id }
        });
        if (!existingPlaylist) {
            throw new common_1.NotFoundException(`Playlist with ID ${id} not found`);
        }
        // Si se está actualizando el mundoId, verificar que el mundo existe
        if (updatePlaylistDto.mundoId && updatePlaylistDto.mundoId !== existingPlaylist.mundoId) {
            const mundo = await this.prisma.mundo.findUnique({
                where: { id: updatePlaylistDto.mundoId }
            });
            if (!mundo) {
                throw new common_1.NotFoundException(`Mundo with ID ${updatePlaylistDto.mundoId} not found`);
            }
        }
        try {
            const updatedPlaylist = await this.prisma.playlist.update({
                where: { id },
                data: {
                    ...updatePlaylistDto,
                    updatedAt: new Date()
                },
                include: {
                    mundo: true,
                    videoItems: {
                        where: { isActive: true },
                        orderBy: { order: 'asc' }
                    }
                }
            });
            return updatedPlaylist;
        }
        catch (error) {
            // Si es un error de foreign key constraint, convertirlo a NotFoundException
            if (error.code === 'P2003') {
                throw new common_1.NotFoundException(`Mundo with ID ${updatePlaylistDto.mundoId} not found`);
            }
            throw error;
        }
    }
    async remove(id) {
        // Verificar que la playlist existe
        const existingPlaylist = await this.prisma.playlist.findUnique({
            where: { id }
        });
        if (!existingPlaylist) {
            throw new common_1.NotFoundException(`Playlist with ID ${id} not found`);
        }
        // Implementar soft delete
        const deletedPlaylist = await this.prisma.playlist.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date()
            },
            include: {
                mundo: true,
                videoItems: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                }
            }
        });
        return deletedPlaylist;
    }
};
exports.PlaylistService = PlaylistService;
exports.PlaylistService = PlaylistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlaylistService);
