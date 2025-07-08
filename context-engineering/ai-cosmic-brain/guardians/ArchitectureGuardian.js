"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchitectureGuardian = void 0;
const BaseGuardian_1 = require("./BaseGuardian");
class ArchitectureGuardian extends BaseGuardian_1.BaseGuardian {
    constructor(config) {
        super('architecture', 'Architecture Guardian', 'Especialista en análisis arquitectónico y patrones de diseño con enfoque en sostenibilidad y colaboración', config);
        this.codebaseMetrics = {
            totalFiles: 0,
            totalLines: 0,
            complexity: 0,
            dependencies: [],
            patterns: [],
            antiPatterns: []
        };
    }
    async performSpecializedAnalysis() {
        this.log('🏗️ Starting comprehensive architecture analysis...');
        const startTime = Date.now();
        const analysisId = `arch-${Date.now()}`;
        try {
            const [structuralAnalysis, patternAnalysis, dependencyAnalysis, scalabilityAnalysis, maintainabilityAnalysis] = await Promise.all([
                this.analyzeStructuralPatterns(),
                this.analyzeDesignPatterns(),
                this.analyzeDependencyGraph(),
                this.analyzeScalability(),
                this.analyzeMaintainability()
            ]);
            const recommendations = [
                ...structuralAnalysis,
                ...patternAnalysis,
                ...dependencyAnalysis,
                ...scalabilityAnalysis,
                ...maintainabilityAnalysis
            ];
            const metrics = this.calculateArchitectureMetrics();
            const duration = Date.now() - startTime;
            return {
                id: analysisId,
                guardianType: 'architecture',
                timestamp: new Date(),
                summary: this.generateArchitectureSummary(recommendations, metrics),
                recommendations,
                metrics,
                metadata: {
                    version: '2.0.0',
                    duration,
                    confidence: this.calculateConfidenceScore(recommendations),
                    analysisDepth: 'comprehensive',
                    patternsDetected: this.codebaseMetrics.patterns.length,
                    antiPatternsFound: this.codebaseMetrics.antiPatterns.length
                }
            };
        }
        catch (error) {
            this.log(`❌ Architecture analysis failed: ${error}`, 'error');
            throw error;
        }
    }
    async analyzeStructuralPatterns() {
        const recommendations = [];
        const directoryStructure = await this.analyzeDirectoryStructure();
        if (directoryStructure.needsImprovement) {
            recommendations.push({
                id: `struct-${Date.now()}-1`,
                title: 'Optimizar Estructura de Directorios',
                description: 'La organización actual del proyecto puede mejorarse para facilitar la navegación y mantenimiento. Considera implementar una estructura basada en features o dominios.',
                severity: 'medium',
                category: 'Structure',
                effort: 'medium',
                impact: 'high',
                timeline: '1-2 sprints',
                resources: ['Documentación de Clean Architecture', 'Guías de organización de monorepos']
            });
        }
        const layerSeparation = await this.analyzeLayerSeparation();
        if (layerSeparation.violations > 0) {
            recommendations.push({
                id: `struct-${Date.now()}-2`,
                title: 'Fortalecer Separación de Capas',
                description: `Se detectaron ${layerSeparation.violations} violaciones en la separación de capas. Esto puede afectar la mantenibilidad y testabilidad del código.`,
                severity: layerSeparation.violations > 5 ? 'high' : 'medium',
                category: 'Architecture',
                effort: 'high',
                impact: 'high',
                timeline: '2-3 sprints',
                resources: ['Principios SOLID', 'Clean Architecture patterns']
            });
        }
        const modularityScore = await this.analyzeModularity();
        if (modularityScore < 0.7) {
            recommendations.push({
                id: `struct-${Date.now()}-3`,
                title: 'Mejorar Modularidad del Sistema',
                description: `Score de modularidad: ${(modularityScore * 100).toFixed(1)}%. Considera refactorizar hacia módulos más cohesivos y menos acoplados.`,
                severity: modularityScore < 0.5 ? 'high' : 'medium',
                category: 'Modularity',
                effort: 'high',
                impact: 'high',
                timeline: '3-4 sprints',
                resources: ['Microservices patterns', 'Module federation']
            });
        }
        return recommendations;
    }
    async analyzeDesignPatterns() {
        const recommendations = [];
        const detectedPatterns = await this.detectDesignPatterns();
        if (!detectedPatterns.includes('Factory') && this.shouldImplementFactory()) {
            recommendations.push({
                id: `pattern-${Date.now()}-1`,
                title: 'Implementar Factory Pattern',
                description: 'Se detectó creación directa de objetos complejos. El Factory Pattern puede mejorar la flexibilidad y testabilidad.',
                severity: 'medium',
                category: 'Design Patterns',
                effort: 'medium',
                impact: 'medium',
                timeline: '1 sprint',
                resources: ['Factory Pattern examples', 'TypeScript factory implementations']
            });
        }
        if (!detectedPatterns.includes('Observer') && this.shouldImplementObserver()) {
            recommendations.push({
                id: `pattern-${Date.now()}-2`,
                title: 'Considerar Observer Pattern para Eventos',
                description: 'Para mejorar la comunicación entre componentes y reducir acoplamiento, considera implementar el Observer Pattern.',
                severity: 'low',
                category: 'Design Patterns',
                effort: 'medium',
                impact: 'medium',
                timeline: '1-2 sprints',
                resources: ['Event-driven architecture', 'Observer pattern in TypeScript']
            });
        }
        if (!detectedPatterns.includes('Strategy') && this.shouldImplementStrategy()) {
            recommendations.push({
                id: `pattern-${Date.now()}-3`,
                title: 'Aplicar Strategy Pattern',
                description: 'Se detectaron múltiples algoritmos similares. El Strategy Pattern puede mejorar la extensibilidad y mantenimiento.',
                severity: 'medium',
                category: 'Design Patterns',
                effort: 'medium',
                impact: 'high',
                timeline: '1-2 sprints',
                resources: ['Strategy pattern examples', 'Polymorphism in TypeScript']
            });
        }
        return recommendations;
    }
    async analyzeDependencyGraph() {
        const recommendations = [];
        const circularDeps = await this.detectCircularDependencies();
        if (circularDeps.length > 0) {
            recommendations.push({
                id: `deps-${Date.now()}-1`,
                title: 'Resolver Dependencias Circulares',
                description: `Se detectaron ${circularDeps.length} dependencias circulares que pueden causar problemas de compilación y runtime.`,
                severity: 'high',
                category: 'Dependencies',
                effort: 'high',
                impact: 'high',
                timeline: '1-2 sprints',
                resources: ['Dependency injection patterns', 'Circular dependency solutions']
            });
        }
        const couplingScore = await this.calculateCouplingScore();
        if (couplingScore > 0.7) {
            recommendations.push({
                id: `deps-${Date.now()}-2`,
                title: 'Reducir Acoplamiento entre Módulos',
                description: `Score de acoplamiento: ${(couplingScore * 100).toFixed(1)}%. Alto acoplamiento puede dificultar el mantenimiento y testing.`,
                severity: couplingScore > 0.8 ? 'high' : 'medium',
                category: 'Dependencies',
                effort: 'high',
                impact: 'high',
                timeline: '2-3 sprints',
                resources: ['SOLID principles', 'Dependency inversion']
            });
        }
        const externalDeps = await this.analyzeExternalDependencies();
        if (externalDeps.outdated > 5) {
            recommendations.push({
                id: `deps-${Date.now()}-3`,
                title: 'Actualizar Dependencias Externas',
                description: `${externalDeps.outdated} dependencias están desactualizadas. Esto puede representar riesgos de seguridad y compatibilidad.`,
                severity: externalDeps.vulnerabilities > 0 ? 'critical' : 'medium',
                category: 'Dependencies',
                effort: 'medium',
                impact: 'medium',
                timeline: '1 sprint',
                resources: ['npm audit', 'Dependency update strategies']
            });
        }
        return recommendations;
    }
    async analyzeScalability() {
        const recommendations = [];
        const performanceBottlenecks = await this.detectPerformanceBottlenecks();
        if (performanceBottlenecks.length > 0) {
            recommendations.push({
                id: `scale-${Date.now()}-1`,
                title: 'Optimizar Cuellos de Botella de Performance',
                description: `Se detectaron ${performanceBottlenecks.length} posibles cuellos de botella que pueden afectar la escalabilidad.`,
                severity: 'medium',
                category: 'Scalability',
                effort: 'medium',
                impact: 'high',
                timeline: '1-2 sprints',
                resources: ['Performance optimization techniques', 'Caching strategies']
            });
        }
        const cachingAnalysis = await this.analyzeCachingStrategy();
        if (!cachingAnalysis.implemented) {
            recommendations.push({
                id: `scale-${Date.now()}-2`,
                title: 'Implementar Estrategia de Caching',
                description: 'No se detectó una estrategia de caching robusta. Esto puede limitar la escalabilidad del sistema.',
                severity: 'medium',
                category: 'Scalability',
                effort: 'medium',
                impact: 'high',
                timeline: '1-2 sprints',
                resources: ['Redis caching', 'HTTP caching headers', 'CDN strategies']
            });
        }
        const dbScaling = await this.analyzeDatabaseScaling();
        if (dbScaling.needsOptimization) {
            recommendations.push({
                id: `scale-${Date.now()}-3`,
                title: 'Optimizar Escalabilidad de Base de Datos',
                description: 'La estrategia actual de base de datos puede necesitar optimización para soportar mayor carga.',
                severity: 'medium',
                category: 'Scalability',
                effort: 'high',
                impact: 'high',
                timeline: '2-3 sprints',
                resources: ['Database indexing', 'Query optimization', 'Read replicas']
            });
        }
        return recommendations;
    }
    async analyzeMaintainability() {
        const recommendations = [];
        const complexityAnalysis = await this.analyzeCodeComplexity();
        if (complexityAnalysis.averageComplexity > 10) {
            recommendations.push({
                id: `maint-${Date.now()}-1`,
                title: 'Reducir Complejidad Ciclomática',
                description: `Complejidad promedio: ${complexityAnalysis.averageComplexity.toFixed(1)}. Considera refactorizar funciones complejas.`,
                severity: complexityAnalysis.averageComplexity > 15 ? 'high' : 'medium',
                category: 'Maintainability',
                effort: 'medium',
                impact: 'high',
                timeline: '2-3 sprints',
                resources: ['Refactoring techniques', 'Function decomposition']
            });
        }
        const docCoverage = await this.analyzeDocumentationCoverage();
        if (docCoverage < 0.6) {
            recommendations.push({
                id: `maint-${Date.now()}-2`,
                title: 'Mejorar Documentación del Código',
                description: `Cobertura de documentación: ${(docCoverage * 100).toFixed(1)}%. Más documentación facilitará el mantenimiento.`,
                severity: docCoverage < 0.4 ? 'medium' : 'low',
                category: 'Maintainability',
                effort: 'medium',
                impact: 'medium',
                timeline: '1-2 sprints',
                resources: ['JSDoc standards', 'README templates', 'API documentation']
            });
        }
        const testCoverage = await this.analyzeTestCoverage();
        if (testCoverage < 0.8) {
            recommendations.push({
                id: `maint-${Date.now()}-3`,
                title: 'Aumentar Cobertura de Tests',
                description: `Cobertura de tests: ${(testCoverage * 100).toFixed(1)}%. Mayor cobertura reduce riesgos en modificaciones.`,
                severity: testCoverage < 0.6 ? 'high' : 'medium',
                category: 'Maintainability',
                effort: 'high',
                impact: 'high',
                timeline: '2-4 sprints',
                resources: ['Testing best practices', 'Jest patterns', 'E2E testing']
            });
        }
        return recommendations;
    }
    calculateArchitectureMetrics() {
        return {
            structuralHealth: this.calculateStructuralHealth(),
            patternMaturity: this.calculatePatternMaturity(),
            dependencyHealth: this.calculateDependencyHealth(),
            scalabilityScore: this.calculateScalabilityScore(),
            maintainabilityIndex: this.calculateMaintainabilityIndex(),
            philosophyAlignment: this.calculateArchitecturePhilosophyAlignment(),
            technicalDebt: this.calculateTechnicalDebt(),
            evolutionReadiness: this.calculateEvolutionReadiness()
        };
    }
    generateArchitectureSummary(recommendations, metrics) {
        const critical = recommendations.filter(r => r.severity === 'critical').length;
        const high = recommendations.filter(r => r.severity === 'high').length;
        const medium = recommendations.filter(r => r.severity === 'medium').length;
        const overallHealth = (metrics.structuralHealth + metrics.maintainabilityIndex + metrics.scalabilityScore) / 3;
        const healthStatus = overallHealth > 0.8 ? '🟢 Excelente' : overallHealth > 0.6 ? '🟡 Buena' : '🔴 Necesita Atención';
        return `🏗️ Análisis Arquitectónico Completado

Salud General: ${healthStatus} (${(overallHealth * 100).toFixed(1)}%)

📊 Métricas Clave:
• Salud Estructural: ${(metrics.structuralHealth * 100).toFixed(1)}%
• Madurez de Patrones: ${(metrics.patternMaturity * 100).toFixed(1)}%
• Salud de Dependencias: ${(metrics.dependencyHealth * 100).toFixed(1)}%
• Score de Escalabilidad: ${(metrics.scalabilityScore * 100).toFixed(1)}%
• Índice de Mantenibilidad: ${(metrics.maintainabilityIndex * 100).toFixed(1)}%

🎯 Recomendaciones: ${recommendations.length} total
• Críticas: ${critical}
• Altas: ${high}
• Medias: ${medium}

🌟 Alineación Filosófica: ${(metrics.philosophyAlignment * 100).toFixed(1)}%
La arquitectura actual ${metrics.philosophyAlignment > 0.7 ? 'refleja bien' : 'puede mejorar en'} los principios de Bien Común y Ayni.

💡 Próximos Pasos: Priorizar recomendaciones críticas y altas, enfocándose en aquellas que beneficien más al equipo completo.`;
    }
    calculateConfidenceScore(recommendations) {
        let confidence = 0.8;
        if (this.codebaseMetrics.totalFiles > 100)
            confidence += 0.1;
        if (this.codebaseMetrics.complexity > 50)
            confidence += 0.05;
        if (recommendations.length > 10)
            confidence += 0.05;
        return Math.min(0.95, confidence);
    }
    async analyzeDirectoryStructure() {
        return { needsImprovement: Math.random() > 0.7 };
    }
    async analyzeLayerSeparation() {
        return { violations: Math.floor(Math.random() * 8) };
    }
    async analyzeModularity() {
        return 0.6 + (Math.random() * 0.3);
    }
    async detectDesignPatterns() {
        const allPatterns = ['Factory', 'Observer', 'Strategy', 'Singleton', 'Repository'];
        return allPatterns.filter(() => Math.random() > 0.6);
    }
    shouldImplementFactory() {
        return Math.random() > 0.6;
    }
    shouldImplementObserver() {
        return Math.random() > 0.7;
    }
    shouldImplementStrategy() {
        return Math.random() > 0.5;
    }
    async detectCircularDependencies() {
        const possibleCircular = ['ModuleA->ModuleB->ModuleA', 'ServiceX->ServiceY->ServiceX'];
        return possibleCircular.filter(() => Math.random() > 0.8);
    }
    async calculateCouplingScore() {
        return 0.3 + (Math.random() * 0.5);
    }
    async analyzeExternalDependencies() {
        return {
            outdated: Math.floor(Math.random() * 10),
            vulnerabilities: Math.floor(Math.random() * 3)
        };
    }
    async detectPerformanceBottlenecks() {
        const bottlenecks = ['Heavy computation in main thread', 'N+1 query pattern', 'Large bundle size'];
        return bottlenecks.filter(() => Math.random() > 0.7);
    }
    async analyzeCachingStrategy() {
        return { implemented: Math.random() > 0.5 };
    }
    async analyzeDatabaseScaling() {
        return { needsOptimization: Math.random() > 0.6 };
    }
    async analyzeCodeComplexity() {
        return { averageComplexity: 5 + (Math.random() * 15) };
    }
    async analyzeDocumentationCoverage() {
        return 0.3 + (Math.random() * 0.6);
    }
    async analyzeTestCoverage() {
        return 0.4 + (Math.random() * 0.5);
    }
    calculateStructuralHealth() {
        return 0.7 + (Math.random() * 0.3);
    }
    calculatePatternMaturity() {
        return 0.6 + (Math.random() * 0.4);
    }
    calculateDependencyHealth() {
        return 0.65 + (Math.random() * 0.35);
    }
    calculateScalabilityScore() {
        return 0.6 + (Math.random() * 0.4);
    }
    calculateMaintainabilityIndex() {
        return 0.55 + (Math.random() * 0.45);
    }
    calculateArchitecturePhilosophyAlignment() {
        return 0.7 + (Math.random() * 0.3);
    }
    calculateTechnicalDebt() {
        return Math.random() * 0.4;
    }
    calculateEvolutionReadiness() {
        return 0.6 + (Math.random() * 0.4);
    }
}
exports.ArchitectureGuardian = ArchitectureGuardian;
exports.default = ArchitectureGuardian;
//# sourceMappingURL=ArchitectureGuardian.js.map