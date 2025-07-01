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
exports.SubtitleController = void 0;
const common_1 = require("@nestjs/common");
const subtitle_service_1 = require("./subtitle.service");
const create_subtitle_dto_1 = require("./dto/create-subtitle.dto");
const update_subtitle_dto_1 = require("./dto/update-subtitle.dto");
const find_all_subtitles_dto_1 = require("./dto/find-all-subtitles.dto");
let SubtitleController = class SubtitleController {
    constructor(subtitleService) {
        this.subtitleService = subtitleService;
    }
    async create(createSubtitleDto) {
        return this.subtitleService.create(createSubtitleDto);
    }
    async findAll(findAllDto) {
        return this.subtitleService.findAll(findAllDto);
    }
    async findOne(id) {
        return this.subtitleService.findOne(id);
    }
    async update(id, updateSubtitleDto) {
        return this.subtitleService.update(id, updateSubtitleDto);
    }
    async remove(id) {
        await this.subtitleService.remove(id);
    }
};
exports.SubtitleController = SubtitleController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subtitle_dto_1.CreateSubtitleDto]),
    __metadata("design:returntype", Promise)
], SubtitleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_subtitles_dto_1.FindAllSubtitlesDto]),
    __metadata("design:returntype", Promise)
], SubtitleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubtitleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_subtitle_dto_1.UpdateSubtitleDto]),
    __metadata("design:returntype", Promise)
], SubtitleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubtitleController.prototype, "remove", null);
exports.SubtitleController = SubtitleController = __decorate([
    (0, common_1.Controller)('subtitles'),
    __metadata("design:paramtypes", [subtitle_service_1.SubtitleService])
], SubtitleController);
