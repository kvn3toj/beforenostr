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
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:5173',
      // 🌐 NETWORK ACCESS - Permitir acceso desde cualquier IP de red local
      'http://192.168.1.37:3001',
      /^http:\/\/192\.168\.1\.\d+:3001$/,  // Cualquier IP 192.168.1.x:3001
      /^http:\/\/10\.\d+\.\d+\.\d+:3001$/, // Redes 10.x.x.x:3001
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:3001$/ // Redes 172.16-31.x.x:3001
    ],
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
  await app.listen(port, '0.0.0.0'); // 🌐 ESCUCHAR EN TODAS LAS INTERFACES DE RED

  console.log(`🚀 Gamifier API is running on: http://localhost:${port}`);
  console.log(`🌐 Network access: http://192.168.1.37:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();
