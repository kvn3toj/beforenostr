const fs = require('fs');
const path = require('path');
const glob = require('glob');

const REPORTS_DIR = path.join(__dirname, '../../reports');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'historical-trends.json');

/**
 * Gathers and sorts all consolidated review reports by date.
 * @returns {object[]} Array of report objects, sorted oldest to newest.
 */
function getAllReportsSorted() {
  const reportPattern = path.join(REPORTS_DIR, 'consolidated_review_*.json');
  const reportFiles = glob.sync(reportPattern);

  const reports = reportFiles.map((file) => {
    const report = JSON.parse(fs.readFileSync(file, 'utf-8'));
    // Ensure timestamp exists for sorting
    if (!report.timestamp) {
      report.timestamp = new Date(fs.statSync(file).mtime).toISOString();
    }
    return report;
  });

  reports.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return reports;
}

/**
 * Processes historical reports to generate trend data.
 * @param {object[]} reports - Sorted array of historical report objects.
 * @returns {object} An object containing trend data.
 */
function generateTrendData(reports) {
  const trends = {
    overall: [],
    byModule: {},
  };

  reports.forEach((report) => {
    const date = report.timestamp.split('T')[0];

    // Overall trends
    trends.overall.push({
      date,
      totalIssues: report.summary.totalIssues,
      severity: report.summary.severityBreakdown,
    });

    // Per-module trends
    report.results.forEach((moduleResult) => {
      const moduleName = moduleResult.module;
      if (!trends.byModule[moduleName]) {
        trends.byModule[moduleName] = [];
      }
      trends.byModule[moduleName].push({
        date,
        totalIssues: moduleResult.summary.totalIssues,
        severity: moduleResult.summary.severityBreakdown,
      });
    });
  });

  return trends;
}

function main() {
  console.log('--- Historical Trend Analysis ---');
  const allReports = getAllReportsSorted();

  if (allReports.length < 2) {
    console.log('Insufficient reports to generate trends. Need at least two.');
    return;
  }

  const trendData = generateTrendData(allReports);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trendData, null, 2));
  console.log(`✅ Historical trend data saved to ${OUTPUT_FILE}`);
}

main();
