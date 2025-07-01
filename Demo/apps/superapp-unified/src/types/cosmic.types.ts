/**
 * 🌟 TIPOS CÓSMICOS CENTRALIZADOS
 *
 * Definiciones de enums y tipos básicos para evitar importaciones circulares
 * Fuente única de verdad para todos los tipos cósmicos del proyecto
 *
 * Creado por: KIRA, The Word Weaver
 * Supervisado por: ANA, CIO Cósmica
 */

// 🌟 Elementos Temáticos Cósmicos
export enum ThematicElement {
  FIRE = 'Fuego',
  WATER = 'Agua',
  AIR = 'Aire',
  EARTH = 'Tierra',
  ETHER = 'Éter'
}

// 🌟 Roles de Guardianes Digitales
export enum GuardianRole {
  ANA = 'ANA',
  LUNA = 'LUNA',
  ARIA = 'ARIA',
  PHOENIX = 'PHOENIX',
  KIRA = 'KIRA',
  SAGE = 'SAGE',
  NIRA = 'NIRA',
  COSMOS = 'COSMOS',
  MAYA = 'MAYA',
  ZARA = 'ZARA',
  THOR = 'THOR',
  NOVA = 'NOVA'
}

// 🌟 Niveles de HambrE (Hunger for Action, Motivation, Responsibility, Excellence)
export enum HambrELevel {
  NURTURES_CURIOSITY = 1,
  ACTIVATES_CONTRIBUTION = 2,
  IMPULSES_TRANSFORMATION = 3
}

// 🌟 Estados de Columnas del Kanban Cósmico
export enum ColumnStatus {
  BACKLOG = 'Backlog Cósmico',
  ALCHEMICAL = 'En Proceso de Alquimia',
  QUALITY = 'En Revisión de Calidad',
  MANIFESTED = 'Manifestado'
}

// 🌟 Interfaz principal para tareas cósmicas
export interface CosmicTask {
  id?: string;
  title: string;
  description: string;
  element: ThematicElement;
  guardian: GuardianRole;
  hambreLevel: HambrELevel;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  phase: 1 | 2 | 3;
  estimatedHours: number;
  philosophicalKpi: 'IER' | 'VIC' | 'GS';
  tags: string[];
  status: ColumnStatus;
  createdAt: Date;
}

// 🌟 Configuraciones temáticas para elementos
export interface ElementConfig {
  color: string;
  guardian: GuardianRole;
  module: string;
}

// 🌟 Configuraciones de HambrE
export interface HambrEConfig {
  emoji: string;
  description: string;
  color: string;
}

// 🌟 Type guards para validación en runtime
export const isValidThematicElement = (value: any): value is ThematicElement => {
  return Object.values(ThematicElement).includes(value);
};

export const isValidGuardianRole = (value: any): value is GuardianRole => {
  return Object.values(GuardianRole).includes(value);
};

export const isValidHambrELevel = (value: any): value is HambrELevel => {
  return [1, 2, 3].includes(value);
};

export const isValidColumnStatus = (value: any): value is ColumnStatus => {
  return Object.values(ColumnStatus).includes(value);
};
