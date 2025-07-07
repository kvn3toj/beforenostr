const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');

// 🎭 ORQUESTADOR DE LA SINFONÍA DE CALIDAD
// Configuración modular para monorepo CoomÜnity
// Filosofía COSMOS: "La Unidad en la Diversidad"

module.exports = [
  // 🌍 CONFIGURACIÓN GLOBAL - Reglas base para todo el monorepo
  {
    name: 'coomunity/global-ignores',
    ignores: [
      'dist/**',
      'node_modules/**',
      'generated/**',
      '**/generated/**',
      'build/**',
      'coverage/**',
      '.next/**',
      'out/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // 🎸 BACKEND NESTJS - Configuración especializada
  {
    name: 'coomunity/backend',
    files: ['backend/**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './backend/tsconfig.json',
        ecmaFeatures: {
          jsx: false, // Backend no usa JSX
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
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // 🌟 PURIFICACIÓN CÓSMICA - Backend NestJS
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',

      // Reglas específicas NestJS
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',

      // Reglas de limpieza backend
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // 🎹 SUPERAPP REACT - Configuración especializada
  {
    name: 'coomunity/superapp',
    files: ['Demo/apps/superapp-unified/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './Demo/apps/superapp-unified/tsconfig.json',
        ecmaFeatures: {
          jsx: true, // SuperApp usa JSX
        },
      },
      globals: {
        ...globals.es2020,
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // 🌟 PURIFICACIÓN CÓSMICA - React Frontend
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',

      // Reglas específicas React
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off', // TypeScript maneja esto
      'react/react-in-jsx-scope': 'off', // React 17+

      // Reglas de limpieza frontend
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // 🎺 ADMIN FRONTEND - Configuración especializada
  {
    name: 'coomunity/admin',
    files: ['apps/admin-frontend/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './apps/admin-frontend/tsconfig.json',
        ecmaFeatures: {
          jsx: true, // Admin usa JSX
        },
      },
      globals: {
        ...globals.es2020,
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // 🌟 PURIFICACIÓN CÓSMICA - Admin Frontend
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',

      // Reglas específicas Admin
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // Reglas de limpieza admin
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // 🔧 CONFIGURACIÓN GENERAL - Scripts y utilidades
  {
    name: 'coomunity/scripts',
    files: ['scripts/**/*.{js,ts}', '*.{js,ts}'],
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
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off', // Scripts pueden usar console
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
