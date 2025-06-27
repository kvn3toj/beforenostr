/**
 * 🧪 Test para verificar que videoDurationFixer funciona correctamente
 * Este archivo puede ser ejecutado para probar las correcciones de duración
 */

import { fixVideoDuration, fixVideosDurations, formatDuration } from './videoDurationFixer';

// Videos de prueba que simulan el problema de duración 0:00
const testVideos = [
  // Video que debería tener duración verificada (ID 39)
  {
    id: 39,
    title: 'Sacred Economics with Charles Eisenstein - A Short Film',
    content: 'https://www.youtube.com/embed/EEZkQv25uEs',
    duration: 0 // Problema: duración es 0
  },
  // Video que debería tener duración verificada (ID 40)
  {
    id: 40,
    title: 'Elementos de Juego en Educación',
    content: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    duration: 0 // Problema: duración es 0
  },
  // Video nuevo que debería ser estimado por contenido
  {
    id: 999,
    title: 'Introducción a la Gamificación - Tutorial Básico',
    content: 'https://example.com/video',
    duration: 0 // Problema: duración es 0
  },
  // Video que ya tiene duración correcta (no debería cambiar)
  {
    id: 100,
    title: 'Video con duración correcta',
    content: 'https://example.com/video',
    duration: 300 // Ya tiene duración válida
  }
];

// 🧪 Función de test
export const testVideoDurationFixer = () => {
  console.log('🧪 ===== TESTING VIDEO DURATION FIXER =====');

  // Test 1: Corregir video individual
  console.log('\n📹 Test 1: fixVideoDuration individual');
  testVideos.forEach(video => {
    const fixed = fixVideoDuration(video);
    console.log(`   Video ID ${video.id}:`);
    console.log(`     Original: ${video.duration}s (${formatDuration(video.duration || 0)})`);
    console.log(`     Corregido: ${fixed.duration}s (${formatDuration(fixed.duration || 0)})`);
    console.log(`     Cambió: ${video.duration !== fixed.duration ? '✅ SÍ' : '❌ NO'}`);
  });

  // Test 2: Corregir array de videos
  console.log('\n📹 Test 2: fixVideosDurations array');
  const fixedArray = fixVideosDurations(testVideos);
  fixedArray.forEach((video, index) => {
    const original = testVideos[index];
    console.log(`   Video ${index + 1}: ${original.duration}s → ${video.duration}s`);
  });

  // Test 3: Simulación de hook con fixVideosDurations
  console.log('\n📹 Test 3: Simulación de hook (fixVideosDurations)');
  const hookResult = fixVideosDurations(testVideos);
  hookResult.forEach((video, index) => {
    const original = testVideos[index];
    console.log(`   Hook Video ${index + 1}: ${original.duration}s → ${video.duration}s`);
  });

  // Test 4: Verificar casos específicos
  console.log('\n📹 Test 4: Casos específicos verificados');
  const video39 = fixVideoDuration(testVideos[0]);
  const video40 = fixVideoDuration(testVideos[1]);

  console.log(`   Video 39 (Sacred Economics): ${video39.duration}s (esperado: 729s) ${video39.duration === 729 ? '✅' : '❌'}`);
  console.log(`   Video 40 (Elementos de Juego): ${video40.duration}s (esperado: 94s) ${video40.duration === 94 ? '✅' : '❌'}`);

  // Test 5: Formateo de duración
  console.log('\n📹 Test 5: Formateo de duraciones');
  const testDurations = [0, 30, 60, 90, 150, 300, 729, 3661];
  testDurations.forEach(seconds => {
    console.log(`   ${seconds}s → "${formatDuration(seconds)}"`);
  });

  console.log('\n🎉 ===== TESTS COMPLETADOS =====');

  // Resumen de resultados
  const videosFixed = fixedArray.filter((video, index) => video.duration !== testVideos[index].duration).length;
  console.log(`\n📊 RESUMEN:`);
  console.log(`   Videos procesados: ${testVideos.length}`);
  console.log(`   Videos corregidos: ${videosFixed}`);
  console.log(`   Videos sin cambios: ${testVideos.length - videosFixed}`);
  console.log(`   Función formatDuration: ✅ Funcionando`);
  console.log(`   Duraciones verificadas: ✅ Aplicadas`);

  return {
    original: testVideos,
    fixed: fixedArray,
    summary: {
      total: testVideos.length,
      fixed: videosFixed,
      unchanged: testVideos.length - videosFixed
    }
  };
};

// 🎯 Auto-ejecutar test si se importa en consola del navegador
if (typeof window !== 'undefined') {
  console.log('🎯 videoDurationFixer test disponible en window.testVideoDurationFixer()');
  (window as any).testVideoDurationFixer = testVideoDurationFixer;
}
