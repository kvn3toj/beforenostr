const fs = require('fs');
const path = require('path');
const glob = require('glob');

const REPORTS_DIR = path.join(__dirname, '../../reports');

/**
 * Finds and sorts consolidated review reports by timestamp.
 * @returns {string[]} Sorted list of report file paths.
 */
function getSortedReports() {
  const reportPattern = path.join(REPORTS_DIR, 'consolidated_review_*.json');
  const reports = glob.sync(reportPattern);

  // Sort by timestamp desc (newest first)
  reports.sort((a, b) => {
    const timeA = fs.statSync(a).mtime.getTime();
    const timeB = fs.statSync(b).mtime.getTime();
    return timeB - timeA;
  });

  return reports;
}

/**
 * Compares two reports and logs a summary of changes.
 * @param {object} oldReport The older report object.
 * @param {object} newReport The newer report object.
 */
function compareReports(oldReport, newReport) {
  console.log('--- Report Comparison ---');
  console.log(
    `Comparing ${path.basename(oldReport.filePath)} with ${path.basename(newReport.filePath)}`
  );

  const oldTotal = oldReport.summary.totalIssues;
  const newTotal = newReport.summary.totalIssues;
  const difference = newTotal - oldTotal;

  console.log(`\nTotal Issues:`);
  console.log(`- Previous: ${oldTotal}`);
  console.log(`- Current:  ${newTotal}`);

  if (difference > 0) {
    console.log(`- Result:   🔴 ${difference} new issue(s) detected.`);
  } else if (difference < 0) {
    console.log(`- Result:   🟢 ${Math.abs(difference)} issue(s) resolved.`);
  } else {
    console.log(`- Result:   ⚪️ No change in total issues.`);
  }
}

function main() {
  const sortedReports = getSortedReports();

  if (sortedReports.length < 2) {
    console.log(
      'Insufficient reports to compare. Need at least two consolidated reports.'
    );
    return;
  }

  const newReportPath = sortedReports[0];
  const oldReportPath = sortedReports[1];

  const newReport = JSON.parse(fs.readFileSync(newReportPath, 'utf-8'));
  const oldReport = JSON.parse(fs.readFileSync(oldReportPath, 'utf-8'));
  newReport.filePath = newReportPath;
  oldReport.filePath = oldReportPath;

  compareReports(oldReport, newReport);
}

main();
