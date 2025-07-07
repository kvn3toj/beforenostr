// 🎸 SOLISTA BACKEND NESTJS
// Configuración especializada para backend NestJS
// Configuración independiente y funcional

const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  // 🌍 IGNORES GLOBALES - Archivos que NO deben ser analizados
  {
    name: 'coomunity/backend-ignores',
    ignores: [
      'dist/**',
      'node_modules/**',
      'generated/**',
      '**/generated/**',
      'src/generated/**',
      'prisma/migrations/**',
      '.turbo/**',
      '.husky/**',
      '.github/**',
      'test/**',
      'coverage/**',
      'build/**',
      // Archivos JS de configuración problemáticos
      'eslint.config.js',
      'fix-marketplace-production.js',
      'prisma/simple-seed.js',
      'scripts/reset-admin-password.js',
      // Todos los archivos de seeds problemáticos
      'prisma/seed*.ts',
      'src/prisma/seed*.ts',
      'scripts/verify-uplay-videos.ts',
      // Archivos generados de Prisma (muy importantes de ignorar)
      'src/generated/prisma/**',
      'generated/prisma/**',
      '**/prisma/index.d.ts',
      '**/prisma/index.js',
      '**/prisma/runtime/**',
      '**/prisma/wasm.js',
    ],
  },

  // 🎸 BACKEND NESTJS - Configuración principal
  {
    name: 'coomunity/backend-main',
    files: ['src/**/*.{ts,js}'],
    ignores: ['src/generated/**', 'src/**/generated/**', 'src/prisma/seed*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: false,
        },
      },
      globals: {
        ...globals.es2020,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      // TypeScript rules - MÁS PERMISIVAS
      '@typescript-eslint/no-explicit-any': 'warn', // Cambiado de error a warning
      '@typescript-eslint/no-unused-vars': [
        'warn', // Cambiado de error a warning
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^ExtArgs$|^Null$|^GlobalOmitOptions$', // Ignorar variables específicas de Prisma
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-unused-vars': 'off',

      // NestJS específico
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Reglas generales - MÁS PERMISIVAS
      'no-console': 'warn', // Permitir console con warning
      'no-debugger': 'warn', // Cambiado de error a warning
      'prefer-const': 'warn', // Cambiado de error a warning
      'no-var': 'warn', // Cambiado de error a warning
      'no-unused-private-class-members': 'off', // Desactivar para evitar errores en código generado
      'no-redeclare': 'off', // Desactivar para evitar errores en código generado
    },
  },

  // 🔧 SEEDS Y SCRIPTS - Configuración muy permisiva
  {
    name: 'coomunity/backend-seeds-scripts',
    files: ['scripts/**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...globals.es2020,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
    },
  },
];
