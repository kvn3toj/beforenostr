import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FeedbackItem, GeminiReviewResponse } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_SYSTEM_INSTRUCTION } from '../constants';

// Custom error types for better error handling
export class GeminiAPIError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'GeminiAPIError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class ParseError extends Error {
  constructor(message: string, public rawResponse?: string) {
    super(message);
    this.name = 'ParseError';
  }
}

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
    throw new ConfigurationError("Gemini API Key is not configured. Cannot initialize AI client.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

const sanitizeInput = (code: string, language: string): { code: string; language: string } => {
  // Basic input sanitization
  const sanitizedCode = code.trim();
  const sanitizedLanguage = language.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (!sanitizedCode) {
    throw new Error("Code cannot be empty");
  }
  
  if (sanitizedCode.length > 10000) {
    throw new Error("Code is too long. Please limit to 10,000 characters.");
  }
  
  return { code: sanitizedCode, language: sanitizedLanguage };
};

const parseGeminiResponse = (response: GenerateContentResponse): FeedbackItem[] => {
  const responseText = response.text;
  
  if (!responseText) {
    throw new ParseError("Received empty or undefined response from Gemini API");
  }
  
  let jsonStr = responseText.trim();
  
  if (!jsonStr) {
    throw new ParseError("Received empty response from Gemini API");
  }
  
  // Remove markdown fences if present
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr) as GeminiReviewResponse;
    
    if (!parsedData || typeof parsedData !== 'object') {
      throw new ParseError("Response is not a valid object", jsonStr);
    }
    
    if (!Array.isArray(parsedData.review_feedback)) {
      throw new ParseError("Response missing 'review_feedback' array", jsonStr);
    }
    
    // Validate each feedback item
    parsedData.review_feedback.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new ParseError(`Invalid feedback item at index ${index}`, jsonStr);
      }
      
      if (!item.severity || !item.message) {
        throw new ParseError(`Missing required fields in feedback item ${index}`, jsonStr);
      }
    });
    
    return parsedData.review_feedback;
    
  } catch (parseError) {
    if (parseError instanceof ParseError) {
      throw parseError;
    }
    
    console.error("Failed to parse JSON response from Gemini:", parseError);
    console.error("Raw response text:", responseText);
    
    const truncatedResponse = responseText.substring(0, 200);
    throw new ParseError(
      `Failed to parse the review feedback. The AI response may be malformed.`,
      truncatedResponse
    );
  }
};

export const getCodeReview = async (code: string, language: string): Promise<FeedbackItem[]> => {
  try {
    // Input validation and sanitization
    const { code: sanitizedCode, language: sanitizedLanguage } = sanitizeInput(code, language);
    
    const ai = getAiClient();
    const prompt = `Language: ${sanitizedLanguage}\n\nCode:\n\`\`\`${sanitizedLanguage}\n${sanitizedCode}\n\`\`\``;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.3, // Lower temperature for more deterministic, factual reviews
      },
    });

    return parseGeminiResponse(response);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    if (error instanceof ConfigurationError || error instanceof ParseError) {
      throw error;
    }
    
    if (error instanceof Error) {
      // Handle specific Gemini API errors
      if (error.message.includes("API key not valid") || error.message.includes("invalid_api_key")) {
        throw new GeminiAPIError("The Gemini API key is invalid. Please check your configuration.", error);
      }
      
      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        throw new GeminiAPIError("API quota exceeded or rate limit reached. Please try again later.", error);
      }
      
      if (error.message.includes("network") || error.message.includes("fetch")) {
        throw new GeminiAPIError("Network error occurred. Please check your internet connection.", error);
      }
      
      // Generic API error
      throw new GeminiAPIError(`An error occurred while communicating with the AI: ${error.message}`, error);
    }
    
    throw new GeminiAPIError("An unknown error occurred while fetching the code review.");
  }
};
