const fs = require('fs');
const path = require('path');
const glob = require('glob');

const REPORTS_DIR = path.join(__dirname, '../../reports');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'priority-recommendations.json');

// Weights for calculating risk score
const SEVERITY_WEIGHTS = {
  Error: 3,
  Warning: 2,
  Suggestion: 1,
  Info: 0,
};

/**
 * Gathers all consolidated review reports.
 * @returns {object[]} Array of report objects.
 */
function getAllReports() {
  const reportPattern = path.join(REPORTS_DIR, 'consolidated_review_*.json');
  const reportFiles = glob.sync(reportPattern);
  return reportFiles.map((file) => JSON.parse(fs.readFileSync(file, 'utf-8')));
}

/**
 * Analyzes historical reports to calculate risk scores for each module.
 * @param {object[]} reports Array of historical report objects.
 * @returns {object} An object with modules as keys and their risk scores as values.
 */
function calculateRiskScores(reports) {
  const moduleScores = {};

  reports.forEach((report) => {
    report.results.forEach((moduleResult) => {
      const moduleName = moduleResult.module;
      if (!moduleScores[moduleName]) {
        moduleScores[moduleName] = { score: 0, issues: 0 };
      }

      const score = Object.entries(
        moduleResult.summary.severityBreakdown
      ).reduce((acc, [severity, count]) => {
        return acc + (SEVERITY_WEIGHTS[severity] || 0) * count;
      }, 0);

      moduleScores[moduleName].score += score;
      moduleScores[moduleName].issues += moduleResult.summary.totalIssues;
    });
  });

  return moduleScores;
}

function main() {
  console.log('--- Module Prioritization Analysis ---');
  const allReports = getAllReports();

  if (allReports.length === 0) {
    console.log('No reports found to analyze.');
    return;
  }

  const riskScores = calculateRiskScores(allReports);

  const sortedModules = Object.entries(riskScores)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.score - a.score);

  const recommendations = {
    timestamp: new Date().toISOString(),
    recommendations: sortedModules,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(recommendations, null, 2));
  console.log(`✅ Priority recommendations saved to ${OUTPUT_FILE}`);
  console.log('Top 3 modules needing attention:');
  sortedModules.slice(0, 3).forEach((mod, i) => {
    console.log(`${i + 1}. ${mod.name} (Risk Score: ${mod.score})`);
  });
}

main();
