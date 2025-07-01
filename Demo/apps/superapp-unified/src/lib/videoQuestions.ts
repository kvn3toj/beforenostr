// Video Questions Configuration for CoomÜnity Interactive Player
// This file contains demonstration questions for videos when backend is not available

export interface VideoQuestion {
  id: number;
  videoId: string;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'true-false' | 'quick-response';
  question: string;
  options: {
    id: string;
    text: string;
    label: string;
    isCorrect: boolean;
  }[];
  timeLimit?: number;
  reward?: {
    merits: number;
    ondas: number;
  };
  difficulty?: 'easy' | 'medium' | 'hard';
}

// CoomÜnity Philosophy and Principles Questions
export const videoQuestionsDatabase: Record<string, VideoQuestion[]> = {
  'coomunity-intro': [
    {
      id: 1,
      videoId: 'coomunity-intro',
      timestamp: 15,
      endTimestamp: 45,
      type: 'multiple-choice',
      question: '¿Cuál es el principio fundamental de Reciprocidad en CoomÜnity?',
      timeLimit: 25,
      difficulty: 'medium',
      reward: { merits: 20, ondas: 8 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Reciprocidad y equilibrio energético',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Competencia individual extrema',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'Acumulación ilimitada de recursos',
          isCorrect: false,
        },
        {
          id: 'd',
          label: 'D',
          text: 'Jerarquía social rígida',
          isCorrect: false,
        },
      ],
    },
    {
      id: 2,
      videoId: 'coomunity-intro',
      timestamp: 60,
      endTimestamp: 80,
      type: 'true-false',
      question:
        '¿Las Öndas representan energía vibracional positiva que se genera al contribuir al Bien Común?',
      timeLimit: 18,
      difficulty: 'easy',
      reward: { merits: 15, ondas: 12 },
      options: [
        { id: 'true', label: 'V', text: 'Verdadero', isCorrect: true },
        { id: 'false', label: 'F', text: 'Falso', isCorrect: false },
      ],
    },
    {
      id: 3,
      videoId: 'coomunity-intro',
      timestamp: 120,
      endTimestamp: 140,
      type: 'quick-response',
      question: 'En CoomÜnity, ¿qué significa priorizar el "Bien Común"?',
      timeLimit: 12,
      difficulty: 'hard',
      reward: { merits: 35, ondas: 15 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Beneficio colectivo sobre individual',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Ganancia personal máxima',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'Neutralidad en decisiones',
          isCorrect: false,
        },
      ],
    },
    {
      id: 4,
      videoId: 'coomunity-intro',
      timestamp: 180,
      endTimestamp: 200,
      type: 'multiple-choice',
      question:
        '¿Qué representa la Metanöia en el desarrollo personal dentro de CoomÜnity?',
      timeLimit: 20,
      difficulty: 'medium',
      reward: { merits: 25, ondas: 10 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Transformación profunda de la consciencia',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Acumulación de conocimiento técnico',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'Competencia con otros miembros',
          isCorrect: false,
        },
        {
          id: 'd',
          label: 'D',
          text: 'Obtención de privilegios especiales',
          isCorrect: false,
        },
      ],
    },
  ],

  'reciprocidad-deep-dive': [
    {
      id: 5,
      videoId: 'reciprocidad-deep-dive',
      timestamp: 20,
      endTimestamp: 40,
      type: 'multiple-choice',
      question: '¿Cómo se manifiesta el Reciprocidad en las interacciones diarias?',
      timeLimit: 22,
      difficulty: 'medium',
      reward: { merits: 25, ondas: 12 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Intercambio equilibrado de valor y energía',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Maximización del beneficio personal',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'Competencia destructiva',
          isCorrect: false,
        },
        {
          id: 'd',
          label: 'D',
          text: 'Acumulación sin retribución',
          isCorrect: false,
        },
      ],
    },
    {
      id: 6,
      videoId: 'reciprocidad-deep-dive',
      timestamp: 90,
      endTimestamp: 110,
      type: 'true-false',
      question:
        '¿El Reciprocidad implica que siempre debemos recibir exactamente lo mismo que damos?',
      timeLimit: 15,
      difficulty: 'hard',
      reward: { merits: 30, ondas: 18 },
      options: [
        { id: 'true', label: 'V', text: 'Verdadero', isCorrect: false },
        {
          id: 'false',
          label: 'F',
          text: 'Falso - El equilibrio puede ser energético, no literal',
          isCorrect: true,
        },
      ],
    },
    {
      id: 7,
      videoId: 'reciprocidad-deep-dive',
      timestamp: 150,
      endTimestamp: 170,
      type: 'quick-response',
      question: '¿Cuál es la consecuencia de romper el Reciprocidad?',
      timeLimit: 10,
      difficulty: 'medium',
      reward: { merits: 20, ondas: 10 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Desequilibrio energético y desarmonía',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Mayor prosperidad personal',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'No hay consecuencias',
          isCorrect: false,
        },
      ],
    },
  ],

  'ondas-energia': [
    {
      id: 8,
      videoId: 'ondas-energia',
      timestamp: 25,
      endTimestamp: 45,
      type: 'multiple-choice',
      question: '¿Cómo se generan las Öndas en el ecosistema CoomÜnity?',
      timeLimit: 25,
      difficulty: 'hard',
      reward: { merits: 40, ondas: 20 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'A través de acciones que benefician al Bien Común',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Mediante transacciones monetarias',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'Por acumulación de bienes materiales',
          isCorrect: false,
        },
        {
          id: 'd',
          label: 'D',
          text: 'A través de la competencia',
          isCorrect: false,
        },
      ],
    },
    {
      id: 9,
      videoId: 'ondas-energia',
      timestamp: 80,
      endTimestamp: 100,
      type: 'true-false',
      question:
        '¿Las Öndas pueden multiplicarse cuando se comparten con otros miembros?',
      timeLimit: 16,
      difficulty: 'medium',
      reward: { merits: 25, ondas: 15 },
      options: [
        {
          id: 'true',
          label: 'V',
          text: 'Verdadero - La energía se amplifica al compartirse',
          isCorrect: true,
        },
        { id: 'false', label: 'F', text: 'Falso', isCorrect: false },
      ],
    },
    {
      id: 10,
      videoId: 'ondas-energia',
      timestamp: 140,
      endTimestamp: 160,
      type: 'quick-response',
      question: '¿Qué diferencia las Öndas de una moneda tradicional?',
      timeLimit: 12,
      difficulty: 'hard',
      reward: { merits: 45, ondas: 25 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Representan energía vibracional, no valor material',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Tienen mayor valor económico',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'Son más escasas',
          isCorrect: false,
        },
      ],
    },
    {
      id: 11,
      videoId: 'ondas-energia',
      timestamp: 200,
      endTimestamp: 220,
      type: 'multiple-choice',
      question: '¿Cómo afectan las Öndas al bienestar colectivo?',
      timeLimit: 18,
      difficulty: 'medium',
      reward: { merits: 30, ondas: 18 },
      options: [
        {
          id: 'a',
          label: 'A',
          text: 'Elevan la vibración energética de toda la comunidad',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'B',
          text: 'Solo benefician al individuo que las posee',
          isCorrect: false,
        },
        {
          id: 'c',
          label: 'C',
          text: 'No tienen impacto en el colectivo',
          isCorrect: false,
        },
        {
          id: 'd',
          label: 'D',
          text: 'Crean división entre miembros',
          isCorrect: false,
        },
      ],
    },
  ],
};

// Helper function to get questions for a specific video
export const getVideoQuestions = (videoId: string): VideoQuestion[] => {
  return videoQuestionsDatabase[videoId] || [];
};

// Helper function to validate if questions exist for a video
export const hasQuestions = (videoId: string): boolean => {
  return (
    videoId in videoQuestionsDatabase &&
    videoQuestionsDatabase[videoId].length > 0
  );
};

// Helper function to count total questions for a video
export const getQuestionCount = (videoId: string): number => {
  return getVideoQuestions(videoId).length;
};

// Helper function to get total possible rewards for a video
export const getTotalRewards = (
  videoId: string
): { merits: number; ondas: number } => {
  const questions = getVideoQuestions(videoId);
  return questions.reduce(
    (total, question) => {
      if (question.reward) {
        total.merits += question.reward.merits;
        total.ondas += question.reward.ondas;
      }
      return total;
    },
    { merits: 0, ondas: 0 }
  );
};

// Helper function to get questions by difficulty
export const getQuestionsByDifficulty = (
  videoId: string,
  difficulty: 'easy' | 'medium' | 'hard'
): VideoQuestion[] => {
  return getVideoQuestions(videoId).filter((q) => q.difficulty === difficulty);
};

// Function to seed questions to backend (for development)
export const seedQuestionsToBackend = async (
  apiService: any
): Promise<void> => {
  try {
    for (const [videoId, questions] of Object.entries(videoQuestionsDatabase)) {
      for (const question of questions) {
        await apiService.post('/video-items/questions', {
          videoId: question.videoId,
          timestamp: question.timestamp,
          endTimestamp: question.endTimestamp,
          type: question.type,
          question: question.question,
          options: question.options,
          timeLimit: question.timeLimit,
          reward: question.reward,
          difficulty: question.difficulty,
        });
      }
    }
    console.log('✅ Questions seeded successfully to backend');
  } catch (error) {
    console.warn('⚠️ Could not seed questions to backend:', error);
  }
};

// Export default questions for fallback
export default videoQuestionsDatabase;
