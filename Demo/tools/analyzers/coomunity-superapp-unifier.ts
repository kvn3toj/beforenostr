#!/usr/bin/env tsx

/**
 * 🌟 CoomÜnity SuperApp Unifier
 * Script de Unificación Holística Automatizada
 * 
 * Este script integra todos los módulos dispersos de CoomÜnity
 * en una SuperApp coherente y funcional.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface UnificationConfig {
  sourceRoot: string;
  targetRoot: string;
  modules: ModuleConfig[];
  preserveOriginals: boolean;
}

interface ModuleConfig {
  name: string;
  source: string;
  target: string;
  type: 'react' | 'static' | 'assets' | 'data';
  priority: number;
  dependencies: string[];
  transformations: TransformationRule[];
}

interface TransformationRule {
  pattern: RegExp;
  replacement: string;
  fileTypes: string[];
}

const UNIFICATION_CONFIG: UnificationConfig = {
  sourceRoot: '.',
  targetRoot: './coomunity-superapp-unified',
  preserveOriginals: true,
  modules: [
    // 🎯 Core Application (PROJECT_3)
    {
      name: 'Core App',
      source: 'demo.coomunity/project_3',
      target: 'src',
      type: 'react',
      priority: 1,
      dependencies: [],
      transformations: [
        {
          pattern: /import.*from ['"]\.\.?\//g,
          replacement: 'import $1 from "@/',
          fileTypes: ['.ts', '.tsx']
        }
      ]
    },

    // 🎮 Pilgrim Experience
    {
      name: 'Pilgrim Demo',
      source: 'coomunity_pilgrim_demo',
      target: 'src/modules/pilgrim',
      type: 'static',
      priority: 2,
      dependencies: ['Core App'],
      transformations: [
        {
          pattern: /\/assets\//g,
          replacement: '/assets/pilgrim/',
          fileTypes: ['.html', '.css', '.js']
        }
      ]
    },

    // 🏪 Merchant Platform
    {
      name: 'Merchant Platform',
      source: 'coomunity_merchant_dev',
      target: 'src/modules/marketplace',
      type: 'static',
      priority: 3,
      dependencies: ['Core App'],
      transformations: [
        {
          pattern: /\/assets\//g,
          replacement: '/assets/marketplace/',
          fileTypes: ['.html', '.css', '.js']
        }
      ]
    },

    // 🔴 Red Pill Interactive
    {
      name: 'Red Pill Videos',
      source: 'recovered_code/red_pill_interactive',
      target: 'src/modules/videos',
      type: 'static',
      priority: 4,
      dependencies: ['Core App'],
      transformations: [
        {
          pattern: /\/videos\//g,
          replacement: '/assets/videos/',
          fileTypes: ['.html', '.css', '.js']
        }
      ]
    },

    // 💰 Wallet System
    {
      name: 'Wallet System',
      source: 'coomunity_wallet',
      target: 'src/modules/wallet',
      type: 'static',
      priority: 5,
      dependencies: ['Core App'],
      transformations: [
        {
          pattern: /\/assets\//g,
          replacement: '/assets/wallet/',
          fileTypes: ['.html', '.css', '.js']
        }
      ]
    },

    // 👥 Social Features
    {
      name: 'Social Features',
      source: 'coomunity_gossip',
      target: 'src/modules/social',
      type: 'static',
      priority: 6,
      dependencies: ['Core App'],
      transformations: [
        {
          pattern: /\/assets\//g,
          replacement: '/assets/social/',
          fileTypes: ['.html', '.css', '.js']
        }
      ]
    },

    // 🎵 ÜPlay Content
    {
      name: 'ÜPlay System',
      source: 'demo.coomunity/project_3/ÜPlay',
      target: 'src/modules/uplay',
      type: 'react',
      priority: 7,
      dependencies: ['Core App'],
      transformations: []
    }
  ]
};

class CoomUnitySuperAppUnifier {
  private config: UnificationConfig;
  private stats = {
    filesProcessed: 0,
    directoriesCreated: 0,
    transformationsApplied: 0,
    errors: 0
  };

  constructor(config: UnificationConfig) {
    this.config = config;
  }

  async unify(): Promise<void> {
    console.log('🌟 CoomÜnity SuperApp Unification Started');
    console.log('==========================================');

    try {
      // Fase 1: Preparación
      await this.prepareUnifiedStructure();
      
      // Fase 2: Migración de módulos por prioridad
      await this.migrateModules();
      
      // Fase 3: Configuración del proyecto
      await this.setupProject();
      
      // Fase 4: Aplicar transformaciones
      await this.applyTransformations();
      
      // Fase 5: Generar configuraciones
      await this.generateConfigurations();

      this.printSummary();
      
    } catch (error) {
      console.error('❌ Unification failed:', error);
      throw error;
    }
  }

  private async prepareUnifiedStructure(): Promise<void> {
    console.log('\n📁 Phase 1: Preparing unified structure...');
    
    // Crear directorio principal
    if (!fs.existsSync(this.config.targetRoot)) {
      fs.mkdirSync(this.config.targetRoot, { recursive: true });
      this.stats.directoriesCreated++;
    }

    // Crear estructura base
    const baseStructure = [
      'src/app',
      'src/components/ui',
      'src/components/layout',
      'src/components/modules',
      'src/hooks',
      'src/lib',
      'src/stores',
      'src/styles',
      'src/types',
      'public/assets',
      'docs'
    ];

    baseStructure.forEach(dir => {
      const fullPath = path.join(this.config.targetRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.stats.directoriesCreated++;
      }
    });

    console.log(`   ✅ Created ${this.stats.directoriesCreated} directories`);
  }

  private async migrateModules(): Promise<void> {
    console.log('\n🔄 Phase 2: Migrating modules...');
    
    // Ordenar módulos por prioridad
    const sortedModules = this.config.modules.sort((a, b) => a.priority - b.priority);
    
    for (const module of sortedModules) {
      await this.migrateModule(module);
    }
  }

  private async migrateModule(module: ModuleConfig): Promise<void> {
    const sourcePath = path.join(this.config.sourceRoot, module.source);
    const targetPath = path.join(this.config.targetRoot, module.target);
    
    console.log(`   📦 Migrating ${module.name}...`);
    console.log(`      From: ${sourcePath}`);
    console.log(`      To: ${targetPath}`);

    if (!fs.existsSync(sourcePath)) {
      console.log(`      ⚠️  Source not found, skipping...`);
      return;
    }

    try {
      // Crear directorio destino
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
        this.stats.directoriesCreated++;
      }

      // Copiar archivos según el tipo
      if (module.type === 'react') {
        await this.copyReactModule(sourcePath, targetPath);
      } else {
        await this.copyStaticModule(sourcePath, targetPath);
      }

      console.log(`      ✅ ${module.name} migrated successfully`);
      
    } catch (error) {
      console.error(`      ❌ Failed to migrate ${module.name}:`, error);
      this.stats.errors++;
    }
  }

  private async copyReactModule(source: string, target: string): Promise<void> {
    // Copiar específicamente archivos React importantes
    const reactFiles = ['src', 'public', 'package.json', 'tsconfig.json', 'vite.config.ts'];
    
    for (const file of reactFiles) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      
      if (fs.existsSync(sourcePath)) {
        await this.copyRecursive(sourcePath, targetPath);
      }
    }
  }

  private async copyStaticModule(source: string, target: string): Promise<void> {
    // Copiar todos los archivos del módulo estático
    await this.copyRecursive(source, target);
  }

  private async copyRecursive(source: string, target: string): Promise<void> {
    const stats = fs.lstatSync(source);
    
    if (stats.isDirectory()) {
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
        this.stats.directoriesCreated++;
      }
      
      const items = fs.readdirSync(source);
      for (const item of items) {
        await this.copyRecursive(
          path.join(source, item),
          path.join(target, item)
        );
      }
    } else {
      fs.copyFileSync(source, target);
      this.stats.filesProcessed++;
    }
  }

  private async setupProject(): Promise<void> {
    console.log('\n⚙️  Phase 3: Setting up unified project...');
    
    // Generar package.json unificado
    await this.generatePackageJson();
    
    // Generar configuraciones TypeScript
    await this.generateTsConfig();
    
    // Generar configuración Vite
    await this.generateViteConfig();
    
    // Generar configuración Tailwind
    await this.generateTailwindConfig();
  }

  private async generatePackageJson(): Promise<void> {
    const packageJson = {
      name: "coomunity-superapp",
      version: "1.0.0",
      type: "module",
      description: "CoomÜnity SuperApp - Plataforma Unificada",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "lint:fix": "eslint . --ext ts,tsx --fix",
        test: "vitest",
        "test:coverage": "vitest --coverage",
        "type-check": "tsc --noEmit"
      },
      dependencies: {
        "@emotion/react": "^11.14.0",
        "@emotion/styled": "^11.14.0",
        "@mui/icons-material": "^7.0.1",
        "@mui/material": "^7.0.1",
        "@radix-ui/react-dialog": "^1.1.6",
        "@radix-ui/react-dropdown-menu": "^2.1.6",
        "@radix-ui/react-slot": "^1.1.2",
        "@radix-ui/react-toast": "^1.2.6",
        "@supabase/supabase-js": "^2.49.4",
        "@tanstack/react-query": "^5.76.0",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "date-fns": "^4.1.0",
        "lucide-react": "^0.344.0",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "react-hook-form": "^7.53.0",
        "react-router-dom": "^6.22.2",
        "sonner": "^2.0.3",
        "tailwind-merge": "^2.6.0",
        "uuid": "^11.1.0",
        "zod": "^3.23.8",
        "zustand": "^4.5.2"
      },
      devDependencies: {
        "@types/react": "^18.3.5",
        "@types/react-dom": "^18.3.0",
        "@types/uuid": "^10.0.0",
        "@typescript-eslint/eslint-plugin": "^8.3.0",
        "@typescript-eslint/parser": "^8.3.0",
        "@vitejs/plugin-react": "^4.2.1",
        "autoprefixer": "^10.4.21",
        "eslint": "^9.9.1",
        "eslint-plugin-react-hooks": "^5.1.0-rc.0",
        "eslint-plugin-react-refresh": "^0.4.11",
        "postcss": "^8.4.48",
        "tailwindcss": "^3.4.17",
        "typescript": "^5.5.3",
        "vite": "^6.2.5",
        "vitest": "^2.1.1"
      }
    };

    const targetPath = path.join(this.config.targetRoot, 'package.json');
    fs.writeFileSync(targetPath, JSON.stringify(packageJson, null, 2));
    this.stats.filesProcessed++;
    console.log('   ✅ package.json generated');
  }

  private async generateTsConfig(): Promise<void> {
    const tsConfig = {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
          "@/components/*": ["./src/components/*"],
          "@/hooks/*": ["./src/hooks/*"],
          "@/lib/*": ["./src/lib/*"],
          "@/stores/*": ["./src/stores/*"],
          "@/types/*": ["./src/types/*"]
        }
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    };

    const targetPath = path.join(this.config.targetRoot, 'tsconfig.json');
    fs.writeFileSync(targetPath, JSON.stringify(tsConfig, null, 2));
    this.stats.filesProcessed++;
    console.log('   ✅ tsconfig.json generated');
  }

  private async generateViteConfig(): Promise<void> {
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`;

    const targetPath = path.join(this.config.targetRoot, 'vite.config.ts');
    fs.writeFileSync(targetPath, viteConfig);
    this.stats.filesProcessed++;
    console.log('   ✅ vite.config.ts generated');
  }

  private async generateTailwindConfig(): Promise<void> {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // CoomÜnity specific colors
        coomunity: {
          purple: '#6366f1',
          gold: '#f59e0b',
          earth: '#78716c',
          water: '#06b6d4',
          fire: '#ef4444',
          air: '#8b5cf6',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;

    const targetPath = path.join(this.config.targetRoot, 'tailwind.config.js');
    fs.writeFileSync(targetPath, tailwindConfig);
    this.stats.filesProcessed++;
    console.log('   ✅ tailwind.config.js generated');
  }

  private async applyTransformations(): Promise<void> {
    console.log('\n🔧 Phase 4: Applying transformations...');
    
    for (const module of this.config.modules) {
      if (module.transformations.length > 0) {
        await this.applyModuleTransformations(module);
      }
    }
  }

  private async applyModuleTransformations(module: ModuleConfig): Promise<void> {
    const modulePath = path.join(this.config.targetRoot, module.target);
    
    console.log(`   🔄 Transforming ${module.name}...`);
    
    for (const transformation of module.transformations) {
      await this.applyTransformation(modulePath, transformation);
    }
  }

  private async applyTransformation(basePath: string, rule: TransformationRule): Promise<void> {
    const applyToFile = (filePath: string) => {
      const ext = path.extname(filePath);
      if (!rule.fileTypes.includes(ext)) return;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const transformed = content.replace(rule.pattern, rule.replacement);
        
        if (content !== transformed) {
          fs.writeFileSync(filePath, transformed);
          this.stats.transformationsApplied++;
        }
      } catch (error) {
        console.error(`      ❌ Failed to transform ${filePath}:`, error);
        this.stats.errors++;
      }
    };

    const walkDir = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.lstatSync(fullPath);
        
        if (stats.isDirectory()) {
          walkDir(fullPath);
        } else {
          applyToFile(fullPath);
        }
      }
    };

    walkDir(basePath);
  }

  private async generateConfigurations(): Promise<void> {
    console.log('\n📝 Phase 5: Generating additional configurations...');
    
    // Generar README
    await this.generateReadme();
    
    // Generar .gitignore
    await this.generateGitignore();
    
    // Generar ENV template
    await this.generateEnvTemplate();
  }

  private async generateReadme(): Promise<void> {
    const readme = `# 🌟 CoomÜnity SuperApp

## Plataforma Unificada de Economía Colaborativa

### 🎯 Visión
Una SuperApp que integra todas las funcionalidades de CoomÜnity en una experiencia coherente:

- 🎮 **Pilgrim**: Experiencia gamificada de desarrollo personal
- 🏪 **Marketplace**: E-commerce completo con geolocalización  
- 🔴 **Videos Interactivos**: Contenido multimedia inmersivo
- 💰 **Wallet**: Sistema financiero integrado
- 👥 **Social**: Conexiones y comunicación
- 📊 **ÜStats**: Analytics y métricas personales
- 🎵 **ÜPlay**: Plataforma de contenido multimedia

### 🚀 Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
\`\`\`

### 🏗️ Arquitectura

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Material-UI + Tailwind CSS + Shadcn/ui
- **Estado**: Zustand + React Query
- **Backend**: Supabase (Auth, DB, Storage)
- **Navegación**: React Router v6

### 📁 Estructura

\`\`\`
src/
├── app/                 # Rutas de la aplicación
├── components/          # Componentes reutilizables
├── hooks/              # Custom hooks
├── lib/                # Utilidades y configuración
├── stores/             # Estado global (Zustand)
└── styles/             # Estilos globales
\`\`\`

### 🌱 Filosofía CoomÜnity

Esta SuperApp encarna los valores fundamentales:
- **Bien Común** sobre interés particular
- **Ayni** (reciprocidad justa)
- **Vocación** y desarrollo personal
- **Tecnología Consciente** al servicio de la humanidad

---

**Generado automáticamente por CoomÜnity SuperApp Unifier**
`;

    const targetPath = path.join(this.config.targetRoot, 'README.md');
    fs.writeFileSync(targetPath, readme);
    this.stats.filesProcessed++;
    console.log('   ✅ README.md generated');
  }

  private async generateGitignore(): Promise<void> {
    const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
out/

# Testing
coverage/
.nyc_output

# Misc
*.tgz
*.tar.gz
.cache/
.parcel-cache/
.vite/
`;

    const targetPath = path.join(this.config.targetRoot, '.gitignore');
    fs.writeFileSync(targetPath, gitignore);
    this.stats.filesProcessed++;
    console.log('   ✅ .gitignore generated');
  }

  private async generateEnvTemplate(): Promise<void> {
    const envTemplate = `# CoomÜnity SuperApp Environment Variables

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API (for geolocation features)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Analytics
VITE_HOTJAR_ID=your_hotjar_id_here

# WhatsApp Integration (optional)
VITE_WHATSAPP_API_TOKEN=your_whatsapp_token_here

# Development
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000
`;

    const targetPath = path.join(this.config.targetRoot, '.env.template');
    fs.writeFileSync(targetPath, envTemplate);
    this.stats.filesProcessed++;
    console.log('   ✅ .env.template generated');
  }

  private printSummary(): void {
    console.log('\n🎉 UNIFICATION COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log(`📊 Statistics:`);
    console.log(`   📁 Directories created: ${this.stats.directoriesCreated}`);
    console.log(`   📄 Files processed: ${this.stats.filesProcessed}`);
    console.log(`   🔄 Transformations applied: ${this.stats.transformationsApplied}`);
    console.log(`   ❌ Errors: ${this.stats.errors}`);
    console.log(`\n📍 Unified SuperApp location: ${this.config.targetRoot}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. cd ${this.config.targetRoot}`);
    console.log(`   2. npm install`);
    console.log(`   3. Copy .env.template to .env and configure`);
    console.log(`   4. npm run dev`);
    console.log(`\n🌟 Welcome to CoomÜnity SuperApp!`);
  }
}

// Ejecutar unificación si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const unifier = new CoomUnitySuperAppUnifier(UNIFICATION_CONFIG);
  unifier.unify().catch(console.error);
}

export { CoomUnitySuperAppUnifier, UNIFICATION_CONFIG }; 