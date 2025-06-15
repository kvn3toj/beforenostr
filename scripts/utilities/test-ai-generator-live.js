#!/usr/bin/env node
/**
 * Prueba en vivo del generador AI de preguntas
 */

async function testAIGenerator() {
  console.log('🤖 Probando Generador AI en Vivo...');
  console.log('='.repeat(50));

  try {
    // Simular la importación del módulo como lo haría el frontend
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    const apiKey = 'AIzaSyDXMoHjoHi8-xUfiD5QN6bFVIeoTMhK2z4';
    const genAI = new GoogleGenerativeAI(apiKey);

    // Crear el modelo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Configuración de prueba
    const config = {
      numberOfQuestions: 2,
      focusContext: 'general',
      questionTypes: ['multiple-choice', 'true-false'],
      timeDistribution: 'distributed',
      difficultyLevel: 'medium',
      languageCode: 'es-ES'
    };

    // Datos simulados del video
    const videoData = {
      title: "Mecánicas de Gamificación",
      description: "Video educativo sobre gamificación",
      subtitles: [{
        languageCode: 'es-ES',
        content: `WEBVTT

00:00:00.000 --> 00:00:05.000
Bienvenidos a esta sesión sobre gamificación y engagement.

00:00:05.000 --> 00:00:12.000
Hoy vamos a explorar diferentes estrategias y mecánicas efectivas.

00:00:12.000 --> 00:00:18.000
La gamificación puede transformar la experiencia del usuario.

00:00:18.000 --> 00:00:25.000
Los puntos proporcionan feedback inmediato sobre el progreso.

00:00:25.000 --> 00:00:32.000
Los badges representan logros específicos y crean motivación.

00:00:32.000 --> 00:00:38.000
Las tablas de clasificación fomentan la competencia saludable.`
      }]
    };

    const prompt = `
Eres un asistente especializado en crear preguntas de ATENCIÓN para videos educativos.

OBJETIVO: Generar ${config.numberOfQuestions} preguntas que verifiquen si el usuario está prestando atención al video.

INFORMACIÓN DEL VIDEO:
Título: ${videoData.title}
Descripción: ${videoData.description}

SUBTÍTULOS:
${videoData.subtitles[0].content}

CONFIGURACIÓN:
- Número de preguntas: ${config.numberOfQuestions}
- Tipos de pregunta: ${config.questionTypes.join(', ')}
- Idioma: ${config.languageCode}

FORMATO DE RESPUESTA (JSON válido):
{
  "questions": [
    {
      "timestamp": 10,
      "endTimestamp": 15,
      "type": "multiple-choice",
      "text": "¿Qué tema se menciona al inicio del video?",
      "options": ["Marketing", "Gamificación", "Diseño", "Programación"],
      "correctAnswer": 1,
      "explanation": "Se menciona específicamente gamificación y engagement"
    }
  ]
}

Genera EXACTAMENTE ${config.numberOfQuestions} preguntas basadas en el contenido específico del video.
`;

    console.log('📤 Enviando prompt a Google AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Respuesta recibida de Google AI:');
    console.log('-'.repeat(50));
    console.log(text);
    console.log('-'.repeat(50));

    // Intentar parsear el JSON
    try {
      let jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (!jsonMatch) {
        jsonMatch = text.match(/\{[\s\S]*\}/);
      }
      
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);
        
        console.log('\n✅ JSON parseado exitosamente:');
        console.log('📊 Número de preguntas generadas:', parsed.questions?.length || 0);
        
        if (parsed.questions) {
          parsed.questions.forEach((q, index) => {
            console.log(`\n🔸 Pregunta ${index + 1}:`);
            console.log(`   Tiempo: ${q.timestamp}s`);
            console.log(`   Tipo: ${q.type}`);
            console.log(`   Texto: ${q.text}`);
            if (q.options) {
              console.log(`   Opciones: ${q.options.join(', ')}`);
              console.log(`   Respuesta correcta: ${q.options[q.correctAnswer]}`);
            }
            if (q.explanation) {
              console.log(`   Explicación: ${q.explanation}`);
            }
          });
        }
        
        console.log('\n🎉 ¡Prueba del generador AI EXITOSA!');
        
      } else {
        console.log('❌ No se pudo extraer JSON válido de la respuesta');
      }
    } catch (parseError) {
      console.log('❌ Error parseando JSON:', parseError.message);
    }

  } catch (error) {
    console.log('❌ Error en la prueba:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Sugerencia: Verifica que la API key de Google AI sea válida');
    }
    if (error.message.includes('quota')) {
      console.log('\n💡 Sugerencia: Has excedido el límite de cuota de la API');
    }
  }
}

// Ejecutar la prueba
testAIGenerator(); 