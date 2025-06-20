console.log('🎨 VERIFICACIÓN SISTEMA DE COLORES');
import('./src/design-system/color-system.ts').then(module => {
  console.log('Paleta activa:', module.ACTIVE_PALETTE);
  console.log('Color primario:', module.COLOR_PALETTES[module.ACTIVE_PALETTE].primary[500]);
});
