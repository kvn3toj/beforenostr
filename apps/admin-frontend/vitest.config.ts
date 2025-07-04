import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom', // Lightweight alternative to jsdom 
    threads: false,           // Disable parallel execution
    fileParallelism: false,   // Tests run sequentially
    deps: {
      optimizer: {
        web: {
          exclude: [
            '@mui/icons-material/*', 
            'date-fns/locale/*',
            '@google/generative-ai'
          ],
        },
      },
    },
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/*.spec.ts', 'src/auth/**/*'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '**/*.spec.ts'],
    },
  },
}); 