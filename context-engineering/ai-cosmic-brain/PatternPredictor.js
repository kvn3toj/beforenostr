"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternPredictor = void 0;
const types_1 = require("./types");
class PatternPredictor {
    constructor(config) {
        this.predictionHistory = [];
        this.validatedPredictions = [];
        this.config = config;
    }
    async predictEmergingPatterns(context) {
        this.log('🔮 Iniciando predicción de patrones emergentes...');
        const predictions = [];
        try {
            const architecturalPredictions = await this.predictArchitecturalPatterns(context);
            const collaborationPredictions = await this.predictCollaborationPatterns(context);
            const philosophyPredictions = await this.predictPhilosophyPatterns(context);
            const technicalPredictions = await this.predictTechnicalPatterns(context);
            const processPredictions = await this.predictProcessPatterns(context);
            const uiUxPredictions = await this.predictUIUXPatterns(context);
            predictions.push(...architecturalPredictions, ...collaborationPredictions, ...philosophyPredictions, ...technicalPredictions, ...processPredictions, ...uiUxPredictions);
            const qualityFilteredPredictions = this.applyQualityFilters(predictions);
            const sortedPredictions = this.sortByRelevance(qualityFilteredPredictions, context);
            const topPredictions = sortedPredictions.slice(0, 20);
            this.predictionHistory.push(...topPredictions);
            this.log(`✅ Generadas ${topPredictions.length} predicciones de patrones`);
            return topPredictions;
        }
        catch (error) {
            this.log(`❌ Error prediciendo patrones: ${error.message}`);
            throw error;
        }
    }
    async predictArchitecturalPatterns(context) {
        const predictions = [];
        const complexityTrend = this.findTrend(context.trends, 'complexity');
        if (complexityTrend && complexityTrend.trend === 'increasing' && complexityTrend.velocity > 0.1) {
            predictions.push({
                id: this.generateId('arch'),
                name: 'Necesidad de Refactoring Arquitectónico',
                description: 'La complejidad creciente sugiere la necesidad de simplificar la arquitectura',
                confidence: Math.min(complexityTrend.confidence * 100, 90),
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(complexityTrend.velocity, 30),
                category: types_1.PatternCategory.ARCHITECTURE,
                impact: this.calculateImpact(complexityTrend.velocity),
                philosophyAlignment: 85,
                evidence: [
                    `Complejidad incrementando a ${complexityTrend.velocity.toFixed(2)}/día`,
                    `${context.codebase.fileCount} archivos con complejidad promedio ${context.codebase.complexity}`
                ],
                suggestedActions: [
                    'Implementar patrones de diseño simplificadores',
                    'Refactorizar módulos de alta complejidad',
                    'Establecer límites de complejidad por archivo'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        if (context.codebase.dependencies.length > 50) {
            predictions.push({
                id: this.generateId('arch'),
                name: 'Evolución hacia Microservicios',
                description: 'Alto número de dependencias sugiere beneficios de arquitectura de microservicios',
                confidence: 75,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.1, 60),
                category: types_1.PatternCategory.ARCHITECTURE,
                impact: types_1.ImpactLevel.HIGH,
                philosophyAlignment: 80,
                evidence: [
                    `${context.codebase.dependencies.length} dependencias detectadas`,
                    'Acoplamiento alto entre módulos'
                ],
                suggestedActions: [
                    'Evaluar separación en servicios independientes',
                    'Implementar API Gateway',
                    'Definir boundaries de contexto'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        if (context.codebase.testCoverage < 70) {
            predictions.push({
                id: this.generateId('arch'),
                name: 'Emergencia de Testing Automatizado',
                description: 'Baja cobertura de tests sugiere necesidad de estrategia de testing robusta',
                confidence: 85,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.2, 14),
                category: types_1.PatternCategory.TECHNICAL,
                impact: types_1.ImpactLevel.MEDIUM,
                philosophyAlignment: 90,
                evidence: [
                    `Cobertura de tests actual: ${context.codebase.testCoverage}%`,
                    'Incremento en bugs reportados'
                ],
                suggestedActions: [
                    'Implementar TDD (Test-Driven Development)',
                    'Configurar CI/CD con gates de calidad',
                    'Capacitar equipo en testing strategies'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        return predictions;
    }
    async predictCollaborationPatterns(context) {
        const predictions = [];
        if (context.harmony.collaboration.ayniScore < 80) {
            predictions.push({
                id: this.generateId('collab'),
                name: 'Necesidad de Pair Programming Estructurado',
                description: 'Score de Ayni bajo sugiere beneficios de pair programming para mejorar reciprocidad',
                confidence: 80,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.3, 7),
                category: types_1.PatternCategory.COLLABORATION,
                impact: types_1.ImpactLevel.MEDIUM,
                philosophyAlignment: 95,
                evidence: [
                    `Score Ayni actual: ${context.harmony.collaboration.ayniScore}/100`,
                    'Desequilibrio en contribuciones individuales'
                ],
                suggestedActions: [
                    'Implementar sesiones de pair programming diarias',
                    'Rotar pares regularmente',
                    'Medir y celebrar contribuciones mutuas'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        if (context.harmony.collaboration.codeReviews < 75) {
            predictions.push({
                id: this.generateId('collab'),
                name: 'Evolución hacia Code Reviews Colaborativos',
                description: 'Necesidad de fortalecer cultura de code reviews como herramienta de aprendizaje',
                confidence: 75,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.2, 14),
                category: types_1.PatternCategory.COLLABORATION,
                impact: types_1.ImpactLevel.MEDIUM,
                philosophyAlignment: 88,
                evidence: [
                    `Calidad de code reviews: ${context.harmony.collaboration.codeReviews}/100`,
                    'Oportunidades de aprendizaje mutuo no aprovechadas'
                ],
                suggestedActions: [
                    'Establecer templates para code reviews constructivos',
                    'Capacitar en técnicas de feedback empático',
                    'Implementar métricas de calidad de reviews'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        if (context.teamSize > 8) {
            predictions.push({
                id: this.generateId('collab'),
                name: 'Necesidad de Estructuras de Comunicación Escalables',
                description: 'Equipo grande requiere patrones de comunicación más estructurados',
                confidence: 85,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.1, 21),
                category: types_1.PatternCategory.COLLABORATION,
                impact: types_1.ImpactLevel.HIGH,
                philosophyAlignment: 85,
                evidence: [
                    `Tamaño del equipo: ${context.teamSize} personas`,
                    'Complejidad de comunicación O(n²)'
                ],
                suggestedActions: [
                    'Implementar estructura de equipos pequeños (3-5 personas)',
                    'Establecer canales de comunicación especializados',
                    'Crear roles de facilitación y coordinación'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        return predictions;
    }
    async predictPhilosophyPatterns(context) {
        const predictions = [];
        if (context.harmony.philosophy.bienComunAlignment < 85) {
            predictions.push({
                id: this.generateId('philosophy'),
                name: 'Necesidad de Workshops de Filosofía CoomÜnity',
                description: 'Alineación con Bien Común puede fortalecerse con educación filosófica',
                confidence: 90,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.4, 7),
                category: types_1.PatternCategory.PHILOSOPHY,
                impact: types_1.ImpactLevel.HIGH,
                philosophyAlignment: 100,
                evidence: [
                    `Alineación Bien Común: ${context.harmony.philosophy.bienComunAlignment}/100`,
                    'Oportunidades de profundizar en principios CoomÜnity'
                ],
                suggestedActions: [
                    'Organizar workshops semanales de filosofía CoomÜnity',
                    'Integrar principios filosóficos en decisiones técnicas',
                    'Crear métricas de impacto en Bien Común'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        if (context.harmony.philosophy.cooperationOverCompetition < 90) {
            predictions.push({
                id: this.generateId('philosophy'),
                name: 'Evolución hacia Gamificación Cooperativa',
                description: 'Oportunidad de implementar sistemas que fomenten cooperación sobre competición',
                confidence: 85,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.3, 14),
                category: types_1.PatternCategory.PHILOSOPHY,
                impact: types_1.ImpactLevel.MEDIUM,
                philosophyAlignment: 95,
                evidence: [
                    `Score cooperación: ${context.harmony.philosophy.cooperationOverCompetition}/100`,
                    'Potencial para sistemas colaborativos'
                ],
                suggestedActions: [
                    'Implementar métricas de colaboración grupal',
                    'Crear challenges que requieran cooperación',
                    'Celebrar logros colectivos sobre individuales'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        return predictions;
    }
    async predictTechnicalPatterns(context) {
        const predictions = [];
        if (context.harmony.technical.codeQuality < 80) {
            predictions.push({
                id: this.generateId('technical'),
                name: 'Implementación de Linting y Formateo Automatizado',
                description: 'Calidad de código puede mejorarse con herramientas automatizadas',
                confidence: 90,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.5, 3),
                category: types_1.PatternCategory.TECHNICAL,
                impact: types_1.ImpactLevel.MEDIUM,
                philosophyAlignment: 85,
                evidence: [
                    `Calidad de código: ${context.harmony.technical.codeQuality}/100`,
                    'Inconsistencias en estilo y estructura'
                ],
                suggestedActions: [
                    'Configurar ESLint/Prettier',
                    'Implementar pre-commit hooks',
                    'Establecer estándares de código documentados'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        if (context.harmony.technical.performanceScore < 75) {
            predictions.push({
                id: this.generateId('technical'),
                name: 'Optimización de Performance Proactiva',
                description: 'Tendencias de performance sugieren necesidad de optimización sistemática',
                confidence: 80,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.2, 21),
                category: types_1.PatternCategory.TECHNICAL,
                impact: types_1.ImpactLevel.HIGH,
                philosophyAlignment: 80,
                evidence: [
                    `Score de performance: ${context.harmony.technical.performanceScore}/100`,
                    'Incremento en tiempo de respuesta'
                ],
                suggestedActions: [
                    'Implementar monitoring de performance',
                    'Optimizar queries de base de datos',
                    'Implementar caching estratégico'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        return predictions;
    }
    async predictProcessPatterns(context) {
        const predictions = [];
        if (context.projectPhase === 'development' && context.codebase.linesOfCode > 10000) {
            predictions.push({
                id: this.generateId('process'),
                name: 'Transición hacia Metodología Ágil Madura',
                description: 'Tamaño del proyecto sugiere beneficios de metodologías ágiles más estructuradas',
                confidence: 85,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.1, 30),
                category: types_1.PatternCategory.PROCESS,
                impact: types_1.ImpactLevel.MEDIUM,
                philosophyAlignment: 88,
                evidence: [
                    `${context.codebase.linesOfCode} líneas de código`,
                    'Complejidad de coordinación incrementando'
                ],
                suggestedActions: [
                    'Implementar sprints estructurados',
                    'Establecer ceremonias ágiles regulares',
                    'Crear backlog priorizado por valor'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        return predictions;
    }
    async predictUIUXPatterns(context) {
        const predictions = [];
        if (context.harmony.philosophy.inclusivityScore < 85) {
            predictions.push({
                id: this.generateId('uiux'),
                name: 'Implementación de Design System Inclusivo',
                description: 'Score de inclusividad sugiere necesidad de design system más accesible',
                confidence: 80,
                emergenceDate: new Date(),
                predictedDate: this.calculateEmergenceDate(0.2, 28),
                category: types_1.PatternCategory.UI_UX,
                impact: types_1.ImpactLevel.MEDIUM,
                philosophyAlignment: 95,
                evidence: [
                    `Score de inclusividad: ${context.harmony.philosophy.inclusivityScore}/100`,
                    'Oportunidades de mejora en accesibilidad'
                ],
                suggestedActions: [
                    'Crear design system con principios de accesibilidad',
                    'Implementar tests de usabilidad inclusiva',
                    'Capacitar equipo en diseño universal'
                ],
                status: types_1.PredictionStatus.PENDING
            });
        }
        return predictions;
    }
    async validatePredictions(currentContext) {
        this.log('✅ Validando predicciones anteriores...');
        const validatedPredictions = [];
        for (const prediction of this.predictionHistory) {
            if (prediction.status === types_1.PredictionStatus.PENDING) {
                const isRealized = await this.checkIfPredictionRealized(prediction, currentContext);
                if (isRealized) {
                    prediction.status = types_1.PredictionStatus.VALIDATED;
                    this.validatedPredictions.push(prediction);
                    this.log(`✅ Predicción validada: ${prediction.name}`);
                }
                else if (this.isPredictionExpired(prediction)) {
                    prediction.status = types_1.PredictionStatus.REJECTED;
                    this.log(`❌ Predicción expirada: ${prediction.name}`);
                }
                validatedPredictions.push(prediction);
            }
        }
        const accuracy = this.calculatePredictionAccuracy();
        this.log(`📊 Accuracy de predicciones: ${accuracy.toFixed(1)}%`);
        return validatedPredictions;
    }
    getPredictionAccuracy() {
        return this.calculatePredictionAccuracy();
    }
    getPredictionStats() {
        const total = this.predictionHistory.length;
        const validated = this.predictionHistory.filter(p => p.status === types_1.PredictionStatus.VALIDATED).length;
        const rejected = this.predictionHistory.filter(p => p.status === types_1.PredictionStatus.REJECTED).length;
        const pending = this.predictionHistory.filter(p => p.status === types_1.PredictionStatus.PENDING).length;
        return {
            total,
            validated,
            rejected,
            pending,
            accuracy: this.calculatePredictionAccuracy()
        };
    }
    applyQualityFilters(predictions) {
        return predictions.filter(prediction => {
            if (prediction.confidence < 60)
                return false;
            if (prediction.philosophyAlignment < 70)
                return false;
            const isDuplicate = predictions.some(other => other !== prediction &&
                other.name === prediction.name &&
                other.confidence > prediction.confidence);
            return !isDuplicate;
        });
    }
    sortByRelevance(predictions, context) {
        return predictions.sort((a, b) => {
            const scoreA = this.calculateRelevanceScore(a, context);
            const scoreB = this.calculateRelevanceScore(b, context);
            return scoreB - scoreA;
        });
    }
    calculateRelevanceScore(prediction, context) {
        let score = 0;
        score += prediction.confidence * 0.3;
        score += this.getImpactWeight(prediction.impact) * 25 * 0.3;
        score += prediction.philosophyAlignment * 0.3;
        const daysToEmergence = Math.max(1, (prediction.predictedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        score += (1 / daysToEmergence) * 100 * 0.1;
        return score;
    }
    getImpactWeight(impact) {
        switch (impact) {
            case types_1.ImpactLevel.LOW: return 1;
            case types_1.ImpactLevel.MEDIUM: return 2;
            case types_1.ImpactLevel.HIGH: return 3;
            case types_1.ImpactLevel.CRITICAL: return 4;
            default: return 1;
        }
    }
    findTrend(trends, metric) {
        return trends.find(trend => trend.metric === metric);
    }
    calculateEmergenceDate(velocity, baseDays) {
        const emergenceDate = new Date();
        const adjustedDays = Math.max(1, baseDays * (1 - velocity));
        emergenceDate.setDate(emergenceDate.getDate() + adjustedDays);
        return emergenceDate;
    }
    calculateImpact(velocity) {
        if (velocity > 0.5)
            return types_1.ImpactLevel.CRITICAL;
        if (velocity > 0.3)
            return types_1.ImpactLevel.HIGH;
        if (velocity > 0.1)
            return types_1.ImpactLevel.MEDIUM;
        return types_1.ImpactLevel.LOW;
    }
    async checkIfPredictionRealized(prediction, context) {
        switch (prediction.category) {
            case types_1.PatternCategory.TECHNICAL:
                return this.checkTechnicalPrediction(prediction, context);
            case types_1.PatternCategory.COLLABORATION:
                return this.checkCollaborationPrediction(prediction, context);
            case types_1.PatternCategory.PHILOSOPHY:
                return this.checkPhilosophyPrediction(prediction, context);
            default:
                return false;
        }
    }
    checkTechnicalPrediction(prediction, context) {
        if (prediction.name.includes('Linting')) {
            return context.codebase.architecturePatterns.includes('automated-linting');
        }
        return false;
    }
    checkCollaborationPrediction(prediction, context) {
        if (prediction.name.includes('Pair Programming')) {
            return context.harmony.collaboration.pairProgramming > 80;
        }
        return false;
    }
    checkPhilosophyPrediction(prediction, context) {
        if (prediction.name.includes('Filosofía CoomÜnity')) {
            return context.harmony.philosophy.bienComunAlignment > 85;
        }
        return false;
    }
    isPredictionExpired(prediction) {
        const now = new Date();
        const gracePeriod = 7 * 24 * 60 * 60 * 1000;
        return now.getTime() > (prediction.predictedDate.getTime() + gracePeriod);
    }
    calculatePredictionAccuracy() {
        const totalValidated = this.validatedPredictions.length;
        const totalCompleted = this.predictionHistory.filter(p => p.status === types_1.PredictionStatus.VALIDATED || p.status === types_1.PredictionStatus.REJECTED).length;
        if (totalCompleted === 0)
            return 100;
        return (totalValidated / totalCompleted) * 100;
    }
    generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    log(message) {
        if (this.config.debugMode) {
            console.log(`[PatternPredictor] ${message}`);
        }
    }
}
exports.PatternPredictor = PatternPredictor;
//# sourceMappingURL=PatternPredictor.js.map