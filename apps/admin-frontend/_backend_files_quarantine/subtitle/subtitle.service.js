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
exports.SubtitleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubtitleService = class SubtitleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    validateContentOrUrl(dto, isUpdate = false) {
        if (!dto.content && !dto.contentUrl) {
            throw new common_1.BadRequestException('Either content or contentUrl must be provided for a subtitle.');
        }
        if (dto.content && dto.contentUrl) {
            throw new common_1.BadRequestException('Cannot provide both content and contentUrl for a subtitle.');
        }
        // En caso de update, si ambos son undefined, significa que no se están actualizando.
        // Si uno se actualiza a null/undefined, el otro debe estar presente o quedarse como estaba.
        // Esta lógica es más compleja y podría requerir la carga del subtítulo existente
        // para verificar si al menos uno de los campos de contenido finaliza con un valor.
        // Por ahora, la validación simple de "al menos uno presente" es suficiente.
    }
    async create(createSubtitleDto) {
        this.validateContentOrUrl(createSubtitleDto);
        return this.prisma.subtitle.create({ data: createSubtitleDto });
    }
    async findAll(findAllDto) {
        if (!findAllDto.videoItemId) {
            throw new common_1.BadRequestException('videoItemId is required to find subtitles.');
        }
        return this.prisma.subtitle.findMany({
            where: {
                videoItemId: findAllDto.videoItemId,
                languageCode: findAllDto.languageCode,
                format: findAllDto.format,
                isActive: findAllDto.isActive,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        const subtitle = await this.prisma.subtitle.findUnique({ where: { id } });
        if (!subtitle) {
            throw new common_1.NotFoundException(`Subtitle with ID ${id} not found.`);
        }
        return subtitle;
    }
    async update(id, updateSubtitleDto) {
        const existingSubtitle = await this.prisma.subtitle.findUnique({ where: { id } });
        if (!existingSubtitle) {
            throw new common_1.NotFoundException(`Subtitle with ID ${id} not found.`);
        }
        const combinedDto = {
            content: updateSubtitleDto.content !== undefined ? updateSubtitleDto.content : existingSubtitle.content,
            contentUrl: updateSubtitleDto.contentUrl !== undefined ? updateSubtitleDto.contentUrl : existingSubtitle.contentUrl,
        };
        this.validateContentOrUrl(combinedDto, true);
        return this.prisma.subtitle.update({
            where: { id },
            data: updateSubtitleDto,
        });
    }
    async remove(id) {
        const existingSubtitle = await this.prisma.subtitle.findUnique({ where: { id } });
        if (!existingSubtitle) {
            throw new common_1.NotFoundException(`Subtitle with ID ${id} not found.`);
        }
        await this.prisma.subtitle.delete({ where: { id } });
    }
};
exports.SubtitleService = SubtitleService;
exports.SubtitleService = SubtitleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubtitleService);
