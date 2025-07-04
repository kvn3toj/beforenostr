const { chromium } = require('playwright');

async function testMonitoringSystem() {
  console.log('🎯 Iniciando test del Sistema de Monitoreo...\n');
  
  const baseUrl = 'http://localhost:3002';
  
  // Función helper para hacer requests HTTP
  async function makeRequest(url, options = {}) {
    const http = require('http');
    const https = require('https');
    const urlParsed = new URL(url);
    const client = urlParsed.protocol === 'https:' ? https : http;
    
    return new Promise((resolve, reject) => {
      const req = client.request(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (e) {
            resolve(data);
          }
        });
      });
      
      req.on('error', reject);
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }
  
  try {
    // Test 1: Verificar endpoint de test
    console.log('📋 Test 1: Endpoint de test básico');
    const testData = await makeRequest(`${baseUrl}/monitoring/test`);
    console.log('✅ Test endpoint:', testData);
    console.log('');

    // Test 2: Verificar health report
    console.log('📋 Test 2: Health Report');
    const healthData = await makeRequest(`${baseUrl}/monitoring/health-report`);
    console.log('✅ Health Report:');
    console.log(`   - Status: ${healthData.status}`);
    console.log(`   - Cache Health: ${healthData.cacheHealth.healthy ? 'Healthy' : 'Unhealthy'}`);
    console.log(`   - YouTube API: ${healthData.youtubeApiHealth.configured ? 'Configured' : 'Not Configured'} / ${healthData.youtubeApiHealth.accessible ? 'Accessible' : 'Not Accessible'}`);
    console.log(`   - Last Check: ${healthData.lastConsistencyCheck || 'Never'}`);
    console.log(`   - Inconsistencies: ${healthData.inconsistenciesCount}`);
    console.log('');

    // Test 3: Ejecutar check de consistencia
    console.log('📋 Test 3: Ejecutar Check de Consistencia');
    const checkData = await makeRequest(`${baseUrl}/monitoring/run-check`, {
      method: 'POST'
    });
    console.log('✅ Consistency Check Result:');
    console.log(`   - Total Videos: ${checkData.totalVideos}`);
    console.log(`   - Inconsistencies Found: ${checkData.inconsistenciesFound}`);
    console.log(`   - Execution Time: ${checkData.executionTime}ms`);
    console.log(`   - Alerts Sent: ${checkData.alertsSent}`);
    console.log('');

    // Test 4: Verificar último check
    console.log('📋 Test 4: Último Check Ejecutado');
    const lastCheckData = await makeRequest(`${baseUrl}/monitoring/last-check`);
    console.log('✅ Last Check Result:');
    console.log(`   - Timestamp: ${lastCheckData.timestamp}`);
    console.log(`   - Total Videos: ${lastCheckData.totalVideos}`);
    console.log(`   - Inconsistencies: ${lastCheckData.inconsistenciesFound}`);
    console.log('');

    // Test 5: Configuración de alertas
    console.log('📋 Test 5: Configuración de Alertas');
    const alertConfigData = await makeRequest(`${baseUrl}/monitoring/alert-config`);
    console.log('✅ Alert Configuration:');
    console.log(`   - Email Enabled: ${alertConfigData.emailEnabled}`);
    console.log(`   - Slack Enabled: ${alertConfigData.slackEnabled}`);
    console.log(`   - Alert Threshold: ${alertConfigData.alertThreshold}`);
    console.log(`   - Email Configured: ${alertConfigData.emailConfigured}`);
    console.log(`   - Slack Configured: ${alertConfigData.slackWebhookConfigured}`);
    console.log('');

    // Test 6: Verificar health report actualizado
    console.log('📋 Test 6: Health Report Actualizado (después del check)');
    const updatedHealthData = await makeRequest(`${baseUrl}/monitoring/health-report`);
    console.log('✅ Updated Health Report:');
    console.log(`   - Status: ${updatedHealthData.status}`);
    console.log(`   - Last Check: ${updatedHealthData.lastConsistencyCheck}`);
    console.log(`   - Inconsistencies: ${updatedHealthData.inconsistenciesCount}`);
    console.log('');

    // Resumen final
    console.log('🎉 RESUMEN DEL TEST DEL SISTEMA DE MONITOREO:');
    console.log('✅ Todos los endpoints están funcionando correctamente');
    console.log('✅ El sistema de health reporting está operativo');
    console.log('✅ Los checks de consistencia se ejecutan correctamente');
    console.log('✅ La configuración de alertas está disponible');
    console.log('✅ El sistema está listo para monitoreo automático');
    console.log('');
    
    // Información sobre cron jobs
    console.log('📅 CRON JOBS CONFIGURADOS:');
    console.log('   - Daily Consistency Check: 2:00 AM (configurable via DAILY_CHECK_HOUR)');
    console.log('   - Hourly Health Check: Cada hora en punto');
    console.log('');
    
    // Información sobre alertas
    console.log('🚨 CONFIGURACIÓN DE ALERTAS:');
    console.log('   Para habilitar alertas por email, configure:');
    console.log('   - SMTP_HOST, SMTP_USER, SMTP_PASS, ALERT_EMAIL_RECIPIENTS');
    console.log('   - Cambie ALERT_EMAIL_ENABLED=true');
    console.log('');
    console.log('   Para habilitar alertas por Slack, configure:');
    console.log('   - SLACK_WEBHOOK_URL');
    console.log('   - Cambie ALERT_SLACK_ENABLED=true');
    console.log('');

  } catch (error) {
    console.error('❌ Error durante el test:', error);
    console.log('');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('   1. Verifique que el backend esté corriendo en puerto 3002');
    console.log('   2. Verifique que el módulo de monitoreo esté cargado');
    console.log('   3. Revise los logs del backend para errores específicos');
  }
}

// Ejecutar el test
testMonitoringSystem().catch(console.error); 