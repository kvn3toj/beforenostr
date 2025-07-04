const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../../reports');
const TRENDS_FILE = path.join(REPORTS_DIR, 'historical-trends.json');
const PRIORITY_FILE = path.join(REPORTS_DIR, 'priority-recommendations.json');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'predictive-alerts.json');

/**
 * Reads a JSON file safely.
 * @param {string} filePath
 * @returns {object|null} Parsed JSON object or null if file doesn't exist.
 */
function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: File not found at ${filePath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Analyzes trends to find modules with increasing error counts.
 * @param {object} trendData
 * @returns {string[]} A list of module names with negative trends.
 */
function findModulesWithNegativeTrends(trendData) {
  const negativeTrendModules = [];
  if (!trendData || !trendData.byModule) return negativeTrendModules;

  for (const moduleName in trendData.byModule) {
    const history = trendData.byModule[moduleName];
    if (history.length < 2) continue;

    const last = history[history.length - 1];
    const secondLast = history[history.length - 2];

    const lastErrors = last.severity.Error || 0;
    const secondLastErrors = secondLast.severity.Error || 0;

    // If errors have increased, flag it as a negative trend.
    if (lastErrors > secondLastErrors) {
      negativeTrendModules.push(moduleName);
    }
  }
  return negativeTrendModules;
}

function main() {
  console.log('--- Predictive Recommendation Analysis ---');
  const trends = readJsonFile(TRENDS_FILE);
  const priorities = readJsonFile(PRIORITY_FILE);

  if (!trends || !priorities) {
    console.log(
      'Missing trend or priority data. Cannot generate recommendations.'
    );
    return;
  }

  const recommendations = [];
  const highPriorityModules = priorities.recommendations
    .slice(0, 5)
    .map((p) => p.name);
  const modulesWithBadTrends = findModulesWithNegativeTrends(trends);

  // Recommendation 1: High priority module with a negative trend
  highPriorityModules.forEach((moduleName) => {
    if (modulesWithBadTrends.includes(moduleName)) {
      recommendations.push({
        type: 'CRITICAL_ACTION',
        module: moduleName,
        message: `This high-priority module has a growing number of 'Error' level issues. Immediate review is recommended.`,
        reason: 'High risk score + Increasing error trend',
      });
    }
  });

  // Recommendation 2: Any module with a negative trend
  modulesWithBadTrends.forEach((moduleName) => {
    if (!recommendations.some((r) => r.module === moduleName)) {
      recommendations.push({
        type: 'PREVENTIVE_ACTION',
        module: moduleName,
        message: `This module shows a recent increase in 'Error' level issues. A preventive review is advised.`,
        reason: 'Increasing error trend',
      });
    }
  });

  const output = {
    timestamp: new Date().toISOString(),
    alerts: recommendations,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(
    `✅ Predictive alerts and recommendations saved to ${OUTPUT_FILE}`
  );
}

main();
