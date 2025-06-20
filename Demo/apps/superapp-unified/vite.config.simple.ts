import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Configuración simplificada de Vite para resolver problemas de dependencias
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
    host: true,
    // Proxy para redirigir peticiones de API al backend
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
  // Optimizaciones mínimas para evitar problemas de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
    ],
    // Excluir dependencias problemáticas
    exclude: [
      'vitest',
      '@vitest/expect',
      '@vitest/snapshot',
      '@vitest/utils',
      '@vitest/pretty-format',
      'expect-type',
      'tinyrainbow'
    ],
  },
  preview: {
    port: 3001,
    host: true
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
})
