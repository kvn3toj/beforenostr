import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

// --- Constantes Gemini (adaptadas del script original) ---
const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const GEMINI_SYSTEM_INSTRUCTION = `You are an expert code reviewer specializing in React/TypeScript applications with a focus on the CoomÜnity philosophy. Your task is to analyze the provided code snippet and identify potential issues, suggest improvements, and highlight best practices aligned with the project's values.

The user will provide the programming language, module context, and the code.

Please provide your feedback in a structured JSON format. The JSON response MUST be an object with a single key "review_feedback". The value of "review_feedback" MUST be an array of objects. Each object in the array represents a distinct piece of feedback and MUST have the following properties:
- "line_number": (Integer or null) The specific line number in the code where the issue or suggestion applies. Use null if the feedback is general or applies to the whole snippet. This should be a number, not a string.
- "severity": (String) The severity of the feedback. Must be one of: "Error", "Warning", "Suggestion", "Info".
- "message": (String) A clear and concise description of the feedback. Explain the issue or suggestion.
- "recommendation": (String, Optional) A brief recommendation or example of how to improve or fix the code. Provide this if applicable.
- "category": (String) The category of the feedback. Must be one of: "Performance", "Security", "Accessibility", "Code Quality", "Architecture", "Philosophy", "Best Practices".

Consider the CoomÜnity philosophy (Bien Común, Ayni, Reciprocidad) when reviewing code. Look for opportunities to enhance user experience, promote collaboration, and ensure the code serves the community's values.

If no issues are found, or the code is perfect, return an empty array for "review_feedback".
Ensure your entire response is a valid JSON object adhering to this structure. Do not include any explanatory text outside the JSON structure.`;

// --- Configuración de módulos ---
const MODULE_CONFIGS = {
  HOME: {
    name: 'Home',
    description: 'Página principal y dashboard del usuario',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Home.tsx',
      'Demo/apps/superapp-unified/src/pages/Home*.tsx',
      'Demo/apps/superapp-unified/src/pages/Home/**/*.tsx',
      'Demo/apps/superapp-unified/src/components/modules/home/**/*.tsx',
    ],
    priority: 'high',
  },
  USTATS: {
    name: 'UStats',
    description: 'Estadísticas y analytics del usuario',
    paths: [
      'Demo/apps/superapp-unified/src/pages/UStats.tsx',
      'Demo/apps/superapp-unified/src/components/modules/ustats/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useUStats*.ts',
      'Demo/apps/superapp-unified/src/services/ustats*.ts',
    ],
    priority: 'medium',
  },
  USOCIAL: {
    name: 'USocial',
    description: 'Funcionalidades sociales y networking',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Social*.tsx',
      'Demo/apps/superapp-unified/src/components/modules/social/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useSocial*.ts',
      'Demo/apps/superapp-unified/src/services/social*.ts',
    ],
    priority: 'high',
  },
  UPLAY: {
    name: 'UPlay',
    description: 'Sistema de gamificación y videos interactivos',
    paths: [
      'Demo/apps/superapp-unified/src/pages/UPlay*.tsx',
      'Demo/apps/superapp-unified/src/components/modules/uplay/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useUPlay*.ts',
      'Demo/apps/superapp-unified/src/services/uplay*.ts',
    ],
    priority: 'high',
  },
  UMARKET: {
    name: 'UMarket',
    description: 'Marketplace y economía colaborativa',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Marketplace*.tsx',
      'Demo/apps/superapp-unified/src/components/modules/marketplace/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useMarketplace*.ts',
      'Demo/apps/superapp-unified/src/services/marketplace*.ts',
    ],
    priority: 'medium',
  },
  CHALLENGES: {
    name: 'Challenges',
    description: 'Sistema de desafíos y misiones',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Challenges*.tsx',
      'Demo/apps/superapp-unified/src/components/modules/challenges/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useChallenges*.ts',
      'Demo/apps/superapp-unified/src/services/challenges*.ts',
    ],
    priority: 'medium',
  },
  WALLET: {
    name: 'Wallet',
    description: 'Gestión de Ünits y economía interna',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Wallet.tsx',
      'Demo/apps/superapp-unified/src/components/modules/wallet/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useWallet*.ts',
      'Demo/apps/superapp-unified/src/services/wallet*.ts',
    ],
    priority: 'high',
  },
  LETS: {
    name: 'Lets',
    description: 'Sistema de intercambios y colaboración',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Lets*.tsx',
      'Demo/apps/superapp-unified/src/components/modules/lets/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useLets*.ts',
      'Demo/apps/superapp-unified/src/services/lets*.ts',
    ],
    priority: 'medium',
  },
  PROFILE: {
    name: 'Profile',
    description: 'Gestión de perfil y configuración de usuario',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Profile.tsx',
      'Demo/apps/superapp-unified/src/components/modules/profile/**/*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useProfile*.ts',
      'Demo/apps/superapp-unified/src/services/profile*.ts',
    ],
    priority: 'medium',
  },
  AUTH: {
    name: 'Authentication',
    description: 'Sistema de autenticación y autorización',
    paths: [
      'Demo/apps/superapp-unified/src/pages/Login*.tsx',
      'Demo/apps/superapp-unified/src/pages/Register*.tsx',
      'Demo/apps/superapp-unified/src/hooks/useAuth*.ts',
      'Demo/apps/superapp-unified/src/services/auth*.ts',
      'Demo/apps/superapp-unified/src/contexts/Auth*.tsx',
    ],
    priority: 'high',
  },
  SHARED: {
    name: 'Shared Components',
    description: 'Componentes y utilidades compartidas',
    paths: [
      'Demo/apps/superapp-unified/src/components/shared/**/*.tsx',
      'Demo/apps/superapp-unified/src/utils/**/*.ts',
      'Demo/apps/superapp-unified/src/lib/**/*.ts',
      'Demo/apps/superapp-unified/src/types/**/*.ts',
    ],
    priority: 'low',
  },
};

// --- API Key ---
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error(
    '❌ Falta la API Key de Gemini. Configura GEMINI_API_KEY en tu entorno.'
  );
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Detección de lenguaje por extensión ---
function detectLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.ts', '.tsx'].includes(ext)) return 'typescript';
  if (['.js', '.jsx', '.cjs', '.mjs'].includes(ext)) return 'javascript';
  if (['.py'].includes(ext)) return 'python';
  if (['.java'].includes(ext)) return 'java';
  if (['.go'].includes(ext)) return 'go';
  if (['.rb'].includes(ext)) return 'ruby';
  if (['.php'].includes(ext)) return 'php';
  if (['.css', '.scss', '.sass', '.less'].includes(ext)) return 'css';
  if (['.html'].includes(ext)) return 'html';
  if (['.json'].includes(ext)) return 'json';
  if (['.sql'].includes(ext)) return 'sql';
  if (['.sh'].includes(ext)) return 'bash';
  if (['.c', '.h'].includes(ext)) return 'c';
  if (['.cpp', '.hpp'].includes(ext)) return 'cpp';
  if (['.cs'].includes(ext)) return 'csharp';
  if (['.swift'].includes(ext)) return 'swift';
  if (['.kt'].includes(ext)) return 'kotlin';
  if (['.rs'].includes(ext)) return 'rust';
  if (['.md'].includes(ext)) return 'markdown';
  if (['.yml', '.yaml'].includes(ext)) return 'yaml';
  return 'other';
}

// --- Lógica de revisión Gemini mejorada ---
async function reviewFile(filePath, language, moduleName) {
  try {
    const code = await fs.readFile(filePath, 'utf-8');
    const prompt = `Language: ${language}
Module: ${moduleName}
File: ${filePath}

Code:
\`\`\`${language}
${code}
\`\`\``;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) jsonStr = match[1].trim();

    try {
      const parsed = JSON.parse(jsonStr);
      return parsed.review_feedback || [];
    } catch (e) {
      return [
        {
          severity: 'Error',
          message: 'No se pudo parsear la respuesta de Gemini',
          line_number: null,
          category: 'Code Quality',
        },
      ];
    }
  } catch (e) {
    return [
      {
        severity: 'Error',
        message: `Error al llamar a Gemini: ${e.message || e}`,
        line_number: null,
        category: 'Code Quality',
      },
    ];
  }
}

// --- Función para obtener archivos de un módulo ---
async function getModuleFiles(moduleKey) {
  const config = MODULE_CONFIGS[moduleKey];
  if (!config) {
    throw new Error(`Módulo '${moduleKey}' no encontrado`);
  }

  const allFiles = [];
  for (const pattern of config.paths) {
    try {
      const files = await glob(pattern, {
        ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      });
      allFiles.push(...files);
    } catch (error) {
      console.warn(
        `⚠️ Error al buscar archivos con patrón ${pattern}:`,
        error.message
      );
    }
  }

  // Eliminar duplicados y archivos que no existen
  const uniqueFiles = [...new Set(allFiles)];
  const existingFiles = [];

  for (const file of uniqueFiles) {
    try {
      await fs.access(file);
      existingFiles.push(file);
    } catch (error) {
      console.warn(`⚠️ Archivo no encontrado: ${file}`);
    }
  }

  return existingFiles;
}

// --- Función para generar reporte ---
function generateReport(moduleKey, results) {
  const config = MODULE_CONFIGS[moduleKey];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `reports/${moduleKey}_review_${timestamp}.json`;

  const report = {
    module: moduleKey,
    moduleName: config.name,
    description: config.description,
    priority: config.priority,
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
      filesWithIssues: results.filter((r) => r.issues.length > 0).length,
      severityBreakdown: {
        Error: 0,
        Warning: 0,
        Suggestion: 0,
        Info: 0,
      },
      categoryBreakdown: {},
    },
    results: results,
  };

  // Calcular estadísticas
  results.forEach((result) => {
    result.issues.forEach((issue) => {
      report.summary.severityBreakdown[issue.severity]++;
      report.summary.categoryBreakdown[issue.category] =
        (report.summary.categoryBreakdown[issue.category] || 0) + 1;
    });
  });

  return { report, reportPath };
}

// --- Función principal de revisión de módulo ---
async function reviewModule(moduleKey, options = {}) {
  const config = MODULE_CONFIGS[moduleKey];
  if (!config) {
    console.error(
      `❌ Módulo '${moduleKey}' no encontrado. Módulos disponibles:`
    );
    Object.keys(MODULE_CONFIGS).forEach((key) => {
      console.log(`  - ${key}: ${MODULE_CONFIGS[key].name}`);
    });
    return;
  }

  console.log(`\n Iniciando revisión del módulo: ${config.name}`);
  console.log(`📝 Descripción: ${config.description}`);
  console.log(`🎯 Prioridad: ${config.priority}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  try {
    const files = await getModuleFiles(moduleKey);

    if (files.length === 0) {
      console.log(`⚠️ No se encontraron archivos para el módulo ${moduleKey}`);
      return;
    }

    console.log(`📁 Archivos encontrados: ${files.length}`);

    const results = [];
    let totalIssues = 0;

    for (const file of files) {
      const language = detectLanguage(file);
      console.log(`\n Revisando: ${file} (${language})`);

      const issues = await reviewFile(file, language, config.name);

      if (issues.length === 0) {
        console.log('  ✅ Sin problemas detectados.');
      } else {
        totalIssues += issues.length;
        issues.forEach((issue) => {
          console.log(
            `  - [${issue.severity}] [${issue.category}] Línea ${issue.line_number ?? '-'}: ${issue.message}`
          );
          if (issue.recommendation) {
            console.log(`    💡 Recomendación: ${issue.recommendation}`);
          }
        });
      }

      results.push({
        file,
        language,
        issues,
      });

      // Pausa entre archivos para evitar rate limiting
      if (options.delay) {
        await new Promise((resolve) => setTimeout(resolve, options.delay));
      }
    }

    // Generar reporte
    const { report, reportPath } = generateReport(moduleKey, results);

    // Crear directorio de reportes si no existe
    await fs.mkdir('reports', { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n📊 RESUMEN DE REVISIÓN - ${config.name}`);
    console.log(`📁 Archivos revisados: ${results.length}`);
    console.log(`🐛 Total de issues encontrados: ${totalIssues}`);
    console.log(
      `📄 Archivos con issues: ${results.filter((r) => r.issues.length > 0).length}`
    );
    console.log(`📄 Reporte guardado en: ${reportPath}`);

    // Mostrar breakdown por severidad
    console.log(`\n📊 Breakdown por severidad:`);
    Object.entries(report.summary.severityBreakdown).forEach(
      ([severity, count]) => {
        if (count > 0) {
          const icon =
            severity === 'Error'
              ? '❌'
              : severity === 'Warning'
                ? '⚠️'
                : severity === 'Suggestion'
                  ? '💡'
                  : 'ℹ️';
          console.log(`  ${icon} ${severity}: ${count}`);
        }
      }
    );

    // Mostrar breakdown por categoría
    console.log(`\n📊 Breakdown por categoría:`);
    Object.entries(report.summary.categoryBreakdown).forEach(
      ([category, count]) => {
        console.log(`  📂 ${category}: ${count}`);
      }
    );

    return report;
  } catch (error) {
    console.error(`❌ Error al revisar módulo ${moduleKey}:`, error.message);
    throw error;
  }
}

// --- Función para listar módulos disponibles ---
function listModules() {
  console.log('\n📋 MÓDULOS DISPONIBLES PARA REVISIÓN:');
  console.log('=====================================');

  Object.entries(MODULE_CONFIGS).forEach(([key, config]) => {
    const priorityIcon =
      config.priority === 'high'
        ? '🔴'
        : config.priority === 'medium'
          ? '🟡'
          : '🟢';
    console.log(`${priorityIcon} ${key}: ${config.name}`);
    console.log(`   📝 ${config.description}`);
    console.log(`   🎯 Prioridad: ${config.priority}`);
    console.log('');
  });
}

// --- Función principal ---
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🤖 GEMINI MODULAR CODE REVIEWER - CoomÜnity');
    console.log('=============================================');
    console.log('\nUso:');
    console.log('  node gemini-modular-review.js <módulo> [opciones]');
    console.log('  node gemini-modular-review.js --list');
    console.log('  node gemini-modular-review.js --all');
    console.log('\nEjemplos:');
    console.log('  node gemini-modular-review.js HOME');
    console.log('  node gemini-modular-review.js UPLAY --delay 1000');
    console.log('  node gemini-modular-review.js --all --delay 2000');
    console.log('\nOpciones:');
    console.log('  --delay <ms>     Pausa entre archivos (default: 500ms)');
    console.log('  --list           Listar módulos disponibles');
    console.log('  --all            Revisar todos los módulos');
    console.log('');
    listModules();
    return;
  }

  const options = {
    delay: 500, // default delay
  };

  // Parsear opciones
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--delay' && args[i + 1]) {
      options.delay = parseInt(args[i + 1]);
      args.splice(i, 2);
      i--;
    } else if (args[i] === '--list') {
      listModules();
      return;
    }
  }

  const moduleKey = args[0]?.toUpperCase();

  if (moduleKey === '--ALL') {
    console.log(' Iniciando revisión de TODOS los módulos...');
    const results = {};

    for (const key of Object.keys(MODULE_CONFIGS)) {
      try {
        console.log(`\n${'='.repeat(50)}`);
        results[key] = await reviewModule(key, options);
        console.log(`${'='.repeat(50)}`);
      } catch (error) {
        console.error(`❌ Error en módulo ${key}:`, error.message);
        results[key] = { error: error.message };
      }
    }

    // Reporte consolidado
    const consolidatedReport = {
      timestamp: new Date().toISOString(),
      totalModules: Object.keys(MODULE_CONFIGS).length,
      modulesReviewed: Object.keys(results).length,
      results,
    };

    const consolidatedPath = `reports/consolidated_review_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    await fs.mkdir('reports', { recursive: true });
    await fs.writeFile(
      consolidatedPath,
      JSON.stringify(consolidatedReport, null, 2)
    );

    console.log(`\n🎉 REVISIÓN COMPLETADA DE TODOS LOS MÓDULOS`);
    console.log(`📄 Reporte consolidado: ${consolidatedPath}`);
  } else if (moduleKey && MODULE_CONFIGS[moduleKey]) {
    await reviewModule(moduleKey, options);
  } else {
    console.error(`❌ Módulo '${moduleKey}' no válido.`);
    console.log('\nMódulos disponibles:');
    Object.keys(MODULE_CONFIGS).forEach((key) => {
      console.log(`  - ${key}`);
    });
  }
}

// --- Manejo de errores global ---
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// --- Ejecutar si es el archivo principal ---
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { reviewModule, listModules, MODULE_CONFIGS };
