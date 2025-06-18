async function testAIGenerator() {
  try {
    console.log('🤖 Testing AI Question Generator...');

    // 1. Login primero
    console.log('🔑 Logging in...');
    const loginResponse = await fetch('http://localhost:1111/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gamifier.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login successful');

    // 2. Obtener un video para probar
    console.log('📹 Getting video for testing...');
    const videosResponse = await fetch('http://localhost:1111/content/items', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!videosResponse.ok) {
      throw new Error(`Failed to get videos: ${videosResponse.status}`);
    }

    const videos = await videosResponse.json();
    const testVideo = videos.find(v => v.title.includes('Mecánicas') || v.id === 9); // Usar video "Mecánicas de Recompensa"
    
    if (!testVideo) {
      throw new Error('No test video found');
    }

    console.log(`📹 Using video: ${testVideo.title} (ID: ${testVideo.id})`);

    // 3. Configuración para generar preguntas
    const generateConfig = {
      videoItemId: testVideo.id,
      numberOfQuestions: 2,
      focusContext: 'general',
      questionTypes: ['multiple-choice', 'true-false'],
      timeDistribution: 'distributed',
      difficultyLevel: 'medium',
      languageCode: 'es-ES',
      autoSave: false
    };

    // 4. Llamar al generador de preguntas AI
    console.log('🚀 Generating questions with AI...');
    console.log('   Config:', JSON.stringify(generateConfig, null, 2));

    const generateResponse = await fetch('http://localhost:1111/ai/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(generateConfig)
    });

    console.log('   Response status:', generateResponse.status);

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('   Error response:', errorText);
      throw new Error(`AI generation failed: ${generateResponse.status} - ${errorText}`);
    }

    const result = await generateResponse.json();
    
    console.log('✅ AI Questions Generated Successfully!');
    console.log('   Success:', result.success);
    console.log('   Message:', result.message);
    console.log('   Number of questions:', result.questions?.length || 0);
    
    if (result.questions && result.questions.length > 0) {
      console.log('\n📝 Generated Questions:');
      result.questions.forEach((q, index) => {
        console.log(`\n${index + 1}. [${q.type}] at ${q.timestamp}s:`);
        console.log(`   ${q.text}`);
        if (q.options) {
          q.options.forEach((option, optIndex) => {
            const marker = optIndex === q.correctAnswer ? '✓' : ' ';
            console.log(`   ${marker} ${String.fromCharCode(65 + optIndex)}. ${option}`);
          });
        }
        if (q.explanation) {
          console.log(`   💡 ${q.explanation}`);
        }
      });
    }

    console.log('\n🎉 Test completed successfully!');
    return result;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

// Ejecutar test
testAIGenerator()
  .then(() => {
    console.log('\n✅ AI Generator test completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ AI Generator test failed:', error.message);
    process.exit(1);
  }); 