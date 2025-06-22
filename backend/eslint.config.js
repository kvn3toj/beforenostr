import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['dist', 'node_modules', 'generated/**', 'src/generated/**']
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: false // Backend is not using JSX
        }
      },
      globals: {
        ...globals.es2020,
        ...globals.node,
        ...globals.jest,
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'prettier': prettier,
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
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'no-console': 'off',
      'no-undef': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-useless-catch': 'error',
    }
  }
];
