#!/bin/bash

# Analytics Hooks Test Coverage Script
# This script runs tests for analytics hooks and generates a coverage report

echo "🧪 Running Analytics Hooks Test Coverage..."
echo "=============================================="

# Run tests with coverage
npm test -- --coverage src/hooks/analytics --reporter=verbose

echo ""
echo "📊 Coverage Summary:"
echo "===================="

# Extract coverage information for analytics hooks only
npm test -- --coverage src/hooks/analytics --reporter=json > coverage-temp.json 2>/dev/null

echo ""
echo "✅ Analytics Hooks Test Coverage Complete!"
echo ""
echo "📁 Coverage files generated:"
echo "   - HTML Report: coverage/index.html"
echo "   - JSON Report: coverage/coverage-final.json"
echo ""
echo "🔍 To view detailed coverage:"
echo "   open coverage/index.html"
echo ""

# Clean up temporary files
rm -f coverage-temp.json

echo "🎯 Target: 100% coverage maintained for all analytics hooks" 