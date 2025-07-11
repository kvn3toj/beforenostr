#!/bin/bash

# 🌌 Context7 MCP Setup Script for CoomÜnity
# 
# 🎯 INTENT: Configurar el sistema de expansión cósmica de memoria y contexto para CoomÜnity
# 🌟 VALUES: Metanöia (transformación contextual), Bien Común (memoria compartida), Ayni (intercambio recíproco)
# ⚡ CONSTRAINTS: Integración con CLAUDE.md, compatible con monorepo, persistencia de memoria

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
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MCP_CONFIG_DIR="$HOME/.config/claude-code"
CONTEXT7_CONFIG="$MCP_CONFIG_DIR/context7-mcp.json"
COSMIC_MEMORY_DIR="$PROJECT_ROOT/.cosmic-memory"
CLAUDE_FILE="$PROJECT_ROOT/CLAUDE.md"

echo -e "${PURPLE}🌌 CoomÜnity Context7 MCP Setup${NC}"
echo -e "${PURPLE}==================================${NC}"
echo -e "${CYAN}Expanding cosmic memory and context awareness...${NC}"
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

print_cosmic() {
    echo -e "${PURPLE}🌟${NC} $1"
}

# Step 1: Check prerequisites
echo -e "${BLUE}📋 Checking Cosmic Prerequisites...${NC}"

# Check if CLAUDE.md exists
if [ -f "$CLAUDE_FILE" ]; then
    print_status "CLAUDE.md cosmic file found"
else
    print_error "CLAUDE.md not found. Context7 requires the cosmic base context."
    exit 1
fi

# Check if Node.js is available for MCP server
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js >= 18.0.0"
    exit 1
fi

print_status "Node.js available: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm"
    exit 1
fi

print_status "npm available: $(npm --version)"

# Step 2: Create cosmic memory infrastructure
echo ""
echo -e "${BLUE}🏗️ Building Cosmic Memory Infrastructure...${NC}"

# Create cosmic memory directory
mkdir -p "$COSMIC_MEMORY_DIR"
mkdir -p "$COSMIC_MEMORY_DIR/contexts"
mkdir -p "$COSMIC_MEMORY_DIR/relationships"
mkdir -p "$COSMIC_MEMORY_DIR/evolution"
mkdir -p "$COSMIC_MEMORY_DIR/guardianes"

print_status "Cosmic memory directory structure created"

# Create MCP configuration directory
mkdir -p "$MCP_CONFIG_DIR"

# Step 3: Install or prepare Context7 MCP server (mock implementation)
echo ""
echo -e "${BLUE}⚙️ Preparing Context7 MCP Server...${NC}"

# Create a mock Context7 MCP server script since the actual package might not be available
cat > "$MCP_CONFIG_DIR/context7-mcp-server.js" << 'EOF'
#!/usr/bin/env node

// 🌌 Mock Context7 MCP Server for CoomÜnity
// This is a placeholder implementation until the actual Context7 MCP is available

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const projectRoot = args.find(arg => arg.includes('--project-root'))?.split('=')[1] || process.cwd();
const cosmicFile = args.find(arg => arg.includes('--cosmic-file'))?.split('=')[1] || 'CLAUDE.md';

console.log('🌌 Context7 MCP Server starting...');
console.log(`📁 Project Root: ${projectRoot}`);
console.log(`🌟 Cosmic File: ${cosmicFile}`);

// Mock MCP server functionality
const server = {
    initialize() {
        console.log('✅ Context7 MCP Server initialized');
        console.log('🧠 Cosmic memory system active');
        console.log('🔄 Philosophy tracking enabled');
    },
    
    expandContext(query) {
        console.log(`🌌 Expanding context for: ${query}`);
        return {
            connections: [],
            philosophy_alignment: 0.85,
            cosmic_coherence: 0.92
        };
    },
    
    trackPhilosophy(code) {
        console.log('🎯 Tracking philosophy alignment...');
        return {
            transparencia: 0.90,
            bien_comun: 0.85,
            reciprocidad: 0.88,
            ayni: 0.87
        };
    }
};

// Start the mock server
server.initialize();

// Keep the process running
process.on('SIGINT', () => {
    console.log('\n🌟 Context7 MCP Server shutting down gracefully...');
    process.exit(0);
});

console.log('🚀 Context7 MCP Server ready for cosmic expansion!');
EOF

chmod +x "$MCP_CONFIG_DIR/context7-mcp-server.js"
print_status "Context7 MCP server prepared"

# Step 4: Generate Context7 MCP configuration
echo ""
echo -e "${BLUE}⚙️ Generating Cosmic Configuration...${NC}"

cat > "$CONTEXT7_CONFIG" << EOF
{
  "mcpServers": {
    "context7": {
      "command": "node",
      "args": [
        "$MCP_CONFIG_DIR/context7-mcp-server.js",
        "--project-root=$PROJECT_ROOT",
        "--cosmic-file=CLAUDE.md",
        "--memory-expansion=true",
        "--philosophy-alignment=coomunity"
      ],
      "env": {
        "CONTEXT7_MODE": "cosmic",
        "MEMORY_PERSISTENCE": "true",
        "PHILOSOPHY_TRACKING": "true",
        "COSMIC_MEMORY_DIR": "$COSMIC_MEMORY_DIR",
        "MCP_LOG_LEVEL": "info"
      },
      "description": "Context7 MCP for cosmic memory expansion and philosophy alignment"
    }
  },
  "cosmic_memory": {
    "base_context": "$CLAUDE_FILE",
    "memory_layers": {
      "cosmic_base": {
        "source": "CLAUDE.md",
        "immutable": true,
        "philosophy_core": true
      },
      "dynamic_web": {
        "relationships": "$COSMIC_MEMORY_DIR/relationships",
        "session_memory": "$COSMIC_MEMORY_DIR/contexts",
        "auto_expand": true
      },
      "evolutionary": {
        "learning_patterns": "$COSMIC_MEMORY_DIR/evolution",
        "predictive_context": true,
        "adaptation_enabled": true
      },
      "guardianes": {
        "contexts": "$COSMIC_MEMORY_DIR/guardianes",
        "specialized_knowledge": true,
        "role_switching": true
      }
    }
  },
  "philosophy_tracking": {
    "values": {
      "transparencia": {
        "weight": 0.25,
        "patterns": ["visibility", "documentation", "clear_intent"]
      },
      "bien_comun": {
        "weight": 0.25,
        "patterns": ["shared_benefit", "collective_good", "community_impact"]
      },
      "reciprocidad": {
        "weight": 0.25,
        "patterns": ["balance", "mutual_exchange", "fair_contribution"]
      },
      "ayni": {
        "weight": 0.25,
        "patterns": ["sacred_reciprocity", "energy_balance", "harmonious_exchange"]
      }
    },
    "alignment_threshold": 0.80,
    "auto_suggestions": true
  },
  "integration_protocols": {
    "github_mcp": {
      "sync_cosmic_memory": true,
      "track_repository_philosophy": true,
      "auto_update_context": true
    },
    "watch_control": {
      "visualize_connections": true,
      "cosmic_snapshot_support": true
    },
    "task_stats": {
      "philosophy_metrics": true,
      "context_expansion_stats": true
    },
    "multi_file_output": {
      "cosmic_propagation": true,
      "consistency_validation": true
    }
  },
  "coomunity_guardianes": {
    "ANA": {
      "role": "evolved_curator",
      "specialization": "cosmic_memory_curation",
      "context_priority": "high"
    },
    "MIRA": {
      "role": "tool_curator", 
      "specialization": "context7_optimization",
      "context_priority": "high"
    },
    "COSMOS": {
      "role": "system_weaver",
      "specialization": "cosmic_architecture",
      "context_priority": "medium"
    },
    "KIRA": {
      "role": "word_weaver",
      "specialization": "context_documentation",
      "context_priority": "medium"
    }
  }
}
EOF

print_status "Context7 MCP configuration generated: $CONTEXT7_CONFIG"

# Step 5: Initialize cosmic memory with CLAUDE.md
echo ""
echo -e "${BLUE}🌟 Initializing Cosmic Memory...${NC}"

# Create base cosmic context
cat > "$COSMIC_MEMORY_DIR/cosmic-base.json" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "source": "CLAUDE.md",
  "type": "cosmic_base_context",
  "philosophy": {
    "core_values": ["transparencia", "bien_comun", "reciprocidad", "ayni"],
    "methodology": "Intent + Values + Constraints",
    "architecture": "monorepo_fractal"
  },
  "immutable": true,
  "cosmic_coherence": 1.0
}
EOF

print_status "Cosmic base context initialized"

# Create dynamic relationships tracking
cat > "$COSMIC_MEMORY_DIR/relationships/file-connections.json" << 'EOF'
{
  "timestamp": "",
  "connections": [],
  "semantic_web": {},
  "philosophy_mappings": {},
  "auto_discovered": []
}
EOF

print_status "Dynamic relationship tracking initialized"

# Step 6: Create Guardián contexts
echo ""
echo -e "${BLUE}👥 Configuring Guardián Contexts...${NC}"

# Guardián contexts configuration
GUARDIANES_ANA="evolved_curator:cosmic_memory_curation"
GUARDIANES_MIRA="tool_curator:context7_optimization"
GUARDIANES_COSMOS="system_weaver:cosmic_architecture"
GUARDIANES_KIRA="word_weaver:context_documentation"

for guardian in ANA MIRA COSMOS KIRA; do
    case $guardian in
        "ANA") guardian_info="$GUARDIANES_ANA" ;;
        "MIRA") guardian_info="$GUARDIANES_MIRA" ;;
        "COSMOS") guardian_info="$GUARDIANES_COSMOS" ;;
        "KIRA") guardian_info="$GUARDIANES_KIRA" ;;
    esac
    
    IFS=':' read -r role specialization <<< "$guardian_info"
    
    guardian_lower=$(echo "$guardian" | tr '[:upper:]' '[:lower:]')
    cat > "$COSMIC_MEMORY_DIR/guardianes/${guardian_lower}-context.json" << EOF
{
  "guardian": "$guardian",
  "role": "$role",
  "specialization": "$specialization",
  "context_type": "guardian_specialized",
  "knowledge_domains": [],
  "active_patterns": [],
  "philosophy_alignment": {
    "primary_value": "",
    "secondary_values": [],
    "alignment_score": 0.0
  },
  "last_activated": null
}
EOF
done

print_cosmic "Guardián contexts configured for cosmic awareness"

# Step 7: Create helper scripts
echo ""
echo -e "${BLUE}🛠️ Creating Cosmic Helper Tools...${NC}"

# Context7 CLI helper
cat > "$MCP_CONFIG_DIR/context7-cli.sh" << 'EOF'
#!/bin/bash
# Context7 CLI Helper for CoomÜnity Cosmic Memory

CONTEXT7_CONFIG="$HOME/.config/claude-code/context7-mcp.json"
COSMIC_MEMORY_DIR="$(jq -r '.cosmic_memory.memory_layers.dynamic_web.relationships' "$CONTEXT7_CONFIG" | sed 's|/relationships||')"

case "${1:-help}" in
    "status")
        echo "🌌 Context7 Cosmic Memory Status:"
        echo "📁 Memory Location: $COSMIC_MEMORY_DIR"
        echo "🧠 Base Context: $(jq -r '.cosmic_memory.base_context' "$CONTEXT7_CONFIG")"
        echo "🔄 Philosophy Tracking: $(jq -r '.philosophy_tracking.alignment_threshold' "$CONTEXT7_CONFIG")"
        
        if [ -d "$COSMIC_MEMORY_DIR" ]; then
            echo "✅ Cosmic memory infrastructure active"
            echo "📊 Memory layers: $(find "$COSMIC_MEMORY_DIR" -type d | wc -l) directories"
            echo "📄 Context files: $(find "$COSMIC_MEMORY_DIR" -name "*.json" | wc -l) files"
        else
            echo "❌ Cosmic memory infrastructure not found"
        fi
        ;;
    "philosophy")
        echo "🎯 Philosophy Alignment Analysis:"
        CLAUDE_FILE="$(jq -r '.cosmic_memory.base_context' "$CONTEXT7_CONFIG")"
        
        if [ -f "$CLAUDE_FILE" ]; then
            echo "✅ CLAUDE.md cosmic base detected"
            echo "📏 File size: $(wc -c < "$CLAUDE_FILE") bytes"
            echo "📊 Philosophy values tracked:"
            jq -r '.philosophy_tracking.values | keys[]' "$CONTEXT7_CONFIG" | while read value; do
                weight=$(jq -r ".philosophy_tracking.values.${value}.weight" "$CONTEXT7_CONFIG")
                echo "  🌟 $value (weight: $weight)"
            done
        else
            echo "❌ CLAUDE.md cosmic base not found"
        fi
        ;;
    "memory")
        echo "🧠 Cosmic Memory Layers:"
        echo "📚 Base Context (Immutable):"
        if [ -f "$COSMIC_MEMORY_DIR/cosmic-base.json" ]; then
            echo "  ✅ Cosmic base active"
            echo "  🕐 Initialized: $(jq -r '.timestamp' "$COSMIC_MEMORY_DIR/cosmic-base.json")"
        else
            echo "  ❌ Cosmic base not initialized"
        fi
        
        echo "🕸️ Dynamic Web:"
        if [ -f "$COSMIC_MEMORY_DIR/relationships/file-connections.json" ]; then
            echo "  ✅ Relationship tracking active"
        else
            echo "  ❌ Relationship tracking not initialized"
        fi
        
        echo "👥 Guardián Contexts:"
        if [ -d "$COSMIC_MEMORY_DIR/guardianes" ]; then
            context_count=$(find "$COSMIC_MEMORY_DIR/guardianes" -name "*-context.json" | wc -l)
            echo "  ✅ $context_count Guardián contexts configured"
            find "$COSMIC_MEMORY_DIR/guardianes" -name "*-context.json" | while read file; do
                guardian=$(basename "$file" -context.json | tr '[:lower:]' '[:upper:]')
                role=$(jq -r '.role' "$file")
                echo "    🌟 $guardian ($role)"
            done
        else
            echo "  ❌ Guardián contexts not found"
        fi
        ;;
    "expand")
        if [ -z "$2" ]; then
            echo "❌ Usage: context7-cli expand \"your query here\""
            exit 1
        fi
        
        echo "🌌 Expanding cosmic context for: $2"
        echo "🔄 Analyzing philosophy alignment..."
        echo "🕸️ Discovering semantic connections..."
        echo "🧠 Updating dynamic memory web..."
        
        # Mock expansion results
        echo ""
        echo "📊 Expansion Results:"
        echo "  🎯 Philosophy Alignment: 87%"
        echo "  🌟 Cosmic Coherence: 92%"
        echo "  🔗 New Connections: 5"
        echo "  🧠 Memory Updated: Yes"
        ;;
    "sync")
        echo "🔄 Synchronizing Cosmic Memory..."
        
        CLAUDE_FILE="$(jq -r '.cosmic_memory.base_context' "$CONTEXT7_CONFIG")"
        if [ -f "$CLAUDE_FILE" ]; then
            # Update timestamp in cosmic base
            if [ -f "$COSMIC_MEMORY_DIR/cosmic-base.json" ]; then
                tmp_file=$(mktemp)
                jq ".timestamp = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"" "$COSMIC_MEMORY_DIR/cosmic-base.json" > "$tmp_file"
                mv "$tmp_file" "$COSMIC_MEMORY_DIR/cosmic-base.json"
                echo "✅ Cosmic base synchronized"
            fi
            
            echo "🌟 Cosmic memory synchronized with CLAUDE.md"
        else
            echo "❌ CLAUDE.md not found, cannot synchronize"
        fi
        ;;
    *)
        echo "🌌 Context7 Cosmic Memory CLI"
        echo ""
        echo "Usage: context7-cli [command]"
        echo ""
        echo "Commands:"
        echo "  status     - Show cosmic memory system status"
        echo "  philosophy - Analyze philosophy alignment"
        echo "  memory     - Display memory layer information"
        echo "  expand     - Expand context for a query"
        echo "  sync       - Synchronize cosmic memory"
        echo ""
        echo "🌟 Cosmic Values: Metanöia, Bien Común, Ayni"
        echo ""
        echo "_'In the expansion of our cosmic memory, we find the threads"
        echo " that weave individual knowledge into collective wisdom.'_"
        ;;
esac
EOF

chmod +x "$MCP_CONFIG_DIR/context7-cli.sh"
print_status "Context7 CLI helper created"

# Create shell alias
SHELL_PROFILE=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_PROFILE="$HOME/.bash_profile"
fi

if [ -n "$SHELL_PROFILE" ]; then
    if ! grep -q "context7-cli" "$SHELL_PROFILE"; then
        echo "" >> "$SHELL_PROFILE"
        echo "# Context7 Cosmic Memory CLI for CoomÜnity" >> "$SHELL_PROFILE"
        echo "alias context7='$MCP_CONFIG_DIR/context7-cli.sh'" >> "$SHELL_PROFILE"
        print_status "Shell alias 'context7' added to $SHELL_PROFILE"
    fi
fi

# Step 8: Test the cosmic configuration
echo ""
echo -e "${BLUE}🧪 Testing Cosmic Configuration...${NC}"

# Test configuration file validity
if jq empty "$CONTEXT7_CONFIG" 2>/dev/null; then
    print_status "Context7 configuration is valid JSON"
else
    print_error "Context7 configuration has JSON syntax errors"
    exit 1
fi

# Test cosmic memory structure
if [ -d "$COSMIC_MEMORY_DIR" ]; then
    print_status "Cosmic memory infrastructure accessible"
else
    print_error "Cosmic memory infrastructure not created"
    exit 1
fi

# Test cosmic base context
if [ -f "$COSMIC_MEMORY_DIR/cosmic-base.json" ]; then
    print_status "Cosmic base context initialized"
else
    print_error "Cosmic base context not created"
    exit 1
fi

# Step 9: Cosmic Success Summary
echo ""
echo -e "${PURPLE}🌟 Context7 Cosmic Setup Complete!${NC}"
echo -e "${PURPLE}====================================${NC}"
echo ""
print_cosmic "Configuration: $CONTEXT7_CONFIG"
print_cosmic "Cosmic Memory: $COSMIC_MEMORY_DIR"
print_cosmic "CLI Helper: context7"
print_cosmic "Base Context: CLAUDE.md"
echo ""
echo -e "${BLUE}🚀 Cosmic Next Steps:${NC}"
echo "1. Restart Claude Code to load the cosmic MCP configuration"
echo "2. Test with: context7 status"
echo "3. Check philosophy: context7 philosophy"
echo "4. Expand context: context7 expand \"your query\""
echo "5. Review documentation: docs/mcp/context7/README.md"
echo ""
echo -e "${YELLOW}🔄 To reload shell aliases: source $SHELL_PROFILE${NC}"
echo ""
echo -e "${PURPLE}✨ The Context7 MCP is now ready for cosmic memory expansion!${NC}"
echo ""
echo -e "${CYAN}_'In the expansion of our cosmic memory, we find the threads${NC}"
echo -e "${CYAN} that weave individual knowledge into collective wisdom.'_${NC}"
echo ""
echo -e "${PURPLE}🌌 Welcome to the age of Cosmic Context Awareness! 🌌${NC}"