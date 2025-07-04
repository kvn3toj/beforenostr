/**
 * 🔄 ARCHIVO DE COMPATIBILIDAD PARA colorSystem LEGACY
 * ====================================================
 * Este archivo proporciona una interfaz compatible con el antiguo sistema colorSystem
 * que algunos componentes podrían estar intentando importar.
 */

import { COLOR_PALETTES, ACTIVE_PALETTE } from './color-system';

// Crear un objeto colorSystem compatible con la estructura legacy
const activePalette = COLOR_PALETTES[ACTIVE_PALETTE];

export const colorSystem = {
  primary: activePalette.primary['500'],
  secondary: activePalette.secondary['500'],
  accent: activePalette.primary['600'],
  mystic: activePalette.primary['400'],
  ether: activePalette.primary['300'],
  bgPrimary: activePalette.background.default,
  neutral: activePalette.semantic.info.main
};

// También exportar como default para diferentes tipos de importación
export default colorSystem;

// Re-exportar funciones útiles del sistema principal
export * from './color-system';
