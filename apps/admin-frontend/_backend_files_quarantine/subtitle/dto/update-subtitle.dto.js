"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubtitleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_subtitle_dto_1 = require("./create-subtitle.dto");
class UpdateSubtitleDto extends (0, mapped_types_1.PartialType)(create_subtitle_dto_1.CreateSubtitleDto) {
}
exports.UpdateSubtitleDto = UpdateSubtitleDto;
