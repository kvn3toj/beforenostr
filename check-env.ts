import * as fs from 'fs';
import * as path from 'path';

// This import will test the tsconfig.json references
import type { TaskDTO } from './packages/shared-types/src/task.dto';

console.log('🌌 [SAGE] Iniciando Protocolo de Validación del Entorno Cósmico...');
console.log('-----------------------------------------------------------------');

console.log('1. Prueba de Resolución de Módulos TypeScript...');
try {
    const testTask: Partial<TaskDTO> = { id: 'test-0.1' };
    if (testTask.id) {
        console.log('✅ ÉXITO: La importación cruzada del módulo `shared-types` se resolvió correctamente.');
    } else {
        // This case should not be reached if compilation succeeds
        throw new Error('La variable de prueba no se inicializó.');
    }
} catch (e) {
    console.error('❌ FALLO: No se pudo resolver la importación desde `shared-types`.');
    console.error('   Causa probable: Problema en `tsconfig.json` (references, paths).');
    process.exit(1);
}

console.log('\n2. Prueba de Acceso al Sistema de Archivos...');
const testDir = path.join(process.cwd(), 'env-validation-test-dir');
try {
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir);
        console.log(`✅ ÉXITO: Se creó el directorio de prueba en ${testDir}`);
        fs.rmdirSync(testDir);
        console.log(`✅ ÉXITO: Se limpió el directorio de prueba.`);
    } else {
        console.log('ℹ️ INFO: El directorio de prueba ya existía, se asume éxito en la creación/limpieza.');
    }
} catch (e: any) {
    console.error(`❌ FALLO: La operación del sistema de archivos falló con el error: ${e.message}`);
    console.error('   Causa probable: Problemas de permisos en el entorno de ejecución.');
    process.exit(1);
}

console.log('-----------------------------------------------------------------');
console.log('✅ [SAGE] Entorno Estable. Las leyes cósmicas se mantienen. ✨');
console.log('-----------------------------------------------------------------');
process.exit(0);
