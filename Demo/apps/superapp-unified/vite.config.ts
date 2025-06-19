/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Plugin visualizador para analizar el bundle
    mode === 'development' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Opciones: treemap, sunburst, network
    }),
    // Plugin de Sentry para source maps y release tracking
    // TODO: Reactivar Sentry cuando se resuelva la compatibilidad con Vite 6.x
    // mode === 'production' && process.env.VITE_SENTRY_DSN && sentryVitePlugin({
    //   org: process.env.SENTRY_ORG,
    //   project: process.env.SENTRY_PROJECT,
    //   authToken: process.env.SENTRY_AUTH_TOKEN,
    //   sourcemaps: {
    //     assets: './dist/**'
    //   },
    //   release: {
    //     name: process.env.VITE_APP_VERSION || '1.0.0'
    //   }
    // }),
    // PWA Plugin temporalmente deshabilitado para resolver EMFILE error
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
    host: true,
    // Configuración para permitir iframe embedding desde Builder.io
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors 'self' https://builder.io https://*.builder.io"
    },
    // Proxy para redirigir peticiones de API al backend
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // Pre-warming de dependencies
    warmup: {
      clientFiles: [
        './src/components/modules/**/*.tsx',
        './src/pages/**/*.tsx',
      ],
    },
  },
  esbuild: {
    // Optimizar importaciones durante el build
    treeShaking: true,
    legalComments: 'none',
  },
  define: {
    // Definir variables de entorno para el build
    __SENTRY_DEBUG__: mode === 'development'
  },
  // Optimizaciones adicionales para prevenir errores de importación
  optimizeDeps: {
    include: [
      '@mui/material',
      '@tanstack/react-query',
      'framer-motion',
    ],
    exclude: [
      '@mui/icons-material'
    ],
    // Forzar pre-bundling de dependencias específicas
    force: true,
  },
  // Configuración para manejar dynamic imports de forma robusta
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        // Usar rutas absolutas para evitar problemas de resolución
        return { runtime: `window.__vitePreload("${filename}")` }
      }
    }
  },
  preview: {
    port: 3001,
    host: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  // 🎯 OPTIMIZACIONES CRÍTICAS DE BUNDLE
  build: {
    // Reducir chunk size límite
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
                // 🔥 CHUNKING INTELIGENTE - Separar vendor libraries
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react';
          }

          // Material-UI core (sin iconos para evitar EMFILE)
          if (id.includes('@mui/material') || id.includes('@mui/system') || id.includes('@emotion')) {
            return 'vendor-mui-core';
          }

          // Query and state management
          if (id.includes('@tanstack/react-query')) {
            return 'vendor-query';
          }

          // Animation
          if (id.includes('framer-motion')) {
            return 'vendor-animation';
          }

          // Utilities
          if (id.includes('lodash') || id.includes('date-fns')) {
            return 'vendor-utils';
          }

          // Iconos MUI como chunks individuales para evitar EMFILE
          if (id.includes('@mui/icons-material')) {
            const iconName = id.split('/').pop()?.replace('.js', '');
            return `icon-${iconName?.slice(0, 10) || 'misc'}`;
          }
        },

        // 🎯 NOMBRES DE ARCHIVOS OPTIMIZADOS
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },

      // 🚀 EXTERNOS (CDN) para librerías pesadas (opcional)
      // external: ['@mui/icons-material'], // Si usáramos CDN
    },

    // 🎯 CONFIGURACIONES ADICIONALES
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log'], // Funciones a eliminar
      },
    },

    // Incrementar límite de assets
    assetsInlineLimit: 4096,
  },
}))
