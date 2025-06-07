const { exec } = require('child_process');
const fs = require('fs');
const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');

console.log('🧪 Test aislado de Swagger...\n');

// Crear un archivo main.ts temporal solo para probar Swagger
const testMainContent = `
import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger';

async function bootstrap() {
  console.log('>>> Test Bootstrap: Starting application...');
  
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const loggerService = app.get(LoggerService);
  app.useLogger(loggerService);
  
  loggerService.log('Test application starting...', 'TestBootstrap');

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Test Swagger setup with detailed error handling
  console.log('>>> Testing Swagger setup...');
  
  try {
    const config = new DocumentBuilder()
      .setTitle('Gamifier API Test')
      .setDescription('Test API for identifying circular dependency')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    console.log('>>> DocumentBuilder created successfully');
    
    const document = SwaggerModule.createDocument(app, config);
    console.log('>>> SwaggerModule.createDocument completed successfully');
    
    SwaggerModule.setup('api', app, document);
    console.log('>>> SwaggerModule.setup completed successfully');
    
    loggerService.log('✅ Swagger test completed successfully', 'TestBootstrap');
    
  } catch (error) {
    console.error('❌ Swagger test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    loggerService.error('❌ Swagger test failed:', error, 'TestBootstrap');
  }

  const port = 3003; // Use different port for testing
  await app.listen(port);
  
  loggerService.log(\`🚀 Test API running on: http://localhost:\${port}\`, 'TestBootstrap');
  
  // Auto-shutdown after 10 seconds
  setTimeout(() => {
    console.log('>>> Auto-shutdown test server...');
    process.exit(0);
  }, 10000);
}

bootstrap().catch(error => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
`;

// Escribir el archivo temporal
fs.writeFileSync('src/test-main.ts', testMainContent);

console.log('📝 Archivo test-main.ts creado');
console.log('🚀 Ejecutando test de Swagger...\n');

// Ejecutar el test
const testProcess = exec('npx tsx --tsconfig tsconfig.backend.json src/test-main.ts', (error, stdout, stderr) => {
  console.log('\n📊 RESULTADO DEL TEST:');
  
  if (stdout) {
    console.log('STDOUT:');
    console.log(stdout);
  }
  
  if (stderr) {
    console.log('STDERR:');
    console.log(stderr);
  }
  
  if (error) {
    console.log('ERROR:');
    console.log(error);
  }
  
  // Limpiar archivo temporal
  try {
    fs.unlinkSync('src/test-main.ts');
    console.log('\n🧹 Archivo temporal eliminado');
  } catch (e) {
    console.log('\n⚠️  No se pudo eliminar archivo temporal:', e.message);
  }
});

// Timeout de seguridad
setTimeout(() => {
  testProcess.kill();
  console.log('\n⏰ Test terminado por timeout');
  
  // Limpiar archivo temporal
  try {
    fs.unlinkSync('src/test-main.ts');
    console.log('🧹 Archivo temporal eliminado');
  } catch (e) {
    console.log('⚠️  No se pudo eliminar archivo temporal:', e.message);
  }
}, 15000);

async function testSwagger() {
  console.log('🔍 Testing Swagger setup in isolation...\n');
  
  try {
    // Import the AppModule
    const { AppModule } = require('./src/app.module');
    
    console.log('1. Creating NestJS app...');
    const app = await NestFactory.create(AppModule, {
      logger: false,
    });
    
    console.log('2. Setting up Swagger configuration...');
    const config = new DocumentBuilder()
      .setTitle('Gamifier API')
      .setDescription('API for the Gamifier educational platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    console.log('3. Creating Swagger document...');
    const document = SwaggerModule.createDocument(app, config);
    
    console.log('4. Setting up Swagger UI...');
    SwaggerModule.setup('api', app, document);
    
    console.log('✅ Swagger setup completed successfully!');
    
    await app.close();
    
  } catch (error) {
    console.error('❌ Swagger setup failed:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testSwagger().catch(console.error); 