"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS for frontend communication
    app.enableCors({
        origin: ['http://localhost:3333', 'http://localhost:5173'], // Vite dev server ports
        credentials: true,
    });
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true, // Importante para transformar query params a tipos DTO
        whitelist: true, // Opcional: remueve propiedades no definidas en DTO
        forbidNonWhitelisted: true, // Opcional: lanza error si hay propiedades extra
    }));
    // Swagger documentation setup
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Gamifier API')
        .setDescription('API for the Gamifier educational platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    // Start server on port 3001 to avoid conflict with frontend
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Gamifier API is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();
