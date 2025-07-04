/**
 * 🌟 TEST DE TIPOS CÓSMICOS
 * 
 * Script para verificar que todos los tipos se importan correctamente
 * y no hay problemas de exportación circular
 */

// Test de importaciones desde el archivo centralizado de tipos
import { 
  CosmicTask, 
  ThematicElement, 
  GuardianRole, 
  HambrELevel, 
  ColumnStatus 
} from '../types/cosmic.types';

// Test de importaciones desde el hook
import { useMiroSync } from '../hooks/useMiroSync';

// Test de importaciones desde servicios
import { cosmicMiroService, useMiroConfig } from '../services/cosmic-miro-service';

// 🌟 Función de verificación de tipos
export const verifyCosmicTypes = () => {
  console.log('🌟 Verificando tipos cósmicos...');
  
  // Test de enums
  console.log('✅ ThematicElement:', Object.values(ThematicElement));
  console.log('✅ GuardianRole:', Object.values(GuardianRole));
  console.log('✅ HambrELevel:', Object.values(HambrELevel));
  console.log('✅ ColumnStatus:', Object.values(ColumnStatus));
  
  // Test de creación de tarea
  const testTask: Omit<CosmicTask, 'id' | 'createdAt'> = {
    title: 'Test Task',
    description: 'Verificación de tipos',
    element: ThematicElement.ETHER,
    guardian: GuardianRole.KIRA,
    hambreLevel: HambrELevel.ACTIVATES_CONTRIBUTION,
    priority: 'Medium',
    phase: 1,
    estimatedHours: 2,
    philosophicalKpi: 'VIC',
    tags: ['test'],
    status: ColumnStatus.BACKLOG
  };
  
  console.log('✅ Test task created:', testTask);
  
  // Test de configuración Miro
  const miroConfig = useMiroConfig();
  console.log('✅ Miro config:', miroConfig);
  
  return {
    typesAvailable: true,
    hookAvailable: !!useMiroSync,
    serviceAvailable: !!cosmicMiroService,
    testTask
  };
};

// Exportar para usar en consola
if (typeof window !== 'undefined') {
  (window as any).verifyCosmicTypes = verifyCosmicTypes;
}

export default verifyCosmicTypes;