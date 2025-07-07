import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const baseConfig = require('../../../eslint.config.cjs');

module.exports = [
  // Heredar configuración base del orquestador
  ...baseConfig.filter(
    (config) =>
      config.name === 'coomunity/global-ignores' ||
      config.name === 'coomunity/superapp'
  ),

  // 🔧 REFINAMIENTOS ESPECÍFICOS SUPERAPP
  {
    name: 'coomunity/superapp-overrides',
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    ignores: [
      'src/generated/**',
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'playwright/**',
      'e2e/**',
    ],
    rules: {
      // Reglas específicas para React
      'react/prop-types': 'off', // TypeScript maneja esto
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/display-name': 'off', // Componentes anónimos OK

      // Hooks de React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Material UI específico
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: true, // MUI props pueden usar any
        },
      ],

      // Zustand store específico
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^set|^get', // Zustand patterns
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // Console permitido en desarrollo
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],
    },
  },

  // 🎨 REGLAS ESPECÍFICAS PARA COMPONENTES UI
  {
    name: 'coomunity/superapp-components',
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      // Componentes deben tener display name
      'react/display-name': 'warn',

      // Props destructuring preferido
      'prefer-destructuring': [
        'error',
        {
          object: true,
          array: false,
        },
      ],
    },
  },

  // 🧪 REGLAS ESPECÍFICAS PARA TESTS
  {
    name: 'coomunity/superapp-tests',
    files: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'playwright/**/*.{ts,js}',
      'e2e/**/*.{ts,js}',
    ],
    rules: {
      'no-console': 'off', // Tests pueden usar console
      '@typescript-eslint/no-explicit-any': 'warn', // Más permisivo en tests
      '@typescript-eslint/no-unused-vars': 'off', // Variables de test pueden no usarse
    },
  },
];
