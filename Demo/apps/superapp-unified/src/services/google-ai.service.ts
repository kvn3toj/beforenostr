// Eliminar imports, variables y funciones no utilizadas y comentarios obsoletos
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error('Google AI API key is not set. Please set VITE_GOOGLE_AI_API_KEY in your .env file');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Función de espera
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para reintentar con espera exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      if (retries >= maxRetries) throw error;
      
      // Si es un error de cuota, esperamos más tiempo
      if (error.message?.includes('quota')) {
        delay = Math.min(delay * 2, 10000); // Máximo 10 segundos
      }
      
      console.log(`Reintentando en ${delay}ms... (intento ${retries + 1}/${maxRetries})`);
      await wait(delay);
      retries++;
    }
  }
}

export const googleAIService = {
  /**
   * Generate text using Google's Generative AI
   * @param prompt The prompt to send to the AI
   * @param model The model to use (defaults to 'gemini-2.0-flash')
   */
  async generateText(prompt: string, model: string = 'gemini-2.0-flash') {
    return retryWithBackoff(async () => {
      try {
        const modelInstance = genAI.getGenerativeModel({ model });
        const result = await modelInstance.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error('Error generating text with Google AI:', error);
        throw error;
      }
    });
  },

  /**
   * Generate text with streaming response
   * @param prompt The prompt to send to the AI
   * @param model The model to use (defaults to 'gemini-2.0-flash')
   */
  async generateTextStream(prompt: string, model: string = 'gemini-2.0-flash') {
    return retryWithBackoff(async () => {
      try {
        const modelInstance = genAI.getGenerativeModel({ model });
        const result = await modelInstance.generateContentStream(prompt);
        return result;
      } catch (error) {
        console.error('Error generating streaming text with Google AI:', error);
        throw error;
      }
    });
  },

  /**
   * Test function to verify the AI service is working
   */
  async test() {
    try {
      const prompt = 'Escribe un haiku sobre programación';
      console.log('Enviando prompt:', prompt);
      
      const response = await this.generateText(prompt);
      console.log('Respuesta recibida:', response);
      
      return response;
    } catch (error) {
      console.error('Error en la prueba:', error);
      throw error;
    }
  }
}; 