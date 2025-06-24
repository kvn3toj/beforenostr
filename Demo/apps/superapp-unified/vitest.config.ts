import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Usar entorno jsdom para tests de React
    environment: 'jsdom',
    // Setup global para mocks y utilidades
    setupFiles: [path.resolve(__dirname, 'src/test/setup.ts')],
    // Excluir tests E2E y de Playwright
    exclude: [
      'node_modules',
      'dist',
      'build',
      'tests/e2e',
      '**/e2e/**',
      '**/*.e2e.{ts,tsx,js,jsx}',
      '**/playwright*.{ts,js}',
    ],
    globals: true,
    // Permitir imports absolutos desde src
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Aumentar timeout si hay tests lentos
    testTimeout: 20000,
  },
});
