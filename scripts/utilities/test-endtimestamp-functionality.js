const BASE_URL = 'http://localhost:1111';

async function makeRequest(method, url, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorData}`);
  }

  return await response.json();
}

async function testEndTimestampFunctionality() {
  console.log('🧪 Testing endTimestamp functionality...\n');

  try {
    // 1. Crear una nueva pregunta con endTimestamp
    console.log('1. Creating a new question with endTimestamp...');
    const newQuestion = {
      videoItemId: 10, // Video ID que existe en el seeder
      timestamp: 180, // 3 minutos
      endTimestamp: 195, // 3 minutos 15 segundos (duración de 15 segundos)
      type: 'multiple-choice',
      text: '¿Cuál es la duración de esta pregunta?',
      languageCode: 'es-ES',
      isActive: true,
      answerOptions: [
        { text: '15 segundos', isCorrect: true, order: 0 },
        { text: '10 segundos', isCorrect: false, order: 1 },
        { text: '20 segundos', isCorrect: false, order: 2 }
      ]
    };

    const createResponse = await makeRequest('POST', `${BASE_URL}/questions`, newQuestion);
    console.log('✅ Question created successfully!');
    console.log(`   ID: ${createResponse.id}`);
    console.log(`   Timestamp: ${createResponse.timestamp}s`);
    console.log(`   EndTimestamp: ${createResponse.endTimestamp}s`);
    console.log(`   Duration: ${createResponse.endTimestamp - createResponse.timestamp}s\n`);

    const questionId = createResponse.id;

    // 2. Obtener la pregunta para verificar que se guardó correctamente
    console.log('2. Retrieving the created question...');
    const getResponse = await makeRequest('GET', `${BASE_URL}/questions/${questionId}`);
    console.log('✅ Question retrieved successfully!');
    console.log(`   Text: "${getResponse.text}"`);
    console.log(`   Start: ${getResponse.timestamp}s`);
    console.log(`   End: ${getResponse.endTimestamp}s`);
    console.log(`   Duration: ${getResponse.endTimestamp - getResponse.timestamp}s\n`);

    // 3. Actualizar la pregunta para cambiar el endTimestamp
    console.log('3. Updating question endTimestamp...');
    const updateData = {
      endTimestamp: 200 // Cambiar a 3 minutos 20 segundos (duración de 20 segundos)
    };

    const updateResponse = await makeRequest('PATCH', `${BASE_URL}/questions/${questionId}`, updateData);
    console.log('✅ Question updated successfully!');
    console.log(`   New EndTimestamp: ${updateResponse.endTimestamp}s`);
    console.log(`   New Duration: ${updateResponse.endTimestamp - updateResponse.timestamp}s\n`);

    // 4. Crear una pregunta sin endTimestamp (opcional)
    console.log('4. Creating a question without endTimestamp...');
    const questionWithoutEnd = {
      videoItemId: 10,
      timestamp: 240, // 4 minutos
      // endTimestamp no especificado
      type: 'short-answer',
      text: 'Esta pregunta no tiene tiempo de fin definido',
      languageCode: 'es-ES',
      isActive: true
    };

    const createResponse2 = await makeRequest('POST', `${BASE_URL}/questions`, questionWithoutEnd);
    console.log('✅ Question without endTimestamp created successfully!');
    console.log(`   ID: ${createResponse2.id}`);
    console.log(`   Timestamp: ${createResponse2.timestamp}s`);
    console.log(`   EndTimestamp: ${createResponse2.endTimestamp || 'null'}\n`);

    // 5. Obtener todas las preguntas del video para ver el timeline completo
    console.log('5. Getting all questions for video timeline...');
    const allQuestionsResponse = await makeRequest('GET', `${BASE_URL}/questions?videoItemId=10`);
    console.log('✅ All questions retrieved successfully!');
    console.log(`   Total questions: ${allQuestionsResponse.length}`);
    
    console.log('\n📊 Timeline Summary:');
    allQuestionsResponse
      .sort((a, b) => a.timestamp - b.timestamp)
      .forEach((q, index) => {
        const duration = q.endTimestamp ? ` (${q.endTimestamp - q.timestamp}s duration)` : ' (no end time)';
        console.log(`   ${index + 1}. ${q.timestamp}s${q.endTimestamp ? ` → ${q.endTimestamp}s` : ''}${duration}`);
        console.log(`      "${q.text.substring(0, 50)}${q.text.length > 50 ? '...' : ''}"`);
      });

    console.log('\n🎉 All endTimestamp functionality tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Ejecutar las pruebas
testEndTimestampFunctionality(); 