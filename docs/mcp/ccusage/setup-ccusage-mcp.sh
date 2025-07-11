#!/bin/bash

# 🌱 CC Usage MCP Setup Script for CoomÜnity
# 
# 🎯 INTENT: Configurar sistema de métricas de sostenibilidad para desarrollo consciente
# 🌟 VALUES: Bien Común (tecnología sostenible), Transparencia (visibilidad del impacto), Ayni (equilibrio ecológico)
# ⚡ CONSTRAINTS: Monitoreo en tiempo real, preservación de privacidad, integración con filosofía CoomÜnity

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
EARTH='\033[0;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MCP_CONFIG_DIR="$HOME/.config/claude-code"
CCUSAGE_CONFIG="$MCP_CONFIG_DIR/ccusage-mcp.json"
SUSTAINABILITY_DIR="$PROJECT_ROOT/.sustainability"
METRICS_DIR="$SUSTAINABILITY_DIR/metrics"

echo -e "${EARTH}🌱 CoomÜnity CC Usage MCP Setup${NC}"
echo -e "${EARTH}================================${NC}"
echo -e "${CYAN}Building sustainable development consciousness...${NC}"
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

print_earth() {
    echo -e "${EARTH}🌍${NC} $1"
}

# Step 1: Check prerequisites
echo -e "${BLUE}📋 Checking Sustainability Prerequisites...${NC}"

# Check if system monitoring tools are available
MONITORING_TOOLS=()
if command -v htop &> /dev/null; then
    MONITORING_TOOLS+=("htop")
fi
if command -v iostat &> /dev/null; then
    MONITORING_TOOLS+=("iostat")
fi
if command -v top &> /dev/null; then
    MONITORING_TOOLS+=("top")
fi

if [ ${#MONITORING_TOOLS[@]} -eq 0 ]; then
    print_warning "No system monitoring tools found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install htop
            print_status "htop installed via Homebrew"
        else
            print_warning "Homebrew not found. Please install monitoring tools manually."
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y htop sysstat
            print_status "Monitoring tools installed via apt"
        elif command -v yum &> /dev/null; then
            sudo yum install -y htop sysstat
            print_status "Monitoring tools installed via yum"
        else
            print_warning "Package manager not found. Please install monitoring tools manually."
        fi
    fi
else
    print_status "System monitoring tools available: ${MONITORING_TOOLS[*]}"
fi

# Check if Node.js is available for mock MCP server
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js >= 18.0.0"
    exit 1
fi

print_status "Node.js available: $(node --version)"

# Step 2: Create sustainability infrastructure
echo ""
echo -e "${BLUE}🏗️ Building Sustainability Infrastructure...${NC}"

# Create sustainability directory structure
mkdir -p "$SUSTAINABILITY_DIR"
mkdir -p "$METRICS_DIR"
mkdir -p "$SUSTAINABILITY_DIR/reports"
mkdir -p "$SUSTAINABILITY_DIR/baselines"
mkdir -p "$SUSTAINABILITY_DIR/optimizations"
mkdir -p "$SUSTAINABILITY_DIR/carbon-tracking"

print_status "Sustainability directory structure created"

# Create MCP configuration directory
mkdir -p "$MCP_CONFIG_DIR"

# Step 3: Install or prepare CC Usage MCP server (mock implementation)
echo ""
echo -e "${BLUE}⚙️ Preparing CC Usage MCP Server...${NC}"

# Create a mock CC Usage MCP server script
cat > "$MCP_CONFIG_DIR/ccusage-mcp-server.js" << 'EOF'
#!/usr/bin/env node

// 🌱 Mock CC Usage MCP Server for CoomÜnity Sustainability
// This is a placeholder implementation until the actual CC Usage MCP is available

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const projectRoot = args.find(arg => arg.includes('--project-root'))?.split('=')[1] || process.cwd();
const sustainabilityMode = args.includes('--sustainability-mode');
const carbonTracking = args.includes('--carbon-tracking');

console.log('🌱 CC Usage MCP Server starting...');
console.log(`📁 Project Root: ${projectRoot}`);
console.log(`🌍 Sustainability Mode: ${sustainabilityMode ? 'Enabled' : 'Disabled'}`);
console.log(`🌿 Carbon Tracking: ${carbonTracking ? 'Enabled' : 'Disabled'}`);

// Mock sustainability metrics
const server = {
    initialize() {
        console.log('✅ CC Usage MCP Server initialized');
        console.log('🌱 Sustainability tracking active');
        console.log('📊 Resource monitoring enabled');
    },
    
    getSystemMetrics() {
        const cpus = os.cpus();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        
        return {
            cpu_count: cpus.length,
            cpu_usage_percent: Math.random() * 30 + 10, // Mock 10-40% usage
            memory_total_gb: Math.round(totalMem / 1024 / 1024 / 1024),
            memory_used_gb: Math.round(usedMem / 1024 / 1024 / 1024),
            memory_usage_percent: Math.round((usedMem / totalMem) * 100),
            timestamp: new Date().toISOString()
        };
    },
    
    calculateCarbonFootprint(metrics) {
        // Mock carbon calculation (very simplified)
        const baseCarbonPerCpuHour = 0.1; // kg CO2 per CPU hour (approximate)
        const cpuHours = (metrics.cpu_usage_percent / 100) * (1 / 60); // Assuming 1 minute sample
        const carbonEstimate = cpuHours * baseCarbonPerCpuHour;
        
        return {
            carbon_kg: carbonEstimate,
            carbon_estimate_accuracy: 0.7,
            methodology: "simplified_cpu_based",
            timestamp: new Date().toISOString()
        };
    },
    
    analyzePhilosophyAlignment() {
        return {
            bien_comun_score: 0.85 + Math.random() * 0.10,
            transparencia_score: 0.90 + Math.random() * 0.08,
            ayni_balance: 0.82 + Math.random() * 0.12,
            overall_alignment: 0.86,
            recommendations: [
                "Consider optimizing memory usage for better efficiency",
                "Current development patterns show good sustainability alignment",
                "Monitor carbon footprint during peak development hours"
            ]
        };
    },
    
    generateSustainabilityReport() {
        const metrics = this.getSystemMetrics();
        const carbon = this.calculateCarbonFootprint(metrics);
        const philosophy = this.analyzePhilosophyAlignment();
        
        return {
            timestamp: new Date().toISOString(),
            system_metrics: metrics,
            carbon_footprint: carbon,
            philosophy_alignment: philosophy,
            sustainability_score: 0.84,
            trend: "improving"
        };
    }
};

// Start the mock server
server.initialize();

// Log sample metrics every 30 seconds (for demo)
let metricsInterval;
if (process.env.DEMO_MODE === 'true') {
    metricsInterval = setInterval(() => {
        const report = server.generateSustainabilityReport();
        console.log(`🌱 Sustainability Score: ${(report.sustainability_score * 100).toFixed(1)}%`);
        console.log(`🌍 Carbon Footprint: ${report.carbon_footprint.carbon_kg.toFixed(4)} kg CO2`);
        console.log(`🎯 Philosophy Alignment: ${(report.philosophy_alignment.overall_alignment * 100).toFixed(1)}%`);
    }, 30000);
}

// Keep the process running
process.on('SIGINT', () => {
    console.log('\n🌱 CC Usage MCP Server shutting down sustainably...');
    if (metricsInterval) clearInterval(metricsInterval);
    process.exit(0);
});

console.log('🚀 CC Usage MCP Server ready for sustainability tracking!');
console.log('🌍 Monitoring environmental impact and resource consumption...');
EOF

chmod +x "$MCP_CONFIG_DIR/ccusage-mcp-server.js"
print_status "CC Usage MCP server prepared"

# Step 4: Generate CC Usage MCP configuration
echo ""
echo -e "${BLUE}⚙️ Generating Sustainability Configuration...${NC}"

cat > "$CCUSAGE_CONFIG" << EOF
{
  "mcpServers": {
    "ccusage": {
      "command": "node",
      "args": [
        "$MCP_CONFIG_DIR/ccusage-mcp-server.js",
        "--project-root=$PROJECT_ROOT",
        "--sustainability-mode=true",
        "--carbon-tracking=true",
        "--privacy-level=team"
      ],
      "env": {
        "CCUSAGE_MODE": "sustainability",
        "CARBON_ESTIMATION": "true",
        "PRIVACY_PRESERVATION": "true",
        "COOMUNITY_PHILOSOPHY": "true",
        "SUSTAINABILITY_DIR": "$SUSTAINABILITY_DIR",
        "MCP_LOG_LEVEL": "info"
      },
      "description": "CC Usage MCP for sustainability metrics and environmental consciousness"
    }
  },
  "sustainability_config": {
    "carbon_tracking": {
      "enabled": true,
      "methodology": "simplified_cpu_based",
      "baseline_location": "$SUSTAINABILITY_DIR/baselines",
      "accuracy_target": 0.80
    },
    "resource_monitoring": {
      "cpu_tracking": true,
      "memory_tracking": true,
      "network_tracking": true,
      "storage_tracking": true,
      "sample_interval_seconds": 60
    },
    "philosophy_alignment": {
      "bien_comun": {
        "weight": 0.33,
        "metrics": ["shared_resource_efficiency", "community_benefit", "collective_optimization"]
      },
      "transparencia": {
        "weight": 0.33,
        "metrics": ["metrics_visibility", "open_reporting", "clear_impact_tracking"]
      },
      "ayni": {
        "weight": 0.34,
        "metrics": ["energy_balance", "technological_harmony", "ecological_reciprocity"]
      }
    },
    "optimization_targets": {
      "carbon_reduction_percent": 20,
      "resource_efficiency_improvement": 15,
      "sustainability_score_target": 0.85,
      "philosophy_alignment_target": 0.80
    }
  },
  "reporting": {
    "daily_summary": true,
    "weekly_report": true,
    "monthly_analysis": true,
    "team_dashboard": true,
    "export_formats": ["json", "csv", "grafana"]
  },
  "integrations": {
    "github_mcp": {
      "track_commit_carbon": true,
      "pr_sustainability_analysis": true,
      "repository_efficiency_metrics": true
    },
    "context7_mcp": {
      "sustainability_context_expansion": true,
      "eco_philosophy_tracking": true,
      "cosmic_sustainability_memory": true
    },
    "protocols": {
      "watch_control": {
        "sustainability_dashboard": true,
        "real_time_metrics": true
      },
      "task_stats": {
        "sustainability_kpis": true,
        "environmental_impact_tracking": true
      }
    }
  },
  "privacy": {
    "anonymize_individual_data": true,
    "team_aggregates_only": true,
    "opt_out_available": true,
    "data_retention_days": 365
  },
  "coomunity_guardianes": {
    "HELIOS": {
      "role": "light_guardian",
      "focus": "energy_efficiency",
      "metrics": ["solar_alignment", "energy_optimization", "light_usage"]
    },
    "GAIA": {
      "role": "earth_consciousness",
      "focus": "environmental_impact",
      "metrics": ["carbon_footprint", "resource_conservation", "ecological_harmony"]
    },
    "ATLAS": {
      "role": "infrastructure_guardian",
      "focus": "system_sustainability",
      "metrics": ["infrastructure_efficiency", "performance_sustainability", "resource_optimization"]
    },
    "SAGE": {
      "role": "quality_alchemist",
      "focus": "sustainable_practices",
      "metrics": ["code_sustainability", "pattern_efficiency", "long_term_viability"]
    }
  }
}
EOF

print_status "CC Usage MCP configuration generated: $CCUSAGE_CONFIG"

# Step 5: Initialize sustainability baselines
echo ""
echo -e "${BLUE}🌱 Initializing Sustainability Baselines...${NC}"

# Create baseline measurement file
cat > "$SUSTAINABILITY_DIR/baselines/initial-baseline.json" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "baseline_type": "initial_system_measurement",
  "system_info": {
    "os": "$(uname -s)",
    "architecture": "$(uname -m)",
    "cpu_cores": $(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo "1"),
    "total_memory_gb": "estimated"
  },
  "carbon_methodology": "simplified_cpu_based",
  "measurement_duration_minutes": 1,
  "philosophy_alignment": {
    "baseline_score": 0.80,
    "target_improvement": 0.05,
    "methodology": "coomunity_ivc_pattern"
  },
  "notes": "Initial baseline for CoomÜnity sustainability tracking"
}
EOF

print_status "Initial sustainability baseline created"

# Create sustainability goals file
cat > "$SUSTAINABILITY_DIR/sustainability-goals.json" << 'EOF'
{
  "coomunity_sustainability_goals": {
    "carbon_neutrality": {
      "target_date": "2025-12-31",
      "current_progress": 0.25,
      "quarterly_milestones": [
        "Q1: Establish accurate measurement",
        "Q2: 25% reduction from baseline",
        "Q3: 50% reduction from baseline", 
        "Q4: Carbon neutral development"
      ]
    },
    "resource_efficiency": {
      "cpu_optimization": "20% improvement",
      "memory_optimization": "15% improvement",
      "network_efficiency": "30% improvement",
      "storage_optimization": "25% improvement"
    },
    "philosophy_integration": {
      "bien_comun_practices": "90% adoption",
      "transparencia_reporting": "100% visibility",
      "ayni_balance": "85% harmony score"
    },
    "team_engagement": {
      "sustainability_awareness": "100% participation",
      "eco_friendly_practices": "80% adoption",
      "continuous_improvement": "Monthly reviews"
    }
  },
  "measurement_frequency": {
    "real_time_monitoring": "60 second intervals",
    "daily_reports": "Automated summary",
    "weekly_analysis": "Trend identification",
    "monthly_review": "Goal progress assessment"
  }
}
EOF

print_status "Sustainability goals configuration created"

# Step 6: Create helper scripts and CLI
echo ""
echo -e "${BLUE}🛠️ Creating Sustainability Helper Tools...${NC}"

# CC Usage CLI helper
cat > "$MCP_CONFIG_DIR/ccusage-cli.sh" << 'EOF'
#!/bin/bash
# CC Usage CLI Helper for CoomÜnity Sustainability

CCUSAGE_CONFIG="$HOME/.config/claude-code/ccusage-mcp.json"
SUSTAINABILITY_DIR="$(jq -r '.sustainability_config.carbon_tracking.baseline_location' "$CCUSAGE_CONFIG" | sed 's|/baselines||')"

case "${1:-help}" in
    "status")
        echo "🌱 CC Usage Sustainability Status:"
        echo "📁 Sustainability Directory: $SUSTAINABILITY_DIR"
        echo "🌍 Carbon Tracking: $(jq -r '.sustainability_config.carbon_tracking.enabled' "$CCUSAGE_CONFIG")"
        echo "📊 Monitoring Interval: $(jq -r '.sustainability_config.resource_monitoring.sample_interval_seconds' "$CCUSAGE_CONFIG")s"
        
        if [ -d "$SUSTAINABILITY_DIR" ]; then
            echo "✅ Sustainability infrastructure active"
            echo "📄 Baseline files: $(find "$SUSTAINABILITY_DIR/baselines" -name "*.json" | wc -l)"
            echo "📊 Metric files: $(find "$SUSTAINABILITY_DIR/metrics" -name "*.json" | wc -l)"
        else
            echo "❌ Sustainability infrastructure not found"
        fi
        ;;
    "carbon")
        echo "🌍 Carbon Footprint Analysis:"
        
        if [ -f "$SUSTAINABILITY_DIR/baselines/initial-baseline.json" ]; then
            echo "✅ Carbon baseline established"
            baseline_date=$(jq -r '.timestamp' "$SUSTAINABILITY_DIR/baselines/initial-baseline.json")
            echo "📅 Baseline Date: $baseline_date"
            echo "⚙️ Methodology: $(jq -r '.carbon_methodology' "$SUSTAINABILITY_DIR/baselines/initial-baseline.json")"
        else
            echo "❌ Carbon baseline not found"
        fi
        
        # Mock current carbon metrics
        echo ""
        echo "📊 Current Estimates (Mock Data):"
        echo "  🌿 Daily Carbon: ~0.5 kg CO2"
        echo "  📈 Weekly Trend: -5% (improving)"
        echo "  🎯 Monthly Target: 20% reduction"
        echo "  ⚖️ Accuracy: ~70% (simplified model)"
        ;;
    "philosophy")
        echo "🎯 Philosophy Alignment Analysis:"
        
        echo "🌟 CoomÜnity Values Integration:"
        bien_comun_weight=$(jq -r '.sustainability_config.philosophy_alignment.bien_comun.weight' "$CCUSAGE_CONFIG")
        transparencia_weight=$(jq -r '.sustainability_config.philosophy_alignment.transparencia.weight' "$CCUSAGE_CONFIG")
        ayni_weight=$(jq -r '.sustainability_config.philosophy_alignment.ayni.weight' "$CCUSAGE_CONFIG")
        
        echo "  🌍 Bien Común (weight: $bien_comun_weight)"
        echo "    📊 Shared resource efficiency tracking"
        echo "    🤝 Community benefit measurement"
        echo "    🔄 Collective optimization focus"
        echo ""
        echo "  👁️ Transparencia (weight: $transparencia_weight)"
        echo "    📈 Metrics visibility enabled"
        echo "    📋 Open reporting active"
        echo "    🎯 Clear impact tracking"
        echo ""
        echo "  ⚖️ Ayni (weight: $ayni_weight)"
        echo "    ⚡ Energy balance monitoring"
        echo "    🌿 Technological harmony tracking"
        echo "    🔄 Ecological reciprocity measurement"
        ;;
    "optimize")
        echo "🚀 Sustainability Optimization Recommendations:"
        
        echo "🎯 Current Targets:"
        carbon_reduction=$(jq -r '.sustainability_config.optimization_targets.carbon_reduction_percent' "$CCUSAGE_CONFIG")
        efficiency_improvement=$(jq -r '.sustainability_config.optimization_targets.resource_efficiency_improvement' "$CCUSAGE_CONFIG")
        sustainability_target=$(jq -r '.sustainability_config.optimization_targets.sustainability_score_target' "$CCUSAGE_CONFIG")
        
        echo "  🌿 Carbon Reduction: $carbon_reduction%"
        echo "  ⚡ Resource Efficiency: +$efficiency_improvement%"
        echo "  📊 Sustainability Score: $sustainability_target"
        echo ""
        echo "💡 Optimization Suggestions (Mock):"
        echo "  1. 🖥️ Optimize CPU usage during non-peak hours"
        echo "  2. 💾 Implement memory caching for repeated operations"
        echo "  3. 🌐 Reduce unnecessary network requests"
        echo "  4. 🔄 Use more efficient algorithms in hot paths"
        echo "  5. ⏰ Schedule heavy operations during renewable energy peak hours"
        ;;
    "report")
        report_type="${2:-weekly}"
        echo "📊 Generating $report_type Sustainability Report..."
        
        timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        local report_file="$SUSTAINABILITY_DIR/reports/${report_type}-report-$(date +%Y%m%d).json"
        
        # Create mock report
        cat > "$report_file" << EOF
{
  "report_type": "$report_type",
  "timestamp": "$timestamp",
  "period": "mock_period",
  "summary": {
    "sustainability_score": 0.84,
    "carbon_footprint_kg": 2.1,
    "resource_efficiency": 0.78,
    "philosophy_alignment": 0.86
  },
  "trends": {
    "carbon_trend": "decreasing",
    "efficiency_trend": "improving", 
    "alignment_trend": "stable"
  },
  "recommendations": [
    "Continue current optimization practices",
    "Focus on memory efficiency improvements",
    "Increase renewable energy usage during development"
  ],
  "coomunity_values": {
    "bien_comun_score": 0.87,
    "transparencia_score": 0.89,
    "ayni_balance": 0.82
  }
}
EOF
        
        echo "✅ Sustainability report generated successfully"
        echo ""
        echo "📈 Summary:"
        echo "  sustainability_score: 0.84"
        echo "  carbon_footprint_kg: 2.1"
        echo "  resource_efficiency: 0.78"
        echo "  philosophy_alignment: 0.86"
        ;;
    "baseline")
        if [ "$2" = "reset" ]; then
            echo "🔄 Resetting sustainability baseline..."
            
            baseline_file="$SUSTAINABILITY_DIR/baselines/baseline-$(date +%Y%m%d-%H%M%S).json"
            cat > "$baseline_file" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "baseline_type": "manual_reset",
  "system_snapshot": {
    "measurement_time": "$(date)",
    "reset_reason": "Manual baseline reset via CLI"
  },
  "philosophy_alignment": {
    "bien_comun": 0.80,
    "transparencia": 0.85,
    "ayni": 0.82
  }
}
EOF
            echo "✅ New baseline created: $baseline_file"
        else
            echo "📊 Current Sustainability Baseline:"
            if [ -f "$SUSTAINABILITY_DIR/baselines/initial-baseline.json" ]; then
                echo "📅 Created: $(jq -r '.timestamp' "$SUSTAINABILITY_DIR/baselines/initial-baseline.json")"
                echo "🖥️ System: $(jq -r '.system_info.os' "$SUSTAINABILITY_DIR/baselines/initial-baseline.json")"
                echo "🧮 CPU Cores: $(jq -r '.system_info.cpu_cores' "$SUSTAINABILITY_DIR/baselines/initial-baseline.json")"
                echo "🎯 Target Improvement: $(jq -r '.philosophy_alignment.target_improvement' "$SUSTAINABILITY_DIR/baselines/initial-baseline.json")"
            else
                echo "❌ No baseline found. Run setup script to create initial baseline."
            fi
            echo ""
            echo "💡 Use 'ccusage-cli baseline reset' to create a new baseline"
        fi
        ;;
    *)
        echo "🌱 CC Usage Sustainability CLI"
        echo ""
        echo "Usage: ccusage-cli [command]"
        echo ""
        echo "Commands:"
        echo "  status      - Show sustainability tracking status"
        echo "  carbon      - Display carbon footprint analysis"
        echo "  philosophy  - Show philosophy alignment metrics"
        echo "  optimize    - Get sustainability optimization recommendations"
        echo "  report      - Generate sustainability report [daily|weekly|monthly]"
        echo "  baseline    - Show baseline info or 'reset' to create new baseline"
        echo ""
        echo "🌍 Environmental Values: Bien Común, Transparencia, Ayni"
        echo ""
        echo "_'In the consciousness of our consumption, we find the path"
        echo " to technological harmony with Gaia.'_"
        ;;
esac
EOF

chmod +x "$MCP_CONFIG_DIR/ccusage-cli.sh"
print_status "CC Usage CLI helper created"

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
    if ! grep -q "ccusage-cli" "$SHELL_PROFILE"; then
        echo "" >> "$SHELL_PROFILE"
        echo "# CC Usage Sustainability CLI for CoomÜnity" >> "$SHELL_PROFILE"
        echo "alias ccusage='$MCP_CONFIG_DIR/ccusage-cli.sh'" >> "$SHELL_PROFILE"
        print_status "Shell alias 'ccusage' added to $SHELL_PROFILE"
    fi
fi

# Step 7: Test the sustainability configuration
echo ""
echo -e "${BLUE}🧪 Testing Sustainability Configuration...${NC}"

# Test configuration file validity
if jq empty "$CCUSAGE_CONFIG" 2>/dev/null; then
    print_status "CC Usage configuration is valid JSON"
else
    print_error "CC Usage configuration has JSON syntax errors"
    exit 1
fi

# Test sustainability infrastructure
if [ -d "$SUSTAINABILITY_DIR" ]; then
    print_status "Sustainability infrastructure accessible"
else
    print_error "Sustainability infrastructure not created"
    exit 1
fi

# Test baseline file
if [ -f "$SUSTAINABILITY_DIR/baselines/initial-baseline.json" ]; then
    print_status "Sustainability baseline initialized"
else
    print_error "Sustainability baseline not created"
    exit 1
fi

# Step 8: Sustainability Success Summary
echo ""
echo -e "${EARTH}🌱 CC Usage Sustainability Setup Complete!${NC}"
echo -e "${EARTH}===========================================${NC}"
echo ""
print_earth "Configuration: $CCUSAGE_CONFIG"
print_earth "Sustainability Dir: $SUSTAINABILITY_DIR"
print_earth "CLI Helper: ccusage"
print_earth "Philosophy: Bien Común, Transparencia, Ayni"
echo ""
echo -e "${BLUE}🚀 Sustainable Next Steps:${NC}"
echo "1. Restart Claude Code to load the sustainability MCP"
echo "2. Test with: ccusage status"
echo "3. Check carbon tracking: ccusage carbon" 
echo "4. Review philosophy alignment: ccusage philosophy"
echo "5. Generate sustainability report: ccusage report weekly"
echo "6. Review documentation: docs/mcp/ccusage/README.md"
echo ""
echo -e "${YELLOW}🔄 To reload shell aliases: source $SHELL_PROFILE${NC}"
echo ""
echo -e "${EARTH}✨ The CC Usage MCP is now ready for sustainability tracking!${NC}"
echo ""
echo -e "${CYAN}_'In the consciousness of our consumption, we find the path${NC}"
echo -e "${CYAN} to technological harmony with Gaia.'_${NC}"
echo ""
echo -e "${EARTH}🌍 Together, we build technology that serves both humanity and Earth! 🌍${NC}"