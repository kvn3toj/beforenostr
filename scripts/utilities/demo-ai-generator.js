const { GoogleGenerativeAI } = require('@google/generative-ai');

// Simulando datos de un video de ejemplo (basado en uno de nuestros videos reales)
const mockVideoData = {
  id: 9,
  title: "Mecánicas de Recompensa en Gamificación",
  description: "Aprende sobre las diferentes mecánicas de recompensa que puedes usar en tus proyectos de gamificación",
  subtitles: [{
    languageCode: 'es-ES',
    content: `WEBVTT

00:00:00.000 --> 00:00:05.000
Hola y bienvenidos a esta sesión sobre mecánicas de recompensa en gamificación.

00:00:05.000 --> 00:00:12.000
Hoy vamos a explorar diferentes tipos de recompensas que puedes implementar en tus proyectos.

00:00:12.000 --> 00:00:18.000
Las recompensas pueden ser tangibles como puntos y badges, o intangibles como reconocimiento.

00:00:18.000 --> 00:00:25.000
Primero, hablemos de los puntos. Los puntos son la moneda básica de cualquier sistema gamificado.

00:00:25.000 --> 00:00:32.000
Los puntos deben ser fáciles de entender y deben tener un valor claro para el usuario.

00:00:32.000 --> 00:00:38.000
Los badges o insignias representan logros específicos y crean un sentido de progreso.

00:00:38.000 --> 00:00:45.000
Un badge bien diseñado cuenta una historia sobre lo que el usuario ha logrado.

00:00:45.000 --> 00:00:52.000
Las tablas de clasificación o leaderboards fomentan la competencia saludable entre usuarios.

00:00:52.000 --> 00:00:58.000
Sin embargo, es importante diseñar leaderboards que no desmotiven a los nuevos usuarios.

00:00:58.000 --> 00:01:05.000
Finalmente, las recompensas sorpresa mantienen el engagement alto y crean momentos de deleite.

00:01:05.000 --> 00:01:10.000
Recuerda que el timing de las recompensas es tan importante como las recompensas mismas.

00:01:10.000 --> 00:01:15.000
¡Gracias por su atención y nos vemos en la próxima sesión!`
  }]
};

async function demoAIQuestionGenerator() {
  try {
    console.log('🤖 Demonstración del Generador de Preguntas AI');
    console.log('='.repeat(50));
    
    // Verificar API key
    const apiKey = process.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyDXMoHjoHi8-xUfiD5QN6bFVIeoTMhK2z4';
    if (!apiKey) {
      throw new Error('No se encontró la API key de Google AI');
    }

    console.log('✅ API Key encontrada');
    console.log(`📹 Video de prueba: "${mockVideoData.title}"`);
    console.log(`📝 Subtítulos disponibles: ${mockVideoData.subtitles.length} idioma(s)`);

    // Configuración de las preguntas a generar
    const config = {
      numberOfQuestions: 3,
      focusContext: 'general', // 'general', 'visual', 'audio', 'specific_moments'
      questionTypes: ['multiple-choice', 'true-false'],
      timeDistribution: 'distributed', // 'beginning', 'middle', 'end', 'distributed'
      difficultyLevel: 'medium', // 'easy', 'medium', 'hard'
      languageCode: 'es-ES'
    };

    console.log('\n⚙️  Configuración:');
    console.log(`   • Número de preguntas: ${config.numberOfQuestions}`);
    console.log(`   • Enfoque: ${config.focusContext}`);
    console.log(`   • Tipos: ${config.questionTypes.join(', ')}`);
    console.log(`   • Distribución: ${config.timeDistribution}`);
    console.log(`   • Dificultad: ${config.difficultyLevel}`);

    // Inicializar Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('\n🔗 Conectando con Google AI...');

    // Construir el prompt especializado
    const subtitlesText = mockVideoData.subtitles
      .filter(s => s.languageCode === config.languageCode)
      .map(s => s.content)
      .join('\\n');

    const prompt = `
Eres un asistente especializado en crear preguntas de ATENCIÓN para videos educativos.

OBJETIVO: Generar ${config.numberOfQuestions} preguntas que verifiquen si el usuario está prestando atención al video, NO preguntas educativas profundas.

INFORMACIÓN DEL VIDEO:
Título: ${mockVideoData.title}
Descripción: ${mockVideoData.description}

SUBTÍTULOS/TRANSCRIPCIÓN:
${subtitlesText}

CONFIGURACIÓN SOLICITADA:
- Número de preguntas: ${config.numberOfQuestions}
- Enfoque: ${config.focusContext}
- Tipos de pregunta: ${config.questionTypes.join(', ')}
- Distribución temporal: ${config.timeDistribution}
- Nivel: ${config.difficultyLevel}
- Idioma: ${config.languageCode}

INSTRUCCIONES ESPECÍFICAS:
- Enfócate en una mezcla de elementos visuales, auditivos y momentos específicos
- Opción múltiple: 4 opciones, solo una correcta
- Verdadero/Falso: afirmaciones sobre lo que ocurre en el video
- Distribuye las preguntas uniformemente a lo largo del video

FORMATO DE RESPUESTA (JSON válido):
{
  "questions": [
    {
      "timestamp": 30,
      "endTimestamp": 45,
      "type": "multiple-choice",
      "text": "¿Qué elemento menciona el presentador como la 'moneda básica' de los sistemas gamificados?",
      "options": ["Badges", "Puntos", "Leaderboards", "Recompensas sorpresa"],
      "correctAnswer": 1,
      "explanation": "Se menciona claramente que los puntos son la moneda básica"
    }
  ]
}

IMPORTANTE: 
- Las preguntas deben ser sobre detalles específicos del video
- Deben requerir que el usuario haya visto ESA parte específica
- No preguntes sobre conocimiento general
- Incluye timestamps precisos basados en los subtítulos
- Genera EXACTAMENTE ${config.numberOfQuestions} preguntas
`;

    console.log('🚀 Generando preguntas...');
    
    // Llamar a Google AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Respuesta recibida de Google AI');

    // Parsear la respuesta JSON
    try {
      // Buscar JSON ya sea en formato plano o dentro de un bloque de código markdown
      let jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (!jsonMatch) {
        jsonMatch = text.match(/\{[\s\S]*\}/);
      }
      
      if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en la respuesta');
      }

      const jsonText = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonText);
      const questions = parsed.questions || [];

      console.log('\\n🎯 PREGUNTAS GENERADAS:');
      console.log('='.repeat(50));

      questions.forEach((question, index) => {
        console.log(`\\n${index + 1}. [${question.type.toUpperCase()}] Tiempo: ${question.timestamp}s`);
        console.log(`   📋 ${question.text}`);
        
        if (question.options) {
          question.options.forEach((option, optIndex) => {
            const marker = optIndex === question.correctAnswer ? '✅' : '  ';
            console.log(`   ${marker} ${String.fromCharCode(65 + optIndex)}. ${option}`);
          });
        }
        
        if (question.explanation) {
          console.log(`   💡 Explicación: ${question.explanation}`);
        }
      });

      console.log('\\n' + '='.repeat(50));
      console.log(`✅ ¡Generación exitosa! ${questions.length} preguntas creadas`);
      console.log('\\n📊 ESTADÍSTICAS:');
      console.log(`   • Preguntas de opción múltiple: ${questions.filter(q => q.type === 'multiple-choice').length}`);
      console.log(`   • Preguntas verdadero/falso: ${questions.filter(q => q.type === 'true-false').length}`);
      console.log(`   • Rango temporal: ${Math.min(...questions.map(q => q.timestamp))}s - ${Math.max(...questions.map(q => q.timestamp))}s`);

      console.log('\\n🎉 Demostración completada con éxito!');
      
      return {
        success: true,
        videoData: mockVideoData,
        config: config,
        questions: questions,
        generatedAt: new Date().toISOString()
      };

    } catch (parseError) {
      console.error('❌ Error al parsear la respuesta JSON:', parseError);
      console.log('\\n📝 Respuesta completa de Google AI:');
      console.log('-'.repeat(50));
      console.log(text);
      console.log('-'.repeat(50));
      throw parseError;
    }

  } catch (error) {
    console.error('❌ Error en la demostración:', error.message);
    console.error('\\nDetalles del error:', error);
    throw error;
  }
}

// Ejecutar la demostración
if (require.main === module) {
  demoAIQuestionGenerator()
    .then((result) => {
      console.log('\\n✅ Demostración del generador AI completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\\n❌ La demostración falló:', error.message);
      process.exit(1);
    });
}

module.exports = { demoAIQuestionGenerator }; 