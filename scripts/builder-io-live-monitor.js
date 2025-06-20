#!/usr/bin/env node

/**
 * 🏗️ BUILDER.IO LIVE MONITOR - COOMUNITY SUPERAPP
 * Monitor avanzado en tiempo real para cambios generados por Builder.io
 * 
 * Detecta automáticamente:
 * - Dependencias faltantes
 * - Importaciones incorrectas de Material UI
 * - Componentes incompletos
 * - Errores de TypeScript
 * - Problemas de compilación
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const chokidar = require('chokidar');

// Configuración
const CONFIG = {
  SUPERAPP_DIR: 'Demo/apps/superapp-unified',
  WATCH_PATTERNS: [
    'src/components/**/*.{ts,tsx,js,jsx}',
    'src/pages/**/*.{ts,tsx,js,jsx}',
    'src/lib/**/*.{ts,tsx,js,jsx}',
    'src/hooks/**/*.{ts,tsx,js,jsx}',
    'src/types/**/*.{ts,tsx}',
    'package.json'
  ],
  IGNORE_PATTERNS: [
    'node_modules/**',
    'dist/**',
    '.vite/**',
    'coverage/**'
  ],
  LOGS_DIR: 'logs',
  BUILDER_PORT: 3001,
  BACKEND_PORT: 3002
};

// Colores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Crear logger
const createLogger = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(CONFIG.LOGS_DIR, `builder-monitor-${timestamp}.log`);
  
  // Crear directorio de logs si no existe
  if (!fs.existsSync(CONFIG.LOGS_DIR)) {
    fs.mkdirSync(CONFIG.LOGS_DIR, { recursive: true });
  }
  
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  
  return {
    log: (message, color = 'reset') => {
      const timestamp = new Date().toISOString();
      const coloredMessage = `${colors[color]}${message}${colors.reset}`;
      const plainMessage = `[${timestamp}] ${message}`;
      
      console.log(coloredMessage);
      logStream.write(plainMessage + '\n');
    },
    error: (message) => {
      const timestamp = new Date().toISOString();
      const coloredMessage = `${colors.red}❌ ${message}${colors.reset}`;
      const plainMessage = `[${timestamp}] ERROR: ${message}`;
      
      console.error(coloredMessage);
      logStream.write(plainMessage + '\n');
    },
    success: (message) => {
      const timestamp = new Date().toISOString();
      const coloredMessage = `${colors.green}✅ ${message}${colors.reset}`;
      const plainMessage = `[${timestamp}] SUCCESS: ${message}`;
      
      console.log(coloredMessage);
      logStream.write(plainMessage + '\n');
    },
    warn: (message) => {
      const timestamp = new Date().toISOString();
      const coloredMessage = `${colors.yellow}⚠️ ${message}${colors.reset}`;
      const plainMessage = `[${timestamp}] WARNING: ${message}`;
      
      console.log(coloredMessage);
      logStream.write(plainMessage + '\n');
    },
    info: (message) => {
      const timestamp = new Date().toISOString();
      const coloredMessage = `${colors.cyan}ℹ️ ${message}${colors.reset}`;
      const plainMessage = `[${timestamp}] INFO: ${message}`;
      
      console.log(coloredMessage);
      logStream.write(plainMessage + '\n');
    },
    close: () => logStream.end()
  };
};

// Analizador de dependencias
class DependencyAnalyzer {
  constructor(logger) {
    this.logger = logger;
    this.packageJsonPath = path.join(CONFIG.SUPERAPP_DIR, 'package.json');
    this.installedDeps = new Set();
    this.loadInstalledDependencies();
  }

  loadInstalledDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      this.installedDeps = new Set(Object.keys(allDeps));
    } catch (error) {
      this.logger.error(`Error cargando package.json: ${error.message}`);
    }
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const analysis = {
        file: filePath,
        imports: this.extractImports(content),
        missingDeps: [],
        incorrectImports: [],
        builderComponents: this.detectBuilderComponents(content),
        hasTypeErrors: this.detectTypeIssues(content)
      };

      // Verificar dependencias faltantes
      analysis.missingDeps = this.findMissingDependencies(analysis.imports);
      
      // Verificar importaciones incorrectas
      analysis.incorrectImports = this.findIncorrectImports(analysis.imports);

      return analysis;
    } catch (error) {
      this.logger.error(`Error analizando ${filePath}: ${error.message}`);
      return null;
    }
  }

  extractImports(content) {
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"];?/g;
    const imports = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        statement: match[0],
        package: match[1]
      });
    }

    return imports;
  }

  findMissingDependencies(imports) {
    const missing = [];
    const commonDeps = {
      'framer-motion': 'framer-motion',
      'react-hook-form': 'react-hook-form',
      '@emotion/react': '@emotion/react',
      '@emotion/styled': '@emotion/styled',
      'recharts': 'recharts',
      'react-router-dom': 'react-router-dom',
      '@tanstack/react-query': '@tanstack/react-query',
      'zustand': 'zustand'
    };

    imports.forEach(imp => {
      const packageName = imp.package.split('/')[0] === '@emotion' 
        ? imp.package 
        : imp.package.split('/')[0];
      
      if (commonDeps[packageName] && !this.installedDeps.has(packageName)) {
        missing.push(commonDeps[packageName]);
      }
    });

    return [...new Set(missing)];
  }

  findIncorrectImports(imports) {
    const incorrect = [];
    
    imports.forEach(imp => {
      // Verificar importaciones incorrectas de Material UI icons
      if (imp.package === '@mui/material/icons') {
        incorrect.push({
          current: imp.statement,
          correct: imp.statement.replace('@mui/material/icons', '@mui/icons-material'),
          issue: 'Ruta incorrecta para iconos de Material UI'
        });
      }
      
      // Verificar otras importaciones problemáticas
      if (imp.package.includes('@mui/material/') && !imp.package.includes('styles')) {
        const component = imp.package.split('/').pop();
        if (['Button', 'TextField', 'Box', 'Typography'].includes(component)) {
          incorrect.push({
            current: imp.statement,
            correct: imp.statement.replace(imp.package, '@mui/material'),
            issue: 'Importación específica innecesaria de Material UI'
          });
        }
      }
    });

    return incorrect;
  }

  detectBuilderComponents(content) {
    const builderPatterns = [
      /builder\.io/i,
      /Builder\./,
      /registerComponent/,
      /BuilderComponent/,
      /builder-registry/
    ];

    return builderPatterns.some(pattern => pattern.test(content));
  }

  detectTypeIssues(content) {
    const typeIssues = [
      /any\s*;/,  // Uso de 'any'
      /\@ts-ignore/,  // Comentarios ts-ignore
      /\@ts-nocheck/  // Comentarios ts-nocheck
    ];

    return typeIssues.some(pattern => pattern.test(content));
  }
}

// Monitor de servicios
class ServiceMonitor {
  constructor(logger) {
    this.logger = logger;
    this.lastStatus = {};
  }

  async checkServices() {
    const services = [
      { name: 'Backend NestJS', url: `http://localhost:${CONFIG.BACKEND_PORT}/health`, port: CONFIG.BACKEND_PORT },
      { name: 'SuperApp Frontend', url: `http://localhost:${CONFIG.BUILDER_PORT}`, port: CONFIG.BUILDER_PORT }
    ];

    const results = {};

    for (const service of services) {
      try {
        const response = await fetch(service.url);
        results[service.name] = {
          status: response.ok ? 'OK' : 'ERROR',
          port: service.port,
          url: service.url
        };
      } catch (error) {
        results[service.name] = {
          status: 'DOWN',
          port: service.port,
          url: service.url,
          error: error.message
        };
      }
    }

    // Solo logear cambios de estado
    Object.entries(results).forEach(([name, result]) => {
      if (this.lastStatus[name]?.status !== result.status) {
        if (result.status === 'OK') {
          this.logger.success(`${name} (${result.port}): ${result.status}`);
        } else {
          this.logger.error(`${name} (${result.port}): ${result.status} - ${result.error || 'No disponible'}`);
        }
      }
    });

    this.lastStatus = results;
    return results;
  }
}

// Compilador TypeScript
class TypeScriptChecker {
  constructor(logger) {
    this.logger = logger;
    this.superappDir = CONFIG.SUPERAPP_DIR;
  }

  async checkTypes() {
    return new Promise((resolve) => {
      const tsc = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck'], {
        cwd: this.superappDir,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      tsc.stdout.on('data', (data) => {
        output += data.toString();
      });

      tsc.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      tsc.on('close', (code) => {
        const hasErrors = code !== 0 || errorOutput.includes('error');
        
        if (hasErrors) {
          this.logger.error('Errores de TypeScript detectados:');
          if (errorOutput) {
            errorOutput.split('\n')
              .filter(line => line.includes('error'))
              .slice(0, 5) // Mostrar solo los primeros 5 errores
              .forEach(line => this.logger.log(`  ${line}`, 'red'));
          }
        } else {
          this.logger.success('TypeScript: Sin errores de tipos');
        }

        resolve({ hasErrors, output: errorOutput });
      });
    });
  }
}

// Monitor principal
class BuilderIOMonitor {
  constructor() {
    this.logger = createLogger();
    this.dependencyAnalyzer = new DependencyAnalyzer(this.logger);
    this.serviceMonitor = new ServiceMonitor(this.logger);
    this.typeChecker = new TypeScriptChecker(this.logger);
    this.watcher = null;
    this.isRunning = false;
  }

  async start() {
    this.logger.log('🏗️ INICIANDO BUILDER.IO LIVE MONITOR', 'cyan');
    this.logger.log(`📁 Directorio: ${CONFIG.SUPERAPP_DIR}`, 'blue');
    this.logger.log(`🔍 Patrones: ${CONFIG.WATCH_PATTERNS.join(', ')}`, 'blue');
    this.logger.log('', 'reset');

    // Verificación inicial
    await this.initialCheck();

    // Configurar watcher
    this.setupWatcher();

    // Configurar monitoreo periódico de servicios
    this.setupServiceMonitoring();

    // Configurar cleanup
    this.setupCleanup();

    this.isRunning = true;
    this.logger.log('🚀 Monitor iniciado. Presiona Ctrl+C para detener', 'green');
  }

  async initialCheck() {
    this.logger.log('🔍 Verificación inicial...', 'yellow');
    
    // Verificar servicios
    await this.serviceMonitor.checkServices();
    
    // Verificar tipos
    await this.typeChecker.checkTypes();
    
    this.logger.log('✅ Verificación inicial completada', 'green');
    this.logger.log('----------------------------------------', 'cyan');
  }

  setupWatcher() {
    const watchPaths = CONFIG.WATCH_PATTERNS.map(pattern => 
      path.join(CONFIG.SUPERAPP_DIR, pattern)
    );

    this.watcher = chokidar.watch(watchPaths, {
      ignored: CONFIG.IGNORE_PATTERNS,
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('add', (filePath) => this.handleFileChange(filePath, 'added'))
      .on('change', (filePath) => this.handleFileChange(filePath, 'modified'))
      .on('unlink', (filePath) => this.handleFileChange(filePath, 'deleted'))
      .on('error', (error) => this.logger.error(`Watcher error: ${error.message}`));
  }

  async handleFileChange(filePath, action) {
    const relativePath = path.relative(CONFIG.SUPERAPP_DIR, filePath);
    this.logger.log(`📄 ${action.toUpperCase()}: ${relativePath}`, 'blue');

    if (action === 'deleted') {
      return;
    }

    // Analizar archivo si es TypeScript/JavaScript
    if (/\.(ts|tsx|js|jsx)$/.test(filePath)) {
      const analysis = this.dependencyAnalyzer.analyzeFile(filePath);
      
      if (analysis) {
        await this.processAnalysis(analysis);
      }
    }

    // Si es package.json, recargar dependencias
    if (filePath.endsWith('package.json')) {
      this.logger.log('📦 package.json modificado, recargando dependencias...', 'yellow');
      this.dependencyAnalyzer.loadInstalledDependencies();
    }

    // Verificar tipos después de cambios
    setTimeout(() => {
      this.typeChecker.checkTypes();
    }, 2000);
  }

  async processAnalysis(analysis) {
    if (analysis.builderComponents) {
      this.logger.log('🏗️ Componente Builder.io detectado', 'magenta');
    }

    if (analysis.missingDeps.length > 0) {
      this.logger.warn('Dependencias faltantes detectadas:');
      analysis.missingDeps.forEach(dep => {
        this.logger.log(`  - ${dep}`, 'yellow');
      });
      this.logger.info(`Comando sugerido: npm install ${analysis.missingDeps.join(' ')} --legacy-peer-deps`);
    }

    if (analysis.incorrectImports.length > 0) {
      this.logger.warn('Importaciones incorrectas detectadas:');
      analysis.incorrectImports.forEach(imp => {
        this.logger.log(`  ❌ ${imp.current}`, 'red');
        this.logger.log(`  ✅ ${imp.correct}`, 'green');
        this.logger.log(`     ${imp.issue}`, 'yellow');
      });
    }

    if (analysis.hasTypeErrors) {
      this.logger.warn('Posibles problemas de tipos detectados (any, @ts-ignore, etc.)');
    }
  }

  setupServiceMonitoring() {
    // Verificar servicios cada 30 segundos
    setInterval(async () => {
      if (this.isRunning) {
        await this.serviceMonitor.checkServices();
      }
    }, 30000);
  }

  setupCleanup() {
    const cleanup = () => {
      this.logger.log('\n🛑 Deteniendo monitor...', 'yellow');
      this.isRunning = false;
      
      if (this.watcher) {
        this.watcher.close();
      }
      
      this.logger.success('Monitor detenido correctamente');
      this.logger.close();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }
}

// Verificar dependencias del sistema
function checkSystemDependencies() {
  const requiredDeps = ['chokidar'];
  const missingDeps = [];

  requiredDeps.forEach(dep => {
    try {
      require.resolve(dep);
    } catch (error) {
      missingDeps.push(dep);
    }
  });

  if (missingDeps.length > 0) {
    console.error(`${colors.red}❌ Dependencias faltantes: ${missingDeps.join(', ')}${colors.reset}`);
    console.log(`${colors.yellow}💡 Instalar con: npm install ${missingDeps.join(' ')} --save-dev${colors.reset}`);
    process.exit(1);
  }
}

// Función fetch para Node.js < 18
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

// Iniciar monitor
if (require.main === module) {
  checkSystemDependencies();
  
  const monitor = new BuilderIOMonitor();
  monitor.start().catch(error => {
    console.error(`${colors.red}❌ Error iniciando monitor: ${error.message}${colors.reset}`);
    process.exit(1);
  });
} 