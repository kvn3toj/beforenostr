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
exports.CreatePlaylistDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreatePlaylistDto {
    constructor() {
        this.orderInMundo = 0;
        this.isActive = true;
    }
}
exports.CreatePlaylistDto = CreatePlaylistDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del mundo al que pertenece la playlist',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePlaylistDto.prototype, "mundoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la playlist',
        example: 'Introducción a TypeScript',
        maxLength: 255
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreatePlaylistDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción de la playlist',
        example: 'Una serie de videos introductorios sobre TypeScript para principiantes',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlaylistDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen o thumbnail de la playlist',
        example: 'https://example.com/images/typescript-intro.jpg',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlaylistDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Orden de la playlist dentro del mundo',
        example: 1,
        minimum: 0,
        default: 0,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], CreatePlaylistDto.prototype, "orderInMundo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado activo/inactivo de la playlist',
        example: true,
        default: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return Boolean(value);
    }),
    __metadata("design:type", Boolean)
], CreatePlaylistDto.prototype, "isActive", void 0);
