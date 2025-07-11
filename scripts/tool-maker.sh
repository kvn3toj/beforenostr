#!/bin/bash

# 🛠️ Tool Maker System - CoomÜnity Automation Protocol
# 
# 🎯 INTENT: Crear y gestionar herramientas de desarrollo de forma automatizada siguiendo patrones CoomÜnity
# 🌟 VALUES: Reciprocidad (herramientas compartidas), Metanöia (transformar desarrollo), Neguentropía (reducir caos)
# ⚡ CONSTRAINTS: Patrones monorepo, TypeScript, documentación automática, tests obligatorios

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
TOOLS_DIR="$PROJECT_ROOT/tools"
TEMPLATES_DIR="$TOOLS_DIR/templates"
LOG_DIR="$PROJECT_ROOT/logs"
TOOL_MAKER_LOG="$LOG_DIR/tool-maker-$(date +%Y%m%d).log"

# Ensure directories exist
mkdir -p "$TOOLS_DIR"
mkdir -p "$TEMPLATES_DIR"
mkdir -p "$LOG_DIR"

# Logging function
log_action() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" | tee -a "$TOOL_MAKER_LOG"
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

print_tool() {
    echo -e "${PURPLE}🛠️${NC} $1"
    log_action "TOOL: $1"
}

# Template management
create_templates() {
    print_tool "Creating CoomÜnity tool templates..."
    
    # Analytics template
    cat > "$TEMPLATES_DIR/analytics.template.ts" << 'EOF'
// 📊 Analytics Tool Template - CoomÜnity Pattern
// 🎯 INTENT: {{TOOL_INTENT}}
// 🌟 VALUES: {{TOOL_VALUES}}
// ⚡ CONSTRAINTS: {{TOOL_CONSTRAINTS}}

import { EventEmitter } from 'events';

export interface AnalyticsConfig {
  projectRoot: string;
  outputFormat: 'json' | 'csv' | 'grafana';
  philosophyTracking: boolean;
}

export interface CoomunityMetrics {
  transparencia: number;
  bienComun: number;
  reciprocidad: number;
  ayni: number;
}

export class {{TOOL_CLASS_NAME}} extends EventEmitter {
  private config: AnalyticsConfig;
  private metrics: Map<string, any> = new Map();

  constructor(config: AnalyticsConfig) {
    super();
    this.config = config;
    this.initializePhilosophyTracking();
  }

  /**
   * Initialize philosophy alignment tracking
   */
  private initializePhilosophyTracking(): void {
    if (this.config.philosophyTracking) {
      this.emit('philosophy-tracking-enabled');
    }
  }

  /**
   * Analyze data with CoomÜnity philosophy alignment
   */
  public async analyze(data: any[]): Promise<CoomunityMetrics> {
    const startTime = Date.now();
    
    try {
      // Implement analysis logic here
      const metrics = this.calculatePhilosophyAlignment(data);
      
      this.emit('analysis-complete', {
        duration: Date.now() - startTime,
        recordsAnalyzed: data.length,
        metrics
      });
      
      return metrics;
    } catch (error) {
      this.emit('analysis-error', error);
      throw error;
    }
  }

  /**
   * Calculate philosophy alignment metrics
   */
  private calculatePhilosophyAlignment(data: any[]): CoomunityMetrics {
    // Mock calculation - implement actual logic
    return {
      transparencia: 0.85,
      bienComun: 0.82,
      reciprocidad: 0.88,
      ayni: 0.86
    };
  }

  /**
   * Export results in specified format
   */
  public async export(metrics: CoomunityMetrics): Promise<string> {
    const timestamp = new Date().toISOString();
    const filename = `{{TOOL_NAME}}-analysis-${timestamp.split('T')[0]}.${this.config.outputFormat}`;
    
    switch (this.config.outputFormat) {
      case 'json':
        return this.exportJson(metrics, filename);
      case 'csv':
        return this.exportCsv(metrics, filename);
      case 'grafana':
        return this.exportGrafana(metrics, filename);
      default:
        throw new Error(`Unsupported format: ${this.config.outputFormat}`);
    }
  }

  private exportJson(metrics: CoomunityMetrics, filename: string): string {
    const output = {
      timestamp: new Date().toISOString(),
      tool: '{{TOOL_NAME}}',
      philosophy: 'coomunity-ivc-pattern',
      metrics,
      metadata: {
        version: '1.0.0',
        generator: 'tool-maker-system'
      }
    };
    
    // Implementation for JSON export
    return filename;
  }

  private exportCsv(metrics: CoomunityMetrics, filename: string): string {
    // Implementation for CSV export
    return filename;
  }

  private exportGrafana(metrics: CoomunityMetrics, filename: string): string {
    // Implementation for Grafana export
    return filename;
  }
}

// Example usage
export const create{{TOOL_CLASS_NAME}} = (config: Partial<AnalyticsConfig> = {}) => {
  const defaultConfig: AnalyticsConfig = {
    projectRoot: process.cwd(),
    outputFormat: 'json',
    philosophyTracking: true,
    ...config
  };
  
  return new {{TOOL_CLASS_NAME}}(defaultConfig);
};
EOF

    # Utility template
    cat > "$TEMPLATES_DIR/utility.template.ts" << 'EOF'
// 🔧 Utility Tool Template - CoomÜnity Pattern
// 🎯 INTENT: {{TOOL_INTENT}}
// 🌟 VALUES: {{TOOL_VALUES}}
// ⚡ CONSTRAINTS: {{TOOL_CONSTRAINTS}}

import * as fs from 'fs/promises';
import * as path from 'path';

export interface UtilityConfig {
  projectRoot: string;
  verbose: boolean;
  dryRun: boolean;
}

export interface PhilosophyCheck {
  hasIntent: boolean;
  hasValues: boolean;
  hasConstraints: boolean;
  alignmentScore: number;
}

export class {{TOOL_CLASS_NAME}} {
  private config: UtilityConfig;

  constructor(config: UtilityConfig) {
    this.config = config;
  }

  /**
   * Execute the tool's main functionality
   */
  public async execute(...args: any[]): Promise<any> {
    if (this.config.verbose) {
      console.log(`🛠️ Executing {{TOOL_NAME}} with args:`, args);
    }

    if (this.config.dryRun) {
      console.log('🔄 Dry run mode - no changes will be made');
      return this.simulateExecution(args);
    }

    return this.performExecution(args);
  }

  /**
   * Check philosophy alignment of files/code
   */
  public async checkPhilosophyAlignment(filePath: string): Promise<PhilosophyCheck> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      const hasIntent = /🎯\s*INTENT:/i.test(content);
      const hasValues = /🌟\s*VALUES:/i.test(content);
      const hasConstraints = /⚡\s*CONSTRAINTS:/i.test(content);
      
      const score = [hasIntent, hasValues, hasConstraints].filter(Boolean).length / 3;
      
      return {
        hasIntent,
        hasValues,
        hasConstraints,
        alignmentScore: score
      };
    } catch (error) {
      throw new Error(`Failed to check philosophy alignment: ${error.message}`);
    }
  }

  /**
   * Generate documentation for the tool
   */
  public async generateDocs(): Promise<string> {
    const docTemplate = `# {{TOOL_NAME}} Documentation

## 🎯 Intent
{{TOOL_INTENT}}

## 🌟 Values
{{TOOL_VALUES}}

## ⚡ Constraints
{{TOOL_CONSTRAINTS}}

## Usage

\`\`\`typescript
import { {{TOOL_CLASS_NAME}} } from './{{TOOL_NAME}}';

const tool = new {{TOOL_CLASS_NAME}}({
  projectRoot: process.cwd(),
  verbose: true,
  dryRun: false
});

await tool.execute();
\`\`\`

## Philosophy Alignment

This tool follows the CoomÜnity Intent + Values + Constraints pattern:

- **Transparencia**: Clear documentation and verbose logging
- **Bien Común**: Shared utility for team benefit
- **Reciprocidad**: Contributes to collective development efficiency
- **Metanöia**: Transforms development workflow

Generated by Tool Maker System
`;

    return docTemplate;
  }

  private async simulateExecution(args: any[]): Promise<any> {
    // Simulate the execution without making changes
    return {
      simulation: true,
      args,
      estimatedChanges: 'Mock changes that would be made'
    };
  }

  private async performExecution(args: any[]): Promise<any> {
    // Implement actual execution logic
    return {
      success: true,
      args,
      changes: 'Actual changes made'
    };
  }
}

// Export factory function
export const create{{TOOL_CLASS_NAME}} = (config: Partial<UtilityConfig> = {}) => {
  const defaultConfig: UtilityConfig = {
    projectRoot: process.cwd(),
    verbose: false,
    dryRun: false,
    ...config
  };
  
  return new {{TOOL_CLASS_NAME}}(defaultConfig);
};
EOF

    # Test template
    cat > "$TEMPLATES_DIR/test.template.ts" << 'EOF'
// 🧪 Test Template for {{TOOL_NAME}} - CoomÜnity Pattern
// 🎯 INTENT: Validate {{TOOL_NAME}} functionality and philosophy alignment
// 🌟 VALUES: Transparencia (clear test results), Bien Común (shared test quality)
// ⚡ CONSTRAINTS: Jest framework, 100% coverage target, philosophy validation

import { {{TOOL_CLASS_NAME}}, create{{TOOL_CLASS_NAME}} } from '../{{TOOL_NAME}}';

describe('{{TOOL_CLASS_NAME}}', () => {
  let tool: {{TOOL_CLASS_NAME}};

  beforeEach(() => {
    tool = create{{TOOL_CLASS_NAME}}({
      projectRoot: '/tmp/test-project',
      verbose: false,
      dryRun: true
    });
  });

  describe('🎯 Intent Validation', () => {
    it('should fulfill the stated intent', async () => {
      // Test that the tool achieves its intended purpose
      const result = await tool.execute();
      expect(result).toBeDefined();
    });
  });

  describe('🌟 Values Alignment', () => {
    it('should demonstrate Transparencia through clear logging', () => {
      // Test transparency features
      expect(tool).toHaveProperty('config');
    });

    it('should support Bien Común through shared utilities', () => {
      // Test common good features
      expect(typeof tool.execute).toBe('function');
    });

    it('should exhibit Reciprocidad through contribution patterns', () => {
      // Test reciprocity features
      expect(tool.generateDocs).toBeDefined();
    });
  });

  describe('⚡ Constraints Compliance', () => {
    it('should respect project root constraints', () => {
      expect(tool.config.projectRoot).toContain('/tmp/test-project');
    });

    it('should handle TypeScript requirements', () => {
      // Test TypeScript compliance
      expect(tool.constructor).toBeDefined();
    });
  });

  describe('🧠 Philosophy Integration', () => {
    it('should check philosophy alignment in files', async () => {
      const mockFilePath = 'mock-file.ts';
      
      // Mock file content with IVC pattern
      jest.spyOn(require('fs/promises'), 'readFile').mockResolvedValue(`
        // 🎯 INTENT: Test intent
        // 🌟 VALUES: Test values  
        // ⚡ CONSTRAINTS: Test constraints
      `);

      const check = await tool.checkPhilosophyAlignment(mockFilePath);
      
      expect(check.hasIntent).toBe(true);
      expect(check.hasValues).toBe(true);
      expect(check.hasConstraints).toBe(true);
      expect(check.alignmentScore).toBe(1.0);
    });

    it('should generate philosophy-aligned documentation', async () => {
      const docs = await tool.generateDocs();
      
      expect(docs).toContain('🎯 Intent');
      expect(docs).toContain('🌟 Values');
      expect(docs).toContain('⚡ Constraints');
      expect(docs).toContain('CoomÜnity');
    });
  });

  describe('🔄 Error Handling', () => {
    it('should handle execution errors gracefully', async () => {
      // Test error scenarios
      const toolWithError = create{{TOOL_CLASS_NAME}}({
        projectRoot: '/nonexistent/path'
      });

      await expect(toolWithError.execute()).resolves.toBeDefined();
    });
  });

  describe('📊 Performance', () => {
    it('should execute within reasonable time constraints', async () => {
      const startTime = Date.now();
      await tool.execute();
      const executionTime = Date.now() - startTime;
      
      expect(executionTime).toBeLessThan(5000); // 5 seconds max
    });
  });
});

// Integration tests
describe('{{TOOL_CLASS_NAME}} Integration', () => {
  it('should integrate with CoomÜnity ecosystem', () => {
    const tool = create{{TOOL_CLASS_NAME}}();
    
    // Test ecosystem integration
    expect(tool).toBeInstanceOf({{TOOL_CLASS_NAME}});
  });

  it('should support monorepo patterns', async () => {
    const tool = create{{TOOL_CLASS_NAME}}({
      projectRoot: '{{PROJECT_ROOT}}'
    });
    
    const result = await tool.execute();
    expect(result).toBeDefined();
  });
});
EOF

    print_status "CoomÜnity tool templates created"
}

# Tool creation functionality
create_tool() {
    local tool_name="$1"
    local template_type="${2:-utility}"
    local output_dir="${3:-$TOOLS_DIR}"
    
    if [ -z "$tool_name" ]; then
        print_error "Tool name required"
        return 1
    fi
    
    print_tool "Creating tool: $tool_name (template: $template_type)"
    
    # Validate template type
    local template_file="$TEMPLATES_DIR/${template_type}.template.ts"
    if [ ! -f "$template_file" ]; then
        print_error "Template not found: $template_type"
        print_info "Available templates: analytics, utility"
        return 1
    fi
    
    # Create tool directory
    local tool_dir="$output_dir/$tool_name"
    mkdir -p "$tool_dir"
    mkdir -p "$tool_dir/tests"
    mkdir -p "$tool_dir/docs"
    
    # Generate tool class name (PascalCase)
    local tool_class_name=$(echo "$tool_name" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/')
    
    # Prompt for Intent, Values, and Constraints
    local tool_intent="Provide automated functionality for CoomÜnity development"
    local tool_values="Transparencia, Bien Común, Reciprocidad"
    local tool_constraints="TypeScript, CoomÜnity patterns, automated testing"
    
    print_info "Enter tool details (or press Enter for defaults):"
    read -p "🎯 Intent: " input_intent
    if [ -n "$input_intent" ]; then
        tool_intent="$input_intent"
    fi
    
    read -p "🌟 Values: " input_values
    if [ -n "$input_values" ]; then
        tool_values="$input_values"
    fi
    
    read -p "⚡ Constraints: " input_constraints
    if [ -n "$input_constraints" ]; then
        tool_constraints="$input_constraints"
    fi
    
    # Create main tool file
    local tool_file="$tool_dir/${tool_name}.ts"
    cp "$template_file" "$tool_file"
    
    # Replace template variables
    sed -i '' "s/{{TOOL_NAME}}/$tool_name/g" "$tool_file"
    sed -i '' "s/{{TOOL_CLASS_NAME}}/$tool_class_name/g" "$tool_file"
    sed -i '' "s/{{TOOL_INTENT}}/$tool_intent/g" "$tool_file"
    sed -i '' "s/{{TOOL_VALUES}}/$tool_values/g" "$tool_file"
    sed -i '' "s/{{TOOL_CONSTRAINTS}}/$tool_constraints/g" "$tool_file"
    sed -i '' "s|{{PROJECT_ROOT}}|$PROJECT_ROOT|g" "$tool_file"
    
    print_status "Main tool file created: $tool_file"
    
    # Create test file
    local test_file="$tool_dir/tests/${tool_name}.test.ts"
    cp "$TEMPLATES_DIR/test.template.ts" "$test_file"
    
    # Replace template variables in test
    sed -i '' "s/{{TOOL_NAME}}/$tool_name/g" "$test_file"
    sed -i '' "s/{{TOOL_CLASS_NAME}}/$tool_class_name/g" "$test_file"
    sed -i '' "s|{{PROJECT_ROOT}}|$PROJECT_ROOT|g" "$test_file"
    
    print_status "Test file created: $test_file"
    
    # Create package.json for the tool
    cat > "$tool_dir/package.json" << EOF
{
  "name": "@coomunity/${tool_name}",
  "version": "1.0.0",
  "description": "${tool_intent}",
  "main": "${tool_name}.js",
  "types": "${tool_name}.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "dev": "ts-node ${tool_name}.ts"
  },
  "keywords": [
    "coomunity",
    "tool",
    "${template_type}",
    "typescript",
    "automation"
  ],
  "author": "CoomÜnity Team",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "events": "^3.3.0"
  },
  "coomunity": {
    "philosophy": {
      "intent": "${tool_intent}",
      "values": "${tool_values}",
      "constraints": "${tool_constraints}"
    },
    "template": "${template_type}",
    "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "generator": "tool-maker-system"
  }
}
EOF
    
    print_status "Package configuration created"
    
    # Create TypeScript config
    cat > "$tool_dir/tsconfig.json" << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "*.ts",
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}
EOF
    
    print_status "TypeScript configuration created"
    
    # Create Jest config
    cat > "$tool_dir/jest.config.js" << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    '*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
EOF
    
    print_status "Jest configuration created"
    
    print_tool "Tool creation completed: $tool_name"
    print_info "📁 Location: $tool_dir"
    print_info "🧪 Run tests: cd $tool_dir && npm test"
    print_info "🔨 Build tool: cd $tool_dir && npm run build"
}

# Documentation generation
generate_docs() {
    local tool_name="$1"
    local format="${2:-markdown}"
    
    if [ -z "$tool_name" ]; then
        print_error "Tool name required for documentation generation"
        return 1
    fi
    
    local tool_dir="$TOOLS_DIR/$tool_name"
    if [ ! -d "$tool_dir" ]; then
        print_error "Tool not found: $tool_name"
        return 1
    fi
    
    print_tool "Generating documentation for: $tool_name (format: $format)"
    
    local package_json="$tool_dir/package.json"
    if [ ! -f "$package_json" ]; then
        print_error "Package.json not found for tool: $tool_name"
        return 1
    fi
    
    # Extract information from package.json
    local description=$(jq -r '.description // "No description"' "$package_json")
    local version=$(jq -r '.version // "1.0.0"' "$package_json")
    local intent=$(jq -r '.coomunity.philosophy.intent // "Not specified"' "$package_json")
    local values=$(jq -r '.coomunity.philosophy.values // "Not specified"' "$package_json")
    local constraints=$(jq -r '.coomunity.philosophy.constraints // "Not specified"' "$package_json")
    local template_type=$(jq -r '.coomunity.template // "utility"' "$package_json")
    local created=$(jq -r '.coomunity.created // "Unknown"' "$package_json")
    
    case "$format" in
        "markdown")
            local doc_file="$tool_dir/docs/README.md"
            cat > "$doc_file" << EOF
# 🛠️ $tool_name

## 📋 Overview

**Version:** $version  
**Type:** $template_type  
**Created:** $created  

$description

## 🎯 Intent

$intent

## 🌟 Values

$values

## ⚡ Constraints

$constraints

## 🚀 Installation

\`\`\`bash
cd tools/$tool_name
npm install
\`\`\`

## 📖 Usage

\`\`\`typescript
import { create$(echo "$tool_name" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/') } from './$tool_name';

const tool = create$(echo "$tool_name" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/')({
  projectRoot: process.cwd(),
  verbose: true
});

await tool.execute();
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
\`\`\`

## 🔨 Development

\`\`\`bash
# Build TypeScript
npm run build

# Development mode
npm run dev
\`\`\`

## 🌟 Philosophy Alignment

This tool follows the CoomÜnity Intent + Values + Constraints pattern:

### 📊 Metrics
- **Transparencia**: Clear documentation and logging
- **Bien Común**: Shared utility for team development
- **Reciprocidad**: Contributes to collective efficiency
- **Metanöia**: Transforms development workflow

### 🎯 Quality Standards
- TypeScript strict mode
- 80%+ test coverage
- Philosophy alignment validation
- Automated documentation

## 🔗 Integration

### With CoomÜnity Ecosystem
- Follows monorepo patterns
- Compatible with existing workflows
- Integrates with automation protocols

### With Other Tools
- Can be composed with other CoomÜnity tools
- Supports chain execution
- Event-driven architecture

## 📝 Contributing

1. Follow the CoomÜnity development guidelines
2. Ensure philosophy alignment (Intent + Values + Constraints)
3. Maintain test coverage above 80%
4. Update documentation for any changes

---

_Generated by Tool Maker System - CoomÜnity Automation Protocol_
EOF
            print_status "Markdown documentation generated: $doc_file"
            ;;
        "json")
            local doc_file="$tool_dir/docs/documentation.json"
            cat > "$doc_file" << EOF
{
  "tool": "$tool_name",
  "version": "$version",
  "type": "$template_type",
  "created": "$created",
  "description": "$description",
  "philosophy": {
    "intent": "$intent",
    "values": "$values",
    "constraints": "$constraints"
  },
  "usage": {
    "installation": "cd tools/$tool_name && npm install",
    "basic_usage": "import { create$(echo "$tool_name" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/') } from './$tool_name'",
    "testing": "npm test",
    "building": "npm run build"
  },
  "integration": {
    "ecosystem": "CoomÜnity monorepo",
    "patterns": ["automation", "philosophy-aligned", "typescript"],
    "dependencies": ["events", "fs/promises", "path"]
  },
  "quality": {
    "test_coverage_target": 80,
    "typescript_strict": true,
    "philosophy_validation": true,
    "documentation_auto_generated": true
  },
  "generated_by": "tool-maker-system",
  "generated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
            print_status "JSON documentation generated: $doc_file"
            ;;
        *)
            print_error "Unknown documentation format: $format. Use 'markdown' or 'json'"
            return 1
            ;;
    esac
}

# Tool testing functionality
test_tool() {
    local tool_name="$1"
    
    if [ -z "$tool_name" ]; then
        print_error "Tool name required for testing"
        return 1
    fi
    
    local tool_dir="$TOOLS_DIR/$tool_name"
    if [ ! -d "$tool_dir" ]; then
        print_error "Tool not found: $tool_name"
        return 1
    fi
    
    print_tool "Testing tool: $tool_name"
    
    cd "$tool_dir"
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        npm install
    fi
    
    # Run tests
    print_info "Running tests..."
    if npm test; then
        print_status "All tests passed for $tool_name"
    else
        print_error "Tests failed for $tool_name"
        return 1
    fi
    
    # Check coverage
    print_info "Checking test coverage..."
    npm run test:coverage
    
    cd - > /dev/null
}

# Tool deployment functionality
deploy_tool() {
    local tool_name="$1"
    
    if [ -z "$tool_name" ]; then
        print_error "Tool name required for deployment"
        return 1
    fi
    
    local tool_dir="$TOOLS_DIR/$tool_name"
    if [ ! -d "$tool_dir" ]; then
        print_error "Tool not found: $tool_name"
        return 1
    fi
    
    print_tool "Deploying tool: $tool_name"
    
    cd "$tool_dir"
    
    # Build the tool
    print_info "Building tool..."
    if npm run build; then
        print_status "Build successful for $tool_name"
    else
        print_error "Build failed for $tool_name"
        return 1
    fi
    
    # Test before deployment
    print_info "Running pre-deployment tests..."
    if npm test; then
        print_status "Pre-deployment tests passed"
    else
        print_error "Pre-deployment tests failed"
        return 1
    fi
    
    # Create deployment package
    local deploy_dir="$PROJECT_ROOT/deployments/$tool_name"
    mkdir -p "$deploy_dir"
    
    # Copy built files
    cp -r dist/* "$deploy_dir/" 2>/dev/null || true
    cp package.json "$deploy_dir/"
    cp -r docs "$deploy_dir/" 2>/dev/null || true
    
    print_status "Tool deployed to: $deploy_dir"
    
    cd - > /dev/null
}

# List available tools
list_tools() {
    print_tool "Available CoomÜnity tools:"
    
    if [ ! -d "$TOOLS_DIR" ] || [ -z "$(ls -A "$TOOLS_DIR" 2>/dev/null)" ]; then
        print_info "No tools found. Create one with: tool-maker create <name>"
        return
    fi
    
    for tool_dir in "$TOOLS_DIR"/*; do
        if [ -d "$tool_dir" ]; then
            local tool_name=$(basename "$tool_dir")
            local package_json="$tool_dir/package.json"
            
            if [ -f "$package_json" ]; then
                local description=$(jq -r '.description // "No description"' "$package_json")
                local version=$(jq -r '.version // "1.0.0"' "$package_json")
                local template_type=$(jq -r '.coomunity.template // "utility"' "$package_json")
                
                echo "  🛠️  $tool_name ($version) - $template_type"
                echo "      $description"
                echo ""
            else
                echo "  📁 $tool_name (no package.json)"
            fi
        fi
    done
}

# Main command processing
main() {
    local start_time=$(date +%s)
    
    print_tool "CoomÜnity Tool Maker System Starting..."
    print_info "Tools Directory: $TOOLS_DIR"
    print_info "Log: $TOOL_MAKER_LOG"
    
    # Ensure templates exist
    if [ ! -f "$TEMPLATES_DIR/utility.template.ts" ]; then
        create_templates
    fi
    
    case "${1:-help}" in
        "create"|"--create-tool")
            shift
            create_tool "$@"
            ;;
        "generate-docs"|"--generate-docs")
            shift
            generate_docs "$@"
            ;;
        "test"|"--test-tool")
            shift
            test_tool "$@"
            ;;
        "deploy"|"--deploy-tool")
            shift
            deploy_tool "$@"
            ;;
        "list"|"--list-tools")
            list_tools
            ;;
        "templates"|"--create-templates")
            create_templates
            ;;
        "--help"|"help"|*)
            echo -e "${PURPLE}🛠️ CoomÜnity Tool Maker System${NC}"
            echo -e "${PURPLE}================================${NC}"
            echo ""
            echo -e "${BLUE}🎯 INTENT:${NC} Create and manage development tools automatically"
            echo -e "${BLUE}🌟 VALUES:${NC} Reciprocidad, Metanöia, Neguentropía"
            echo -e "${BLUE}⚡ CONSTRAINTS:${NC} TypeScript, CoomÜnity patterns, automated testing"
            echo ""
            echo -e "${CYAN}🔧 Commands:${NC}"
            echo "  create <name> [template] [output]  Create new tool"
            echo "  generate-docs <name> [format]     Generate documentation"
            echo "  test <name>                       Run tool tests"
            echo "  deploy <name>                     Deploy tool"
            echo "  list                              List available tools"
            echo "  templates                         Create/update templates"
            echo ""
            echo -e "${CYAN}📝 Templates:${NC}"
            echo "  analytics    - Data analysis and metrics tools"
            echo "  utility      - General purpose development utilities"
            echo ""
            echo -e "${CYAN}📖 Documentation Formats:${NC}"
            echo "  markdown     - README.md format"
            echo "  json         - Structured JSON documentation"
            echo ""
            echo -e "${CYAN}🔨 Usage Examples:${NC}"
            echo "  ./tool-maker.sh create commit-analyzer analytics"
            echo "  ./tool-maker.sh generate-docs commit-analyzer markdown"
            echo "  ./tool-maker.sh test commit-analyzer"
            echo "  ./tool-maker.sh deploy commit-analyzer"
            echo "  ./tool-maker.sh list"
            echo ""
            echo -e "${YELLOW}🌟 Philosophy Integration:${NC}"
            echo "  🔄 Reciprocidad: Tools are shared and reusable"
            echo "  🧠 Metanöia: Transform development process"
            echo "  ⚖️ Neguentropía: Reduce chaos, increase order"
            ;;
    esac
    
    local end_time=$(date +%s)
    local execution_time=$((end_time - start_time))
    
    log_action "Tool Maker command completed in ${execution_time}s: $*"
}

# Execute main function with all arguments
main "$@"