/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
// import { VitePWA } from 'vite-plugin-pwa' // Comentado

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Disable TypeScript checking in development mode
      typescript: mode === 'development' ? false : true
    }),
    nodePolyfills({ 
      include: ['buffer', 'process'] 
    }),
    /* // Comentado
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Gamifier Admin',
        short_name: 'GamifierAdm',
        description: 'Herramienta para crear experiencias gamificadas en Coomünity.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
    */ // Comentado
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Usar versiones reales de CommonJS para módulos problemáticos
      'react-is': 'react-is/cjs/react-is.development.js',
      'prop-types': 'prop-types/index.js',
      'hoist-non-react-statics': 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js',
    }
  },
  optimizeDeps: {
    force: true, // Forzar re-optimización
    exclude: [
      // Excluir módulos problemáticos que causan EMFILE
      '@mui/icons-material/*',
      '@mui/x-date-pickers/*',
      'date-fns/*',
      'date-fns/locale/*',
      '@tanstack/*', // Excluir toda la librería de react-query
      'nostr-tools',
      'react-router-dom',
      '@google/generative-ai',
    ],
    include: [
      // Incluir solo módulos específicos necesarios
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'date-fns/esm/format',
      'date-fns/esm/formatDistance',
      'react-is',
      'prop-types',
      'hoist-non-react-statics',
    ],
    // Configuración para manejar interoperabilidad CommonJS/ESM
    commonjsOptions: {
      include: [/node_modules/], // Incluir todos los módulos de node_modules
      // Configurar exports específicos para módulos problemáticos
      namedExports: {
        'react-is': [
          'isValidElementType', 
          'isContextConsumer', 
          'isForwardRef', 
          'isMemo', 
          'isProfiler', 
          'isFragment', 
          'isLazy', 
          'isPortal', 
          'isProvider', 
          'isStrictMode', 
          'isSuspense',
          'isElement',
          'isValidElement'
        ],
        'prop-types': [
          'PropTypes', 
          'checkPropTypes',
          'resetWarningCache'
        ],
        'hoist-non-react-statics': ['default']
      },
      // Transformar módulos mixtos para mejor compatibilidad
      transformMixedEsModules: true,
    },
  },
  define: {
    global: 'globalThis',
  },
  test: {
    environment: 'jsdom',
    deps: {
      optimizer: {
        web: {
          include: [
            // Array vacío para evitar EMFILE en tests
            // No optimizar librerías problemáticas en el entorno de testing
          ]
        }
      }
    }
  },
  server: {
    port: 3001,
    host: true
  },
  preview: {
    port: 3000,
  },
  // Configuración adicional para SSR si es necesario
  ssr: {
    noExternal: [
      // Forzar que estos módulos se procesen en lugar de ser externalizados
      'react-is',
      'prop-types',
      'hoist-non-react-statics',
    ]
  },
  // Configuración de build para manejar CommonJS en producción
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Continue building even with TypeScript errors in development
    rollupOptions: mode === 'development' ? {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings in development
        if (warning.code === 'TYPESCRIPT_ERROR') return;
        warn(warning);
      }
    } : {},
  },
  esbuild: {
    // Ignore TypeScript errors during development builds
    target: 'es2020',
    logOverride: mode === 'development' ? { 'this-is-undefined-in-esm': 'silent' } : {}
  }
}));
