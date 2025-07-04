#!/usr/bin/env node

/**
 * 🧪 Generador de Datos de Prueba - Gemini Modular Code Reviewer
 *
 * Este script genera datos de prueba para el dashboard ejecutando el revisor
 * modular en diferentes módulos y creando reportes de ejemplo.
 *
 * Filosofía CoomÜnity: Eficiencia en la generación de datos de calidad
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuración
const REPORTS_DIR = path.join(__dirname, '../../reports');
const TEST_DATA_DIR = path.join(
  __dirname,
  '../../tools/modular-review-dashboard/test-data'
);
const MODULES_TO_TEST = ['HOME', 'UPLAY', 'WALLET', 'AUTH', 'SHARED'];

// Asegurar que los directorios existen
[REPORTS_DIR, TEST_DATA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Genera datos de prueba mock si no hay API Key de Gemini
 */
function generateMockData() {
  console.log('🎭 Generando datos de prueba mock...');

  const mockModules = MODULES_TO_TEST.map((module) => ({
    module,
    moduleName: getModuleName(module),
    description: getModuleDescription(module),
    priority: getModulePriority(module),
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: Math.floor(Math.random() * 10) + 3,
      totalIssues: Math.floor(Math.random() * 20) + 1,
      filesWithIssues: Math.floor(Math.random() * 5) + 1,
      severityBreakdown: {
        Error: Math.floor(Math.random() * 5),
        Warning: Math.floor(Math.random() * 8) + 1,
        Suggestion: Math.floor(Math.random() * 6) + 1,
        Info: Math.floor(Math.random() * 4) + 1,
      },
      categoryBreakdown: {
        Performance: Math.floor(Math.random() * 4) + 1,
        Security: Math.floor(Math.random() * 3),
        Accessibility: Math.floor(Math.random() * 3) + 1,
        'Code Quality': Math.floor(Math.random() * 5) + 2,
        Architecture: Math.floor(Math.random() * 3),
        Philosophy: Math.floor(Math.random() * 2) + 1,
        'Best Practices': Math.floor(Math.random() * 4) + 1,
      },
    },
    results: generateMockResults(module),
  }));

  // Generar reporte consolidado
  const consolidatedReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalModules: mockModules.length,
      totalFiles: mockModules.reduce((acc, m) => acc + m.summary.totalFiles, 0),
      totalIssues: mockModules.reduce(
        (acc, m) => acc + m.summary.totalIssues,
        0
      ),
      severityBreakdown: mockModules.reduce((acc, m) => {
        Object.keys(m.summary.severityBreakdown).forEach((severity) => {
          acc[severity] =
            (acc[severity] || 0) + m.summary.severityBreakdown[severity];
        });
        return acc;
      }, {}),
      categoryBreakdown: mockModules.reduce((acc, m) => {
        Object.keys(m.summary.categoryBreakdown).forEach((category) => {
          acc[category] =
            (acc[category] || 0) + m.summary.categoryBreakdown[category];
        });
        return acc;
      }, {}),
    },
    modules: mockModules,
  };

  // Guardar archivos
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];

  // Reportes individuales
  mockModules.forEach((moduleData) => {
    const filename = `${moduleData.module}_review_${timestamp}.json`;
    fs.writeFileSync(
      path.join(REPORTS_DIR, filename),
      JSON.stringify(moduleData, null, 2)
    );
  });

  // Reporte consolidado
  const consolidatedFilename = `consolidated_review_${timestamp}.json`;
  fs.writeFileSync(
    path.join(REPORTS_DIR, consolidatedFilename),
    JSON.stringify(consolidatedReport, null, 2)
  );

  // Copiar a test-data para el dashboard
  fs.writeFileSync(
    path.join(TEST_DATA_DIR, 'sample-consolidated-report.json'),
    JSON.stringify(consolidatedReport, null, 2)
  );

  // Generar datos históricos mock
  generateHistoricalData();

  console.log('✅ Datos de prueba mock generados exitosamente');
  console.log(`📊 Reportes guardados en: ${REPORTS_DIR}`);
  console.log(`🎯 Test data guardado en: ${TEST_DATA_DIR}`);
}

/**
 * Genera resultados mock para un módulo
 */
function generateMockResults(module) {
  const files = getModuleFiles(module);

  return files
    .map((file) => ({
      file,
      language: file.endsWith('.tsx') ? 'typescript' : 'javascript',
      issues: generateMockIssues(),
    }))
    .filter((result) => result.issues.length > 0);
}

/**
 * Genera issues mock
 */
function generateMockIssues() {
  const severities = ['Error', 'Warning', 'Suggestion', 'Info'];
  const categories = [
    'Performance',
    'Security',
    'Accessibility',
    'Code Quality',
    'Architecture',
    'Philosophy',
    'Best Practices',
  ];
  const issueCount = Math.floor(Math.random() * 5);

  return Array.from({ length: issueCount }, () => ({
    line_number: Math.floor(Math.random() * 100) + 1,
    severity: severities[Math.floor(Math.random() * severities.length)],
    message: generateMockMessage(),
    recommendation: generateMockRecommendation(),
    category: categories[Math.floor(Math.random() * categories.length)],
  }));
}

/**
 * Genera datos históricos para mostrar tendencias
 */
function generateHistoricalData() {
  const historical = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    historical.push({
      date: date.toISOString().split('T')[0],
      totalIssues: Math.floor(Math.random() * 50) + 20,
      errors: Math.floor(Math.random() * 10),
      warnings: Math.floor(Math.random() * 20) + 5,
      suggestions: Math.floor(Math.random() * 15) + 3,
      info: Math.floor(Math.random() * 8) + 2,
      moduleBreakdown: MODULES_TO_TEST.reduce((acc, module) => {
        acc[module] = Math.floor(Math.random() * 10) + 1;
        return acc;
      }, {}),
    });
  }

  fs.writeFileSync(
    path.join(TEST_DATA_DIR, 'historical-data.json'),
    JSON.stringify(historical, null, 2)
  );
}

/**
 * Ejecuta el revisor real con Gemini
 */
async function runRealReviewer() {
  console.log('🚀 Ejecutando Gemini Modular Code Reviewer...');

  try {
    // Verificar que tenemos la API Key
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️  No se encontró GEMINI_API_KEY. Usando datos mock.');
      return generateMockData();
    }

    // Ejecutar para módulos prioritarios
    for (const module of MODULES_TO_TEST) {
      console.log(`📝 Analizando módulo ${module}...`);

      try {
        const { stdout, stderr } = await execAsync(
          `node scripts/utilities/gemini-modular-review.js ${module} --delay 1000`,
          { timeout: 120000 } // 2 minutos timeout por módulo
        );

        if (stderr) {
          console.log(`⚠️  Advertencias para ${module}:`, stderr);
        }

        console.log(`✅ ${module} completado`);
      } catch (error) {
        console.log(`❌ Error analizando ${module}:`, error.message);
        // Continuar con el siguiente módulo
      }
    }

    // Copiar reportes más recientes a test-data
    const reports = fs
      .readdirSync(REPORTS_DIR)
      .filter((file) => file.startsWith('consolidated_review_'))
      .sort()
      .reverse();

    if (reports.length > 0) {
      const latestReport = reports[0];
      fs.copyFileSync(
        path.join(REPORTS_DIR, latestReport),
        path.join(TEST_DATA_DIR, 'sample-consolidated-report.json')
      );
    }

    console.log('✅ Análisis real completado');
  } catch (error) {
    console.log('❌ Error en análisis real, usando datos mock:', error.message);
    generateMockData();
  }
}

// Funciones helper
function getModuleName(module) {
  const names = {
    HOME: 'Home Dashboard',
    UPLAY: 'UPlay Gaming',
    WALLET: 'Wallet & Ünits',
    AUTH: 'Authentication',
    SHARED: 'Shared Components',
  };
  return names[module] || module;
}

function getModuleDescription(module) {
  const descriptions = {
    HOME: 'Página principal y dashboard del usuario',
    UPLAY: 'Sistema de gamificación y videos interactivos',
    WALLET: 'Gestión de Ünits y economía interna',
    AUTH: 'Sistema de autenticación y autorización',
    SHARED: 'Componentes y utilidades compartidas',
  };
  return descriptions[module] || `Módulo ${module}`;
}

function getModulePriority(module) {
  const priorities = {
    HOME: 'high',
    UPLAY: 'high',
    WALLET: 'high',
    AUTH: 'high',
    SHARED: 'medium',
  };
  return priorities[module] || 'medium';
}

function getModuleFiles(module) {
  const fileTemplates = {
    HOME: [
      'Demo/apps/superapp-unified/src/pages/Home.tsx',
      'Demo/apps/superapp-unified/src/components/modules/home/HomeStats.tsx',
      'Demo/apps/superapp-unified/src/components/modules/home/HomeQuickActions.tsx',
    ],
    UPLAY: [
      'Demo/apps/superapp-unified/src/pages/UPlay.tsx',
      'Demo/apps/superapp-unified/src/components/modules/uplay/VideoPlayer.tsx',
      'Demo/apps/superapp-unified/src/components/modules/uplay/QuestionModal.tsx',
    ],
    WALLET: [
      'Demo/apps/superapp-unified/src/pages/Wallet.tsx',
      'Demo/apps/superapp-unified/src/components/modules/wallet/WalletBalance.tsx',
      'Demo/apps/superapp-unified/src/components/modules/wallet/TransactionHistory.tsx',
    ],
    AUTH: [
      'Demo/apps/superapp-unified/src/pages/Login.tsx',
      'Demo/apps/superapp-unified/src/components/auth/LoginForm.tsx',
      'Demo/apps/superapp-unified/src/hooks/useAuth.ts',
    ],
    SHARED: [
      'Demo/apps/superapp-unified/src/components/ui/Button.tsx',
      'Demo/apps/superapp-unified/src/components/ui/Card.tsx',
      'Demo/apps/superapp-unified/src/lib/api-service.ts',
    ],
  };

  return fileTemplates[module] || [];
}

function generateMockMessage() {
  const messages = [
    'Componente sin memoización puede causar re-renders innecesarios',
    'Consider adding ARIA labels for better accessibility',
    'Función puede ser simplificada usando destructuring',
    'Missing error handling in async function',
    'Consider implementing Ayni principles in user interaction',
    'Large bundle size detected in this component',
    'Hardcoded strings should be moved to i18n',
    'Missing TypeScript types for props',
    'Consider using React.memo for performance optimization',
    'Error boundary should be implemented for this component',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

function generateMockRecommendation() {
  const recommendations = [
    'Usar React.memo para optimizar re-renders',
    'Implementar aria-label y role attributes',
    'Refactorizar usando const { prop1, prop2 } = props',
    'Agregar try-catch block y error handling',
    'Diseñar interacción que promueva reciprocidad (Ayni)',
    'Implementar lazy loading o code splitting',
    'Mover strings a archivo de traducción',
    'Definir interface/type para props del componente',
    'Envolver componente con React.memo()',
    'Agregar <ErrorBoundary> como componente padre',
  ];

  return recommendations[Math.floor(Math.random() * recommendations.length)];
}

// Script principal
async function main() {
  console.log('🤖 Generador de Datos de Prueba - Gemini Modular Code Reviewer');
  console.log(
    '==============================================================='
  );
  console.log('');

  const mode = process.argv[2] || 'auto';

  switch (mode) {
    case 'mock':
      generateMockData();
      break;
    case 'real':
      await runRealReviewer();
      break;
    case 'auto':
    default:
      await runRealReviewer();
      break;
  }

  console.log('');
  console.log('🎯 Próximos pasos:');
  console.log('1. cd tools/modular-review-dashboard && npm install');
  console.log('2. npm run dev');
  console.log('3. Abrir http://localhost:5173 para ver el dashboard');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateMockData,
  runRealReviewer,
};
