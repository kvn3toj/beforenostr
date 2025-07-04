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
exports.FindAllPlaylistsDto = exports.PlaylistOrderDirection = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var PlaylistOrderDirection;
(function (PlaylistOrderDirection) {
    PlaylistOrderDirection["ASC"] = "asc";
    PlaylistOrderDirection["DESC"] = "desc";
})(PlaylistOrderDirection || (exports.PlaylistOrderDirection = PlaylistOrderDirection = {}));
class FindAllPlaylistsDto {
    constructor() {
        this.isActive = true;
        this.orderBy = 'createdAt';
        this.orderDirection = PlaylistOrderDirection.DESC;
        this.includeItems = false;
        this.includeMundo = false;
        this.page = 1;
        this.limit = 10; // Renamed from pageSize to limit for consistency with service
    }
}
exports.FindAllPlaylistsDto = FindAllPlaylistsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID del mundo para filtrar las playlists',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FindAllPlaylistsDto.prototype, "mundoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Término de búsqueda para el nombre de la playlist',
        example: 'Introducción',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindAllPlaylistsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Término de búsqueda para la descripción de la playlist',
        example: 'Conceptos básicos',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindAllPlaylistsDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filtrar por estado activo/inactivo',
        example: true,
        default: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], FindAllPlaylistsDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo por el cual ordenar los resultados (ej. name, createdAt, orderInMundo)',
        example: 'createdAt',
        default: 'createdAt',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindAllPlaylistsDto.prototype, "orderBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dirección de ordenamiento',
        enum: PlaylistOrderDirection,
        example: PlaylistOrderDirection.DESC,
        default: PlaylistOrderDirection.DESC,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PlaylistOrderDirection),
    __metadata("design:type", String)
], FindAllPlaylistsDto.prototype, "orderDirection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Incluir los videoItems relacionados en la respuesta',
        example: false,
        default: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], FindAllPlaylistsDto.prototype, "includeItems", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Incluir el Mundo relacionado en la respuesta',
        example: false,
        default: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], FindAllPlaylistsDto.prototype, "includeMundo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número de página para la paginación (1-indexed)',
        example: 1,
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindAllPlaylistsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número de elementos por página',
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100, // Added a reasonable maximum
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100) // Added a reasonable maximum
    ,
    __metadata("design:type", Number)
], FindAllPlaylistsDto.prototype, "limit", void 0);
