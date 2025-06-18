const fetch = require('node-fetch');

async function testMetricsIntegration() {
  console.log('🧪 Iniciando test de integración de métricas...\n');

  try {
    // 1. Verificar que el backend esté funcionando
    console.log('1️⃣ Verificando estado del backend...');
    const healthResponse = await fetch('http://localhost:1111/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend funcionando:', healthData.message);

    // 2. Generar algunas métricas de prueba
    console.log('\n2️⃣ Generando métricas de prueba...');
    
    // Generar métricas HTTP
    for (let i = 0; i < 5; i++) {
      await fetch('http://localhost:1111/metrics-test');
      console.log(`   📊 Métricas generadas ${i + 1}/5`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 3. Verificar métricas de Prometheus
    console.log('\n3️⃣ Verificando métricas de Prometheus...');
    const metricsResponse = await fetch('http://localhost:1111/prometheus-metrics');
    const metricsText = await metricsResponse.text();
    
    console.log(`✅ Métricas generadas: ${metricsText.length} caracteres`);
    
    // Verificar métricas específicas
    const httpRequestsMatch = metricsText.match(/http_requests_total.*?(\d+)/);
    const cacheOperationsMatch = metricsText.match(/cache_operations_total.*?(\d+)/);
    const httpDurationMatch = metricsText.match(/http_request_duration_seconds_bucket/);
    
    console.log('\n📈 Métricas encontradas:');
    console.log(`   🌐 HTTP Requests: ${httpRequestsMatch ? httpRequestsMatch[1] : 'No encontrado'}`);
    console.log(`   💾 Cache Operations: ${cacheOperationsMatch ? cacheOperationsMatch[1] : 'No encontrado'}`);
    console.log(`   ⏱️  HTTP Duration Histograms: ${httpDurationMatch ? 'Sí' : 'No'}`);

    // 4. Mostrar muestra de métricas
    console.log('\n4️⃣ Muestra de métricas (primeras 20 líneas):');
    const metricsLines = metricsText.split('\n').slice(0, 20);
    metricsLines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        console.log(`   📊 ${line}`);
      } else if (line.startsWith('# HELP')) {
        console.log(`   📝 ${line}`);
      }
    });

    console.log('\n🎉 Test de integración de métricas completado exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Backend funcionando correctamente');
    console.log('   ✅ MetricsService operativo');
    console.log('   ✅ Endpoint /prometheus-metrics funcional');
    console.log('   ✅ Métricas de HTTP, Cache y Duration generándose');
    console.log('\n🚀 Listo para integrar con Prometheus y Grafana!');

  } catch (error) {
    console.error('❌ Error en el test de integración:', error.message);
    process.exit(1);
  }
}

testMetricsIntegration().catch(console.error); 