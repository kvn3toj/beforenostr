"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarmonyAnalyzer = void 0;
class HarmonyAnalyzer {
    constructor(config) {
        this.harmonyHistory = [];
        this.teamActivities = [];
        this.wellbeingData = [];
        this.ayniContributions = [];
        this.config = config;
    }
    async analyzeTeamHarmony() {
        this.log('📊 Analizando armonía del equipo...');
        try {
            const collaboration = await this.analyzeCollaboration();
            const philosophy = await this.analyzePhilosophy();
            const technical = await this.analyzeTechnical();
            const communication = await this.analyzeCommunication();
            const wellbeing = await this.analyzeWellbeing();
            const overall = this.calculateOverallHarmony(collaboration, philosophy, technical, communication, wellbeing);
            const trends = await this.analyzeTrends();
            const harmony = {
                overall,
                collaboration,
                philosophy,
                technical,
                communication,
                wellbeing,
                timestamp: new Date(),
                trends
            };
            this.harmonyHistory.push(harmony);
            this.log(`✅ Armonía del equipo: ${overall}/100`);
            return harmony;
        }
        catch (error) {
            this.log(`❌ Error analizando armonía: ${error.message}`);
            throw error;
        }
    }
    async analyzeCollaboration() {
        const ayniScore = this.calculateAyniScore();
        const pairProgramming = this.analyzePairProgramming();
        const codeReviews = this.analyzeCodeReviews();
        const knowledgeSharing = this.analyzeKnowledgeSharing();
        const conflictResolution = this.analyzeConflictResolution();
        return {
            ayniScore,
            pairProgramming,
            codeReviews,
            knowledgeSharing,
            conflictResolution
        };
    }
    async analyzePhilosophy() {
        const bienComunAlignment = this.calculateBienComunAlignment();
        const cooperationOverCompetition = this.analyzeCooperationLevel();
        const sustainabilityFocus = this.analyzeSustainabilityFocus();
        const transparencyLevel = this.analyzeTransparency();
        const inclusivityScore = this.analyzeInclusivity();
        return {
            bienComunAlignment,
            cooperationOverCompetition,
            sustainabilityFocus,
            transparencyLevel,
            inclusivityScore
        };
    }
    async analyzeTechnical() {
        return {
            codeQuality: 85,
            testCoverage: 78,
            architectureCompliance: 90,
            performanceScore: 82,
            securityScore: 88
        };
    }
    async analyzeCommunication() {
        const clarityScore = this.analyzeCommunicationClarity();
        const responsivenessScore = this.analyzeResponsiveness();
        const empathyLevel = this.analyzeEmpathy();
        const feedbackQuality = this.analyzeFeedbackQuality();
        return {
            clarityScore,
            responsivenessScore,
            empathyLevel,
            feedbackQuality
        };
    }
    async analyzeWellbeing() {
        const workLifeBalance = this.analyzeWorkLifeBalance();
        const stressLevel = this.analyzeStressLevel();
        const satisfactionLevel = this.analyzeSatisfactionLevel();
        const burnoutRisk = this.analyzeBurnoutRisk();
        return {
            workLifeBalance,
            stressLevel,
            satisfactionLevel,
            burnoutRisk
        };
    }
    async detectBurnoutPatterns() {
        this.log('🔮 Detectando patrones de burnout...');
        const burnoutIndicators = [];
        const affectedMembers = [];
        const overworkPattern = this.detectOverworkPattern();
        if (overworkPattern.detected) {
            burnoutIndicators.push('Patrón de trabajo excesivo detectado');
            affectedMembers.push(...overworkPattern.members);
        }
        const communicationDecline = this.detectCommunicationDecline();
        if (communicationDecline.detected) {
            burnoutIndicators.push('Declive en calidad de comunicación');
            affectedMembers.push(...communicationDecline.members);
        }
        const isolationPattern = this.detectIsolationPattern();
        if (isolationPattern.detected) {
            burnoutIndicators.push('Patrones de aislamiento social');
            affectedMembers.push(...isolationPattern.members);
        }
        const riskLevel = this.calculateBurnoutRisk(burnoutIndicators.length, affectedMembers.length);
        const recommendations = this.generateBurnoutRecommendations(riskLevel, burnoutIndicators);
        return {
            riskLevel,
            affectedMembers: [...new Set(affectedMembers)],
            indicators: burnoutIndicators,
            recommendations
        };
    }
    async suggestHarmonyImprovements() {
        const harmony = await this.analyzeTeamHarmony();
        const suggestions = [];
        if (harmony.collaboration.ayniScore < 80) {
            suggestions.push('🤝 Implementar sesiones de pair programming para mejorar reciprocidad');
            suggestions.push('📝 Crear sistema de reconocimiento mutuo de contribuciones');
        }
        if (harmony.philosophy.bienComunAlignment < 85) {
            suggestions.push('🌟 Realizar workshops sobre filosofía CoomÜnity');
            suggestions.push('📚 Integrar principios del Bien Común en decisiones técnicas');
        }
        if (harmony.wellbeing.stressLevel > 60) {
            suggestions.push('🧘 Implementar pausas de mindfulness durante el día');
            suggestions.push('⚖️ Revisar distribución de carga de trabajo');
        }
        if (harmony.communication.clarityScore < 75) {
            suggestions.push('💬 Establecer protocolos de comunicación más claros');
            suggestions.push('📋 Usar templates para documentación y reportes');
        }
        return suggestions;
    }
    calculateAyniScore() {
        const recentContributions = this.ayniContributions.filter(c => c.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        if (recentContributions.length === 0)
            return 100;
        const memberBalances = new Map();
        for (const contribution of recentContributions) {
            const giverBalance = memberBalances.get(contribution.giverId) || { given: 0, received: 0 };
            giverBalance.given += contribution.value;
            memberBalances.set(contribution.giverId, giverBalance);
            const receiverBalance = memberBalances.get(contribution.receiverId) || { given: 0, received: 0 };
            receiverBalance.received += contribution.value;
            memberBalances.set(contribution.receiverId, receiverBalance);
        }
        let totalBalance = 0;
        let memberCount = 0;
        for (const [_, balance] of memberBalances) {
            const total = balance.given + balance.received;
            if (total > 0) {
                const balanceRatio = Math.min(balance.given, balance.received) / Math.max(balance.given, balance.received);
                totalBalance += balanceRatio * 100;
                memberCount++;
            }
        }
        return memberCount > 0 ? totalBalance / memberCount : 100;
    }
    analyzePairProgramming() {
        const pairActivities = this.teamActivities.filter(a => a.collaborators.length > 0 && a.type === 'commit');
        const totalActivities = this.teamActivities.filter(a => a.type === 'commit').length;
        return totalActivities > 0 ? (pairActivities.length / totalActivities) * 100 : 50;
    }
    analyzeCodeReviews() {
        const reviewActivities = this.teamActivities.filter(a => a.type === 'review');
        const totalCommits = this.teamActivities.filter(a => a.type === 'commit').length;
        return totalCommits > 0 ? Math.min(100, (reviewActivities.length / totalCommits) * 100) : 75;
    }
    analyzeKnowledgeSharing() {
        const sharingContributions = this.ayniContributions.filter(c => c.type === 'knowledge' || c.type === 'mentoring');
        return Math.min(100, sharingContributions.length * 10);
    }
    analyzeConflictResolution() {
        return 85;
    }
    calculateBienComunAlignment() {
        const recentActivities = this.teamActivities.filter(a => a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        if (recentActivities.length === 0)
            return 100;
        const totalAlignment = recentActivities.reduce((sum, activity) => sum + activity.philosophyAlignment, 0);
        return totalAlignment / recentActivities.length;
    }
    analyzeCooperationLevel() {
        const collaborativeActivities = this.teamActivities.filter(a => a.collaborators.length > 0);
        const totalActivities = this.teamActivities.length;
        return totalActivities > 0 ? (collaborativeActivities.length / totalActivities) * 100 : 85;
    }
    analyzeSustainabilityFocus() {
        const avgWorkHours = this.calculateAverageWorkHours();
        if (avgWorkHours <= 8)
            return 100;
        if (avgWorkHours <= 9)
            return 85;
        if (avgWorkHours <= 10)
            return 70;
        return 50;
    }
    analyzeTransparency() {
        const recentComments = this.teamActivities.filter(a => a.type === 'comment' && a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        return Math.min(100, recentComments.length * 5);
    }
    analyzeInclusivity() {
        const memberParticipation = new Map();
        for (const activity of this.teamActivities) {
            const current = memberParticipation.get(activity.memberId) || 0;
            memberParticipation.set(activity.memberId, current + 1);
        }
        const participations = Array.from(memberParticipation.values());
        if (participations.length === 0)
            return 100;
        const mean = participations.reduce((a, b) => a + b, 0) / participations.length;
        const variance = participations.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / participations.length;
        const stdDev = Math.sqrt(variance);
        const cv = mean > 0 ? stdDev / mean : 0;
        return Math.max(0, 100 - (cv * 100));
    }
    analyzeCommunicationClarity() {
        const recentIndicators = this.wellbeingData.filter(w => w.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        if (recentIndicators.length === 0)
            return 80;
        const positiveComm = recentIndicators.filter(w => w.communicationTone === 'positive').length;
        const totalComm = recentIndicators.length;
        return (positiveComm / totalComm) * 100;
    }
    analyzeResponsiveness() {
        const avgResponseTime = this.wellbeingData.reduce((sum, w) => sum + w.responseTime, 0) /
            Math.max(1, this.wellbeingData.length);
        if (avgResponseTime <= 60)
            return 100;
        if (avgResponseTime <= 240)
            return 85;
        if (avgResponseTime <= 480)
            return 70;
        return 50;
    }
    analyzeEmpathy() {
        const empathyContributions = this.ayniContributions.filter(c => c.type === 'support' || c.type === 'mentoring');
        return Math.min(100, empathyContributions.length * 15);
    }
    analyzeFeedbackQuality() {
        const reviewActivities = this.teamActivities.filter(a => a.type === 'review');
        if (reviewActivities.length === 0)
            return 75;
        const avgImpact = reviewActivities.reduce((sum, r) => sum + r.impact, 0) / reviewActivities.length;
        return avgImpact;
    }
    analyzeWorkLifeBalance() {
        const avgWorkHours = this.calculateAverageWorkHours();
        if (avgWorkHours <= 8)
            return 100;
        if (avgWorkHours <= 9)
            return 85;
        if (avgWorkHours <= 10)
            return 70;
        if (avgWorkHours <= 11)
            return 55;
        return 40;
    }
    analyzeStressLevel() {
        const recentIndicators = this.wellbeingData.filter(w => w.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        if (recentIndicators.length === 0)
            return 20;
        const avgStress = recentIndicators.reduce((sum, w) => sum + w.stressLevel, 0) / recentIndicators.length;
        return avgStress;
    }
    analyzeSatisfactionLevel() {
        const recentIndicators = this.wellbeingData.filter(w => w.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        if (recentIndicators.length === 0)
            return 85;
        const avgSatisfaction = recentIndicators.reduce((sum, w) => sum + w.satisfactionLevel, 0) / recentIndicators.length;
        return avgSatisfaction;
    }
    analyzeBurnoutRisk() {
        const stressLevel = this.analyzeStressLevel();
        const workLifeBalance = this.analyzeWorkLifeBalance();
        const satisfactionLevel = this.analyzeSatisfactionLevel();
        const riskFactors = [
            stressLevel * 0.4,
            (100 - workLifeBalance) * 0.3,
            (100 - satisfactionLevel) * 0.3
        ];
        return riskFactors.reduce((sum, factor) => sum + factor, 0);
    }
    calculateOverallHarmony(collaboration, philosophy, technical, communication, wellbeing) {
        const weights = {
            philosophy: 0.3,
            collaboration: 0.25,
            wellbeing: 0.2,
            communication: 0.15,
            technical: 0.1
        };
        const philosophyAvg = (philosophy.bienComunAlignment + philosophy.cooperationOverCompetition +
            philosophy.sustainabilityFocus + philosophy.transparencyLevel +
            philosophy.inclusivityScore) / 5;
        const collaborationAvg = (collaboration.ayniScore + collaboration.pairProgramming +
            collaboration.codeReviews + collaboration.knowledgeSharing +
            collaboration.conflictResolution) / 5;
        const technicalAvg = (technical.codeQuality + technical.testCoverage +
            technical.architectureCompliance + technical.performanceScore +
            technical.securityScore) / 5;
        const communicationAvg = (communication.clarityScore + communication.responsivenessScore +
            communication.empathyLevel + communication.feedbackQuality) / 4;
        const wellbeingAvg = (wellbeing.workLifeBalance + (100 - wellbeing.stressLevel) +
            wellbeing.satisfactionLevel + (100 - wellbeing.burnoutRisk)) / 4;
        const overall = (philosophyAvg * weights.philosophy +
            collaborationAvg * weights.collaboration +
            technicalAvg * weights.technical +
            communicationAvg * weights.communication +
            wellbeingAvg * weights.wellbeing);
        return Math.round(overall);
    }
    async analyzeTrends() {
        if (this.harmonyHistory.length < 2)
            return [];
        const trends = [];
        const recent = this.harmonyHistory[this.harmonyHistory.length - 1];
        const previous = this.harmonyHistory[this.harmonyHistory.length - 2];
        const overallChange = recent.overall - previous.overall;
        trends.push({
            metric: 'overall',
            direction: overallChange > 2 ? 'up' : overallChange < -2 ? 'down' : 'stable',
            change: Math.abs(overallChange),
            period: 'last_analysis'
        });
        const ayniChange = recent.collaboration.ayniScore - previous.collaboration.ayniScore;
        trends.push({
            metric: 'ayniScore',
            direction: ayniChange > 2 ? 'up' : ayniChange < -2 ? 'down' : 'stable',
            change: Math.abs(ayniChange),
            period: 'last_analysis'
        });
        return trends;
    }
    detectOverworkPattern() {
        const overworkedMembers = [];
        const avgWorkHours = this.calculateAverageWorkHours();
        const memberHours = new Map();
        for (const indicator of this.wellbeingData) {
            const hours = memberHours.get(indicator.memberId) || [];
            hours.push(indicator.workHours);
            memberHours.set(indicator.memberId, hours);
        }
        for (const [memberId, hours] of memberHours) {
            const avgHours = hours.reduce((a, b) => a + b, 0) / hours.length;
            if (avgHours > 10) {
                overworkedMembers.push(memberId);
            }
        }
        return {
            detected: overworkedMembers.length > 0,
            members: overworkedMembers
        };
    }
    detectCommunicationDecline() {
        const membersWithDecline = [];
        const negativeComm = this.wellbeingData.filter(w => w.communicationTone === 'negative');
        for (const indicator of negativeComm) {
            if (!membersWithDecline.includes(indicator.memberId)) {
                membersWithDecline.push(indicator.memberId);
            }
        }
        return {
            detected: membersWithDecline.length > 0,
            members: membersWithDecline
        };
    }
    detectIsolationPattern() {
        const isolatedMembers = [];
        const memberCollaboration = new Map();
        for (const activity of this.teamActivities) {
            const collabCount = memberCollaboration.get(activity.memberId) || 0;
            memberCollaboration.set(activity.memberId, collabCount + activity.collaborators.length);
        }
        const avgCollaboration = Array.from(memberCollaboration.values()).reduce((a, b) => a + b, 0) /
            Math.max(1, memberCollaboration.size);
        for (const [memberId, collabCount] of memberCollaboration) {
            if (collabCount < avgCollaboration * 0.5) {
                isolatedMembers.push(memberId);
            }
        }
        return {
            detected: isolatedMembers.length > 0,
            members: isolatedMembers
        };
    }
    calculateBurnoutRisk(indicatorCount, affectedCount) {
        if (indicatorCount >= 3 || affectedCount >= 3)
            return 'critical';
        if (indicatorCount >= 2 || affectedCount >= 2)
            return 'high';
        if (indicatorCount >= 1 || affectedCount >= 1)
            return 'medium';
        return 'low';
    }
    generateBurnoutRecommendations(riskLevel, indicators) {
        const recommendations = [];
        switch (riskLevel) {
            case 'critical':
                recommendations.push('🚨 Intervención inmediata requerida');
                recommendations.push('🏥 Considerar tiempo de descanso para miembros afectados');
                recommendations.push('👥 Redistribuir carga de trabajo urgentemente');
                break;
            case 'high':
                recommendations.push('⚠️ Monitoreo cercano requerido');
                recommendations.push('🧘 Implementar sesiones de bienestar');
                recommendations.push('📊 Revisar métricas de carga de trabajo');
                break;
            case 'medium':
                recommendations.push('👀 Mantener observación');
                recommendations.push('💬 Facilitar conversaciones de check-in');
                break;
            default:
                recommendations.push('✅ Continuar con prácticas actuales');
        }
        return recommendations;
    }
    calculateAverageWorkHours() {
        if (this.wellbeingData.length === 0)
            return 8;
        const totalHours = this.wellbeingData.reduce((sum, w) => sum + w.workHours, 0);
        return totalHours / this.wellbeingData.length;
    }
    log(message) {
        if (this.config.debugMode) {
            console.log(`[HarmonyAnalyzer] ${message}`);
        }
    }
}
exports.HarmonyAnalyzer = HarmonyAnalyzer;
//# sourceMappingURL=HarmonyAnalyzer.js.map