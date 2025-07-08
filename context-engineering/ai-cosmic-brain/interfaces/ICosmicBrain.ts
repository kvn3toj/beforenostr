/**
 * 🧠 ICosmicBrain - Interfaz principal del sistema de IA Cósmica
 *
 * Define las capacidades fundamentales del cerebro cósmico que maneja:
 * - Auto-evolución del sistema fractal
 * - Predicción de patrones emergentes
 * - Auto-asignación de misiones
 * - Análisis de armonía del equipo
 *
 * Filosofía CoomÜnity: Este sistema refleja la Metanöia (transformación de conciencia)
 * aplicada al desarrollo de software, creando un organismo digital que evoluciona
 * hacia el Bien Común.
 */

import { PatternPrediction, Mission, HarmonyMetrics, EvolutionReport } from '../types';

export interface ICosmicBrain {
  // 🔄 Auto-evolución del sistema
  /**
   * Analiza el estado actual del sistema y se auto-mejora
   * basado en métricas de éxito y patrones emergentes
   */
  selfImprove(): Promise<EvolutionReport>;

  /**
   * Evalúa la efectividad de las mejoras implementadas
   */
  evaluateEvolution(): Promise<EvolutionReport>;

  // 🔮 Predicción de patrones emergentes
  /**
   * Analiza el codebase y predice patrones que emergerán
   * basado en tendencias actuales y filosofía del proyecto
   */
  predictPatterns(): Promise<PatternPrediction[]>;

  /**
   * Valida predicciones anteriores contra la realidad actual
   */
  validatePredictions(): Promise<PatternPrediction[]>;

  // 🎯 Auto-asignación de misiones
  /**
   * Identifica gaps en el proyecto y asigna misiones automáticamente
   * priorizando según filosofía CoomÜnity y necesidades técnicas
   */
  assignMissions(): Promise<Mission[]>;

  /**
   * Monitorea el progreso de misiones activas
   */
  monitorMissions(): Promise<Mission[]>;

  // 📊 Análisis de armonía del equipo
  /**
   * Analiza la armonía del equipo basado en patrones de colaboración,
   * aplicación de principios Ayni y alineación con el Bien Común
   */
  analyzeTeamHarmony(): Promise<HarmonyMetrics>;

  /**
   * Sugiere mejoras para incrementar la armonía del equipo
   */
  suggestHarmonyImprovements(): Promise<string[]>;

  // 🌌 Estado del sistema cósmico
  /**
   * Obtiene el estado actual completo del sistema cósmico
   */
  getCosmicState(): Promise<CosmicState>;

  /**
   * Reinicia el sistema cósmico manteniendo aprendizajes críticos
   */
  resetCosmic(): Promise<void>;
}

export interface CosmicState {
  lastEvolution: Date;
  activePatterns: PatternPrediction[];
  activeMissions: Mission[];
  currentHarmony: HarmonyMetrics;
  systemHealth: number; // 0-100
  philosophyAlignment: number; // 0-100
}
