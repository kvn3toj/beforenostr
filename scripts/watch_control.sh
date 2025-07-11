#!/bin/bash

# 🔧 Watch Control System - CoomÜnity Automation Protocol
# 
# 🎯 INTENT: Automatizar el control de dispositivos de visualización y herramientas de desarrollo
# 🌟 VALUES: Transparencia (estados visibles), Eficiencia (reducir fricciones), Bien Común (herramientas para todo el equipo)
# ⚡ CONSTRAINTS: macOS/Linux compatible, respuesta < 3s, logs completos, rutas exactas

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
WATCH_LOG="$LOG_DIR/watch-control-$(date +%Y%m%d).log"
TOOLS_DIR="$PROJECT_ROOT/tools"
SCREENSHOTS_DIR="$PROJECT_ROOT/screenshots"

# Ensure log directory exists
mkdir -p "$LOG_DIR"
mkdir -p "$SCREENSHOTS_DIR"

# Logging function
log_action() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" | tee -a "$WATCH_LOG"
}

# Function to print status
print_status() {
    echo -e "${GREEN}✅${NC} $1"
    log_action "SUCCESS: $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
    log_action "WARNING: $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
    log_action "ERROR: $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
    log_action "INFO: $1"
}

print_watch() {
    echo -e "${PURPLE}⌚${NC} $1"
    log_action "WATCH: $1"
}

# System detection
detect_system() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    else
        echo "unknown"
    fi
}

SYSTEM=$(detect_system)

# Watch Control Functions

# Home screen navigation
go_home() {
    print_watch "Navigating to home screen..."
    
    case $SYSTEM in
        "macos")
            # For macOS - simulate home button or main app window
            osascript << 'EOF'
tell application "System Events"
    -- Simulate Command+H to go to home/hide current app
    key code 4 using command down
end tell
EOF
            ;;
        "linux")
            # For Linux - go to desktop/home
            if command -v xdotool &> /dev/null; then
                xdotool key Super_L+d
            else
                print_warning "xdotool not found. Install with: sudo apt-get install xdotool"
                return 1
            fi
            ;;
        *)
            print_error "Unsupported system: $SYSTEM"
            return 1
            ;;
    esac
    
    print_status "Home navigation completed"
}

# Screenshot functionality
take_screenshot() {
    local filename="watch-screenshot-$(date +%Y%m%d-%H%M%S).png"
    local filepath="$SCREENSHOTS_DIR/$filename"
    
    print_watch "Taking screenshot..."
    
    case $SYSTEM in
        "macos")
            screencapture -x "$filepath"
            if [ $? -eq 0 ]; then
                print_status "Screenshot saved: $filepath"
                
                # Optional: Open screenshot for quick view
                if [ "${WATCH_PREVIEW:-false}" = "true" ]; then
                    open "$filepath"
                fi
            else
                print_error "Failed to take screenshot"
                return 1
            fi
            ;;
        "linux")
            if command -v gnome-screenshot &> /dev/null; then
                gnome-screenshot -f "$filepath"
            elif command -v scrot &> /dev/null; then
                scrot "$filepath"
            elif command -v import &> /dev/null; then
                import -window root "$filepath"
            else
                print_error "No screenshot tool found. Install gnome-screenshot, scrot, or imagemagick"
                return 1
            fi
            
            if [ -f "$filepath" ]; then
                print_status "Screenshot saved: $filepath"
                
                # Optional: Open screenshot for quick view
                if [ "${WATCH_PREVIEW:-false}" = "true" ]; then
                    if command -v xdg-open &> /dev/null; then
                        xdg-open "$filepath"
                    fi
                fi
            else
                print_error "Failed to take screenshot"
                return 1
            fi
            ;;
        *)
            print_error "Screenshot not supported on $SYSTEM"
            return 1
            ;;
    esac
    
    # Log screenshot metadata
    cat >> "$WATCH_LOG" << EOF
SCREENSHOT_METADATA:
  file: $filepath
  timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
  system: $SYSTEM
  size: $(ls -lh "$filepath" | awk '{print $5}')
EOF
}

# Tool switching functionality
switch_tool() {
    local tool_name="$1"
    
    if [ -z "$tool_name" ]; then
        print_error "Tool name required for switch operation"
        return 1
    fi
    
    print_watch "Switching to tool: $tool_name"
    
    case "$tool_name" in
        "watchface")
            print_info "Activating watchface tool..."
            # Custom logic for watchface tool
            ;;
        "scroll")
            print_info "Activating scroll tool..."
            # Custom logic for scroll tool
            ;;
        "wearfx")
            print_info "Activating wearfx tool..."
            # Custom logic for wearfx tool
            ;;
        "development")
            print_info "Switching to development environment..."
            # Open development tools
            case $SYSTEM in
                "macos")
                    # Open VS Code or development IDE
                    if command -v code &> /dev/null; then
                        code "$PROJECT_ROOT"
                    fi
                    ;;
                "linux")
                    if command -v code &> /dev/null; then
                        code "$PROJECT_ROOT"
                    fi
                    ;;
            esac
            ;;
        "browser")
            print_info "Opening browser for development..."
            case $SYSTEM in
                "macos")
                    open "http://localhost:3001"  # SuperApp
                    sleep 1
                    open "http://localhost:3000"  # Admin
                    ;;
                "linux")
                    if command -v xdg-open &> /dev/null; then
                        xdg-open "http://localhost:3001" &
                        sleep 1
                        xdg-open "http://localhost:3000" &
                    fi
                    ;;
            esac
            ;;
        *)
            print_warning "Unknown tool: $tool_name. Available: watchface, scroll, wearfx, development, browser"
            return 1
            ;;
    esac
    
    print_status "Tool switch completed: $tool_name"
}

# Tool cycling functionality
cycle_tools() {
    local tools_spec="$1"
    
    if [ -z "$tools_spec" ]; then
        print_error "Tools specification required (format: tool1,tool2,tool3:delay_seconds)"
        return 1
    fi
    
    # Parse tools and delay
    local tools_part="${tools_spec%:*}"
    local delay_part="${tools_spec##*:}"
    
    # If no delay specified, default to 3 seconds
    if [ "$tools_part" = "$delay_part" ]; then
        delay_part="3"
    fi
    
    IFS=',' read -ra TOOLS <<< "$tools_part"
    local delay="${delay_part:-3}"
    
    print_watch "Starting tool cycle with ${#TOOLS[@]} tools, ${delay}s delay"
    
    for tool in "${TOOLS[@]}"; do
        switch_tool "$tool"
        
        if [ ${#TOOLS[@]} -gt 1 ]; then
            print_info "Waiting ${delay} seconds before next tool..."
            sleep "$delay"
        fi
    done
    
    print_status "Tool cycle completed"
}

# Tool preview functionality
tool_preview() {
    local preview_mode="${1:-true}"
    
    print_watch "Tool preview mode: $preview_mode"
    
    if [ "$preview_mode" = "true" ]; then
        print_info "Available development tools:"
        echo "  🔧 watchface  - Watch face development tool"
        echo "  📜 scroll     - Scroll interaction tool" 
        echo "  ✨ wearfx     - Wear effects tool"
        echo "  💻 development - Development environment"
        echo "  🌐 browser    - Development browser tools"
        echo ""
        print_info "Current project ports:"
        echo "  🎮 SuperApp:     http://localhost:3001"
        echo "  👨‍💼 Admin Panel:  http://localhost:3000"
        echo "  🔧 Backend API:  http://localhost:3002"
        echo ""
        print_info "Watch Control commands:"
        echo "  📸 Screenshot:   --watch-screenshot"
        echo "  🏠 Go Home:      --go-home"
        echo "  🔄 Cycle Tools:  --cycle-tools tool1,tool2:delay"
        echo "  👁️ Preview:      --tool-preview"
    else
        print_info "Tool preview disabled"
    fi
}

# Repository snapshot functionality
repository_snapshot() {
    local format="${1:-visual}"
    
    print_watch "Taking repository snapshot (format: $format)..."
    
    local snapshot_dir="$PROJECT_ROOT/snapshots"
    mkdir -p "$snapshot_dir"
    
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local snapshot_file="$snapshot_dir/repo-snapshot-$timestamp"
    
    case "$format" in
        "visual")
            # Create visual representation
            {
                echo "# 📊 CoomÜnity Repository Snapshot"
                echo "**Timestamp:** $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
                echo ""
                echo "## 📁 Project Structure"
                tree -L 3 "$PROJECT_ROOT" 2>/dev/null || find "$PROJECT_ROOT" -maxdepth 3 -type d | head -20
                echo ""
                echo "## 🔧 Active Processes"
                ps aux | grep -E "(node|npm|tsx)" | grep -v grep || echo "No active development processes"
                echo ""
                echo "## 🌐 Port Status"
                netstat -an | grep -E ":300[0-2]" || echo "Development ports not active"
                echo ""
                echo "## 📊 Git Status"
                cd "$PROJECT_ROOT"
                git status --porcelain 2>/dev/null || echo "Not in git repository"
                echo ""
                echo "## 🎯 Philosophy Alignment"
                echo "- ✅ Transparencia: Complete visibility into repository state"
                echo "- ✅ Bien Común: Shared snapshot for team benefit"
                echo "- ✅ Eficiencia: Automated repository documentation"
            } > "${snapshot_file}.md"
            
            print_status "Visual snapshot saved: ${snapshot_file}.md"
            ;;
        "json")
            # Create JSON data snapshot
            {
                echo "{"
                echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\","
                echo "  \"project_root\": \"$PROJECT_ROOT\","
                echo "  \"system\": \"$SYSTEM\","
                echo "  \"git_branch\": \"$(cd "$PROJECT_ROOT" && git branch --show-current 2>/dev/null || echo "unknown")\","
                echo "  \"active_processes\": $(ps aux | grep -E "(node|npm|tsx)" | grep -v grep | wc -l),"
                echo "  \"philosophy_check\": {"
                echo "    \"transparencia\": true,"
                echo "    \"bien_comun\": true,"
                echo "    \"eficiencia\": true"
                echo "  }"
                echo "}"
            } > "${snapshot_file}.json"
            
            print_status "JSON snapshot saved: ${snapshot_file}.json"
            ;;
        *)
            print_error "Unknown snapshot format: $format. Use 'visual' or 'json'"
            return 1
            ;;
    esac
    
    # Also take a screenshot for complete visual record
    WATCH_PREVIEW=false take_screenshot
}

# Main command processing
main() {
    local start_time=$(date +%s)
    
    print_watch "CoomÜnity Watch Control System Starting..."
    print_info "System: $SYSTEM"
    print_info "Project: $PROJECT_ROOT"
    print_info "Log: $WATCH_LOG"
    
    case "${1:-help}" in
        "--go-home")
            go_home
            ;;
        "--watch-screenshot")
            take_screenshot
            ;;
        "--switch-tool")
            if [ -z "${2:-}" ]; then
                print_error "Tool name required. Usage: --switch-tool <tool_name>"
                exit 1
            fi
            switch_tool "$2"
            ;;
        "--cycle-tools")
            if [ -z "${2:-}" ]; then
                print_error "Tools specification required. Usage: --cycle-tools tool1,tool2:delay"
                exit 1
            fi
            cycle_tools "$2"
            ;;
        "--tool-preview")
            tool_preview "${2:-true}"
            ;;
        "--repository-snapshot")
            repository_snapshot "${2:-visual}"
            ;;
        "--watch-control")
            print_watch "Watch Control System is active and ready"
            print_info "Available commands: --go-home, --watch-screenshot, --switch-tool, --cycle-tools, --tool-preview, --repository-snapshot"
            ;;
        "--status")
            print_watch "System Status Check:"
            print_info "✅ Watch Control System: Active"
            print_info "📱 System Type: $SYSTEM"
            print_info "📁 Project Root: $PROJECT_ROOT"
            print_info "📊 Log File: $WATCH_LOG"
            print_info "📸 Screenshots: $SCREENSHOTS_DIR"
            
            # Check if development servers are running
            if pgrep -f "node.*3001" > /dev/null; then
                print_info "🎮 SuperApp (3001): Running"
            else
                print_warning "🎮 SuperApp (3001): Not running"
            fi
            
            if pgrep -f "node.*3000" > /dev/null; then
                print_info "👨‍💼 Admin (3000): Running"  
            else
                print_warning "👨‍💼 Admin (3000): Not running"
            fi
            
            if pgrep -f "node.*3002" > /dev/null; then
                print_info "🔧 Backend (3002): Running"
            else
                print_warning "🔧 Backend (3002): Not running"
            fi
            ;;
        "--help"|"help"|*)
            echo -e "${PURPLE}🔧 CoomÜnity Watch Control System${NC}"
            echo -e "${PURPLE}=================================${NC}"
            echo ""
            echo -e "${BLUE}🎯 INTENT:${NC} Automate visualization device control and development tools"
            echo -e "${BLUE}🌟 VALUES:${NC} Transparencia, Eficiencia, Bien Común"
            echo -e "${BLUE}⚡ CONSTRAINTS:${NC} <3s response, complete logs, exact paths"
            echo ""
            echo -e "${CYAN}📱 Watch Commands:${NC}"
            echo "  --go-home                    Navigate to home screen"
            echo "  --watch-screenshot           Take screenshot"
            echo "  --switch-tool <name>         Switch to specific tool"
            echo "  --cycle-tools <spec>         Cycle through tools (format: tool1,tool2:delay)"
            echo "  --tool-preview [true|false]  Show/hide tool preview"
            echo "  --repository-snapshot [fmt]  Take repo snapshot (visual|json)"
            echo "  --watch-control              Activate watch control system"
            echo "  --status                     Show system status"
            echo "  --help                       Show this help"
            echo ""
            echo -e "${CYAN}🔧 Available Tools:${NC}"
            echo "  watchface    - Watch face development"
            echo "  scroll       - Scroll interaction"
            echo "  wearfx       - Wear effects"
            echo "  development  - Development environment"
            echo "  browser      - Development browsers"
            echo ""
            echo -e "${CYAN}📝 Usage Examples:${NC}"
            echo "  ./watch_control.sh --go-home"
            echo "  ./watch_control.sh --watch-screenshot"
            echo "  ./watch_control.sh --switch-tool wearfx"
            echo "  ./watch_control.sh --cycle-tools watchface,scroll,wearfx:3"
            echo "  ./watch_control.sh --repository-snapshot visual"
            echo ""
            echo -e "${YELLOW}📊 Philosophy Integration:${NC}"
            echo "  🌟 Transparencia: All actions logged and visible"
            echo "  🤝 Bien Común: Tools benefit entire development team"
            echo "  ⚡ Eficiencia: Reduce manual tool switching friction"
            ;;
    esac
    
    local end_time=$(date +%s)
    local execution_time=$((end_time - start_time))
    
    log_action "Command completed in ${execution_time}s: $*"
    
    if [ $execution_time -gt 3 ]; then
        print_warning "Command took ${execution_time}s (target: <3s)"
    fi
}

# Execute main function with all arguments
main "$@"