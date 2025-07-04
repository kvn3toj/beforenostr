// /// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
// import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 3001,
    host: true,
    fs: {
      // Solo permite acceso a src y node_modules para evitar escaneo de backups y reportes
      allow: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules'),
      ],
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    // PWA DISABLED FOR DEBUGGING
    // mode === 'production' && VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'google-fonts-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
    //           }
    //         }
    //       }
    //     ]
    //   }
    // }),
    // Add bundle analyzer for development
    mode === 'development' && visualizer({
      filename: 'dist/stats.html',
      open: false
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      // Exclude test files from production builds
      external: mode === 'production' ? [
        /.*\.test\.(ts|tsx|js|jsx)$/,
        /.*\.spec\.(ts|tsx|js|jsx)$/
      ] : [
        /backups\//,
        /analysis\//,
        /playwright-report\//,
        /data\//,
        /public\//,
        /dist\//,
        /temp/,
        /_temp/,
        /_temp_frontend_src_files/,
        /docs\//
      ],
      output: {
        manualChunks: {
          // React y ecosistema
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Material-UI core y estilos
          'mui-core': ['@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
          // Material-UI iconos
          'mui-icons': ['@mui/icons-material'],
          // React Query
          'react-query': ['@tanstack/react-query'],
          // Framer Motion
          'framer-motion': ['framer-motion'],
          // Utilidades grandes
          'lodash': ['lodash.debounce'],
          'date-fns': ['date-fns'],
        }
      }
    },
    // Increase chunk size warning limit since we're optimizing manually
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging in production
    sourcemap: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-router-dom',
      '@tanstack/react-query'
    ]
  },
  // Define environment variables for build
  define: {
    // Ensure environment variables are available during build
    __DEV__: mode === 'development'
  }
}))
