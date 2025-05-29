
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FeedbackItem, GeminiReviewResponse } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_SYSTEM_INSTRUCTION } from '../constants';

// Ensure API_KEY is handled as per instructions (pre-configured environment variable)
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This error will be caught by the global error handler or shown in console
  // In a real app, you might want a more user-facing way to indicate this configuration issue if it's critical at runtime,
  // but the prompt implies API_KEY is always available.
  console.error("API_KEY for Gemini is not configured. Please set the process.env.API_KEY environment variable.");
  // To prevent the app from completely breaking if API_KEY is missing during development/build,
  // we throw an error that can be caught by the calling function.
}

const getAiClient = () => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Cannot initialize AI client.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};


export const getCodeReview = async (code: string, language: string): Promise<FeedbackItem[]> => {
  const ai = getAiClient();

  const prompt = `Language: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.3, // Lower temperature for more deterministic, factual reviews
      },
    });

    let jsonStr = response.text.trim();
    
    // Remove markdown fences if present
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as GeminiReviewResponse;
      if (parsedData && Array.isArray(parsedData.review_feedback)) {
        return parsedData.review_feedback;
      } else {
        console.error("Parsed JSON does not match expected structure:", parsedData);
        throw new Error("Received an unexpected review format from the AI. The 'review_feedback' array is missing or invalid.");
      }
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", parseError);
      console.error("Raw response text:", response.text);
      throw new Error(`Failed to parse the review feedback. Raw AI response: "${response.text.substring(0,100)}..."`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // Specific error from Gemini client might have more details
      if (error.message.includes("API key not valid")) {
         throw new Error("The Gemini API key is invalid. Please check your configuration.");
      }
      // Check for quota issues or other specific API errors if possible
      // e.g. by inspecting error.cause or specific error types if the SDK provides them.
      throw new Error(`An error occurred while communicating with the AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the code review.");
  }
};
