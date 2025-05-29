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
exports.PrismaService = void 0;
// src/prisma/prisma.service.ts
const common_1 = require("@nestjs/common");
const prisma_1 = require("../generated/prisma");
let PrismaService = class PrismaService extends prisma_1.PrismaClient {
    constructor() {
        super();
        console.log('>>> PrismaService Constructor Executed');
    }
    async onModuleInit() {
        console.log('>>> PrismaService onModuleInit - Connecting to database...');
        await this.$connect();
        console.log('>>> PrismaService onModuleInit - Database connection established');
    }
    async enableShutdownHooks(app) {
        // Note: beforeExit event is not available in the current Prisma version
        // This method is kept for compatibility but doesn't do anything
        // The connection will be closed when the app shuts down
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
