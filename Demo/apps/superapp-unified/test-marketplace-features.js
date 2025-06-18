#!/usr/bin/env node

/**
 * 🧪 Script de Verificación del Marketplace Mejorado
 * Verifica que todas las nuevas funcionalidades funcionen correctamente
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tests = [
  {
    name: '🏪 Marketplace con Filtros Avanzados',
    url: 'http://localhost:2222/marketplace',
    expectedElements: [
      'Marketplace CoomÜnity', // Header
      'productos', // Contador de productos
      'Desarrollo Web Profesional', // Producto mock 1
      'Diseño UX/UI Premium', // Producto mock 2
      'Marketing Digital Estratégico', // Producto mock 3
      'Tecnología', // Categoría
      'Virtual/Online', // Tipo de entrega
      '4.8', // Rating
      'Lükas', // Moneda
    ],
    interactions: [
      'Botón de filtros (🎛️)',
      'Búsqueda expandible',
      'Chips de categoría',
      'Ratings con estrellas',
      'Botones de carrito',
      'Menu contextual'
    ]
  }
];

async function runTest(test) {
  console.log(`\n🧪 Probando: ${test.name}`);
  console.log(`📍 URL: ${test.url}`);
  
  try {
    const response = await fetch(test.url);
    const html = await response.text();
    
    console.log(`✅ Status: ${response.status}`);
    
    // Verificar elementos esperados
    const foundElements = test.expectedElements.filter(element => 
      html.includes(element)
    );
    
    console.log(`📋 Elementos encontrados: ${foundElements.length}/${test.expectedElements.length}`);
    foundElements.forEach(element => {
      console.log(`   ✓ ${element}`);
    });
    
    const missingElements = test.expectedElements.filter(element => 
      !html.includes(element)
    );
    
    if (missingElements.length > 0) {
      console.log(`❌ Elementos faltantes:`);
      missingElements.forEach(element => {
        console.log(`   ✗ ${element}`);
      });
    }
    
    // Verificar que sea una página React válida
    const hasReact = html.includes('react') || html.includes('vite') || html.includes('module');
    console.log(`⚛️  React/Vite detectado: ${hasReact ? '✅' : '❌'}`);
    
    // Mostrar interacciones esperadas
    console.log(`🎯 Interacciones a verificar manualmente:`);
    test.interactions.forEach(interaction => {
      console.log(`   • ${interaction}`);
    });
    
    return {
      name: test.name,
      success: response.status === 200 && foundElements.length === test.expectedElements.length,
      foundElements: foundElements.length,
      totalElements: test.expectedElements.length,
      missingElements
    };
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return {
      name: test.name,
      success: false,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando verificación del Marketplace Mejorado...\n');
  
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    
    // Esperar un poco entre tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE VERIFICACIÓN');
  console.log('=' .repeat(50));
  
  const successCount = results.filter(r => r.success).length;
  console.log(`✅ Tests exitosos: ${successCount}/${results.length}`);
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    if (result.foundElements !== undefined) {
      console.log(`   📋 Elementos: ${result.foundElements}/${result.totalElements}`);
    }
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    }
  });
  
  console.log('\n🎯 PRÓXIMOS PASOS RECOMENDADOS:');
  console.log('1. Abrir http://localhost:2222/marketplace en el navegador');
  console.log('2. Probar el botón de filtros avanzados (🎛️)');
  console.log('3. Verificar que la búsqueda funcione');
  console.log('4. Comprobar que los filtros se apliquen correctamente');
  console.log('5. Probar las opciones del menú contextual');
  console.log('6. Verificar que los productos muestren ratings y categorías');
  
  return results;
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests, tests }; 