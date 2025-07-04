import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      'generated/**',
      'src/generated/**',
      'prisma/seed*.ts', // Seed files pueden usar console.log
      'scripts/**', // Scripts de desarrollo
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: false, // Backend is not using JSX
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

      // 🌟 PURIFICACIÓN CÓSMICA - Reglas estrictas para prevenir 'any' y variables no usadas
      '@typescript-eslint/no-explicit-any': 'error', // Prohibir 'any' completamente
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Desactivar la regla JS en favor de la TypeScript

      // Reglas de limpieza de código
      'no-console': 'warn', // Advertir sobre console.log en producción
      'no-debugger': 'error', // Prohibir debugger
      'no-alert': 'error', // Prohibir alert()
      'no-undef': 'error', // Error en variables no definidas
      'prefer-const': 'error', // Forzar const cuando sea posible
      'no-var': 'error', // Prohibir var
      'object-shorthand': 'error', // Forzar object shorthand
      'prefer-arrow-callback': 'error', // Preferir arrow functions
      'no-useless-catch': 'error', // Eliminar catch innecesarios
      'no-empty': 'error', // Prohibir bloques vacíos
      'no-unreachable': 'error', // Prohibir código inalcanzable
    },
  },
];
