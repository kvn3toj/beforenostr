#!/bin/bash
# 🌿 CoomÜnity Productivity Automation Script
# Integrates health monitoring, extension management, and natural workflow patterns

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# CoomÜnity Philosophy Constants
AYNI_THRESHOLD=80     # Reciprocity balance
MERITO_TARGET=90      # Quality target
BIEN_COMUN_MIN=85     # Common good minimum

echo -e "${PURPLE}🌿 CoomÜnity Productivity Automation System${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════${NC}"
echo ""

# ================================================================
# 1. MORNING RITUAL (Initialization)
# ================================================================
morning_ritual() {
    echo -e "${BLUE}☀️ MORNING RITUAL - Natural System Startup${NC}"
    echo "─────────────────────────────────────────────"
    
    # Check system vitals
    echo "🔍 Checking system vital signs..."
    
    # PostgreSQL Health (adapted for different OS)
    if command -v brew >/dev/null && brew services list | grep postgresql | grep started > /dev/null; then
        echo -e "✅ PostgreSQL: ${GREEN}Healthy${NC}"
    elif systemctl is-active --quiet postgresql 2>/dev/null; then
        echo -e "✅ PostgreSQL: ${GREEN}Healthy${NC}"
    else
        echo -e "⚠️  PostgreSQL: ${YELLOW}May need to be started${NC}"
    fi
    
    # Backend Health Check
    if curl -s http://localhost:3002/health > /dev/null; then
        echo -e "✅ Backend: ${GREEN}Responding${NC}"
    else
        echo -e "⚠️  Backend: ${YELLOW}May need restart${NC}"
    fi
    
    # Clean development environment
    echo "🧹 Cleaning development environment..."
    pkill -f "vite" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    
    # Check VS Code extensions health
    check_extensions_health
    
    # Set daily intentions
    set_daily_intentions
    
    echo -e "${GREEN}✨ Morning ritual completed. Ready for productive day!${NC}"
    echo ""
}

# ================================================================
# 2. EXTENSION HEALTH MONITORING
# ================================================================
check_extensions_health() {
    echo "🔧 Checking VS Code extensions health..."
    
    # Critical extensions for CoomÜnity
    critical_extensions=(
        "ms-ossdata.vscode-postgresql"
        "humao.rest-client"
        "prisma.prisma"
        "ms-playwright.playwright"
        "streetsidesoftware.code-spell-checker"
        "sonarsource.sonarlint-vscode"
        "eamodio.gitlens"
    )
    
    missing_extensions=()
    
    for ext in "${critical_extensions[@]}"; do
        if command -v code >/dev/null && code --list-extensions | grep -q "$ext"; then
            echo -e "   ✅ $ext"
        else
            echo -e "   ❌ $ext ${YELLOW}(MISSING)${NC}"
            missing_extensions+=("$ext")
        fi
    done
    
    # Auto-install missing extensions (only if code command exists)
    if [ ${#missing_extensions[@]} -gt 0 ] && command -v code >/dev/null; then
        echo ""
        echo -e "${YELLOW}🔧 Auto-installing missing extensions...${NC}"
        for ext in "${missing_extensions[@]}"; do
            echo "Installing $ext..."
            code --install-extension "$ext"
        done
        echo -e "${GREEN}✅ Extension installation completed${NC}"
    elif [ ${#missing_extensions[@]} -gt 0 ]; then
        echo -e "${YELLOW}💡 Install missing extensions manually in VS Code${NC}"
    fi
}

# ================================================================
# 3. NATURAL WORKFLOW PATTERN DETECTION
# ================================================================
detect_workflow_pattern() {
    echo -e "${BLUE}🧠 Detecting Natural Workflow Pattern${NC}"
    echo "─────────────────────────────────────────"
    
    HOUR=$(date +%H)
    WEEKDAY=$(date +%u) # 1=Monday, 7=Sunday
    
    # Circadian rhythm optimization
    if [ $HOUR -ge 6 ] && [ $HOUR -le 9 ]; then
        PATTERN="morning_focus"
        RECOMMENDATION="🌅 Morning energy peak - Perfect for complex problem solving"
    elif [ $HOUR -ge 10 ] && [ $HOUR -le 12 ]; then
        PATTERN="cognitive_peak"
        RECOMMENDATION="🧠 Cognitive peak - Ideal for architectural decisions"
    elif [ $HOUR -ge 13 ] && [ $HOUR -le 15 ]; then
        PATTERN="post_lunch_creative"
        RECOMMENDATION="🎨 Creative hours - Great for UI/UX improvements"
    elif [ $HOUR -ge 16 ] && [ $HOUR -le 18 ]; then
        PATTERN="systematic_work"
        RECOMMENDATION="📊 Systematic work - Perfect for testing and refactoring"
    elif [ $HOUR -ge 19 ] && [ $HOUR -le 21 ]; then
        PATTERN="reflection_planning"
        RECOMMENDATION="🌙 Reflection time - Ideal for planning and documentation"
    else
        PATTERN="rest_mode"
        RECOMMENDATION="😴 Rest mode - Time to step away from the screen"
    fi
    
    echo "Current Pattern: $PATTERN"
    echo "Recommendation: $RECOMMENDATION"
    
    # Weekly cycle consideration
    if [ $WEEKDAY -eq 1 ]; then
        echo "🗓️  Monday: Planning and architecture focus"
    elif [ $WEEKDAY -eq 5 ]; then
        echo "🗓️  Friday: Code cleanup and documentation"
    fi
    
    echo ""
}

# ================================================================
# 4. PRODUCTIVITY METRICS ANALYZER
# ================================================================
analyze_productivity() {
    echo -e "${BLUE}📊 CoomÜnity Productivity Analysis${NC}"
    echo "─────────────────────────────────────────"
    
    # Git activity analysis
    TODAY=$(date +%Y-%m-%d)
    COMMITS_TODAY=$(git log --since="$TODAY 00:00:00" --oneline 2>/dev/null | wc -l)
    
    # Calculate CoomÜnity metrics
    calculate_ayni_score
    calculate_merito_score
    calculate_bien_comun_score
    
    echo "📈 Today's Progress:"
    echo "   Commits: $COMMITS_TODAY"
    echo "   Ayni Score: $AYNI_SCORE/100"
    echo "   Mérito Score: $MERITO_SCORE/100"
    echo "   Bien Común Score: $BIEN_COMUN_SCORE/100"
    
    # Overall productivity assessment
    OVERALL_SCORE=$(( (AYNI_SCORE + MERITO_SCORE + BIEN_COMUN_SCORE) / 3 ))
    
    if [ $OVERALL_SCORE -ge 85 ]; then
        echo -e "🎉 Overall Status: ${GREEN}EXCELLENT${NC} ($OVERALL_SCORE/100)"
    elif [ $OVERALL_SCORE -ge 70 ]; then
        echo -e "✅ Overall Status: ${YELLOW}GOOD${NC} ($OVERALL_SCORE/100)"
    else
        echo -e "⚠️  Overall Status: ${RED}NEEDS ATTENTION${NC} ($OVERALL_SCORE/100)"
    fi
    
    echo ""
}

# ================================================================
# 5. COOMUNITY METRICS CALCULATION
# ================================================================
calculate_ayni_score() {
    # Ayni: Reciprocity and balanced exchange
    if [ -d "Demo/apps/superapp-unified/src/components" ]; then
        SHARED_COMPONENTS=$(find Demo/apps/superapp-unified/src/components -name "*.tsx" 2>/dev/null | grep -i "shared\|common\|reusable" | wc -l)
        TOTAL_COMPONENTS=$(find Demo/apps/superapp-unified/src/components -name "*.tsx" 2>/dev/null | wc -l)
    else
        SHARED_COMPONENTS=0
        TOTAL_COMPONENTS=0
    fi
    
    if [ $TOTAL_COMPONENTS -gt 0 ]; then
        AYNI_SCORE=$(( (SHARED_COMPONENTS * 100) / TOTAL_COMPONENTS ))
    else
        AYNI_SCORE=50  # Default score if no components found
    fi
    
    # Adjust based on collaboration metrics
    if [ $COMMITS_TODAY -gt 3 ]; then
        AYNI_SCORE=$(( AYNI_SCORE + 10 ))
    fi
    
    AYNI_SCORE=$(( AYNI_SCORE > 100 ? 100 : AYNI_SCORE ))
}

calculate_merito_score() {
    # Mérito: Quality and contribution
    
    # Check for TypeScript strict mode
    if [ -f "Demo/apps/superapp-unified/tsconfig.json" ] && grep -q '"strict": true' Demo/apps/superapp-unified/tsconfig.json; then
        MERITO_SCORE=80
    else
        MERITO_SCORE=60
    fi
    
    # Check for tests
    if [ -d "Demo/apps/superapp-unified" ]; then
        TEST_FILES=$(find Demo/apps/superapp-unified -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null | wc -l)
    else
        TEST_FILES=0
    fi
    
    if [ $TEST_FILES -gt 10 ]; then
        MERITO_SCORE=$(( MERITO_SCORE + 15 ))
    elif [ $TEST_FILES -gt 5 ]; then
        MERITO_SCORE=$(( MERITO_SCORE + 10 ))
    fi
    
    # Check for documentation
    if [ -f "Demo/apps/superapp-unified/README.md" ]; then
        MERITO_SCORE=$(( MERITO_SCORE + 5 ))
    fi
    
    MERITO_SCORE=$(( MERITO_SCORE > 100 ? 100 : MERITO_SCORE ))
}

calculate_bien_comun_score() {
    # Bien Común: Common good and sustainability
    
    # Check for accessibility features
    ACCESSIBILITY_SCORE=70
    if [ -d "Demo/apps/superapp-unified/src" ] && grep -r "aria-" Demo/apps/superapp-unified/src/ > /dev/null 2>&1; then
        ACCESSIBILITY_SCORE=$(( ACCESSIBILITY_SCORE + 15 ))
    fi
    
    # Check for error handling
    if [ -d "Demo/apps/superapp-unified/src" ] && grep -r "try.*catch" Demo/apps/superapp-unified/src/ > /dev/null 2>&1; then
        ACCESSIBILITY_SCORE=$(( ACCESSIBILITY_SCORE + 10 ))
    fi
    
    # Check for performance optimizations
    if [ -d "Demo/apps/superapp-unified/src" ] && grep -r "useMemo\|useCallback" Demo/apps/superapp-unified/src/ > /dev/null 2>&1; then
        ACCESSIBILITY_SCORE=$(( ACCESSIBILITY_SCORE + 5 ))
    fi
    
    BIEN_COMUN_SCORE=$(( ACCESSIBILITY_SCORE > 100 ? 100 : ACCESSIBILITY_SCORE ))
}

# ================================================================
# 6. NATURAL BREAK REMINDER
# ================================================================
natural_break_reminder() {
    echo -e "${YELLOW}🌱 Natural Break Reminder${NC}"
    echo "─────────────────────────"
    
    echo "🧘 Taking breaks enhances creativity and prevents burnout"
    echo ""
    echo "Suggested micro-breaks:"
    echo "  • 2 minutes: Deep breathing (4-7-8 technique)"
    echo "  • 5 minutes: Gentle stretching"
    echo "  • 10 minutes: Nature connection (window view/walk)"
    echo "  • 15 minutes: Hydration and mindful eating"
    echo ""
    echo "💡 Remember: Sustainable productivity > burnout productivity"
}

# ================================================================
# 7. EVENING WRAP-UP
# ================================================================
evening_wrapup() {
    echo -e "${PURPLE}🌙 Evening Wrap-up Ritual${NC}"
    echo "──────────────────────────"
    
    # Final productivity analysis
    analyze_productivity
    
    # Commit reminders
    UNCOMMITTED_CHANGES=$(git status --porcelain 2>/dev/null | wc -l)
    if [ $UNCOMMITTED_CHANGES -gt 0 ]; then
        echo -e "${YELLOW}📝 You have $UNCOMMITTED_CHANGES uncommitted changes${NC}"
        echo "Consider committing your progress before ending the day"
    fi
    
    # Tomorrow's planning
    echo ""
    echo "🗓️  Planning for tomorrow:"
    echo "  1. Review today's achievements"
    echo "  2. Set 3 main intentions for tomorrow"
    echo "  3. Prepare your development environment"
    echo ""
    
    # Gratitude practice
    echo "🙏 Gratitude practice:"
    echo "  • What coding challenge did you overcome today?"
    echo "  • How did you contribute to the CoomÜnity vision?"
    echo "  • What did you learn that makes you a better developer?"
    echo ""
}

# ================================================================
# 8. DAILY INTENTION SETTING
# ================================================================
set_daily_intentions() {
    echo "🎯 Setting Daily Intentions (CoomÜnity Style)"
    echo "────────────────────────────────────────────"
    
    # Generate intention based on current project status
    FEATURE_BRANCHES=$(git branch -r 2>/dev/null | grep "feature/" | wc -l)
    OPEN_TODOS=0
    if [ -d "Demo/apps/superapp-unified/src" ]; then
        OPEN_TODOS=$(grep -r "TODO\|FIXME" Demo/apps/superapp-unified/src/ 2>/dev/null | wc -l)
    fi
    
    echo "Suggested focus areas:"
    if [ $FEATURE_BRANCHES -gt 2 ]; then
        echo "  🌊 Flow: Complete and merge existing features"
    fi
    
    if [ $OPEN_TODOS -gt 10 ]; then
        echo "  🧹 Clarity: Address technical debt and TODOs"
    fi
    
    echo "  🌱 Growth: Add one new test or improve documentation"
    echo "  🤝 Ayni: Review someone's code or share knowledge"
    echo "  🎨 Beauty: Improve UI/UX or code elegance"
    echo ""
}

# ================================================================
# 9. MAIN EXECUTION LOGIC
# ================================================================
main() {
    case "${1:-help}" in
        "morning"|"start")
            morning_ritual
            detect_workflow_pattern
            ;;
        "check"|"status")
            analyze_productivity
            detect_workflow_pattern
            ;;
        "break"|"rest")
            natural_break_reminder
            ;;
        "evening"|"wrap")
            evening_wrapup
            ;;
        "extensions"|"ext")
            check_extensions_health
            ;;
        "metrics"|"score")
            analyze_productivity
            ;;
        "help"|*)
            echo "🌿 CoomÜnity Productivity Automation"
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  morning    Start your productive day with system checks"
            echo "  check      Analyze current productivity metrics"
            echo "  break      Get natural break recommendations"
            echo "  evening    Wrap up your day with reflection"
            echo "  extensions Check and install missing VS Code extensions"
            echo "  metrics    Show detailed CoomÜnity metrics"
            echo ""
            echo "Philosophy: Ayni (Reciprocity) • Mérito (Quality) • Bien Común (Common Good)"
            echo ""
            echo "Examples:"
            echo "  $0 morning     # Start your day"
            echo "  $0 check       # Quick status check"
            echo "  $0 break       # Break reminder"
            echo "  $0 evening     # End of day wrap-up"
            ;;
    esac
}

# ================================================================
# 10. AUTOMATIC SCHEDULING (Optional Integration)
# ================================================================
setup_automatic_reminders() {
    echo "🤖 Setting up automatic productivity reminders..."
    
    # Create cron-like reminders (requires user setup)
    cat << 'EOF' > ~/.coomunity_productivity_reminders
# Add these to your crontab (crontab -e):
# 0 9 * * 1-5 /path/to/productivity-automation.sh morning
# 0 12 * * 1-5 /path/to/productivity-automation.sh break
# 0 15 * * 1-5 /path/to/productivity-automation.sh break
# 0 18 * * 1-5 /path/to/productivity-automation.sh evening
EOF
    
    echo "✅ Reminder templates created in ~/.coomunity_productivity_reminders"
    echo "📝 To activate: run 'crontab -e' and add the suggested lines"
}

# Execute main function with all arguments
main "$@" 