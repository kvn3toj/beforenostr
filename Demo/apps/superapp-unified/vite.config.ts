/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { resolve } from 'path'

// 🚨 ANTI-EMFILE CONFIGURATION
const isEMFILESafeMode = process.env.VITE_OPTIMIZE_DEPS_DISABLED === 'true'
const isDevelopment = process.env.NODE_ENV !== 'production'

console.log('🔧 Vite Config Mode:', {
  NODE_ENV: process.env.NODE_ENV,
  EMFILE_SAFE_MODE: isEMFILESafeMode,
  isDevelopment
})

// Custom plugin to prevent EMFILE by stubbing MUI icons
const muiIconStubPlugin = () => ({
  name: 'mui-icon-stub',
  resolveId(id: string) {
    if (id.startsWith('@mui/icons-material')) {
      return id; // Let Vite handle the import
    }
  },
  load(id: string) {
    if (id.startsWith('@mui/icons-material')) {
      // Return a simple stub component for all MUI icons in development
      return `
        import React from 'react';
        const IconStub = (props) => React.createElement('div', {
          ...props,
          style: {
            width: '24px',
            height: '24px',
            backgroundColor: '#ccc',
            borderRadius: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#666',
            ...props.style
          }
        }, '🚨');
        export default IconStub;
        // Export all possible icon names as the same stub
        ${['Add', 'Analytics', 'ArrowBack', 'Error', 'ErrorOutline', 'CheckCircle', 'Home', 'Settings', 'Close', 'Menu', 'ExpandMore', 'Visibility', 'VisibilityOff', 'Edit', 'Delete', 'Save', 'Cancel', 'Refresh', 'Search'].map(name => `export const ${name} = IconStub;`).join('\n')}
        export * from '@mui/icons-material';
      `;
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Add our MUI icon stub plugin only in development
    mode === 'development' && muiIconStubPlugin(),
    // Plugin visualizador para analizar el bundle (solo en desarrollo si no es safe mode)
    mode === 'development' && !isEMFILESafeMode && visualizer({
      filename: 'dist/stats.html',
      open: false, // No abrir automáticamente para evitar stress
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    }),
    // Plugin de Sentry para source maps en producción
    /*
    mode === 'production' && sentryVitePlugin({
      org: "coomunity-organization",
      project: "superapp-frontend",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
    */
    // PWA Plugin solo en producción
    mode === 'production' && VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'CoomÜnity SuperApp',
        short_name: 'CoomÜnity',
        description: 'Plataforma de Economía Colaborativa y Educación Gamificada',
        theme_color: '#8B5CF6',
        background_color: '#0F172A',
        display: 'standalone',
        icons: [
          {
            src: '/logos/logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logos/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/icons": resolve(__dirname, "./src/utils/iconRegistry"),
    },
  },
  server: {
    port: 3001,
    host: true, // Permitir acceso desde la red
    open: false, // No abrir navegador automáticamente
    cors: true,
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
    // Reduced pre-warming to prevent file descriptor exhaustion
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/main.tsx',
      ],
    },
    // 🚀 CRITICAL ANTI-EMFILE OPTIMIZATIONS
    watch: isEMFILESafeMode ? {
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    } : undefined
  },
  esbuild: {
    // Optimizar importaciones durante el build
    treeShaking: true,
    legalComments: 'none',
    // Reduce bundle size and processing time
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  define: {
    // Definir variables de entorno para el build
    __SENTRY_DEBUG__: mode === 'development',
    // EMFILE prevention variables
    'process.env.NODE_ENV': mode === 'development' ? '"development"' : '"production"',
    __DEV__: mode === 'development',
    __EMFILE_SAFE_MODE__: isEMFILESafeMode
  },
  // 🚀 CRITICAL OPTIMIZATIONS TO PREVENT EMFILE
  optimizeDeps: isEMFILESafeMode ? {
    // EMFILE SAFE MODE: Minimal processing
    disabled: true, // Disable optimization completely in safe mode
  } : {
    // NORMAL MODE: Controlled optimization
    include: [
      '@mui/material',
      '@mui/material/styles',
      '@mui/material/colors',
      '@mui/system',
      '@emotion/react',
      '@emotion/styled',
      '@tanstack/react-query',
      'framer-motion',
      'react',
      'react-dom',
      'react-router-dom'
    ],
    // CRITICAL: Completely exclude ALL icon packages that cause EMFILE
    exclude: [
      '@mui/icons-material',
      '@mui/icons-material/*'
    ],
    // Limit concurrent processing to prevent EMFILE
    esbuildOptions: {
      target: 'es2020',
      // Reduce worker threads to minimize file descriptor usage
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx'
      }
    }
  },
  // CRITICAL: Reduce dependency scanning stress
  cacheDir: 'node_modules/.vite',
  // 🚨 AGGRESSIVE SOLUTION: Define external modules to prevent processing
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
    host: true,
    cors: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  // 🎯 BUILD CONFIGURATION
  build: {
    target: 'es2020',
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        // Manual chunking para reducir el tamaño de chunks individuales
        manualChunks: mode === 'production' ? {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        } : undefined,
      },
      // ANTI-EMFILE: Reduce concurrent processing
      maxParallelFileOps: isDevelopment ? 3 : 10
    },
    // Aumentar el límite de warnings para evitar que se detenga el build
    chunkSizeWarningLimit: 1600,
  },
}))
