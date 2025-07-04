#!/usr/bin/env node

/**
 * 🎯 Builder.io Rules Validator
 * Validates that components follow Builder.io best practices
 * Run before commits to prevent hook errors and import issues
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 🎯 Configuration
const CONFIG = {
  srcDir: './src',
  extensions: ['tsx', 'ts'],
  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.test.*',
    '**/*.spec.*'
  ]
};

// 🚨 Validation Rules
const RULES = {
  // Rule 1: No massive Material UI imports
  massiveImports: {
    name: 'No Massive Material UI Imports',
    pattern: /import\s*{[^}]*}\s*from\s*['"]@mui\/(material|icons-material)['"]/g,
    severity: 'error',
    message: '❌ Use specific imports instead of massive imports from Material UI'
  },

  // Rule 2: Proper useCallback order
  useCallbackOrder: {
    name: 'Proper useCallback Order',
    pattern: /const\s+(\w+)\s*=\s*useCallback\(/g,
    severity: 'warning',
    message: '⚠️ Verify useCallback order to prevent circular dependencies'
  },

  // Rule 3: Cleanup effects present
  cleanupEffects: {
    name: 'Cleanup Effects Required',
    pattern: /useEffect\(\(\)\s*=>\s*{[\s\S]*?return\s*\(\)\s*=>\s*{[\s\S]*?}\s*;\s*}\s*,\s*\[\]\s*\)/g,
    severity: 'warning',
    message: '⚠️ Consider adding cleanup effects for timers and event listeners'
  },

  // Rule 4: Error handling present
  errorHandling: {
    name: 'Error Handling Required',
    pattern: /window\.addEventListener\(['"]error['"]|try\s*{|catch\s*\(/g,
    severity: 'info',
    message: 'ℹ️ Consider adding error handling for Builder.io compatibility'
  }
};

// 🔍 File Scanner
class BuilderRulesValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  /**
   * Validate all files in the project
   */
  async validateProject() {
    console.log('🎯 Validating Builder.io Rules...\n');

    const files = this.getSourceFiles();
    
    for (const file of files) {
      await this.validateFile(file);
    }

    this.printResults();
    return this.errors.length === 0;
  }

  /**
   * Get all source files to validate
   */
  getSourceFiles() {
    const pattern = `${CONFIG.srcDir}/**/*.{${CONFIG.extensions.join(',')}}`;
    const files = glob.sync(pattern, {
      ignore: CONFIG.excludePatterns
    });

    console.log(`📁 Found ${files.length} files to validate\n`);
    return files;
  }

  /**
   * Validate a single file
   */
  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);

      // Skip if not a React component
      if (!this.isReactComponent(content)) {
        return;
      }

      console.log(`🔍 Validating: ${relativePath}`);

      // Apply all rules
      for (const [ruleKey, rule] of Object.entries(RULES)) {
        this.applyRule(relativePath, content, rule, ruleKey);
      }

      // Special validations for specific component types
      if (this.isVideoComponent(filePath)) {
        this.validateVideoComponent(relativePath, content);
      }

    } catch (error) {
      this.addError(filePath, `Failed to read file: ${error.message}`);
    }
  }

  /**
   * Check if file is a React component
   */
  isReactComponent(content) {
    return content.includes('import React') || 
           content.includes('from \'react\'') ||
           content.includes('from "react"') ||
           content.includes('React.FC') ||
           content.includes('function') && content.includes('return');
  }

  /**
   * Check if component is a video/media component
   */
  isVideoComponent(filePath) {
    const fileName = path.basename(filePath).toLowerCase();
    return fileName.includes('player') || 
           fileName.includes('video') || 
           fileName.includes('media');
  }

  /**
   * Apply a validation rule
   */
  applyRule(filePath, content, rule, ruleKey) {
    const matches = content.match(rule.pattern);
    
    if (ruleKey === 'massiveImports' && matches) {
      // Check if it's actually a massive import (more than 3 items)
      const isMassive = matches.some(match => {
        const itemCount = (match.match(/,/g) || []).length + 1;
        return itemCount > 3;
      });
      
      if (isMassive) {
        this.addIssue(rule.severity, filePath, rule.message, rule.name);
      }
    } else if (ruleKey === 'cleanupEffects') {
      // Check if component has timers but no cleanup
      const hasTimers = content.includes('setInterval') || content.includes('setTimeout');
      const hasCleanup = matches && matches.length > 0;
      
      if (hasTimers && !hasCleanup) {
        this.addIssue(rule.severity, filePath, 
          '⚠️ Component uses timers but missing cleanup effects', rule.name);
      }
    } else if (ruleKey === 'useCallbackOrder') {
      // Extract useCallback function names and check for potential circular deps
      if (matches) {
        this.validateCallbackOrder(filePath, content, matches);
      }
    }
  }

  /**
   * Validate useCallback order for circular dependencies
   */
  validateCallbackOrder(filePath, content, matches) {
    const callbacks = [];
    const lines = content.split('\n');
    
    // Extract callback names and their dependencies
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const callbackMatch = line.match(/const\s+(\w+)\s*=\s*useCallback\(/);
      
      if (callbackMatch) {
        const name = callbackMatch[1];
        
        // Find the dependency array
        let j = i;
        let depArray = '';
        while (j < lines.length && !lines[j].includes('], [')) {
          depArray += lines[j];
          j++;
        }
        if (j < lines.length) {
          depArray += lines[j];
        }
        
        callbacks.push({ name, dependencies: depArray, line: i + 1 });
      }
    }
    
    // Check for potential circular dependencies
    for (let i = 0; i < callbacks.length; i++) {
      const callback = callbacks[i];
      for (let j = i + 1; j < callbacks.length; j++) {
        const laterCallback = callbacks[j];
        
        if (callback.dependencies.includes(laterCallback.name)) {
          this.addIssue('warning', filePath, 
            `⚠️ Potential circular dependency: ${callback.name} depends on ${laterCallback.name} which is defined later`,
            'useCallback Order');
        }
      }
    }
  }

  /**
   * Special validation for video components
   */
  validateVideoComponent(filePath, content) {
    const checks = [
      {
        condition: !content.includes('useRef<HTML'),
        message: '⚠️ Video component should use properly typed refs'
      },
      {
        condition: !content.includes('clearInterval') && content.includes('setInterval'),
        message: '❌ Video component uses setInterval but missing clearInterval'
      },
      {
        condition: !content.includes('ErrorBoundary') && content.length > 5000,
        message: '⚠️ Complex video component should be wrapped in ErrorBoundary'
      }
    ];

    checks.forEach(check => {
      if (check.condition) {
        this.addIssue('warning', filePath, check.message, 'Video Component Rules');
      }
    });
  }

  /**
   * Add an issue to the appropriate list
   */
  addIssue(severity, filePath, message, ruleName) {
    const issue = { filePath, message, ruleName };
    
    switch (severity) {
      case 'error':
        this.errors.push(issue);
        break;
      case 'warning':
        this.warnings.push(issue);
        break;
      case 'info':
        this.info.push(issue);
        break;
    }
  }

  /**
   * Add error (convenience method)
   */
  addError(filePath, message) {
    this.addIssue('error', filePath, message, 'General');
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 Builder.io Rules Validation Results');
    console.log('='.repeat(60));

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS (Must Fix):');
      this.errors.forEach(error => {
        console.log(`  📁 ${error.filePath}`);
        console.log(`  🚨 ${error.message}`);
        console.log(`  📋 Rule: ${error.ruleName}\n`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS (Should Fix):');
      this.warnings.forEach(warning => {
        console.log(`  📁 ${warning.filePath}`);
        console.log(`  ⚠️ ${warning.message}`);
        console.log(`  📋 Rule: ${warning.ruleName}\n`);
      });
    }

    if (this.info.length > 0) {
      console.log('\nℹ️ INFO (Consider):');
      this.info.forEach(info => {
        console.log(`  📁 ${info.filePath}`);
        console.log(`  ℹ️ ${info.message}`);
        console.log(`  📋 Rule: ${info.ruleName}\n`);
      });
    }

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`  ❌ Errors: ${this.errors.length}`);
    console.log(`  ⚠️ Warnings: ${this.warnings.length}`);
    console.log(`  ℹ️ Info: ${this.info.length}`);

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ All Builder.io rules passed! 🎉');
    } else if (this.errors.length === 0) {
      console.log('\n✅ No critical errors found. Consider fixing warnings.');
    } else {
      console.log('\n❌ Critical errors found. Please fix before committing.');
    }

    console.log('\n📖 For more info, see: .builderrules');
    console.log('='.repeat(60));
  }
}

// 🚀 Main execution
async function main() {
  const validator = new BuilderRulesValidator();
  const success = await validator.validateProject();
  
  // Exit with error code if validation failed
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('🚨 Validation failed:', error);
    process.exit(1);
  });
}

module.exports = BuilderRulesValidator; 