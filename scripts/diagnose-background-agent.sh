#!/bin/bash

echo "🔍 CoomÜnity Background Agent Diagnostic Script"
echo "=============================================="

# Check 1: Directory Path
echo "📁 Checking directory path..."
CURRENT_DIR=$(pwd)
echo "Current directory: $CURRENT_DIR"
if [[ "$CURRENT_DIR" == *" "* ]]; then
    echo "❌ WARNING: Directory path contains spaces which can cause Background Agent failures"
    echo "   Recommendation: Move project to a path without spaces"
else
    echo "✅ Directory path looks good"
fi

# Check 2: Git Status
echo ""
echo "🔧 Checking Git configuration..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ Git repository initialized"
    echo "Branch: $(git branch --show-current)"
    echo "Remote: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"
else
    echo "❌ Git not initialized"
fi

# Check 3: Background Agent Files
echo ""
echo "📋 Checking Background Agent configuration..."
if [ -f ".cursor/environment.json" ]; then
    echo "✅ environment.json exists"
else
    echo "❌ environment.json missing"
fi

if [ -f ".cursor/mcp.json" ]; then
    echo "✅ mcp.json exists"
else
    echo "⚠️ mcp.json missing (optional)"
fi

# Check 4: Node.js and Dependencies
echo ""
echo "📦 Checking Node.js environment..."
echo "Node version: $(node --version 2>/dev/null || echo 'Not installed')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'Not installed')"

if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
fi

# Check 5: Environment Variables
echo ""
echo "🔐 Checking environment setup..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo "Environment variables count: $(wc -l < .env)"
else
    echo "⚠️ .env file missing"
fi

# Check 6: Network Connectivity
echo ""
echo "🌐 Checking network connectivity..."
if curl -s --max-time 5 https://api.github.com > /dev/null; then
    echo "✅ GitHub API accessible"
else
    echo "❌ Cannot reach GitHub API"
fi

# Check 7: Cursor-specific checks
echo ""
echo "🎯 Cursor-specific checks..."
if [ -d ".cursor" ]; then
    echo "✅ .cursor directory exists"
    echo "Configuration files:"
    ls -la .cursor/ | grep -E '\.(json|md)$' || echo "No configuration files found"
else
    echo "❌ .cursor directory missing"
fi

echo ""
echo "🏁 Diagnostic complete!"
echo ""
echo "📋 Recommendations:"
echo "1. If directory has spaces, move to path without spaces"
echo "2. Ensure GitHub is connected in Cursor settings (cursor.com/integrations)"
echo "3. Verify repository permissions (read-write access required)"
echo "4. Try restarting Cursor after making changes"
echo "5. If issues persist, check Cursor forum for latest updates" 