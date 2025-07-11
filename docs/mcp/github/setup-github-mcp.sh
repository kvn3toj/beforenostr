#!/bin/bash

# 🐙 GitHub MCP Setup Script for CoomÜnity
# 
# 🎯 INTENT: Automatizar configuración completa del GitHub MCP para omnisciencia del repositorio
# 🌟 VALUES: Transparencia (configuración visible), Bien Común (herramienta para todo el equipo)
# ⚡ CONSTRAINTS: Requiere GitHub token válido, compatible con Claude Code MCP

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MCP_CONFIG_DIR="$HOME/.config/claude-code"
GITHUB_MCP_CONFIG="$MCP_CONFIG_DIR/github-mcp.json"

echo -e "${BLUE}🐙 CoomÜnity GitHub MCP Setup${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Step 1: Check prerequisites
echo -e "${BLUE}📋 Checking Prerequisites...${NC}"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI (gh) not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install gh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install gh
    else
        print_error "Please install GitHub CLI manually: https://cli.github.com/"
        exit 1
    fi
fi

print_status "GitHub CLI available"

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    print_warning "Not authenticated with GitHub. Please authenticate..."
    gh auth login --scopes repo,read:org,workflow
else
    print_status "GitHub authentication verified"
fi

# Step 2: Verify repository access
echo ""
echo -e "${BLUE}🔍 Verifying Repository Access...${NC}"

REPO_NAME=$(basename "$PROJECT_ROOT")
REPO_OWNER=$(gh repo view --json owner --jq '.owner.login' 2>/dev/null || echo "")

if [ -z "$REPO_OWNER" ]; then
    print_error "Could not determine repository owner. Are you in a git repository?"
    exit 1
fi

FULL_REPO_NAME="$REPO_OWNER/$REPO_NAME"
print_status "Repository: $FULL_REPO_NAME"

# Test API access
if gh api repos/$FULL_REPO_NAME > /dev/null 2>&1; then
    print_status "Repository API access verified"
else
    print_error "Cannot access repository via GitHub API"
    exit 1
fi

# Step 3: Create MCP configuration directory
echo ""
echo -e "${BLUE}📁 Setting Up MCP Configuration...${NC}"

mkdir -p "$MCP_CONFIG_DIR"
print_status "MCP config directory created: $MCP_CONFIG_DIR"

# Step 4: Generate GitHub MCP configuration
echo ""
echo -e "${BLUE}⚙️ Generating GitHub MCP Configuration...${NC}"

# Get GitHub token from gh CLI
GITHUB_TOKEN=$(gh auth token)

cat > "$GITHUB_MCP_CONFIG" << EOF
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": [
        "--repository", "$FULL_REPO_NAME",
        "--cache-ttl", "300",
        "--max-requests-per-hour", "4000"
      ],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN",
        "GITHUB_REPOSITORY": "$FULL_REPO_NAME",
        "MCP_LOG_LEVEL": "info"
      },
      "description": "GitHub MCP for CoomÜnity repository omniscience"
    }
  },
  "integrations": {
    "protocols": {
      "watch_control": {
        "github_commands": [
          "repository-snapshot",
          "activity-summary",
          "health-check"
        ]
      },
      "task_stats": {
        "github_metrics": [
          "commit-frequency",
          "pr-velocity",
          "issue-resolution-time",
          "contributor-activity"
        ]
      },
      "multi_file_output": {
        "github_sync": [
          "docs-auto-update",
          "changelog-generation",
          "release-notes"
        ]
      }
    }
  },
  "coomunity": {
    "philosophy": {
      "transparencia": "All repository activities visible and auditable",
      "bien_comun": "Shared intelligence for team benefit",
      "reciprocidad": "Balanced contribution tracking and recognition"
    },
    "guardianes": {
      "ATLAS": "infrastructure_monitoring",
      "COSMOS": "system_integration", 
      "SAGE": "quality_metrics",
      "KIRA": "documentation_maintenance"
    }
  }
}
EOF

print_status "GitHub MCP configuration generated: $GITHUB_MCP_CONFIG"

# Step 5: Create helper scripts
echo ""
echo -e "${BLUE}🛠️ Creating Helper Scripts...${NC}"

# GitHub MCP CLI helper
cat > "$MCP_CONFIG_DIR/github-mcp-cli.sh" << 'EOF'
#!/bin/bash
# GitHub MCP CLI Helper for CoomÜnity

GITHUB_MCP_CONFIG="$HOME/.config/claude-code/github-mcp.json"

case "${1:-help}" in
    "status")
        echo "🐙 GitHub MCP Status:"
        gh api rate_limit | jq '.rate'
        echo ""
        gh api repos/$(jq -r '.mcpServers.github.env.GITHUB_REPOSITORY' "$GITHUB_MCP_CONFIG") | jq '{name, full_name, private, updated_at}'
        ;;
    "metrics")
        echo "📊 Repository Metrics:"
        REPO=$(jq -r '.mcpServers.github.env.GITHUB_REPOSITORY' "$GITHUB_MCP_CONFIG")
        echo "Open Issues: $(gh api repos/$REPO/issues?state=open | jq length)"
        echo "Open PRs: $(gh api repos/$REPO/pulls?state=open | jq length)" 
        echo "Recent Commits: $(gh api repos/$REPO/commits?per_page=10 | jq length)"
        ;;
    "health")
        echo "🏥 Repository Health Check:"
        REPO=$(jq -r '.mcpServers.github.env.GITHUB_REPOSITORY' "$GITHUB_MCP_CONFIG")
        
        # Check if repo is accessible
        if gh api repos/$REPO > /dev/null 2>&1; then
            echo "✅ Repository accessible"
        else
            echo "❌ Repository access failed"
        fi
        
        # Check rate limits
        REMAINING=$(gh api rate_limit | jq -r '.rate.remaining')
        if [ "$REMAINING" -gt 100 ]; then
            echo "✅ API rate limit OK ($REMAINING remaining)"
        else
            echo "⚠️ API rate limit low ($REMAINING remaining)"
        fi
        ;;
    "snapshot")
        echo "📸 Taking Repository Snapshot..."
        REPO=$(jq -r '.mcpServers.github.env.GITHUB_REPOSITORY' "$GITHUB_MCP_CONFIG")
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        SNAPSHOT_FILE="/tmp/github_snapshot_$TIMESTAMP.json"
        
        {
            echo "{"
            echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\","
            echo "  \"repository\": $(gh api repos/$REPO),"
            echo "  \"issues\": $(gh api repos/$REPO/issues?state=all),"
            echo "  \"pulls\": $(gh api repos/$REPO/pulls?state=all),"
            echo "  \"commits\": $(gh api repos/$REPO/commits?per_page=50)"
            echo "}"
        } > "$SNAPSHOT_FILE"
        
        echo "Snapshot saved: $SNAPSHOT_FILE"
        ;;
    *)
        echo "🐙 GitHub MCP CLI Helper"
        echo ""
        echo "Usage: github-mcp-cli.sh [command]"
        echo ""
        echo "Commands:"
        echo "  status   - Show GitHub API and repository status"
        echo "  metrics  - Display repository metrics"
        echo "  health   - Perform health check"
        echo "  snapshot - Take complete repository snapshot"
        echo ""
        echo "🌟 Aligned with CoomÜnity Values: Transparencia, Bien Común, Reciprocidad"
        ;;
esac
EOF

chmod +x "$MCP_CONFIG_DIR/github-mcp-cli.sh"
print_status "GitHub MCP CLI helper created"

# Create alias in shell profile
SHELL_PROFILE=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_PROFILE="$HOME/.bash_profile"
fi

if [ -n "$SHELL_PROFILE" ]; then
    if ! grep -q "github-mcp-cli" "$SHELL_PROFILE"; then
        echo "" >> "$SHELL_PROFILE"
        echo "# GitHub MCP CLI Helper for CoomÜnity" >> "$SHELL_PROFILE"
        echo "alias github-mcp='$MCP_CONFIG_DIR/github-mcp-cli.sh'" >> "$SHELL_PROFILE"
        print_status "Shell alias 'github-mcp' added to $SHELL_PROFILE"
    fi
fi

# Step 6: Test the configuration
echo ""
echo -e "${BLUE}🧪 Testing Configuration...${NC}"

# Test GitHub API access
if gh api user > /dev/null 2>&1; then
    print_status "GitHub API authentication working"
else
    print_error "GitHub API authentication failed"
    exit 1
fi

# Test repository-specific access
if gh api repos/$FULL_REPO_NAME > /dev/null 2>&1; then
    print_status "Repository-specific API access working"
else
    print_error "Repository-specific API access failed"
    exit 1
fi

# Step 7: Success summary
echo ""
echo -e "${GREEN}🎉 GitHub MCP Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
print_info "Configuration saved to: $GITHUB_MCP_CONFIG"
print_info "CLI helper available as: github-mcp"
print_info "Repository: $FULL_REPO_NAME"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Restart Claude Code to load the new MCP configuration"
echo "2. Test with: github-mcp status"
echo "3. Take a snapshot: github-mcp snapshot"
echo "4. Review the documentation: docs/mcp/github/README.md"
echo ""
echo -e "${YELLOW}🔄 To reload shell aliases: source $SHELL_PROFILE${NC}"
echo ""
echo -e "${GREEN}✨ The GitHub MCP is now ready to provide omniscient repository awareness!${NC}"
echo -e "${BLUE}_'In the omniscience of our repository, we find the wisdom of collective creation.'_${NC}"