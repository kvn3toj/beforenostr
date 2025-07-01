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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const playlist_service_1 = require("./playlist.service");
const create_playlist_dto_1 = require("./dto/create-playlist.dto");
const update_playlist_dto_1 = require("./dto/update-playlist.dto");
const find_all_playlists_dto_1 = require("./dto/find-all-playlists.dto");
let PlaylistController = class PlaylistController {
    constructor(playlistService) {
        this.playlistService = playlistService;
    }
    create(createPlaylistDto) {
        return this.playlistService.create(createPlaylistDto);
    }
    test() {
        console.log('>>> PlaylistController.test: Endpoint de prueba ejecutado');
        return { message: 'Test endpoint working', timestamp: new Date().toISOString() };
    }
    // TODO: Implementar autenticación si se requiere
    // @UseGuards(AuthGuard('jwt'))
    // @ApiBearerAuth()
    // @UsePipes(new ValidationPipe({ transform: true })) // Comentado temporalmente para depuración
    async findAll(findAllDto) {
        console.log('>>> PlaylistController.findAll: Inicio');
        console.log('>>> PlaylistController.findAll: findAllDto:', findAllDto);
        try {
            const result = await this.playlistService.findAll(findAllDto);
            console.log('>>> PlaylistController.findAll: Resultado obtenido:', result);
            return result;
        }
        catch (error) {
            console.error('>>> PlaylistController.findAll: Error:', error);
            throw error;
        }
    }
    // TODO: Implementar autenticación si se requiere
    // @UseGuards(AuthGuard('jwt'))
    // @ApiBearerAuth()
    findOne(id) {
        return this.playlistService.findOne(id);
    }
    update(id, updatePlaylistDto) {
        return this.playlistService.update(id, updatePlaylistDto);
    }
    // TODO: Implementar autenticación y autorización
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles('admin')
    // @ApiBearerAuth()
    remove(id) {
        return this.playlistService.remove(id);
    }
};
exports.PlaylistController = PlaylistController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear una nueva playlist',
        description: 'Crea una nueva playlist dentro de un mundo específico'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Playlist creada exitosamente',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                mundoId: '123e4567-e89b-12d3-a456-426614174001',
                name: 'Introducción a TypeScript',
                description: 'Una serie de videos introductorios',
                imageUrl: 'https://example.com/image.jpg',
                orderInMundo: 1,
                isActive: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                mundo: {
                    id: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Mundo de Programación'
                },
                videoItems: []
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Mundo no encontrado'
    })
    // TODO: Implementar autenticación y autorización
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles('admin')
    // @ApiBearerAuth()
    ,
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_playlist_dto_1.CreatePlaylistDto]),
    __metadata("design:returntype", void 0)
], PlaylistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Test endpoint',
        description: 'Endpoint de prueba simple'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Test exitoso'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlaylistController.prototype, "test", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar playlists',
        description: 'Obtiene una lista de playlists con filtros opcionales'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'mundoId',
        required: false,
        description: 'ID del mundo para filtrar playlists',
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        description: 'Filtrar por estado activo/inactivo',
        example: true,
        type: Boolean
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Número de página para la paginación',
        example: 0,
        type: Number
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: false,
        description: 'Número de elementos por página',
        example: 10,
        type: Number
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Lista de playlists obtenida exitosamente',
        schema: {
            type: 'array',
            items: {
                example: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    mundoId: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Introducción a TypeScript',
                    description: 'Una serie de videos introductorios',
                    imageUrl: 'https://example.com/image.jpg',
                    orderInMundo: 1,
                    isActive: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    mundo: {
                        id: '123e4567-e89b-12d3-a456-426614174001',
                        name: 'Mundo de Programación'
                    },
                    videoItems: []
                }
            }
        }
    })
    // TODO: Implementar autenticación si se requiere
    // @UseGuards(AuthGuard('jwt'))
    // @ApiBearerAuth()
    // @UsePipes(new ValidationPipe({ transform: true })) // Comentado temporalmente para depuración
    ,
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_playlists_dto_1.FindAllPlaylistsDto]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener playlist por ID',
        description: 'Obtiene una playlist específica con todos sus detalles y videos'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID único de la playlist',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Playlist encontrada exitosamente',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                mundoId: '123e4567-e89b-12d3-a456-426614174001',
                name: 'Introducción a TypeScript',
                description: 'Una serie de videos introductorios',
                imageUrl: 'https://example.com/image.jpg',
                orderInMundo: 1,
                isActive: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                mundo: {
                    id: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Mundo de Programación'
                },
                videoItems: [
                    {
                        id: '123e4567-e89b-12d3-a456-426614174002',
                        title: 'Variables y Tipos',
                        description: 'Introducción a variables en TypeScript',
                        order: 1,
                        subtitles: [],
                        questions: []
                    }
                ]
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Playlist no encontrada'
    })
    // TODO: Implementar autenticación si se requiere
    // @UseGuards(AuthGuard('jwt'))
    // @ApiBearerAuth()
    ,
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlaylistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar playlist',
        description: 'Actualiza una playlist existente'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID único de la playlist a actualizar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Playlist actualizada exitosamente'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Playlist no encontrada'
    })
    // TODO: Implementar autenticación y autorización
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles('admin')
    // @ApiBearerAuth()
    ,
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_playlist_dto_1.UpdatePlaylistDto]),
    __metadata("design:returntype", void 0)
], PlaylistController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Eliminar playlist (soft delete)',
        description: 'Marca una playlist como inactiva (eliminación suave)'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID único de la playlist a eliminar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Playlist eliminada exitosamente'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Playlist no encontrada'
    })
    // TODO: Implementar autenticación y autorización
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles('admin')
    // @ApiBearerAuth()
    ,
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlaylistController.prototype, "remove", null);
exports.PlaylistController = PlaylistController = __decorate([
    (0, swagger_1.ApiTags)('playlists'),
    (0, common_1.Controller)('playlists'),
    __metadata("design:paramtypes", [playlist_service_1.PlaylistService])
], PlaylistController);
