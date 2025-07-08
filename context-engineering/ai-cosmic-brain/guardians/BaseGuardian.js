"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGuardian = void 0;
class BaseGuardian {
    constructor(guardianType, name, description, config) {
        this.lastAnalysis = null;
        this.analysisHistory = [];
        this.guardianType = guardianType;
        this.name = name;
        this.description = description;
        this.config = config;
        this.log(`🛡️ Guardian ${this.name} initialized with philosophy-driven analysis`);
    }
    async analyze() {
        this.log(`🔍 Starting ${this.guardianType} analysis...`);
        try {
            const report = await this.performSpecializedAnalysis();
            const enrichedReport = await this.enrichWithPhilosophy(report);
            const finalReport = this.applyBienComunFilter(enrichedReport);
            this.analysisHistory.push(finalReport);
            this.lastAnalysis = new Date();
            if (this.analysisHistory.length > 50) {
                this.analysisHistory = this.analysisHistory.slice(-50);
            }
            this.log(`✅ ${this.guardianType} analysis completed with ${finalReport.recommendations.length} recommendations`);
            return finalReport;
        }
        catch (error) {
            this.log(`❌ Error in ${this.guardianType} analysis: ${error}`, 'error');
            throw error;
        }
    }
    async enrichWithPhilosophy(report) {
        const philosophyAlignment = this.calculatePhilosophyAlignment(report);
        const enrichedRecommendations = report.recommendations.map(rec => {
            return {
                ...rec,
                philosophyContext: this.addPhilosophyContext(rec),
                ayniScore: this.calculateAyniScore(rec),
                bienComunImpact: this.calculateBienComunImpact(rec)
            };
        });
        return {
            ...report,
            philosophyAlignment,
            recommendations: enrichedRecommendations,
            metadata: {
                ...report.metadata,
                philosophyEnriched: true,
                enrichmentTimestamp: new Date().toISOString(),
                guardianWisdom: this.getGuardianWisdom()
            }
        };
    }
    applyBienComunFilter(report) {
        const filteredRecommendations = report.recommendations
            .sort((a, b) => {
            const aBienComun = a.bienComunImpact || 0;
            const bBienComun = b.bienComunImpact || 0;
            if (aBienComun !== bBienComun) {
                return bBienComun - aBienComun;
            }
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        })
            .map((rec, index) => ({
            ...rec,
            priority: index + 1,
            bienComunRank: index + 1
        }));
        return {
            ...report,
            recommendations: filteredRecommendations,
            summary: this.generateBienComunSummary(filteredRecommendations)
        };
    }
    calculatePhilosophyAlignment(report) {
        const recommendations = report.recommendations;
        const bienComunScore = this.calculatePrincipleScore(recommendations, 'bienComun');
        const ayniScore = this.calculatePrincipleScore(recommendations, 'ayni');
        const cooperacionScore = this.calculatePrincipleScore(recommendations, 'cooperacion');
        const metanoiaScore = this.calculatePrincipleScore(recommendations, 'metanoia');
        const neguentropiaScore = this.calculatePrincipleScore(recommendations, 'neguentropia');
        const overallAlignment = (bienComunScore + ayniScore + cooperacionScore +
            metanoiaScore + neguentropiaScore) / 5;
        return {
            overall: Math.round(overallAlignment * 100) / 100,
            principles: {
                bienComun: bienComunScore,
                ayni: ayniScore,
                cooperacion: cooperacionScore,
                metanoia: metanoiaScore,
                neguentropia: neguentropiaScore
            },
            strengths: this.identifyPhilosophyStrengths(recommendations),
            opportunities: this.identifyPhilosophyOpportunities(recommendations)
        };
    }
    addPhilosophyContext(recommendation) {
        const contexts = [];
        if (recommendation.bienComunImpact && recommendation.bienComunImpact > 0.7) {
            contexts.push("🌟 Alto impacto en Bien Común - beneficia significativamente al equipo completo");
        }
        if (recommendation.ayniScore && recommendation.ayniScore > 0.8) {
            contexts.push("🤝 Fortalece Ayni - promueve reciprocidad y equilibrio en el equipo");
        }
        if (recommendation.title.toLowerCase().includes('transform') ||
            recommendation.title.toLowerCase().includes('evolv') ||
            recommendation.title.toLowerCase().includes('improv')) {
            contexts.push("🦋 Impulsa Metanöia - facilita transformación consciente y evolución");
        }
        return contexts.length > 0 ? contexts.join(' | ') :
            "🌱 Contribuye al crecimiento orgánico del sistema";
    }
    calculateAyniScore(recommendation) {
        let score = 0.5;
        if (recommendation.description.toLowerCase().includes('shar'))
            score += 0.2;
        if (recommendation.description.toLowerCase().includes('collaborat'))
            score += 0.2;
        if (recommendation.description.toLowerCase().includes('team'))
            score += 0.1;
        if (recommendation.description.toLowerCase().includes('mutual'))
            score += 0.2;
        if (recommendation.description.toLowerCase().includes('reciproc'))
            score += 0.3;
        if (recommendation.description.toLowerCase().includes('individual'))
            score -= 0.1;
        if (recommendation.description.toLowerCase().includes('compet'))
            score -= 0.2;
        if (recommendation.description.toLowerCase().includes('exclusive'))
            score -= 0.3;
        return Math.max(0, Math.min(1, score));
    }
    calculateBienComunImpact(recommendation) {
        let impact = 0.5;
        if (recommendation.severity === 'critical')
            impact += 0.3;
        if (recommendation.severity === 'high')
            impact += 0.2;
        if (recommendation.description.toLowerCase().includes('accessibility'))
            impact += 0.3;
        if (recommendation.description.toLowerCase().includes('performance'))
            impact += 0.2;
        if (recommendation.description.toLowerCase().includes('security'))
            impact += 0.3;
        if (recommendation.description.toLowerCase().includes('maintainab'))
            impact += 0.2;
        if (recommendation.description.toLowerCase().includes('scalab'))
            impact += 0.2;
        if (recommendation.description.toLowerCase().includes('usabilit'))
            impact += 0.2;
        return Math.max(0, Math.min(1, impact));
    }
    getMetrics() {
        return {
            guardianType: this.guardianType,
            name: this.name,
            totalAnalyses: this.analysisHistory.length,
            lastAnalysis: this.lastAnalysis,
            averageRecommendations: this.analysisHistory.length > 0
                ? this.analysisHistory.reduce((sum, report) => sum + report.recommendations.length, 0) / this.analysisHistory.length
                : 0,
            philosophyAlignment: this.getAveragePhilosophyAlignment(),
            uptime: this.lastAnalysis ? Date.now() - this.lastAnalysis.getTime() : 0
        };
    }
    getGuardianWisdom() {
        const wisdoms = [
            "🌟 El verdadero progreso honra tanto la innovación como la tradición",
            "🤝 En la reciprocidad encuentra el equilibrio perfecto",
            "🌱 Cada mejora debe nutrir el crecimiento del conjunto",
            "🦋 La transformación consciente supera a la optimización ciega",
            "🌍 Lo que beneficia a uno debe beneficiar a todos",
            "⚖️ El equilibrio entre eficiencia y humanidad es la clave",
            "🔄 Los patrones emergen cuando observamos con paciencia",
            "💫 La excelencia técnica y la sabiduría ancestral convergen"
        ];
        return wisdoms[Math.floor(Math.random() * wisdoms.length)];
    }
    calculatePrincipleScore(recommendations, principle) {
        return 0.7 + (Math.random() * 0.3);
    }
    identifyPhilosophyStrengths(recommendations) {
        return ["Enfoque colaborativo", "Visión de largo plazo", "Consideración del Bien Común"];
    }
    identifyPhilosophyOpportunities(recommendations) {
        return ["Fortalecer reciprocidad", "Ampliar impacto comunitario", "Profundizar transformación"];
    }
    getAveragePhilosophyAlignment() {
        if (this.analysisHistory.length === 0)
            return 0;
        const sum = this.analysisHistory.reduce((acc, report) => acc + (report.philosophyAlignment?.overall || 0), 0);
        return sum / this.analysisHistory.length;
    }
    generateBienComunSummary(recommendations) {
        const highImpact = recommendations.filter(r => (r.bienComunImpact || 0) > 0.7).length;
        const total = recommendations.length;
        return `🌍 Análisis Bien Común: ${highImpact}/${total} recomendaciones con alto impacto comunitario. ` +
            `Priorización aplicada según beneficio colectivo y filosofía CoomÜnity.`;
    }
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${this.guardianType.toUpperCase()}] [${this.name}]`;
        if (this.config.debug) {
            switch (level) {
                case 'error':
                    console.error(`${prefix} ❌ ${message}`);
                    break;
                case 'warn':
                    console.warn(`${prefix} ⚠️ ${message}`);
                    break;
                default:
                    console.log(`${prefix} 📝 ${message}`);
            }
        }
    }
    getStatus() {
        return {
            name: this.name,
            type: this.guardianType,
            isActive: this.lastAnalysis !== null,
            lastAnalysis: this.lastAnalysis,
            analysisCount: this.analysisHistory.length,
            description: this.description,
            philosophyAlignment: this.getAveragePhilosophyAlignment()
        };
    }
    cleanHistory(keepLast = 20) {
        if (this.analysisHistory.length > keepLast) {
            this.analysisHistory = this.analysisHistory.slice(-keepLast);
            this.log(`🧹 History cleaned, keeping last ${keepLast} analyses`);
        }
    }
}
exports.BaseGuardian = BaseGuardian;
exports.default = BaseGuardian;
//# sourceMappingURL=BaseGuardian.js.map