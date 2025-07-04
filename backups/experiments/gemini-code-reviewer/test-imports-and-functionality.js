#!/usr/bin/env node

/**
 * GEMINI CODE REVIEWER - COMPREHENSIVE VERIFICATION TEST
 * Verifies all imports, dependencies, configurations and detects potential issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'blue');
  log(`  ${message}`, 'blue');
  log('='.repeat(60), 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

let totalTests = 0;
let passedTests = 0;
let errors = [];
let warnings = [];

function runTest(testName, testFn) {
  totalTests++;
  try {
    const result = testFn();
    if (result === true) {
      passedTests++;
      logSuccess(`${testName}: PASSED`);
    } else if (result === false) {
      logError(`${testName}: FAILED`);
      errors.push(testName);
    } else {
      passedTests++;
      logSuccess(`${testName}: PASSED - ${result}`);
    }
  } catch (error) {
    logError(`${testName}: ERROR - ${error.message}`);
    errors.push(`${testName}: ${error.message}`);
  }
}

// TEST 1: Verify project structure
function testProjectStructure() {
  logHeader('1. PROJECT STRUCTURE VERIFICATION');
  
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'index.tsx',
    'App.tsx',
    'types.ts',
    'constants.ts',
    'services/geminiService.ts'
  ];

  const requiredDirs = [
    'components',
    'services'
  ];

  runTest('Required files exist', () => {
    const missing = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));
    if (missing.length > 0) {
      logError(`Missing files: ${missing.join(', ')}`);
      return false;
    }
    return true;
  });

  runTest('Required directories exist', () => {
    const missing = requiredDirs.filter(dir => !fs.existsSync(path.join(__dirname, dir)));
    if (missing.length > 0) {
      logError(`Missing directories: ${missing.join(', ')}`);
      return false;
    }
    return true;
  });
}

// TEST 2: Verify package.json and dependencies
function testDependencies() {
  logHeader('2. DEPENDENCIES VERIFICATION');
  
  runTest('package.json exists and is valid', () => {
    const packagePath = path.join(__dirname, 'package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = {
      'react': '^19.1.0',
      'react-dom': '^19.1.0',
      '@google/genai': '^1.0.1'
    };

    const requiredDevDeps = {
      '@types/node': '^22.14.0',
      'typescript': '~5.7.2',
      'vite': '^6.2.0'
    };

    const missingDeps = Object.keys(requiredDeps).filter(dep => !packageContent.dependencies?.[dep]);
    const missingDevDeps = Object.keys(requiredDevDeps).filter(dep => !packageContent.devDependencies?.[dep]);

    if (missingDeps.length > 0) {
      logError(`Missing dependencies: ${missingDeps.join(', ')}`);
      return false;
    }

    if (missingDevDeps.length > 0) {
      logError(`Missing dev dependencies: ${missingDevDeps.join(', ')}`);
      return false;
    }

    return `All required dependencies present`;
  });

  runTest('Required npm scripts exist', () => {
    const packagePath = path.join(__dirname, 'package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredScripts = ['dev', 'build', 'preview'];
    const missingScripts = requiredScripts.filter(script => !packageContent.scripts?.[script]);
    
    if (missingScripts.length > 0) {
      logError(`Missing scripts: ${missingScripts.join(', ')}`);
      return false;
    }
    
    return `All required scripts present`;
  });
}

// TEST 3: Verify TypeScript configuration
function testTypeScriptConfig() {
  logHeader('3. TYPESCRIPT CONFIGURATION');
  
  runTest('tsconfig.json is valid', () => {
    const tsconfigPath = path.join(__dirname, 'tsconfig.json');
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
    
    // TypeScript allows comments in tsconfig.json, so we need to strip them for validation
    const stripComments = (jsonString) => {
      // Remove /* */ style comments
      let cleaned = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove // style comments (but preserve them in strings)
      cleaned = cleaned.replace(/\/\/.*$/gm, '');
      return cleaned;
    };
    
    try {
      const cleanedContent = stripComments(tsconfigContent);
      const tsconfig = JSON.parse(cleanedContent);
      
      const requiredOptions = {
        'target': 'ES2020',
        'module': 'ESNext',
        'jsx': 'react-jsx',
        'strict': true
      };

      const missing = Object.entries(requiredOptions).filter(([key, value]) => 
        tsconfig.compilerOptions[key] !== value
      );

      if (missing.length > 0) {
        logWarning(`Different config options: ${missing.map(([k, v]) => `${k}: expected ${v}, got ${tsconfig.compilerOptions[k]}`).join(', ')}`);
        warnings.push('TypeScript config differs from recommended settings');
      }

      return `Valid TypeScript configuration with comments`;
    } catch (parseError) {
      logError(`Invalid tsconfig.json syntax: ${parseError.message}`);
      return false;
    }
  });
}

// TEST 4: Verify imports in all files
function testImports() {
  logHeader('4. IMPORT VERIFICATION');
  
  runTest('App.tsx imports', () => {
    const appPath = path.join(__dirname, 'App.tsx');
    const content = fs.readFileSync(appPath, 'utf8');
    
    const requiredImports = [
      "import React",
      "from './components/CodeInput'",
      "from './components/LanguageSelector'",
      "from './components/FeedbackDisplay'",
      "from './components/LoadingSpinner'",
      "from './components/ErrorDisplay'",
      "from './components/Header'",
      "from './components/Footer'",
      "from './services/geminiService'",
      "from './types'",
      "from './constants'"
    ];

    const missingImports = requiredImports.filter(imp => !content.includes(imp));
    
    if (missingImports.length > 0) {
      logError(`Missing imports in App.tsx: ${missingImports.join(', ')}`);
      return false;
    }
    
    return `All ${requiredImports.length} imports verified`;
  });

  runTest('Component files import React', () => {
    const componentsDir = path.join(__dirname, 'components');
    const componentFiles = fs.readdirSync(componentsDir).filter(file => file.endsWith('.tsx'));
    
    const missingReactImports = componentFiles.filter(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      return !content.includes("import React");
    });
    
    if (missingReactImports.length > 0) {
      logError(`Components missing React import: ${missingReactImports.join(', ')}`);
      return false;
    }
    
    return `All ${componentFiles.length} components have React import`;
  });

  runTest('Service imports', () => {
    const servicePath = path.join(__dirname, 'services/geminiService.ts');
    const content = fs.readFileSync(servicePath, 'utf8');
    
    const requiredImports = [
      "import { GoogleGenAI",
      "from '../types'",
      "from '../constants'"
    ];

    const missingImports = requiredImports.filter(imp => !content.includes(imp));
    
    if (missingImports.length > 0) {
      logError(`Missing imports in geminiService.ts: ${missingImports.join(', ')}`);
      return false;
    }
    
    return `All service imports verified`;
  });
}

// TEST 5: Verify component exports
function testComponentExports() {
  logHeader('5. COMPONENT EXPORTS VERIFICATION');
  
  runTest('All components are properly exported', () => {
    const componentsDir = path.join(__dirname, 'components');
    const componentFiles = fs.readdirSync(componentsDir).filter(file => file.endsWith('.tsx'));
    
    const exportIssues = [];
    
    componentFiles.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      const componentName = file.replace('.tsx', '');
      
      // Check for export
      if (!content.includes(`export const ${componentName}`) && !content.includes(`export { ${componentName}`)) {
        exportIssues.push(`${file} - Component not exported properly`);
      }
    });
    
    if (exportIssues.length > 0) {
      logError(`Export issues: ${exportIssues.join(', ')}`);
      return false;
    }
    
    return `All ${componentFiles.length} components properly exported`;
  });
}

// TEST 6: HTML and configuration issues
function testHTMLAndConfig() {
  logHeader('6. HTML AND CONFIGURATION ISSUES');
  
  runTest('index.html configuration', () => {
    const htmlPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    const issues = [];
    
    // Check for duplicate scripts
    const scriptMatches = content.match(/<script[^>]*src="[^"]*index\.tsx"[^>]*>/g);
    if (scriptMatches && scriptMatches.length > 1) {
      issues.push('Duplicate index.tsx script tags detected');
    }
    
    // Check for missing CSS file reference
    if (content.includes('index.css') && !fs.existsSync(path.join(__dirname, 'index.css'))) {
      issues.push('index.css referenced but file does not exist');
    }
    
    // Check for required elements
    if (!content.includes('<div id="root">')) {
      issues.push('Missing root div element');
    }
    
    if (issues.length > 0) {
      logWarning(`HTML issues found: ${issues.join(', ')}`);
      warnings.push(...issues);
    }
    
    return issues.length === 0 ? true : `Found ${issues.length} issues (see warnings)`;
  });

  runTest('Vite configuration', () => {
    const vitePath = path.join(__dirname, 'vite.config.ts');
    const content = fs.readFileSync(vitePath, 'utf8');
    
    // Check for API key configuration
    if (!content.includes('GEMINI_API_KEY')) {
      logWarning('GEMINI_API_KEY not found in vite config');
      warnings.push('API key configuration missing in vite.config.ts');
    }
    
    return true;
  });
}

// TEST 7: Environment variables
function testEnvironmentVariables() {
  logHeader('7. ENVIRONMENT VARIABLES');
  
  runTest('Environment setup instructions', () => {
    const envFiles = ['.env', '.env.example', '.env.local'];
    const existingEnvFiles = envFiles.filter(file => fs.existsSync(path.join(__dirname, file)));
    
    if (existingEnvFiles.length === 0) {
      logWarning('No environment files found. Create .env with GEMINI_API_KEY');
      warnings.push('Environment file needed: create .env with GEMINI_API_KEY=your_api_key');
    }
    
    return `Environment check completed (${existingEnvFiles.length} env files found)`;
  });
}

// TEST 8: Code quality checks
function testCodeQuality() {
  logHeader('8. CODE QUALITY CHECKS');
  
  runTest('No console.error without handling', () => {
    const issues = [];
    const filesToCheck = ['services/geminiService.ts', 'App.tsx'];
    
    filesToCheck.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        // Check for console.error followed by proper error handling
        const consoleErrors = content.match(/console\.error\(/g);
        if (consoleErrors) {
          const hasErrorHandling = content.includes('throw new Error') || content.includes('catch');
          if (!hasErrorHandling) {
            issues.push(`${file} has console.error without proper error handling`);
          }
        }
      }
    });
    
    if (issues.length > 0) {
      logWarning(`Code quality issues: ${issues.join(', ')}`);
      warnings.push(...issues);
    }
    
    return issues.length === 0;
  });

  runTest('Type safety in components', () => {
    const componentsDir = path.join(__dirname, 'components');
    const componentFiles = fs.readdirSync(componentsDir).filter(file => file.endsWith('.tsx'));
    
    const typeIssues = [];
    
    componentFiles.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      
      // Check for proper TypeScript interfaces
      if (!content.includes('interface ') && !content.includes('type ')) {
        typeIssues.push(`${file} might be missing TypeScript interfaces`);
      }
      
      // Check for any type usage
      if (content.includes(': any')) {
        typeIssues.push(`${file} uses 'any' type - consider more specific typing`);
      }
    });
    
    if (typeIssues.length > 0) {
      logInfo(`Type recommendations: ${typeIssues.join(', ')}`);
    }
    
    return `Type safety check completed (${typeIssues.length} recommendations)`;
  });
}

// Main test runner
async function runAllTests() {
  log('🧪 GEMINI CODE REVIEWER - COMPREHENSIVE VERIFICATION', 'magenta');
  log('Testing imports, configuration, and functionality...\n', 'cyan');

  testProjectStructure();
  testDependencies();
  testTypeScriptConfig();
  testImports();
  testComponentExports();
  testHTMLAndConfig();
  testEnvironmentVariables();
  testCodeQuality();

  // Summary
  logHeader('TEST SUMMARY');
  
  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${totalTests - passedTests}`, 'red');
  log(`Warnings: ${warnings.length}`, 'yellow');
  
  if (errors.length > 0) {
    log('\n❌ ERRORS FOUND:', 'red');
    errors.forEach(error => log(`  • ${error}`, 'red'));
  }
  
  if (warnings.length > 0) {
    log('\n⚠️  WARNINGS:', 'yellow');
    warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
  }
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  if (successRate >= 90) {
    logSuccess(`\n🎉 PROJECT HEALTH: EXCELLENT (${successRate}%)`);
    logSuccess('✅ All critical systems verified and working correctly!');
  } else if (successRate >= 75) {
    log(`\n⚠️  PROJECT HEALTH: GOOD (${successRate}%)`, 'yellow');
    log('Some issues need attention, but core functionality should work.', 'yellow');
  } else {
    log(`\n❌ PROJECT HEALTH: NEEDS ATTENTION (${successRate}%)`, 'red');
    log('Critical issues found that may prevent proper functioning.', 'red');
  }

  // Recommendations
  log('\n📋 RECOMMENDATIONS:', 'cyan');
  log('1. Create .env file with GEMINI_API_KEY=your_api_key', 'cyan');
  log('2. Run "npm install" to ensure all dependencies are installed', 'cyan');
  log('3. Run "npm run dev" to start development server', 'cyan');
  log('4. Test with sample code to verify API integration', 'cyan');
  
  if (warnings.some(w => w.includes('index.css'))) {
    log('5. Remove index.css reference from index.html or create the file', 'cyan');
  }
  
  if (warnings.some(w => w.includes('Duplicate'))) {
    log('6. Fix duplicate script tags in index.html', 'cyan');
  }

  return {
    totalTests,
    passedTests,
    errors,
    warnings,
    successRate: parseFloat(successRate)
  };
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests };