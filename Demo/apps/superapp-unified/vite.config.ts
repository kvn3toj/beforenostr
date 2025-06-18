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
    react({
      // Disable TypeScript checking in development mode
      typescript: mode === 'development' ? false : true
    }),
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
    ...(process.env.NODE_ENV === 'production' ? [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icon-*.png', 'screenshot-*.png'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.coomunity\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24 horas
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
                }
              }
            }
          ]
        },
        manifest: {
          name: 'CoomÜnity SuperApp',
          short_name: 'CoomÜnity',
          description: 'SuperApp de CoomÜnity - Economía colaborativa, gamificación y desarrollo personal integrados',
          theme_color: '#E91E63',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ] : [])
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
      '@mui/icons-material',
      '@tanstack/react-query',
      'framer-motion',
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
        manualChunks: {
          // React ecosystem
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Material-UI ecosystem (separado por tamaño)
          'vendor-mui-core': ['@mui/material', '@mui/system'],
          'vendor-mui-icons': ['@mui/icons-material'],
          'vendor-mui-extras': ['@mui/lab', '@emotion/react', '@emotion/styled'],
          
          // Query and state management
          'vendor-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          
          // Animation and interactions  
          'vendor-animation': ['framer-motion'],
          
          // Utilities
          'vendor-utils': ['lodash.debounce', 'date-fns'],
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