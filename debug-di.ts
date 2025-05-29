import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Injectable } from '@nestjs/common';

// Test Service 1
@Injectable()
export class TestService1 {
  constructor() {
    console.log('[DEBUG] TestService1 constructor called');
  }
  
  getMessage(): string {
    return 'TestService1 is working';
  }
}

// Test Service 2 that depends on TestService1
@Injectable()
export class TestService2 {
  constructor(private readonly testService1: TestService1) {
    console.log('[DEBUG] TestService2 constructor called');
    console.log('[DEBUG] TestService2 - testService1:', this.testService1);
    
    if (this.testService1) {
      console.log('[DEBUG] TestService2 - testService1.getMessage():', this.testService1.getMessage());
    } else {
      console.error('[DEBUG] TestService2 - ERROR: testService1 is undefined!');
    }
  }
}

// Test Module
@Module({
  providers: [TestService1, TestService2],
  exports: [TestService1, TestService2],
})
export class TestModule {}

// Test App Module
@Module({
  imports: [TestModule],
})
export class TestAppModule {}

// Bootstrap function
async function testDI() {
  console.log('[DEBUG] Starting DI test...');
  console.log('[DEBUG] Node version:', process.version);
  console.log('[DEBUG] Working directory:', process.cwd());
  
  try {
    const app = await NestFactory.create(TestAppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    
    console.log('[DEBUG] App created successfully');
    
    // Try to get the services directly
    const testService2 = app.get(TestService2);
    console.log('[DEBUG] Got TestService2:', testService2);
    
    await app.close();
    console.log('[DEBUG] Test completed successfully');
  } catch (error) {
    console.error('[DEBUG] Error during test:', error);
  }
}

testDI(); 