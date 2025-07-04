const fs = require('fs');
const path = require('path');
const glob = require('glob');

const REPORTS_DIR = path.join(__dirname, '../../reports');
const HIGH_SEVERITY_THRESHOLD = 5; // Trigger alert if "Error" severity issues increase by this much

/**
 * Finds the latest consolidated review report.
 * @returns {string|null} Path to the latest report or null.
 */
function getLatestReport() {
  const reportPattern = path.join(REPORTS_DIR, 'consolidated_review_*.json');
  const reports = glob.sync(reportPattern);

  if (reports.length === 0) return null;

  reports.sort(
    (a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime()
  );
  return reports[0];
}

/**
 * Analyzes a report to decide if an alert is needed.
 * @param {object} report The report object.
 */
function analyzeAndAlert(report) {
  console.log('--- Alert Analysis ---');

  const highSeverityIssues = report.summary.severityBreakdown.Error || 0;

  let alertNeeded = false;
  let alertMessage = '';

  if (highSeverityIssues > HIGH_SEVERITY_THRESHOLD) {
    alertNeeded = true;
    alertMessage = `🔴 Critical Alert: ${highSeverityIssues} high-severity (Error) issues found! Threshold is ${HIGH_SEVERITY_THRESHOLD}.`;
  } else {
    alertMessage = `🟢 Alert Status: No critical conditions met. ${highSeverityIssues} high-severity issues found.`;
  }

  console.log(alertMessage);

  // This is where you would integrate with Slack, Discord, etc.
  // For now, we just log to the console.
  if (alertNeeded) {
    console.log('Action: Sending notification to team channel...');
    // Example: sendToSlack(alertMessage);
  }
}

function main() {
  const latestReportPath = getLatestReport();

  if (!latestReportPath) {
    console.log('No reports found to analyze for alerts.');
    return;
  }

  const report = JSON.parse(fs.readFileSync(latestReportPath, 'utf-8'));
  analyzeAndAlert(report);
}

main();
