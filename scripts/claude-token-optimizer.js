#!/usr/bin/env node

/**
 * 🎯 OPTIMIZADOR DE TOKENS CLAUDE SONNET
 * 
 * Implementa técnicas avanzadas de optimización basadas en:
 * - OpenAI Community best practices (ahorro hasta 30%)
 * - Prompt engineering eficiente
 * - Cache inteligente y batch processing
 * - JSON minificado y respuestas estructuradas
 */

const fs = require('fs').promises;
const path = require('path');

// ============================================================================
// TÉCNICAS DE OPTIMIZACIÓN DE TOKENS
// ============================================================================

class ClaudeTokenOptimizer {
  constructor() {
    this.optimizationRules = {
      // Regla 1: Eliminar palabras innecesarias
      removeFillerWords: [
        'please', 'kindly', 'really', 'very', 'quite', 'rather',
        'actually', 'basically', 'essentially', 'obviously',
        'clearly', 'definitely', 'absolutely', 'certainly'
      ],
      
      // Regla 2: Abreviaciones técnicas
      technicalAbbreviations: {
        'frontend': 'FE',
        'backend': 'BE', 
        'database': 'DB',
        'application': 'app',
        'configuration': 'config',
        'implementation': 'impl',
        'optimization': 'opt',
        'integration': 'integ',
        'authentication': 'auth',
        'authorization': 'authz',
        'repository': 'repo',
        'environment': 'env',
        'development': 'dev',
        'production': 'prod'
      },
      
      // Regla 3: Patrones de compresión
      compressionPatterns: {
        'analyze the': 'analyze',
        'check if': 'check',
        'make sure': 'ensure',
        'in order to': 'to',
        'due to the fact that': 'because',
        'at this point in time': 'now',
        'for the purpose of': 'for'
      }
    };
  }

  // 🎯 OPTIMIZAR PROMPT PRINCIPAL
  optimizePrompt(originalPrompt) {
    let optimized = originalPrompt;
    
    // 1. Eliminar palabras innecesarias
    optimized = this.removeFillerWords(optimized);
    
    // 2. Aplicar abreviaciones técnicas
    optimized = this.applyTechnicalAbbreviations(optimized);
    
    // 3. Comprimir patrones comunes
    optimized = this.compressCommonPatterns(optimized);
    
    // 4. Minificar JSON si existe
    optimized = this.minifyJsonInPrompt(optimized);
    
    // 5. Remover espacios extra
    optimized = this.cleanWhitespace(optimized);
    
    const savings = this.calculateTokenSavings(originalPrompt, optimized);
    
    return {
      original: originalPrompt,
      optimized: optimized,
      savings: savings
    };
  }

  // 🧹 ELIMINAR PALABRAS INNECESARIAS
  removeFillerWords(text) {
    let result = text;
    
    this.optimizationRules.removeFillerWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, '');
    });
    
    return result;
  }

  // 🔤 APLICAR ABREVIACIONES TÉCNICAS
  applyTechnicalAbbreviations(text) {
    let result = text;
    
    Object.entries(this.optimizationRules.technicalAbbreviations).forEach(([full, abbrev]) => {
      const regex = new RegExp(`\\b${full}\\b`, 'gi');
      result = result.replace(regex, abbrev);
    });
    
    return result;
  }

  // 📦 COMPRIMIR PATRONES COMUNES
  compressCommonPatterns(text) {
    let result = text;
    
    Object.entries(this.optimizationRules.compressionPatterns).forEach(([pattern, replacement]) => {
      const regex = new RegExp(pattern, 'gi');
      result = result.replace(regex, replacement);
    });
    
    return result;
  }

  // 🗜️ MINIFICAR JSON EN PROMPT
  minifyJsonInPrompt(text) {
    // Buscar bloques JSON y minificarlos
    const jsonRegex = /\{[\s\S]*?\}/g;
    
    return text.replace(jsonRegex, (match) => {
      try {
        const parsed = JSON.parse(match);
        return JSON.stringify(parsed); // Sin espacios
      } catch (error) {
        return match; // Si no es JSON válido, mantener original
      }
    });
  }

  // 🧽 LIMPIAR ESPACIOS EN BLANCO
  cleanWhitespace(text) {
    return text
      .replace(/\s+/g, ' ') // Múltiples espacios → un espacio
      .replace(/\n\s*\n/g, '\n') // Múltiples saltos → un salto
      .trim();
  }

  // 📊 CALCULAR AHORRO DE TOKENS
  calculateTokenSavings(original, optimized) {
    const originalTokens = this.estimateTokens(original);
    const optimizedTokens = this.estimateTokens(optimized);
    const saved = originalTokens - optimizedTokens;
    const percentage = ((saved / originalTokens) * 100).toFixed(1);
    
    return {
      original_tokens: originalTokens,
      optimized_tokens: optimizedTokens,
      tokens_saved: saved,
      percentage_saved: percentage
    };
  }

  // 📏 ESTIMADOR DE TOKENS (Claude Sonnet)
  estimateTokens(text) {
    // Claude Sonnet: aproximadamente 3.5-4 caracteres por token
    return Math.ceil(text.length / 3.7);
  }

  // 🎯 GENERAR PROMPT OPTIMIZADO PARA ANÁLISIS GAMIFIER2.0
  generateOptimizedAnalysisPrompt(data) {
    const basePrompt = `Analyze gamifier2.0 FE-BE integ:

FILES: ${JSON.stringify(data.files)}
COMMITS: ${JSON.stringify(data.commits)}  
ENDPOINTS: ${JSON.stringify(data.endpoints)}
METRICS: ${JSON.stringify(data.metrics)}

Return compact JSON:
{"priority":"HIGH|MED|LOW","actions":["a1","a2"],"est":"Xd","status":"OK|WARN|ERR","gaps":N}

Focus: LETS, marketplace, social, analytics modules.
Context: Rama gamifier2.0, repo beforenostr.
BE ready: 85%, FE ready: 90%.`;

    return this.optimizePrompt(basePrompt);
  }

  // 📋 GENERAR PROMPTS BATCH OPTIMIZADOS
  generateBatchPrompts(dataArray) {
    // Combinar múltiples análisis en un solo prompt
    const batchData = {
      analyses: dataArray.slice(0, 3), // Máximo 3 análisis por batch
      timestamp: Date.now(),
      branch: 'gamifier2.0'
    };

    const batchPrompt = `Batch analyze ${batchData.analyses.length} gamifier2.0 changes:

DATA: ${JSON.stringify(batchData)}

Return array: [{"id":1,"priority":"HIGH","actions":["a1"],"est":"1d"},...]

Max ${batchData.analyses.length} results. Compact JSON only.`;

    return this.optimizePrompt(batchPrompt);
  }

  // 💾 SISTEMA DE CACHE INTELIGENTE
  generateCacheKey(data) {
    // Generar clave única basada en contenido relevante
    const relevantData = {
      files: data.files?.slice(0, 5) || [],
      branch: data.branch || 'unknown',
      day: new Date().toISOString().split('T')[0]
    };
    
    const hash = this.simpleHash(JSON.stringify(relevantData));
    return `claude_cache_${hash}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }

  // 📊 MÉTRICAS DE OPTIMIZACIÓN
  generateOptimizationReport(optimizations) {
    const totalOriginal = optimizations.reduce((sum, opt) => sum + opt.savings.original_tokens, 0);
    const totalOptimized = optimizations.reduce((sum, opt) => sum + opt.savings.optimized_tokens, 0);
    const totalSaved = totalOriginal - totalOptimized;
    const avgSavings = (totalSaved / totalOriginal * 100).toFixed(1);

    return {
      total_prompts: optimizations.length,
      total_tokens_saved: totalSaved,
      average_savings_percentage: avgSavings,
      estimated_cost_savings: (totalSaved * 0.000015).toFixed(4), // Claude Sonnet pricing
      recommendations: this.generateRecommendations(optimizations)
    };
  }

  generateRecommendations(optimizations) {
    const recommendations = [];
    
    const avgSavings = optimizations.reduce((sum, opt) => 
      sum + parseFloat(opt.savings.percentage_saved), 0) / optimizations.length;
    
    if (avgSavings < 15) {
      recommendations.push("Consider more aggressive prompt compression");
    }
    
    if (avgSavings > 30) {
      recommendations.push("Excellent optimization - maintain current patterns");
    }
    
    recommendations.push("Use batch processing for multiple similar analyses");
    recommendations.push("Implement caching for repeated queries");
    
    return recommendations;
  }
}

// ============================================================================
// FUNCIÓN DE DEMOSTRACIÓN
// ============================================================================

async function demonstrateOptimization() {
  console.log('🎯 Demostración Claude Token Optimizer');
  console.log('=====================================');
  
  const optimizer = new ClaudeTokenOptimizer();
  
  // Ejemplo de datos para análisis
  const sampleData = {
    files: ['useLetsIntegration.ts', 'analytics.service.ts', 'api-service.ts'],
    commits: ['feat: Design System', 'fix: UStats transform', 'opt: LETS endpoints'],
    endpoints: { lets: 200, marketplace: 200, social: 200, analytics: 404 },
    metrics: { modified_files: 41, branch: 'gamifier2.0' }
  };
  
  // Generar prompt optimizado
  const optimizedPrompt = optimizer.generateOptimizedAnalysisPrompt(sampleData);
  
  console.log('\n📊 RESULTADO DE OPTIMIZACIÓN:');
  console.log(`Original tokens: ${optimizedPrompt.savings.original_tokens}`);
  console.log(`Optimized tokens: ${optimizedPrompt.savings.optimized_tokens}`);
  console.log(`Tokens saved: ${optimizedPrompt.savings.tokens_saved}`);
  console.log(`Percentage saved: ${optimizedPrompt.savings.percentage_saved}%`);
  
  console.log('\n🎯 PROMPT OPTIMIZADO:');
  console.log(optimizedPrompt.optimized);
  
  // Demostrar batch processing
  const batchPrompt = optimizer.generateBatchPrompts([sampleData, sampleData]);
  console.log('\n📦 BATCH PROMPT:');
  console.log(`Batch tokens: ${batchPrompt.savings.optimized_tokens}`);
  console.log(`Savings: ${batchPrompt.savings.percentage_saved}%`);
  
  // Generar clave de cache
  const cacheKey = optimizer.generateCacheKey(sampleData);
  console.log('\n💾 CACHE KEY:', cacheKey);
  
  console.log('\n✅ Demostración completada');
}

// ============================================================================
// EXPORTACIONES Y EJECUCIÓN
// ============================================================================

if (require.main === module) {
  demonstrateOptimization();
}

module.exports = { ClaudeTokenOptimizer }; 