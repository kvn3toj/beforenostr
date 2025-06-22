// /// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
// import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
      ] : [],
      output: {
        manualChunks: {
          // Split Material-UI into smaller chunks
          'mui-core': ['@mui/material/styles', '@mui/material/CssBaseline'],
          'mui-components': [
            '@mui/material/Box',
            '@mui/material/Typography',
            '@mui/material/Button',
            '@mui/material/Card',
            '@mui/material/CardContent',
            '@mui/material/Grid'
          ],
          'mui-icons': ['@mui/icons-material'],
          // Split React ecosystem
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'react-query': ['@tanstack/react-query'],
          // Split large utilities
          'lodash': ['lodash.debounce'],
          'date-utils': ['date-fns'],
          // Split Supabase if being used
          'supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react']
        }
      }
    },
    // Increase chunk size warning limit since we're optimizing manually
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging in production
    sourcemap: mode === 'production' ? false : true
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
