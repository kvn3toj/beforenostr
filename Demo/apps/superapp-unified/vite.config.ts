import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Disable TypeScript checking in development mode
      typescript: mode === 'development' ? false : true
    }),
    // Plugin de Sentry para source maps y release tracking
    mode === 'production' && process.env.VITE_SENTRY_DSN && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './dist/**'
      },
      release: {
        name: process.env.VITE_APP_VERSION || '1.0.0'
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
    host: true
  },
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
    } : {}
  },
  esbuild: {
    // Ignore TypeScript errors during development builds
    target: 'es2020',
    logOverride: mode === 'development' ? { 'this-is-undefined-in-esm': 'silent' } : {}
  },
  define: {
    // Definir variables de entorno para el build
    __SENTRY_DEBUG__: mode === 'development'
  }
}))