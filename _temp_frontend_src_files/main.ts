import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('>>> Bootstrap: Starting application...');
  console.log('>>> Bootstrap: Creating NestFactory...');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  console.log('>>> Bootstrap: NestFactory created successfully');

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3333', 'http://localhost:2222', 'http://localhost:1111', 'http://localhost:3003', 'http://localhost:5173'], // Frontend ports: React dev, custom port, Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Importante para transformar query params a tipos DTO
      whitelist: true, // Opcional: remueve propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Opcional: lanza error si hay propiedades extra
    }),
  );

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Gamifier API')
    .setDescription('API for the Gamifier educational platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server on port 3002 to match user's configuration and avoid conflicts
  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  console.log(`🚀 Gamifier API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap(); 