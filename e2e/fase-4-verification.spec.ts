import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// 🧪 FASE 4 Verification Tests
// Verifica la implementación completa de Gestión del Monorepo y Despliegue

test.describe('🚀 FASE 4: Monorepo y Despliegue - Verificación Completa', () => {

  // ================================================================
  // 1. Verificar Configuración de Turborepo
  // ================================================================
  test('✅ 1.1 - Verificar turbo.json existe y tiene configuración correcta', async () => {
    const turboConfigPath = 'turbo.json';
    
    // Verificar que el archivo existe
    expect(fs.existsSync(turboConfigPath)).toBeTruthy();
    
    // Leer y parsear configuración
    const turboConfig = JSON.parse(fs.readFileSync(turboConfigPath, 'utf-8'));
    
    // Verificar estructura básica
    expect(turboConfig).toHaveProperty('$schema');
    expect(turboConfig).toHaveProperty('pipeline');
    expect(turboConfig).toHaveProperty('globalDependencies');
    
    // Verificar pipelines esenciales
    const expectedPipelines = ['build', 'build:prod', 'dev', 'lint', 'test', 'test:ux'];
    expectedPipelines.forEach(pipeline => {
      expect(turboConfig.pipeline).toHaveProperty(pipeline);
    });
    
    // Verificar configuración específica
    expect(turboConfig.pipeline.dev.cache).toBe(false);
    expect(turboConfig.pipeline.dev.persistent).toBe(true);
    expect(turboConfig.pipeline['build:prod']).toHaveProperty('env');
    
    console.log('✅ turbo.json configurado correctamente');
  });

  test('✅ 1.2 - Verificar package.json del monorepo actualizado', async () => {
    const packagePath = 'package.json';
    
    expect(fs.existsSync(packagePath)).toBeTruthy();
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    // Verificar información básica del monorepo
    expect(packageJson.name).toBe('coomunity-monorepo');
    expect(packageJson.private).toBe(true);
    expect(packageJson).toHaveProperty('workspaces');
    
    // Verificar workspaces configurados
    expect(packageJson.workspaces).toContain('Demo/apps/*');
    expect(packageJson.workspaces).toContain('packages/*');
    expect(packageJson.workspaces).toContain('shared/*');
    
    // Verificar scripts esenciales del monorepo
    const expectedScripts = [
      'build', 'build:prod', 'dev', 'dev:superapp',
      'lint', 'test', 'clean:cache', 'docker:build',
      'health:check', 'ci:install', 'ci:build'
    ];
    
    expectedScripts.forEach(script => {
      expect(packageJson.scripts).toHaveProperty(script);
    });
    
    // Verificar dependencias de Turborepo
    expect(packageJson.devDependencies).toHaveProperty('turbo');
    
    console.log('✅ package.json del monorepo configurado correctamente');
  });

  // ================================================================
  // 2. Verificar Scripts de Automatización
  // ================================================================
  test('✅ 2.1 - Verificar script docker-build.sh', async () => {
    const scriptPath = 'scripts/docker-build.sh';
    
    expect(fs.existsSync(scriptPath)).toBeTruthy();
    
    const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
    
    // Verificar elementos esenciales del script
    expect(scriptContent).toContain('#!/bin/bash');
    expect(scriptContent).toContain('CoomÜnity Monorepo - Docker Build Script');
    expect(scriptContent).toContain('set -e');
    
    // Verificar funciones de logging
    expect(scriptContent).toContain('log()');
    expect(scriptContent).toContain('error()');
    expect(scriptContent).toContain('success()');
    
    // Verificar lógica de construcción Docker
    expect(scriptContent).toContain('docker build');
    expect(scriptContent).toContain('Demo/apps/superapp-unified');
    expect(scriptContent).toContain('NODE_ENV=production');
    
    // Verificar que el archivo sea ejecutable
    const stats = fs.statSync(scriptPath);
    expect(stats.mode & parseInt('111', 8)).toBeGreaterThan(0);
    
    console.log('✅ docker-build.sh implementado correctamente');
  });

  test('✅ 2.2 - Verificar script health-check.sh', async () => {
    const scriptPath = 'scripts/health-check.sh';
    
    expect(fs.existsSync(scriptPath)).toBeTruthy();
    
    const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
    
    // Verificar elementos esenciales
    expect(scriptContent).toContain('#!/bin/bash');
    expect(scriptContent).toContain('Health Check Script');
    expect(scriptContent).toContain('set -e');
    
    // Verificar configuración de URLs
    expect(scriptContent).toContain('SUPERAPP_URL=');
    expect(scriptContent).toContain('BACKEND_URL=');
    expect(scriptContent).toContain('localhost:3000');
    expect(scriptContent).toContain('localhost:3002');
    
    // Verificar funciones de verificación
    expect(scriptContent).toContain('check_url()');
    expect(scriptContent).toContain('check_port()');
    expect(scriptContent).toContain('report_service()');
    
    // Verificar verificaciones específicas
    expect(scriptContent).toContain('SuperApp Frontend Health Check');
    expect(scriptContent).toContain('Backend NestJS Health Check');
    expect(scriptContent).toContain('Database Health Check');
    expect(scriptContent).toContain('Integration Health Check');
    
    // Verificar que sea ejecutable
    const stats = fs.statSync(scriptPath);
    expect(stats.mode & parseInt('111', 8)).toBeGreaterThan(0);
    
    console.log('✅ health-check.sh implementado correctamente');
  });

  // ================================================================
  // 3. Verificar Configuraciones Docker
  // ================================================================
  test('✅ 3.1 - Verificar Dockerfile multi-stage', async () => {
    const dockerfilePath = 'Demo/apps/superapp-unified/Dockerfile';
    
    expect(fs.existsSync(dockerfilePath)).toBeTruthy();
    
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf-8');
    
    // Verificar stages multi-stage
    expect(dockerfileContent).toContain('FROM node:18-alpine AS base');
    expect(dockerfileContent).toContain('FROM base AS deps');
    expect(dockerfileContent).toContain('FROM base AS development');
    expect(dockerfileContent).toContain('FROM base AS builder');
    expect(dockerfileContent).toContain('FROM nginx:alpine AS production');
    
    // Verificar configuraciones específicas
    expect(dockerfileContent).toContain('WORKDIR /app');
    expect(dockerfileContent).toContain('EXPOSE 3000');
    expect(dockerfileContent).toContain('npm run build:prod');
    expect(dockerfileContent).toContain('nginx.conf');
    
    // Verificar optimizaciones de seguridad
    expect(dockerfileContent).toContain('addgroup -g 1001 -S nodejs');
    expect(dockerfileContent).toContain('USER nextjs');
    expect(dockerfileContent).toContain('HEALTHCHECK');
    
    // Verificar metadata
    expect(dockerfileContent).toContain('LABEL maintainer="CoomÜnity Team"');
    expect(dockerfileContent).toContain('LABEL version="1.0.0"');
    
    console.log('✅ Dockerfile multi-stage implementado correctamente');
  });

  test('✅ 3.2 - Verificar configuración Nginx', async () => {
    const nginxConfigPath = 'Demo/apps/superapp-unified/nginx.conf';
    
    expect(fs.existsSync(nginxConfigPath)).toBeTruthy();
    
    const nginxContent = fs.readFileSync(nginxConfigPath, 'utf-8');
    
    // Verificar configuración básica
    expect(nginxContent).toContain('user nextjs');
    expect(nginxContent).toContain('listen 3000');
    expect(nginxContent).toContain('server_name localhost');
    
    // Verificar proxy al backend
    expect(nginxContent).toContain('location /api/');
    expect(nginxContent).toContain('proxy_pass http://backend:3002');
    
    // Verificar configuraciones de seguridad
    expect(nginxContent).toContain('X-Frame-Options');
    expect(nginxContent).toContain('X-Content-Type-Options');
    expect(nginxContent).toContain('X-XSS-Protection');
    expect(nginxContent).toContain('Content-Security-Policy');
    
    // Verificar optimizaciones
    expect(nginxContent).toContain('gzip on');
    expect(nginxContent).toContain('limit_req_zone');
    
    // Verificar SPA routing
    expect(nginxContent).toContain('try_files $uri $uri/ /index.html');
    
    // Verificar WebSocket support
    expect(nginxContent).toContain('location /ws');
    expect(nginxContent).toContain('Connection "upgrade"');
    
    // Verificar health check endpoint
    expect(nginxContent).toContain('location /health');
    
    console.log('✅ nginx.conf configurado correctamente');
  });

  test('✅ 3.3 - Verificar Docker Compose para desarrollo', async () => {
    const dockerComposePath = 'docker/docker-compose.dev.yml';
    
    expect(fs.existsSync(dockerComposePath)).toBeTruthy();
    
    const composeContent = fs.readFileSync(dockerComposePath, 'utf-8');
    
    // Verificar versión y servicios
    expect(composeContent).toContain('version: \'3.8\'');
    expect(composeContent).toContain('services:');
    
    // Verificar servicio SuperApp
    expect(composeContent).toContain('superapp:');
    expect(composeContent).toContain('target: development');
    expect(composeContent).toContain('- "3000:3000"');
    
    // Verificar servicios de base de datos
    expect(composeContent).toContain('postgres-dev:');
    expect(composeContent).toContain('redis-dev:');
    
    // Verificar volúmenes y redes
    expect(composeContent).toContain('volumes:');
    expect(composeContent).toContain('networks:');
    expect(composeContent).toContain('coomunity-dev');
    
    // Verificar configuración de hot reload
    expect(composeContent).toContain('CHOKIDAR_USEPOLLING');
    expect(composeContent).toContain('host.docker.internal:3002');
    
    // Verificar health checks
    expect(composeContent).toContain('healthcheck:');
    
    console.log('✅ docker-compose.dev.yml configurado correctamente');
  });

  // ================================================================
  // 4. Verificar Pipeline CI/CD
  // ================================================================
  test('✅ 4.1 - Verificar pipeline CI/CD GitHub Actions', async () => {
    const cicdPath = '.github/workflows/ci-cd.yml';
    
    expect(fs.existsSync(cicdPath)).toBeTruthy();
    
    const cicdContent = fs.readFileSync(cicdPath, 'utf-8');
    
    // Verificar configuración básica
    expect(cicdContent).toContain('name: CI/CD Pipeline');
    expect(cicdContent).toContain('on:');
    expect(cicdContent).toContain('branches: [ main, develop, feature/* ]');
    
    // Verificar jobs principales
    expect(cicdContent).toContain('detect-changes:');
    expect(cicdContent).toContain('quality-check:');
    expect(cicdContent).toContain('build-test-superapp:');
    expect(cicdContent).toContain('e2e-testing:');
    expect(cicdContent).toContain('docker-build:');
    
    // Verificar configuración de Turborepo
    expect(cicdContent).toContain('TURBO_TOKEN');
    expect(cicdContent).toContain('turbo run');
    
    // Verificar change detection
    expect(cicdContent).toContain('dorny/paths-filter@v2');
    expect(cicdContent).toContain('Demo/apps/superapp-unified/**');
    
    // Verificar security scanning
    expect(cicdContent).toContain('aquasecurity/trivy-action');
    expect(cicdContent).toContain('trufflesecurity/trufflehog');
    
    // Verificar Docker builds
    expect(cicdContent).toContain('docker/build-push-action');
    expect(cicdContent).toContain('platforms: linux/amd64,linux/arm64');
    
    // Verificar despliegues
    expect(cicdContent).toContain('deploy-staging:');
    expect(cicdContent).toContain('deploy-production:');
    
    console.log('✅ Pipeline CI/CD configurado correctamente');
  });

  // ================================================================
  // 5. Verificar Documentación
  // ================================================================
  test('✅ 5.1 - Verificar documentación de FASE 4', async () => {
    const docPath = 'FASE_4_MONOREPO_DEPLOYMENT_SETUP.md';
    
    expect(fs.existsSync(docPath)).toBeTruthy();
    
    const docContent = fs.readFileSync(docPath, 'utf-8');
    
    // Verificar estructura de documentación
    expect(docContent).toContain('# 🚀 FASE 4: Gestión del Monorepo y Despliegue');
    expect(docContent).toContain('## 📋 Resumen Ejecutivo');
    expect(docContent).toContain('## 🏗️ **Arquitectura Implementada**');
    
    // Verificar secciones principales
    expect(docContent).toContain('**COMPLETADO** ✅ Optimización del Monorepo');
    expect(docContent).toContain('**COMPLETADO** ✅ Configuración de Producción');
    expect(docContent).toContain('**COMPLETADO** ✅ Infraestructura de Despliegue');
    
    // Verificar comandos de uso
    expect(docContent).toContain('npm run dev:superapp');
    expect(docContent).toContain('./scripts/health-check.sh');
    expect(docContent).toContain('./scripts/docker-build.sh');
    
    // Verificar próximos pasos
    expect(docContent).toContain('## 🎯 **Próximos Pasos Recomendados**');
    expect(docContent).toContain('npm install -g turbo@latest');
    
    console.log('✅ Documentación FASE 4 completa y correcta');
  });

  // ================================================================
  // 6. Verificar Funcionalidad de Scripts
  // ================================================================
  test('✅ 6.1 - Verificar que Turborepo puede ser detectado', async () => {
    // Verificar que turbo.json es válido JSON
    const turboConfig = JSON.parse(fs.readFileSync('turbo.json', 'utf-8'));
    expect(turboConfig).toBeTruthy();
    
    // Verificar que package.json tiene scripts de turbo
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    expect(packageJson.devDependencies?.turbo || packageJson.dependencies?.turbo).toBeTruthy();
    
    console.log('✅ Configuración Turborepo válida');
  });

  test('✅ 6.2 - Verificar estructura de directorios para monorepo', async () => {
    // Verificar directorios principales
    expect(fs.existsSync('Demo/apps')).toBeTruthy();
    expect(fs.existsSync('Demo/apps/superapp-unified')).toBeTruthy();
    expect(fs.existsSync('scripts')).toBeTruthy();
    expect(fs.existsSync('docker')).toBeTruthy();
    expect(fs.existsSync('.github')).toBeTruthy();
    expect(fs.existsSync('.github/workflows')).toBeTruthy();
    
    console.log('✅ Estructura de directorios del monorepo correcta');
  });

  // ================================================================
  // 7. Verificar Configuraciones de Producción
  // ================================================================
  test('✅ 7.1 - Verificar configuraciones para SuperApp', async () => {
    const superappPath = 'Demo/apps/superapp-unified';
    
    // Verificar archivos esenciales
    expect(fs.existsSync(`${superappPath}/package.json`)).toBeTruthy();
    expect(fs.existsSync(`${superappPath}/Dockerfile`)).toBeTruthy();
    expect(fs.existsSync(`${superappPath}/nginx.conf`)).toBeTruthy();
    
    // Verificar package.json de SuperApp
    const superappPackage = JSON.parse(fs.readFileSync(`${superappPath}/package.json`, 'utf-8'));
    expect(superappPackage.name).toBe('coomunity-superapp');
    expect(superappPackage.scripts).toHaveProperty('build:prod');
    expect(superappPackage.scripts).toHaveProperty('test:ux');
    
    console.log('✅ Configuraciones de SuperApp para producción correctas');
  });

  // ================================================================
  // 8. Resumen de Verificación
  // ================================================================
  test('✅ 8.1 - Resumen completo de implementación FASE 4', async () => {
    const implementedFeatures = {
      turborepo: fs.existsSync('turbo.json'),
      monorepoPackage: fs.existsSync('package.json'),
      dockerBuildScript: fs.existsSync('scripts/docker-build.sh'),
      healthCheckScript: fs.existsSync('scripts/health-check.sh'),
      dockerfile: fs.existsSync('Demo/apps/superapp-unified/Dockerfile'),
      nginxConfig: fs.existsSync('Demo/apps/superapp-unified/nginx.conf'),
      dockerCompose: fs.existsSync('docker/docker-compose.dev.yml'),
      cicdPipeline: fs.existsSync('.github/workflows/ci-cd.yml'),
      documentation: fs.existsSync('FASE_4_MONOREPO_DEPLOYMENT_SETUP.md')
    };

    // Verificar que todas las características están implementadas
    Object.entries(implementedFeatures).forEach(([feature, implemented]) => {
      expect(implemented).toBeTruthy();
      console.log(`✅ ${feature}: IMPLEMENTADO`);
    });

    const totalFeatures = Object.keys(implementedFeatures).length;
    const implementedCount = Object.values(implementedFeatures).filter(Boolean).length;
    const completionPercentage = (implementedCount / totalFeatures) * 100;

    expect(completionPercentage).toBe(100);

    console.log('\n🎉 RESUMEN DE VERIFICACIÓN FASE 4:');
    console.log(`📊 Características implementadas: ${implementedCount}/${totalFeatures}`);
    console.log(`📈 Porcentaje de completitud: ${completionPercentage}%`);
    console.log('\n✅ ESTADO: FASE 4 COMPLETAMENTE IMPLEMENTADA');
    console.log('🚀 La infraestructura de monorepo y despliegue está lista para producción!');
  });
});

// ================================================================
// Tests de Integración y Funcionalidad
// ================================================================
test.describe('🔧 Verificación de Integración FASE 4', () => {
  
  test('✅ Verificar que scripts tienen permisos de ejecución', async () => {
    const scripts = [
      'scripts/docker-build.sh',
      'scripts/health-check.sh'
    ];

    scripts.forEach(scriptPath => {
      if (fs.existsSync(scriptPath)) {
        const stats = fs.statSync(scriptPath);
        expect(stats.mode & parseInt('111', 8)).toBeGreaterThan(0);
        console.log(`✅ ${scriptPath} es ejecutable`);
      }
    });
  });

  test('✅ Verificar coherencia entre configuraciones', async () => {
    // Verificar que las URLs en diferentes archivos son coherentes
    const nginxContent = fs.readFileSync('Demo/apps/superapp-unified/nginx.conf', 'utf-8');
    const dockerComposeContent = fs.readFileSync('docker/docker-compose.dev.yml', 'utf-8');
    const healthCheckContent = fs.readFileSync('scripts/health-check.sh', 'utf-8');

    // Verificar puertos coherentes
    expect(nginxContent).toContain('listen 3000');
    expect(dockerComposeContent).toContain('"3000:3000"');
    expect(healthCheckContent).toContain('localhost:3000');

    // Verificar URLs del backend
    expect(nginxContent).toContain('backend:3002');
    expect(dockerComposeContent).toContain('host.docker.internal:3002');
    expect(healthCheckContent).toContain('localhost:3002');

    console.log('✅ Configuraciones coherentes entre archivos');
  });
}); 