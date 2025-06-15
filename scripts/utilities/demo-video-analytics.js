const fetch = require('node-fetch');

async function createVideoEngagementEvent(eventData) {
  try {
    const response = await fetch('http://localhost:3002/analytics/video-engagement/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating video engagement event:', error.message);
    throw error;
  }
}

async function generateSampleAnalyticsData() {
  console.log('🎬 Generando datos de analytics de video de ejemplo...\n');

  // IDs de usuarios ficticios (ajusta según tu base de datos)
  const userIds = [
    '550e8400-e29b-41d4-a716-446655440000', // Usuario admin típico
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
  ];

  // Simular varios usuarios viendo el video 39 (que existe en la base de datos)
  const videoId = '39';
  const sessionBaseId = 'session-demo-';

  console.log(`📺 Generando eventos para video ID: ${videoId}\n`);

  // Usuario 1: Ve el video completo con buena engagement
  try {
    const session1 = sessionBaseId + '1';
    console.log('👤 Usuario 1: Visualización completa con alta engagement');
    
    // Video start
    await createVideoEngagementEvent({
      eventType: 'video_start',
      userId: userIds[0],
      videoItemId: videoId,
      sessionId: session1,
      videoTimestamp: 0,
      videoDuration: 300,
      metadata: { device: 'desktop', quality: '720p' }
    });

    // Pausa a mitad
    await createVideoEngagementEvent({
      eventType: 'video_pause',
      userId: userIds[0],
      videoItemId: videoId,
      sessionId: session1,
      videoTimestamp: 150,
      videoDuration: 300,
      metadata: { device: 'desktop', reason: 'user_initiated' }
    });

    // Resume
    await createVideoEngagementEvent({
      eventType: 'video_resume',
      userId: userIds[0],
      videoItemId: videoId,
      sessionId: session1,
      videoTimestamp: 150,
      videoDuration: 300,
      metadata: { device: 'desktop' }
    });

    // Question answered correctly
    await createVideoEngagementEvent({
      eventType: 'question_answered',
      userId: userIds[0],
      videoItemId: videoId,
      sessionId: session1,
      videoTimestamp: 180,
      videoDuration: 300,
      metadata: { 
        questionId: 'q1', 
        answerCorrect: true,
        responseTime: 5.2 
      }
    });

    // Video complete
    await createVideoEngagementEvent({
      eventType: 'video_complete',
      userId: userIds[0],
      videoItemId: videoId,
      sessionId: session1,
      videoTimestamp: 300,
      videoDuration: 300,
      totalWatchTime: 280, // Vio casi todo
      metadata: { device: 'desktop', engagement_high: true }
    });

    console.log('   ✅ Eventos del Usuario 1 creados\n');

    // Usuario 2: Ve parcialmente con menor engagement
    const session2 = sessionBaseId + '2';
    console.log('👤 Usuario 2: Visualización parcial con engagement medio');

    await createVideoEngagementEvent({
      eventType: 'video_start',
      userId: userIds[1],
      videoItemId: videoId,
      sessionId: session2,
      videoTimestamp: 0,
      videoDuration: 300,
      metadata: { device: 'mobile', quality: '480p' }
    });

    // Varios seeks (saltando)
    await createVideoEngagementEvent({
      eventType: 'video_seek',
      userId: userIds[1],
      videoItemId: videoId,
      sessionId: session2,
      videoTimestamp: 45,
      videoDuration: 300,
      metadata: { 
        device: 'mobile', 
        previousTimestamp: 30, 
        newTimestamp: 90 
      }
    });

    await createVideoEngagementEvent({
      eventType: 'video_seek',
      userId: userIds[1],
      videoItemId: videoId,
      sessionId: session2,
      videoTimestamp: 120,
      videoDuration: 300,
      metadata: { 
        device: 'mobile', 
        previousTimestamp: 90, 
        newTimestamp: 180 
      }
    });

    // Question answered incorrectly
    await createVideoEngagementEvent({
      eventType: 'question_answered',
      userId: userIds[1],
      videoItemId: videoId,
      sessionId: session2,
      videoTimestamp: 200,
      videoDuration: 300,
      metadata: { 
        questionId: 'q2', 
        answerCorrect: false,
        responseTime: 12.8 
      }
    });

    // Abandona el video
    await createVideoEngagementEvent({
      eventType: 'video_abandon',
      userId: userIds[1],
      videoItemId: videoId,
      sessionId: session2,
      videoTimestamp: 220,
      videoDuration: 300,
      totalWatchTime: 150, // Vio la mitad
      metadata: { device: 'mobile', abandon_reason: 'user_exit' }
    });

    console.log('   ✅ Eventos del Usuario 2 creados\n');

    // Usuario 3: Abandono temprano
    const session3 = sessionBaseId + '3';
    console.log('👤 Usuario 3: Abandono temprano');

    await createVideoEngagementEvent({
      eventType: 'video_start',
      userId: userIds[2],
      videoItemId: videoId,
      sessionId: session3,
      videoTimestamp: 0,
      videoDuration: 300,
      metadata: { device: 'tablet', quality: '720p' }
    });

    // Abandono rápido
    await createVideoEngagementEvent({
      eventType: 'video_abandon',
      userId: userIds[2],
      videoItemId: videoId,
      sessionId: session3,
      videoTimestamp: 30,
      videoDuration: 300,
      totalWatchTime: 25,
      metadata: { device: 'tablet', abandon_reason: 'not_interested' }
    });

    console.log('   ✅ Eventos del Usuario 3 creados\n');

    console.log('🎉 ¡Datos de analytics de video generados exitosamente!');
    console.log('\n📊 Ahora puedes probar los nuevos endpoints:');
    console.log(`   • GET /analytics/video-engagement/metrics/${videoId}`);
    console.log('   • GET /analytics/video-engagement/report?startDate=2025-05-01&endDate=2025-06-01');
    console.log('   • GET /analytics/duration-discrepancies/stats');

  } catch (error) {
    console.error('❌ Error generando datos:', error.message);
  }
}

// Ejecutar la demo si se llama directamente
if (require.main === module) {
  generateSampleAnalyticsData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { generateSampleAnalyticsData }; 