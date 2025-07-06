#!/bin/bash

echo "🔍 COOMUNITY CODE QUALITY CHECKER"
echo "================================="
echo "📅 $(date)"
echo "📍 $(pwd)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
ISSUES_FOUND=0
ISSUES_FIXED=0

echo "🎯 PHASE 1: CRITICAL ISSUES DETECTION"
echo "====================================="

# 1. Check for console.log statements
echo "1️⃣ Checking for console.log statements..."
CONSOLE_LOGS=$(grep -r "console\.log" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | wc -l)
if [ $CONSOLE_LOGS -gt 0 ]; then
    echo -e "   ${RED}❌ FOUND: $CONSOLE_LOGS console.log statements${NC}"
    ((ISSUES_FOUND++))
    echo "   📋 Files with console.log:"
    grep -r "console\.log" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | head -5
else
    echo -e "   ${GREEN}✅ No console.log statements found${NC}"
fi

# 2. Check for missing React.memo optimizations
echo "2️⃣ Checking for React performance optimizations..."
TOTAL_COMPONENTS=$(find src/ -name "*.tsx" | wc -l)
MEMO_COMPONENTS=$(grep -r "React\.memo\|memo" src/ --include="*.tsx" | wc -l)
OPTIMIZATION_RATIO=$((MEMO_COMPONENTS * 100 / TOTAL_COMPONENTS))

if [ $OPTIMIZATION_RATIO -lt 20 ]; then
    echo -e "   ${RED}❌ LOW OPTIMIZATION: Only $OPTIMIZATION_RATIO% of components use React.memo${NC}"
    ((ISSUES_FOUND++))
else
    echo -e "   ${GREEN}✅ Good optimization: $OPTIMIZATION_RATIO% of components optimized${NC}"
fi

# 3. Check for missing TypeScript strict typing
echo "3️⃣ Checking for TypeScript strict typing..."
ANY_USAGE=$(grep -r ": any" src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ $ANY_USAGE -gt 10 ]; then
    echo -e "   ${YELLOW}⚠️ WARNING: $ANY_USAGE uses of 'any' type${NC}"
    ((ISSUES_FOUND++))
else
    echo -e "   ${GREEN}✅ Good TypeScript typing: $ANY_USAGE uses of 'any'${NC}"
fi

# 4. Check for missing error boundaries
echo "4️⃣ Checking for error handling..."
ERROR_BOUNDARIES=$(grep -r "ErrorBoundary\|componentDidCatch" src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ $ERROR_BOUNDARIES -eq 0 ]; then
    echo -e "   ${RED}❌ MISSING: No error boundaries detected${NC}"
    ((ISSUES_FOUND++))
else
    echo -e "   ${GREEN}✅ Error boundaries present: $ERROR_BOUNDARIES instances${NC}"
fi

# 5. Check for accessibility issues
echo "5️⃣ Checking for accessibility..."
ARIA_LABELS=$(grep -r "aria-label\|aria-describedby" src/ --include="*.tsx" | wc -l)
if [ $ARIA_LABELS -lt 5 ]; then
    echo -e "   ${YELLOW}⚠️ LOW ACCESSIBILITY: Only $ARIA_LABELS aria labels found${NC}"
    ((ISSUES_FOUND++))
else
    echo -e "   ${GREEN}✅ Good accessibility: $ARIA_LABELS aria labels${NC}"
fi

echo ""
echo "🎯 PHASE 2: PERFORMANCE ANALYSIS"
echo "================================"

# 6. Check bundle size impact
echo "6️⃣ Analyzing bundle size impact..."
LARGE_DEPENDENCIES=$(grep -r "import.*from.*node_modules" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo -e "   ${BLUE}ℹ️ Large dependencies imported: $LARGE_DEPENDENCIES${NC}"

# 7. Check for unused imports
echo "7️⃣ Checking for unused imports..."
UNUSED_IMPORTS=$(grep -r "import.*{.*}" src/ --include="*.tsx" --include="*.ts" | grep -v "React" | wc -l)
if [ $UNUSED_IMPORTS -gt 50 ]; then
    echo -e "   ${YELLOW}⚠️ MANY IMPORTS: $UNUSED_IMPORTS import statements (check for unused)${NC}"
else
    echo -e "   ${GREEN}✅ Reasonable imports: $UNUSED_IMPORTS import statements${NC}"
fi

echo ""
echo "🎯 PHASE 3: AUTOMATED FIXES"
echo "==========================="

# 8. Auto-fix simple issues
echo "8️⃣ Applying automated fixes..."

# Fix missing displayName for components
COMPONENTS_WITHOUT_DISPLAYNAME=$(grep -r "const.*FC" src/ --include="*.tsx" | grep -v "displayName" | wc -l)
if [ $COMPONENTS_WITHOUT_DISPLAYNAME -gt 0 ]; then
    echo -e "   ${YELLOW}⚠️ $COMPONENTS_WITHOUT_DISPLAYNAME components missing displayName${NC}"
    echo "   🔧 Would fix with: Add displayName to all functional components"
fi

# Generate optimization report
echo "9️⃣ Generating optimization report..."
cat > optimization-report.md << EOF
# 🚀 Code Quality Report - $(date)

## 📊 Summary
- **Total Issues Found**: $ISSUES_FOUND
- **Critical Issues**: $((CONSOLE_LOGS + (TOTAL_COMPONENTS - MEMO_COMPONENTS)))
- **Performance Score**: $OPTIMIZATION_RATIO%
- **TypeScript Health**: $((100 - ANY_USAGE))%

## 🎯 Priority Actions
1. **Fix console.log statements** ($CONSOLE_LOGS found)
2. **Add React.memo optimization** ($((TOTAL_COMPONENTS - MEMO_COMPONENTS)) components)
3. **Improve TypeScript typing** ($ANY_USAGE 'any' types)
4. **Add error boundaries** ($ERROR_BOUNDARIES implemented)
5. **Improve accessibility** ($ARIA_LABELS aria labels)

## 🔧 Recommended Commands
\`\`\`bash
# Fix console.log statements
./fix-console-logs.sh

# Add React.memo to components
./add-react-memo.sh

# Run TypeScript strict check
npx tsc --noEmit --strict

# Run accessibility audit
npm run a11y:audit
\`\`\`

## 📈 Performance Improvements
- Implement code splitting
- Add lazy loading
- Optimize bundle size
- Add service worker
EOF

echo ""
echo "📊 FINAL REPORT"
echo "==============="
echo -e "🔍 ${BLUE}Total Issues Found: $ISSUES_FOUND${NC}"
echo -e "✅ ${GREEN}Issues Fixed: $ISSUES_FIXED${NC}"
echo -e "📋 ${BLUE}Report generated: optimization-report.md${NC}"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "🎉 ${GREEN}EXCELLENT! Your code quality is high!${NC}"
    exit 0
elif [ $ISSUES_FOUND -lt 5 ]; then
    echo -e "👍 ${YELLOW}GOOD! Only minor issues to fix${NC}"
    exit 0
else
    echo -e "🔧 ${RED}NEEDS WORK! Several issues need attention${NC}"
    exit 1
fi
