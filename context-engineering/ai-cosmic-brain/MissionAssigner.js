"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionAssigner = void 0;
const types_1 = require("./types");
class MissionAssigner {
    constructor(config) {
        this.assignmentHistory = [];
        this.completedMissions = [];
        this.config = config;
    }
    async assignMissions(context, strategy) {
        this.log('🎯 Iniciando asignación automática de misiones...');
        const defaultStrategy = {
            prioritizePhilosophy: true,
            balanceWorkload: true,
            focusOnGrowth: true,
            considerAyni: true,
            respectPreferences: true
        };
        const assignmentStrategy = { ...defaultStrategy, ...strategy };
        try {
            const candidateMissions = await this.generateCandidateMissions(context);
            const prioritizedMissions = this.prioritizeMissions(candidateMissions, context, assignmentStrategy);
            const assignedMissions = await this.assignResources(prioritizedMissions, context, assignmentStrategy);
            const optimizedMissions = this.optimizeForTeamBalance(assignedMissions, context, assignmentStrategy);
            const scheduledMissions = this.establishSchedule(optimizedMissions, context);
            const validatedMissions = this.validateAssignments(scheduledMissions, context);
            this.assignmentHistory.push(...validatedMissions);
            this.log(`✅ Asignadas ${validatedMissions.length} misiones`);
            return validatedMissions;
        }
        catch (error) {
            this.log(`❌ Error asignando misiones: ${error.message}`);
            throw error;
        }
    }
    async identifyProjectGaps(context) {
        this.log('🔍 Identificando gaps del proyecto...');
        const gaps = [];
        const technicalGaps = await this.identifyTechnicalGaps(context);
        gaps.push(...technicalGaps);
        const processGaps = await this.identifyProcessGaps(context);
        gaps.push(...processGaps);
        const philosophyGaps = await this.identifyPhilosophyGaps(context);
        gaps.push(...philosophyGaps);
        const collaborationGaps = await this.identifyCollaborationGaps(context);
        gaps.push(...collaborationGaps);
        const documentationGaps = await this.identifyDocumentationGaps(context);
        gaps.push(...documentationGaps);
        this.log(`✅ Identificados ${gaps.length} gaps del proyecto`);
        return gaps;
    }
    async identifyOpportunities(context) {
        this.log('🌟 Identificando oportunidades...');
        const opportunities = [];
        const technicalOpportunities = await this.identifyTechnicalOpportunities(context);
        opportunities.push(...technicalOpportunities);
        const growthOpportunities = await this.identifyGrowthOpportunities(context);
        opportunities.push(...growthOpportunities);
        const philosophyOpportunities = await this.identifyPhilosophyOpportunities(context);
        opportunities.push(...philosophyOpportunities);
        const predictionOpportunities = await this.identifyPredictionOpportunities(context);
        opportunities.push(...predictionOpportunities);
        this.log(`✅ Identificadas ${opportunities.length} oportunidades`);
        return opportunities;
    }
    async updateMissionProgress(missionId, progress, notes) {
        const mission = this.assignmentHistory.find(m => m.id === missionId);
        if (!mission) {
            this.log(`⚠️ Misión no encontrada: ${missionId}`);
            return null;
        }
        mission.progress = Math.max(0, Math.min(100, progress));
        if (progress >= 100) {
            mission.status = types_1.MissionStatus.COMPLETED;
            mission.actualEffort = mission.estimatedEffort;
            this.completedMissions.push(mission);
            this.log(`✅ Misión completada: ${mission.title}`);
        }
        this.log(`📊 Progreso actualizado: ${mission.title} - ${progress}%`);
        return mission;
    }
    getMissionStats() {
        const total = this.assignmentHistory.length;
        const assigned = this.assignmentHistory.filter(m => m.status === types_1.MissionStatus.ASSIGNED).length;
        const inProgress = this.assignmentHistory.filter(m => m.status === types_1.MissionStatus.IN_PROGRESS).length;
        const completed = this.assignmentHistory.filter(m => m.status === types_1.MissionStatus.COMPLETED).length;
        const cancelled = this.assignmentHistory.filter(m => m.status === types_1.MissionStatus.CANCELLED).length;
        const averageCompletion = total > 0
            ? this.assignmentHistory.reduce((sum, m) => sum + m.progress, 0) / total
            : 0;
        const philosophyAlignment = total > 0
            ? this.assignmentHistory.reduce((sum, m) => {
                const benefit = m.philosophyBenefit || '';
                return sum + (benefit.length > 50 ? 90 : 70);
            }, 0) / total
            : 100;
        return {
            total,
            assigned,
            inProgress,
            completed,
            cancelled,
            averageCompletion,
            philosophyAlignment
        };
    }
    async generateCandidateMissions(context) {
        const missions = [];
        for (const gap of context.gaps) {
            const gapMissions = this.createMissionsFromGap(gap);
            missions.push(...gapMissions);
        }
        for (const opportunity of context.opportunities) {
            const opportunityMission = this.createMissionFromOpportunity(opportunity);
            missions.push(opportunityMission);
        }
        for (const prediction of context.predictions) {
            const predictionMissions = this.createMissionsFromPrediction(prediction);
            missions.push(...predictionMissions);
        }
        return missions;
    }
    createMissionsFromGap(gap) {
        const missions = [];
        for (const solution of gap.suggestedSolutions) {
            missions.push({
                id: this.generateId('gap'),
                title: `Resolver: ${gap.area}`,
                description: `${gap.description} - Implementar: ${solution}`,
                priority: this.severityToPriority(gap.severity),
                category: this.areaToCategory(gap.area),
                assignedDate: new Date(),
                progress: 0,
                status: types_1.MissionStatus.ASSIGNED,
                philosophyBenefit: `Contribuye al Bien Común resolviendo ${gap.area}`,
                technicalBenefit: solution,
                requirements: [`Analizar ${gap.area}`, `Implementar ${solution}`],
                deliverables: [`${gap.area} mejorado`, `Documentación de solución`],
                dependencies: [],
                estimatedEffort: this.estimateEffortFromSeverity(gap.severity),
                tags: ['gap-resolution', gap.area.toLowerCase()]
            });
        }
        return missions;
    }
    createMissionFromOpportunity(opportunity) {
        return {
            id: this.generateId('opportunity'),
            title: opportunity.name,
            description: opportunity.description,
            priority: this.valueToPriority(opportunity.potentialValue),
            category: opportunity.category,
            assignedDate: new Date(),
            progress: 0,
            status: types_1.MissionStatus.ASSIGNED,
            philosophyBenefit: `Valor filosófico: ${opportunity.philosophyBenefit}/100`,
            technicalBenefit: `Valor técnico: ${opportunity.technicalBenefit}/100`,
            requirements: [`Evaluar viabilidad`, `Diseñar implementación`],
            deliverables: [`${opportunity.name} implementado`],
            dependencies: opportunity.dependencies,
            estimatedEffort: opportunity.estimatedEffort,
            tags: ['opportunity', opportunity.category.toLowerCase()]
        };
    }
    createMissionsFromPrediction(prediction) {
        return prediction.suggestedActions.map(action => ({
            id: this.generateId('prediction'),
            title: `Predicción: ${prediction.name}`,
            description: `Implementar acción preventiva: ${action}`,
            priority: this.impactToPriority(prediction.impact),
            category: this.patternCategoryToMissionCategory(prediction.category),
            assignedDate: new Date(),
            progress: 0,
            status: types_1.MissionStatus.ASSIGNED,
            philosophyBenefit: `Alineación: ${prediction.philosophyAlignment}% - Preparación proactiva`,
            technicalBenefit: action,
            requirements: [`Validar predicción`, `Planificar implementación`],
            deliverables: [`Acción preventiva implementada`],
            dependencies: [],
            estimatedEffort: this.estimateEffortFromConfidence(prediction.confidence),
            tags: ['prediction', 'proactive', prediction.category.toLowerCase()]
        }));
    }
    prioritizeMissions(missions, context, strategy) {
        return missions.sort((a, b) => {
            const scoreA = this.calculateMissionScore(a, context, strategy);
            const scoreB = this.calculateMissionScore(b, context, strategy);
            return scoreB - scoreA;
        });
    }
    calculateMissionScore(mission, context, strategy) {
        let score = 0;
        score += this.getPriorityWeight(mission.priority) * 0.3;
        if (strategy.prioritizePhilosophy) {
            const philosophyScore = this.extractPhilosophyScore(mission.philosophyBenefit);
            score += philosophyScore * (this.config.philosophyWeight || 0.4);
        }
        const harmonyImpact = this.calculateHarmonyImpact(mission, context.harmony);
        score += harmonyImpact * 0.2;
        const urgency = this.calculateUrgency(mission, context);
        score += urgency * 0.1;
        return score;
    }
    async assignResources(missions, context, strategy) {
        const assignedMissions = [];
        for (const mission of missions) {
            const bestCandidate = this.findBestCandidate(mission, context.teamMembers, strategy);
            if (bestCandidate) {
                mission.tags = mission.tags || [];
                mission.tags.push(`assigned-to:${bestCandidate.id}`);
                bestCandidate.currentWorkload += this.estimateWorkloadImpact(mission);
                if (strategy.considerAyni) {
                    this.updateAyniScore(bestCandidate, mission);
                }
                assignedMissions.push(mission);
                this.log(`👤 Misión "${mission.title}" asignada a ${bestCandidate.name}`);
            }
            else {
                this.log(`⚠️ No se encontró candidato para misión: ${mission.title}`);
                mission.status = types_1.MissionStatus.BLOCKED;
                assignedMissions.push(mission);
            }
        }
        return assignedMissions;
    }
    findBestCandidate(mission, teamMembers, strategy) {
        let bestCandidate = null;
        let bestScore = 0;
        for (const member of teamMembers) {
            if (member.currentWorkload > 80)
                continue;
            const score = this.calculateCandidateScore(mission, member, strategy);
            if (score > bestScore) {
                bestScore = score;
                bestCandidate = member;
            }
        }
        return bestCandidate;
    }
    calculateCandidateScore(mission, member, strategy) {
        let score = 0;
        const skillsMatch = this.calculateSkillsMatch(mission, member);
        score += skillsMatch * 0.3;
        const availability = (100 - member.currentWorkload) / 100;
        score += availability * 0.2;
        if (strategy.prioritizePhilosophy) {
            score += (member.philosophyAlignment / 100) * 0.25;
        }
        if (strategy.focusOnGrowth) {
            const growthPotential = this.calculateGrowthPotential(mission, member);
            score += growthPotential * 0.15;
        }
        if (strategy.considerAyni) {
            const ayniBalance = this.calculateAyniBalance(member);
            score += ayniBalance * 0.1;
        }
        return score;
    }
    optimizeForTeamBalance(missions, context, strategy) {
        if (!strategy.balanceWorkload)
            return missions;
        const workloadByMember = new Map();
        for (const mission of missions) {
            const assignedTo = this.extractAssignedMember(mission);
            if (assignedTo) {
                const currentLoad = workloadByMember.get(assignedTo) || 0;
                workloadByMember.set(assignedTo, currentLoad + this.estimateWorkloadImpact(mission));
            }
        }
        const averageLoad = Array.from(workloadByMember.values()).reduce((a, b) => a + b, 0) / workloadByMember.size;
        for (const [memberId, load] of workloadByMember) {
            if (load > averageLoad * 1.3) {
                this.log(`⚖️ Rebalanceando carga para miembro: ${memberId}`);
            }
        }
        return missions;
    }
    establishSchedule(missions, context) {
        const scheduledMissions = [...missions];
        for (const mission of scheduledMissions) {
            const dueDate = this.calculateDueDate(mission, context.timeConstraints);
            mission.dueDate = dueDate;
        }
        return scheduledMissions;
    }
    validateAssignments(missions, context) {
        const validMissions = [];
        for (const mission of missions) {
            if (this.isAssignmentValid(mission, context)) {
                validMissions.push(mission);
            }
            else {
                this.log(`⚠️ Asignación inválida: ${mission.title}`);
                mission.status = types_1.MissionStatus.BLOCKED;
                validMissions.push(mission);
            }
        }
        return validMissions;
    }
    async identifyTechnicalGaps(context) {
        const gaps = [];
        if (context.harmony.technical.testCoverage < 80) {
            gaps.push({
                id: this.generateId('gap'),
                area: 'Testing',
                description: 'Cobertura de tests insuficiente para garantizar calidad',
                severity: context.harmony.technical.testCoverage < 60 ? 'high' : 'medium',
                impact: types_1.ImpactLevel.HIGH,
                evidence: [`Cobertura actual: ${context.harmony.technical.testCoverage}%`],
                suggestedSolutions: ['Implementar TDD', 'Aumentar tests unitarios', 'Configurar CI/CD'],
                philosophyAlignment: 90,
                technicalDebt: 70,
                urgency: 80
            });
        }
        if (context.harmony.technical.performanceScore < 75) {
            gaps.push({
                id: this.generateId('gap'),
                area: 'Performance',
                description: 'Performance del sistema requiere optimización',
                severity: 'medium',
                impact: types_1.ImpactLevel.MEDIUM,
                evidence: [`Score de performance: ${context.harmony.technical.performanceScore}%`],
                suggestedSolutions: ['Optimizar queries', 'Implementar caching', 'Profiling de código'],
                philosophyAlignment: 75,
                technicalDebt: 60,
                urgency: 60
            });
        }
        return gaps;
    }
    async identifyProcessGaps(context) {
        const gaps = [];
        if (context.harmony.communication.clarityScore < 75) {
            gaps.push({
                id: this.generateId('gap'),
                area: 'Documentation',
                description: 'Documentación insuficiente afecta la claridad de comunicación',
                severity: 'medium',
                impact: types_1.ImpactLevel.MEDIUM,
                evidence: [`Score de claridad: ${context.harmony.communication.clarityScore}%`],
                suggestedSolutions: ['Crear templates de documentación', 'Documentar APIs', 'Guías de usuario'],
                philosophyAlignment: 85,
                technicalDebt: 40,
                urgency: 50
            });
        }
        return gaps;
    }
    async identifyPhilosophyGaps(context) {
        const gaps = [];
        if (context.harmony.philosophy.bienComunAlignment < 85) {
            gaps.push({
                id: this.generateId('gap'),
                area: 'Philosophy',
                description: 'Alineación con principios del Bien Común puede fortalecerse',
                severity: 'medium',
                impact: types_1.ImpactLevel.HIGH,
                evidence: [`Alineación actual: ${context.harmony.philosophy.bienComunAlignment}%`],
                suggestedSolutions: ['Workshops de filosofía CoomÜnity', 'Integrar principios en código', 'Métricas de impacto'],
                philosophyAlignment: 100,
                technicalDebt: 0,
                urgency: 70
            });
        }
        return gaps;
    }
    async identifyCollaborationGaps(context) {
        const gaps = [];
        if (context.harmony.collaboration.ayniScore < 80) {
            gaps.push({
                id: this.generateId('gap'),
                area: 'Collaboration',
                description: 'Score de Ayni indica oportunidades de mejorar reciprocidad',
                severity: 'medium',
                impact: types_1.ImpactLevel.MEDIUM,
                evidence: [`Score Ayni: ${context.harmony.collaboration.ayniScore}%`],
                suggestedSolutions: ['Pair programming', 'Rotación de roles', 'Mentoring cruzado'],
                philosophyAlignment: 95,
                technicalDebt: 0,
                urgency: 60
            });
        }
        return gaps;
    }
    async identifyDocumentationGaps(context) {
        return [];
    }
    async identifyTechnicalOpportunities(context) {
        const opportunities = [];
        opportunities.push({
            id: this.generateId('opp'),
            name: 'Automatización de Testing',
            description: 'Implementar pipeline de testing completamente automatizado',
            category: types_1.MissionCategory.TESTING,
            potentialValue: 85,
            implementationComplexity: 60,
            philosophyBenefit: 80,
            technicalBenefit: 90,
            teamGrowthPotential: 70,
            estimatedEffort: 16,
            dependencies: []
        });
        return opportunities;
    }
    async identifyGrowthOpportunities(context) {
        const opportunities = [];
        for (const member of context.teamMembers) {
            for (const growthArea of member.growthAreas) {
                opportunities.push({
                    id: this.generateId('growth'),
                    name: `Desarrollo en ${growthArea}`,
                    description: `Oportunidad de crecimiento para ${member.name} en ${growthArea}`,
                    category: types_1.MissionCategory.FEATURE,
                    potentialValue: 70,
                    implementationComplexity: 40,
                    philosophyBenefit: 90,
                    technicalBenefit: 60,
                    teamGrowthPotential: 95,
                    estimatedEffort: 8,
                    dependencies: []
                });
            }
        }
        return opportunities;
    }
    async identifyPhilosophyOpportunities(context) {
        const opportunities = [];
        if (context.harmony.philosophy.bienComunAlignment < 90) {
            opportunities.push({
                id: this.generateId('philosophy'),
                name: 'Integración Filosófica Profunda',
                description: 'Integrar principios CoomÜnity más profundamente en el código y procesos',
                category: types_1.MissionCategory.PHILOSOPHY,
                potentialValue: 95,
                implementationComplexity: 30,
                philosophyBenefit: 100,
                technicalBenefit: 70,
                teamGrowthPotential: 85,
                estimatedEffort: 12,
                dependencies: []
            });
        }
        return opportunities;
    }
    async identifyPredictionOpportunities(context) {
        const opportunities = [];
        for (const prediction of context.predictions) {
            if (prediction.confidence > 75) {
                opportunities.push({
                    id: this.generateId('pred-opp'),
                    name: `Preparación: ${prediction.name}`,
                    description: `Prepararse proactivamente para ${prediction.description}`,
                    category: this.patternCategoryToMissionCategory(prediction.category),
                    potentialValue: prediction.confidence,
                    implementationComplexity: 50,
                    philosophyBenefit: prediction.philosophyAlignment,
                    technicalBenefit: 80,
                    teamGrowthPotential: 60,
                    estimatedEffort: 6,
                    dependencies: []
                });
            }
        }
        return opportunities;
    }
    severityToPriority(severity) {
        switch (severity) {
            case 'critical': return types_1.MissionPriority.CRITICAL;
            case 'high': return types_1.MissionPriority.HIGH;
            case 'medium': return types_1.MissionPriority.MEDIUM;
            default: return types_1.MissionPriority.LOW;
        }
    }
    valueToPriority(value) {
        if (value >= 90)
            return types_1.MissionPriority.CRITICAL;
        if (value >= 75)
            return types_1.MissionPriority.HIGH;
        if (value >= 50)
            return types_1.MissionPriority.MEDIUM;
        return types_1.MissionPriority.LOW;
    }
    impactToPriority(impact) {
        switch (impact) {
            case types_1.ImpactLevel.CRITICAL: return types_1.MissionPriority.CRITICAL;
            case types_1.ImpactLevel.HIGH: return types_1.MissionPriority.HIGH;
            case types_1.ImpactLevel.MEDIUM: return types_1.MissionPriority.MEDIUM;
            default: return types_1.MissionPriority.LOW;
        }
    }
    areaToCategory(area) {
        const areaLower = area.toLowerCase();
        if (areaLower.includes('test'))
            return types_1.MissionCategory.TESTING;
        if (areaLower.includes('doc'))
            return types_1.MissionCategory.DOCUMENTATION;
        if (areaLower.includes('arch'))
            return types_1.MissionCategory.ARCHITECTURE;
        if (areaLower.includes('phil'))
            return types_1.MissionCategory.PHILOSOPHY;
        return types_1.MissionCategory.FEATURE;
    }
    patternCategoryToMissionCategory(category) {
        return types_1.MissionCategory.FEATURE;
    }
    estimateEffortFromSeverity(severity) {
        switch (severity) {
            case 'critical': return 24;
            case 'high': return 16;
            case 'medium': return 8;
            default: return 4;
        }
    }
    estimateEffortFromConfidence(confidence) {
        return Math.max(2, Math.round(confidence / 10));
    }
    getPriorityWeight(priority) {
        switch (priority) {
            case types_1.MissionPriority.CRITICAL: return 100;
            case types_1.MissionPriority.URGENT: return 80;
            case types_1.MissionPriority.HIGH: return 60;
            case types_1.MissionPriority.MEDIUM: return 40;
            default: return 20;
        }
    }
    extractPhilosophyScore(benefit) {
        if (benefit.includes('100'))
            return 100;
        if (benefit.includes('95'))
            return 95;
        if (benefit.includes('90'))
            return 90;
        if (benefit.includes('85'))
            return 85;
        return 75;
    }
    calculateHarmonyImpact(mission, harmony) {
        let impact = 50;
        if (mission.category === types_1.MissionCategory.PHILOSOPHY)
            impact += 30;
        if (mission.tags?.includes('collaboration'))
            impact += 20;
        if (mission.tags?.includes('growth'))
            impact += 15;
        return Math.min(100, impact);
    }
    calculateUrgency(mission, context) {
        let urgency = 50;
        urgency += this.getPriorityWeight(mission.priority) * 0.3;
        if (mission.dueDate) {
            const daysToDeadline = (mission.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            if (daysToDeadline < 7)
                urgency += 30;
            else if (daysToDeadline < 14)
                urgency += 15;
        }
        return Math.min(100, urgency);
    }
    calculateSkillsMatch(mission, member) {
        const requiredSkills = this.extractRequiredSkills(mission);
        const matchingSkills = member.skills.filter(skill => requiredSkills.some(required => required.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(required.toLowerCase())));
        return requiredSkills.length > 0
            ? (matchingSkills.length / requiredSkills.length) * 100
            : 50;
    }
    extractRequiredSkills(mission) {
        const skills = [];
        const text = `${mission.title} ${mission.description} ${mission.category}`.toLowerCase();
        const technicalSkills = ['typescript', 'react', 'node', 'testing', 'api', 'database', 'ui', 'ux'];
        skills.push(...technicalSkills.filter(skill => text.includes(skill)));
        const processSkills = ['documentation', 'testing', 'architecture', 'refactoring'];
        skills.push(...processSkills.filter(skill => text.includes(skill)));
        return [...new Set(skills)];
    }
    calculateGrowthPotential(mission, member) {
        const missionSkills = this.extractRequiredSkills(mission);
        const growthOpportunities = missionSkills.filter(skill => !member.skills.includes(skill) && member.growthAreas.includes(skill));
        return missionSkills.length > 0
            ? (growthOpportunities.length / missionSkills.length) * 100
            : 0;
    }
    calculateAyniBalance(member) {
        return member.ayniContributions;
    }
    estimateWorkloadImpact(mission) {
        return Math.min(30, mission.estimatedEffort * 2);
    }
    updateAyniScore(member, mission) {
        if (mission.tags?.includes('collaboration') || mission.category === types_1.MissionCategory.PHILOSOPHY) {
            member.ayniContributions += 5;
        }
    }
    extractAssignedMember(mission) {
        const assignedTag = mission.tags?.find(tag => tag.startsWith('assigned-to:'));
        return assignedTag ? assignedTag.split(':')[1] : null;
    }
    calculateDueDate(mission, timeConstraints) {
        const dueDate = new Date();
        let days = mission.estimatedEffort / 8;
        switch (mission.priority) {
            case types_1.MissionPriority.CRITICAL:
                days *= 0.5;
                break;
            case types_1.MissionPriority.HIGH:
                days *= 0.7;
                break;
            case types_1.MissionPriority.MEDIUM:
                days *= 1.0;
                break;
            default:
                days *= 1.5;
        }
        dueDate.setDate(dueDate.getDate() + Math.max(1, Math.ceil(days)));
        return dueDate;
    }
    isAssignmentValid(mission, context) {
        const assignedMember = this.extractAssignedMember(mission);
        if (!assignedMember)
            return false;
        const member = context.teamMembers.find(m => m.id === assignedMember);
        if (!member)
            return false;
        return member.currentWorkload <= 90;
    }
    generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    log(message) {
        if (this.config.debugMode) {
            console.log(`[MissionAssigner] ${message}`);
        }
    }
}
exports.MissionAssigner = MissionAssigner;
//# sourceMappingURL=MissionAssigner.js.map