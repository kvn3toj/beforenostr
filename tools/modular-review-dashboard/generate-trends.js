#!/usr/bin/env node

/**
 * 🔍 Generate Historical Trends Data for Dashboard
 *
 * This script creates historical trends data based on real Gemini reports
 * for the CoomÜnity Modular Review Dashboard.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the latest consolidated report
const latestReportPath = path.join(
  __dirname,
  'test-data',
  'latest-report.json'
);
const historicalDataPath = path.join(
  __dirname,
  'test-data',
  'historical-trends.json'
);

try {
  console.log('🔍 Generating historical trends data...');

  const latestReport = JSON.parse(fs.readFileSync(latestReportPath, 'utf8'));

  // Generate historical data points (simulating 30 days of data)
  const historicalTrends = {
    timestamp: new Date().toISOString(),
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
    trends: {
      totalIssues: [],
      criticalIssues: [],
      moduleBreakdown: [],
      severityTrends: [],
    },
  };

  // Generate 30 days of trend data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    // Simulate gradual improvement over time with some variance
    const improvementFactor = 1 - (i / 30) * 0.3; // 30% improvement over 30 days
    const variance = 0.8 + Math.random() * 0.4; // ±20% variance

    const baseTotalIssues = latestReport.summary.totalIssues;
    const baseCriticalIssues = latestReport.summary.severityBreakdown.Error;

    const totalIssues = Math.round(
      (baseTotalIssues / improvementFactor) * variance
    );
    const criticalIssues = Math.round(
      (baseCriticalIssues / improvementFactor) * variance
    );

    historicalTrends.trends.totalIssues.push({
      date: dateStr,
      value: totalIssues,
    });

    historicalTrends.trends.criticalIssues.push({
      date: dateStr,
      value: criticalIssues,
    });

    // Generate module breakdown for this date
    const moduleData = [];
    latestReport.modules.forEach((module) => {
      const moduleIssues = Math.round(
        (module.summary.totalIssues / improvementFactor) * variance
      );
      moduleData.push({
        module: module.module,
        issues: Math.max(0, moduleIssues),
        priority: module.priority,
      });
    });

    historicalTrends.trends.moduleBreakdown.push({
      date: dateStr,
      modules: moduleData,
    });

    // Generate severity trends
    const severityData = {};
    Object.keys(latestReport.summary.severityBreakdown).forEach((severity) => {
      const baseValue = latestReport.summary.severityBreakdown[severity];
      severityData[severity] = Math.round(
        (baseValue / improvementFactor) * variance
      );
    });

    historicalTrends.trends.severityTrends.push({
      date: dateStr,
      severities: severityData,
    });
  }

  // Write historical trends data
  fs.writeFileSync(
    historicalDataPath,
    JSON.stringify(historicalTrends, null, 2)
  );

  console.log('✅ Historical trends data generated successfully!');
  console.log(
    `📊 Generated ${historicalTrends.trends.totalIssues.length} data points`
  );
  console.log(`📁 Saved to: ${historicalDataPath}`);

  // Also create a quick summary
  const summary = {
    generatedAt: new Date().toISOString(),
    dataPoints: historicalTrends.trends.totalIssues.length,
    periodCovered: '30 days',
    baselineReport: latestReport.timestamp,
    modules: latestReport.modules.length,
    totalIssuesRange: {
      min: Math.min(...historicalTrends.trends.totalIssues.map((d) => d.value)),
      max: Math.max(...historicalTrends.trends.totalIssues.map((d) => d.value)),
      latest:
        historicalTrends.trends.totalIssues[
          historicalTrends.trends.totalIssues.length - 1
        ].value,
    },
  };

  console.log('\n📈 Trends Summary:');
  console.log(`   📊 Data Points: ${summary.dataPoints}`);
  console.log(`   📅 Period: ${summary.periodCovered}`);
  console.log(`   🎯 Modules: ${summary.modules}`);
  console.log(
    `   📉 Issues Range: ${summary.totalIssuesRange.min} - ${summary.totalIssuesRange.max}`
  );
  console.log(`   🔥 Latest: ${summary.totalIssuesRange.latest} issues`);
} catch (error) {
  console.error('❌ Error generating historical trends:', error.message);
  process.exit(1);
}
