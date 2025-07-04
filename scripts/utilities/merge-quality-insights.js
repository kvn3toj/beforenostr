const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

const REPORTS_DIR = path.join(__dirname, '../../reports');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'consolidated-quality-report.json');

// Module path mappings to categorize ESLint results
const MODULE_PATHS = {
  HOME: ['src/pages/Home.tsx', 'src/components/home/**/*'],
  USTATS: ['src/pages/UStats*.tsx', 'src/components/ustats/**/*'],
  USOCIAL: ['src/pages/USocial*.tsx', 'src/components/usocial/**/*'],
  UPLAY: ['src/pages/UPlay*.tsx', 'src/components/uplay/**/*'],
  UMARKET: ['src/pages/UMarket*.tsx', 'src/components/umarket/**/*'],
  CHALLENGES: ['src/pages/Challenges*.tsx', 'src/components/challenges/**/*'],
  WALLET: ['src/pages/Wallet*.tsx', 'src/components/wallet/**/*'],
  LETS: ['src/pages/Lets*.tsx', 'src/components/lets/**/*'],
  PROFILE: ['src/pages/Profile*.tsx', 'src/components/profile/**/*'],
  AUTH: ['src/pages/Login*.tsx', 'src/components/auth/**/*'],
  SHARED: ['src/components/shared/**/*', 'src/lib/**/*', 'src/hooks/**/*'],
};

/**
 * Runs ESLint and returns results in JSON format.
 * @returns {object[]} ESLint results array.
 */
function runESLint() {
  try {
    console.log('Running ESLint analysis...');
    const eslintCommand =
      'cd Demo/apps/superapp-unified && npx eslint src/ --format json --no-error-on-unmatched-pattern';
    const eslintOutput = execSync(eslintCommand, { encoding: 'utf-8' });
    return JSON.parse(eslintOutput);
  } catch (error) {
    console.warn(
      'ESLint execution failed, using empty results:',
      error.message
    );
    return [];
  }
}

/**
 * Gets the latest Gemini modular review report.
 * @returns {object|null} Latest consolidated report or null.
 */
function getLatestGeminiReport() {
  const reportPattern = path.join(REPORTS_DIR, 'consolidated_review_*.json');
  const reports = glob.sync(reportPattern);

  if (reports.length === 0) return null;

  reports.sort(
    (a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime()
  );
  return JSON.parse(fs.readFileSync(reports[0], 'utf-8'));
}

/**
 * Maps a file path to its corresponding module.
 * @param {string} filePath
 * @returns {string} Module name or 'UNKNOWN'.
 */
function getModuleForFile(filePath) {
  for (const [module, patterns] of Object.entries(MODULE_PATHS)) {
    for (const pattern of patterns) {
      // Simple pattern matching (can be enhanced with proper glob matching)
      if (
        filePath.includes(pattern.replace('**/*', '')) ||
        filePath.match(pattern.replace('*', '.*'))
      ) {
        return module;
      }
    }
  }
  return 'UNKNOWN';
}

/**
 * Processes ESLint results and groups them by module.
 * @param {object[]} eslintResults
 * @returns {object} ESLint results grouped by module.
 */
function processESLintResults(eslintResults) {
  const moduleResults = {};

  eslintResults.forEach((fileResult) => {
    const module = getModuleForFile(fileResult.filePath);

    if (!moduleResults[module]) {
      moduleResults[module] = {
        totalIssues: 0,
        errors: 0,
        warnings: 0,
        files: [],
      };
    }

    const issueCount = fileResult.messages.length;
    const errorCount = fileResult.messages.filter(
      (msg) => msg.severity === 2
    ).length;
    const warningCount = fileResult.messages.filter(
      (msg) => msg.severity === 1
    ).length;

    moduleResults[module].totalIssues += issueCount;
    moduleResults[module].errors += errorCount;
    moduleResults[module].warnings += warningCount;
    moduleResults[module].files.push({
      filePath: fileResult.filePath,
      issues: issueCount,
      errors: errorCount,
      warnings: warningCount,
    });
  });

  return moduleResults;
}

/**
 * Simulates test coverage data (placeholder for real implementation).
 * @returns {object} Mock test coverage data by module.
 */
function getTestCoverage() {
  return {
    HOME: { coverage: 85 },
    USTATS: { coverage: 70 },
    USOCIAL: { coverage: 65 },
    UPLAY: { coverage: 90 },
    UMARKET: { coverage: 55 },
    CHALLENGES: { coverage: 80 },
    WALLET: { coverage: 75 },
    LETS: { coverage: 60 },
    PROFILE: { coverage: 85 },
    AUTH: { coverage: 95 },
    SHARED: { coverage: 88 },
  };
}

function main() {
  console.log('--- Consolidated Quality Analysis ---');

  const eslintResults = runESLint();
  const geminiReport = getLatestGeminiReport();
  const testCoverage = getTestCoverage();

  if (!geminiReport) {
    console.log('No Gemini report found. Cannot create consolidated report.');
    return;
  }

  const eslintByModule = processESLintResults(eslintResults);

  const consolidatedReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalModules: Object.keys(MODULE_PATHS).length,
      geminiTotalIssues: geminiReport.summary.totalIssues,
      eslintTotalIssues: Object.values(eslintByModule).reduce(
        (sum, mod) => sum + mod.totalIssues,
        0
      ),
    },
    modules: {},
  };

  // Merge data for each module
  Object.keys(MODULE_PATHS).forEach((moduleName) => {
    const geminiData = geminiReport.results.find(
      (r) => r.module === moduleName
    ) || { summary: { totalIssues: 0, severityBreakdown: {} } };
    const eslintData = eslintByModule[moduleName] || {
      totalIssues: 0,
      errors: 0,
      warnings: 0,
    };
    const coverageData = testCoverage[moduleName] || { coverage: 0 };

    consolidatedReport.modules[moduleName] = {
      gemini: {
        totalIssues: geminiData.summary.totalIssues,
        severityBreakdown: geminiData.summary.severityBreakdown,
      },
      eslint: {
        totalIssues: eslintData.totalIssues,
        errors: eslintData.errors,
        warnings: eslintData.warnings,
      },
      testCoverage: coverageData.coverage,
      overallScore: Math.max(
        0,
        100 -
          geminiData.summary.totalIssues * 2 -
          eslintData.totalIssues * 1.5 -
          (100 - coverageData.coverage)
      ).toFixed(1),
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(consolidatedReport, null, 2));
  console.log(`✅ Consolidated quality report saved to ${OUTPUT_FILE}`);

  // Show top issues
  const moduleScores = Object.entries(consolidatedReport.modules).sort(
    ([, a], [, b]) => parseFloat(a.overallScore) - parseFloat(b.overallScore)
  );

  console.log('\nModules needing attention (lowest scores first):');
  moduleScores.slice(0, 3).forEach(([module, data]) => {
    console.log(
      `${module}: ${data.overallScore}/100 (Gemini: ${data.gemini.totalIssues}, ESLint: ${data.eslint.totalIssues}, Coverage: ${data.testCoverage}%)`
    );
  });
}

main();
