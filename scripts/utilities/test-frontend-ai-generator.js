// Test simple para verificar que el frontend usa el backend para generar preguntas
console.log('🧪 Testing Frontend AI Generator Integration');

// Simular la llamada que hace el frontend
async function testFrontendIntegration() {
  try {
    console.log('🔑 Step 1: Login...');
    
    const loginResponse = await fetch('http://localhost:3002/auth/login', {
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

    console.log('🤖 Step 2: Generate questions via backend API...');
    
    // Esta es la misma llamada que hace el frontend corregido
    const response = await fetch('http://localhost:3002/ai/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        videoItemId: 18,
        numberOfQuestions: 2,
        focusContext: 'general',
        questionTypes: ['multiple-choice'],
        timeDistribution: 'distributed',
        difficultyLevel: 'medium',
        languageCode: 'es-ES',
        autoSave: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ API call successful!');
    console.log('📊 Result:', {
      success: result.success,
      message: result.message,
      questionsCount: result.questions?.length || 0
    });

    if (result.questions && result.questions.length > 0) {
      console.log('\n📝 Generated Questions Analysis:');
      
      result.questions.forEach((q, index) => {
        console.log(`\n${index + 1}. ${q.text}`);
        
        // Verificar si contiene palabras de gamificación
        const gamificationWords = ['gamificación', 'puntos', 'badges', 'leaderboard', 'recompensas'];
        const hasGamification = gamificationWords.some(word => 
          q.text.toLowerCase().includes(word.toLowerCase())
        );
        
        // Verificar si contiene palabras del video específico
        const videoWords = ['danés', 'encasillar', 'personas', 'prejuicios', 'estereotipos'];
        const hasVideoContent = videoWords.some(word => 
          q.text.toLowerCase().includes(word.toLowerCase())
        );
        
        if (hasGamification) {
          console.log('   ❌ PROBLEMA: Contiene palabras de gamificación');
        } else if (hasVideoContent) {
          console.log('   ✅ CORRECTO: Contiene contenido específico del video');
        } else {
          console.log('   ⚠️  NEUTRAL: No contiene palabras específicas detectadas');
        }
      });
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('💡 El frontend ahora debería generar preguntas correctas sobre el contenido del video.');
    
    return result;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

// Ejecutar el test
testFrontendIntegration()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }); 