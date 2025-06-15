import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Explicitly define the build input to avoid Vite scanning unwanted HTML files
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        // Configuración adicional para producción
        ...(mode === 'production' && { compact: true }),
        // Manual chunks para optimizar el code splitting
        manualChunks(id) {
          // Agrupar librerías de Material UI en un chunk separado
          if (id.includes('@mui/material') || id.includes('@mui/icons-material') || id.includes('@mui/lab')) {
            return 'vendor-mui'
          }
          
          // Agrupar otras librerías UI/UX
          if (id.includes('react-router') || id.includes('framer-motion') || id.includes('react-spring')) {
            return 'vendor-ui'
          }
          
          // Agrupar librerías de datos y estado
          if (id.includes('@tanstack/react-query') || id.includes('zustand') || id.includes('react-hook-form')) {
            return 'vendor-data'
          }
          
          // Agrupar utilidades y fechas
          if (id.includes('date-fns') || id.includes('zod') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'vendor-utils'
          }
          
          // Agrupar charts y visualizaciones
          if (id.includes('recharts') || id.includes('lucide-react')) {
            return 'vendor-charts'
          }
          
          // Resto de node_modules en vendor general
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    outDir: 'dist',
    sourcemap: mode === 'development' ? true : 'hidden', // Sourcemaps ocultos en producción
    // Configuraciones adicionales para optimización
    target: 'es2020',
    cssCodeSplit: true, // Separar CSS por chunks
    chunkSizeWarningLimit: 1000 // Aumentar el límite de warning a 1MB
  },
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
    // })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
    host: true,
    // Configuración para permitir iframe embedding desde Builder.io
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors 'self' https://builder.io https://*.builder.io"
    }
  },
  esbuild: {
    // Ignore TypeScript errors during development builds
    target: 'es2020',
    logOverride: mode === 'development' ? { 'this-is-undefined-in-esm': 'silent' } : {}
  },
  define: {
    // Definir variables de entorno para el build
    __SENTRY_DEBUG__: mode === 'development'
  },
  // Optimizaciones adicionales
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-router-dom',
      '@tanstack/react-query'
    ]
  }
}))