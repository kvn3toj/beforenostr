/**
 * 🌌 DESIGN SYSTEM TEMPLATES - INDEX
 * =================================
 * 
 * Templates revolucionarios extraídos del Dashboard HOME
 * para uso escalable en toda la SuperApp CoomÜnity
 * 
 * Fase 2, Semana 1 - Plan Maestro Material UI
 */

// 🌟 TEMPLATE WIDGET REVOLUCIONARIO PRINCIPAL - Using import/export pattern to avoid binding conflicts
import RevolutionaryWidget, {
  RevolutionaryWidgetPrimary,
  RevolutionaryWidgetSecondary,
  RevolutionaryWidgetAccent,
  RevolutionaryWidgetElevated,
  RevolutionaryWidgetFuego,
  RevolutionaryWidgetAgua,
  RevolutionaryWidgetTierra,
  RevolutionaryWidgetAire,
  RevolutionaryWidgetEspiritu
} from './RevolutionaryWidget';

export { 
  RevolutionaryWidget,
  RevolutionaryWidgetPrimary,
  RevolutionaryWidgetSecondary,
  RevolutionaryWidgetAccent,
  RevolutionaryWidgetElevated,
  RevolutionaryWidgetFuego,
  RevolutionaryWidgetAgua,
  RevolutionaryWidgetTierra,
  RevolutionaryWidgetAire,
  RevolutionaryWidgetEspiritu
};

// 🔥 VARIANTES ELEMENTALES - Already exported above to avoid duplication

// 🌈 RE-EXPORTS DE TIPOS
export type {
  RevolutionaryWidgetProps,
  RevolutionaryTemplateProps
} from '../types'; 