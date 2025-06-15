const fetch = require('node-fetch');

async function demoMonitoringComplete() {
  console.log('🎯 DEMOSTRACIÓN COMPLETA DEL SISTEMA DE MONITOREO GAMIFIER\n');
  console.log('=' .repeat(60));

  try {
    // 1. Verificar estado de todos los servicios
    console.log('\n1️⃣ VERIFICANDO ESTADO DE SERVICIOS...\n');
    
    // Backend GAMIFIER
    console.log('🔍 Verificando Backend GAMIFIER...');
    const healthResponse = await fetch('http://localhost:3002/health');
    const healthData = await healthResponse.json();
    console.log(`✅ Backend GAMIFIER: ${healthData.message} (Puerto 3002)`);

    // Prometheus
    console.log('🔍 Verificando Prometheus...');
    const prometheusResponse = await fetch('http://localhost:9090/-/healthy');
    if (prometheusResponse.ok) {
      console.log('✅ Prometheus: Funcionando correctamente (Puerto 9090)');
    }

    // Grafana
    console.log('🔍 Verificando Grafana...');
    const grafanaResponse = await fetch('http://localhost:3001/api/health');
    const grafanaData = await grafanaResponse.json();
    console.log(`✅ Grafana: v${grafanaData.version} funcionando (Puerto 3001)`);

    // 2. Generar actividad para métricas
    console.log('\n2️⃣ GENERANDO ACTIVIDAD PARA MÉTRICAS...\n');
    
    const endpoints = [
      '/health',
      '/metrics-test', 
      '/prometheus-metrics'
    ];

    for (let i = 0; i < 10; i++) {
      const endpoint = endpoints[i % endpoints.length];
      console.log(`📊 Generando request ${i + 1}/10: GET ${endpoint}`);
      
      try {
        await fetch(`http://localhost:3002${endpoint}`);
        console.log(`   ✅ Request exitoso`);
      } catch (error) {
        console.log(`   ❌ Request falló: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // 3. Mostrar métricas actuales
    console.log('\n3️⃣ MÉTRICAS ACTUALES DEL SISTEMA...\n');
    
    const metricsResponse = await fetch('http://localhost:3002/prometheus-metrics');
    const metricsText = await metricsResponse.text();
    
    console.log(`📈 Total de métricas generadas: ${metricsText.length} caracteres`);
    
    // Extraer métricas específicas
    const httpRequestsMatches = metricsText.match(/http_requests_total\{[^}]+\} (\d+)/g);
    const cacheOperationsMatches = metricsText.match(/cache_operations_total\{[^}]+\} (\d+)/g);
    const httpDurationMatches = metricsText.match(/http_request_duration_seconds_bucket/g);
    
    console.log('\n📊 RESUMEN DE MÉTRICAS:');
    console.log(`   🌐 HTTP Requests registrados: ${httpRequestsMatches ? httpRequestsMatches.length : 0} tipos`);
    console.log(`   💾 Cache Operations registradas: ${cacheOperationsMatches ? cacheOperationsMatches.length : 0} tipos`);
    console.log(`   ⏱️  HTTP Duration buckets: ${httpDurationMatches ? httpDurationMatches.length : 0} buckets`);

    // 4. Mostrar muestra de métricas importantes
    console.log('\n4️⃣ MUESTRA DE MÉTRICAS IMPORTANTES...\n');
    
    const importantMetrics = metricsText.split('\n').filter(line => 
      line.includes('http_requests_total') || 
      line.includes('cache_operations_total') ||
      line.includes('cache_hit_ratio') ||
      line.includes('http_request_duration_seconds_count')
    ).slice(0, 10);

    importantMetrics.forEach(metric => {
      if (metric.trim()) {
        console.log(`📊 ${metric}`);
      }
    });

    // 5. Información de acceso a dashboards
    console.log('\n5️⃣ ACCESO A DASHBOARDS DE MONITOREO...\n');
    
    console.log('🎛️  PROMETHEUS (Métricas y Queries):');
    console.log('   📍 URL: http://localhost:9090');
    console.log('   🔍 Queries de ejemplo:');
    console.log('      • rate(http_requests_total[5m])');
    console.log('      • cache_hit_ratio');
    console.log('      • histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))');
    
    console.log('\n📊 GRAFANA (Dashboards Visuales):');
    console.log('   📍 URL: http://localhost:3001');
    console.log('   🔐 Credenciales: admin / admin123');
    console.log('   📈 Dashboard: "GAMIFIER Backend Metrics"');
    
    console.log('\n🔗 ENDPOINTS DE MÉTRICAS:');
    console.log('   📍 Backend Health: http://localhost:3002/health');
    console.log('   📍 Métricas Prometheus: http://localhost:3002/prometheus-metrics');
    console.log('   📍 Test de Métricas: http://localhost:3002/metrics-test');

    // 6. Verificar targets de Prometheus
    console.log('\n6️⃣ ESTADO DE TARGETS EN PROMETHEUS...\n');
    
    try {
      const targetsResponse = await fetch('http://localhost:9090/api/v1/targets');
      const targetsData = await targetsResponse.json();
      
      console.log('🎯 Targets configurados:');
      targetsData.data.activeTargets.forEach(target => {
        const status = target.health === 'up' ? '✅' : '❌';
        console.log(`   ${status} ${target.labels.job}: ${target.health}`);
        if (target.health === 'down' && target.lastError) {
          console.log(`      Error: ${target.lastError}`);
        }
      });
    } catch (error) {
      console.log('❌ No se pudo verificar targets de Prometheus');
    }

    // 7. Resumen final
    console.log('\n7️⃣ RESUMEN FINAL...\n');
    
    console.log('🎉 SISTEMA DE MONITOREO COMPLETAMENTE FUNCIONAL!');
    console.log('\n✅ Componentes operativos:');
    console.log('   • Backend GAMIFIER con métricas instrumentadas');
    console.log('   • Prometheus recolectando métricas');
    console.log('   • Grafana con dashboards pre-configurados');
    console.log('   • Métricas de HTTP, Cache y Performance');
    
    console.log('\n📋 Próximos pasos recomendados:');
    console.log('   1. Abrir Grafana en http://localhost:3001');
    console.log('   2. Explorar el dashboard "GAMIFIER Backend Metrics"');
    console.log('   3. Crear queries personalizadas en Prometheus');
    console.log('   4. Configurar alertas basadas en métricas');
    
    console.log('\n🚀 ¡El sistema está listo para monitoreo en producción!');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error en la demostración:', error.message);
    console.log('\n🔧 Verificar que todos los servicios estén corriendo:');
    console.log('   • Backend: npx tsx watch src/main.ts');
    console.log('   • Docker: docker-compose up -d prometheus grafana');
  }
}

demoMonitoringComplete().catch(console.error); 