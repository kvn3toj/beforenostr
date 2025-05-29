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
exports.TestAppModule = exports.TestModule = exports.TestService2 = exports.TestService1 = void 0;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
// Test Service 1
let TestService1 = class TestService1 {
    constructor() {
        console.log('[DEBUG] TestService1 constructor called');
    }
    getMessage() {
        return 'TestService1 is working';
    }
};
exports.TestService1 = TestService1;
exports.TestService1 = TestService1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TestService1);
// Test Service 2 that depends on TestService1
let TestService2 = class TestService2 {
    constructor(testService1) {
        this.testService1 = testService1;
        console.log('[DEBUG] TestService2 constructor called');
        console.log('[DEBUG] TestService2 - testService1:', this.testService1);
        if (this.testService1) {
            console.log('[DEBUG] TestService2 - testService1.getMessage():', this.testService1.getMessage());
        }
        else {
            console.error('[DEBUG] TestService2 - ERROR: testService1 is undefined!');
        }
    }
};
exports.TestService2 = TestService2;
exports.TestService2 = TestService2 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [TestService1])
], TestService2);
// Test Module
let TestModule = class TestModule {
};
exports.TestModule = TestModule;
exports.TestModule = TestModule = __decorate([
    (0, common_1.Module)({
        providers: [TestService1, TestService2],
        exports: [TestService1, TestService2],
    })
], TestModule);
// Test App Module
let TestAppModule = class TestAppModule {
};
exports.TestAppModule = TestAppModule;
exports.TestAppModule = TestAppModule = __decorate([
    (0, common_1.Module)({
        imports: [TestModule],
    })
], TestAppModule);
// Bootstrap function
async function testDI() {
    console.log('[DEBUG] Starting DI test...');
    console.log('[DEBUG] Node version:', process.version);
    console.log('[DEBUG] Working directory:', process.cwd());
    try {
        const app = await core_1.NestFactory.create(TestAppModule, {
            logger: ['log', 'error', 'warn', 'debug', 'verbose'],
        });
        console.log('[DEBUG] App created successfully');
        // Try to get the services directly
        const testService2 = app.get(TestService2);
        console.log('[DEBUG] Got TestService2:', testService2);
        await app.close();
        console.log('[DEBUG] Test completed successfully');
    }
    catch (error) {
        console.error('[DEBUG] Error during test:', error);
    }
}
testDI();
