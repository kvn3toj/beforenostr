import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";

// --- Constantes Gemini (adaptadas de constants.ts) ---
const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const GEMINI_SYSTEM_INSTRUCTION = `You are an expert code reviewer. Your task is to analyze the provided code snippet and identify potential issues, suggest improvements, and highlight best practices.\n\nThe user will provide the programming language and the code.\n\nPlease provide your feedback in a structured JSON format. The JSON response MUST be an object with a single key \"review_feedback\". The value of \"review_feedback\" MUST be an array of objects. Each object in the array represents a distinct piece of feedback and MUST have the following properties:\n- \"line_number\": (Integer or null) The specific line number in the code where the issue or suggestion applies. Use null if the feedback is general or applies to the whole snippet. This should be a number, not a string.\n- \"severity\": (String) The severity of the feedback. Must be one of: \"Error\", \"Warning\", \"Suggestion\", \"Info\".\n- \"message\": (String) A clear and concise description of the feedback. Explain the issue or suggestion.\n- \"recommendation\": (String, Optional) A brief recommendation or example of how to improve or fix the code. Provide this if applicable.\n\nIf no issues are found, or the code is perfect, return an empty array for \"review_feedback\".\nEnsure your entire response is a valid JSON object adhering to this structure. Do not include any explanatory text outside the JSON structure.`;

// --- API Key ---
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Falta la API Key de Gemini. Configura GEMINI_API_KEY en tu entorno.");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Detección de lenguaje por extensión ---
function detectLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if ([".ts", ".tsx"].includes(ext)) return "typescript";
  if ([".js", ".jsx", ".cjs", ".mjs"].includes(ext)) return "javascript";
  if ([".py"].includes(ext)) return "python";
  if ([".java"].includes(ext)) return "java";
  if ([".go"].includes(ext)) return "go";
  if ([".rb"].includes(ext)) return "ruby";
  if ([".php"].includes(ext)) return "php";
  if ([".css", ".scss", ".sass", ".less"].includes(ext)) return "css";
  if ([".html"].includes(ext)) return "html";
  if ([".json"].includes(ext)) return "json";
  if ([".sql"].includes(ext)) return "sql";
  if ([".sh"].includes(ext)) return "bash";
  if ([".c", ".h"].includes(ext)) return "c";
  if ([".cpp", ".hpp"].includes(ext)) return "cpp";
  if ([".cs"].includes(ext)) return "csharp";
  if ([".swift"].includes(ext)) return "swift";
  if ([".kt"].includes(ext)) return "kotlin";
  if ([".rs"].includes(ext)) return "rust";
  if ([".md"].includes(ext)) return "markdown";
  if ([".yml", ".yaml"].includes(ext)) return "yaml";
  return "other";
}

// --- Lógica de revisión Gemini ---
async function reviewFile(filePath, language) {
  const code = await fs.readFile(filePath, "utf-8");
  const prompt = `Language: ${language}\n\nCode:\n\${language}\n${code}\n\`;
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) jsonStr = match[1].trim();
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed.review_feedback || [];
    } catch (e) {
      return [{ severity: "Error", message: "No se pudo parsear la respuesta de Gemini", line_number: null }];
    }
  } catch (e) {
    return [{ severity: "Error", message: `Error al llamar a Gemini: ${e.message || e}`, line_number: null }];
  }
}

// --- Main ---
async function main() {
  const fileList = (await fs.readFile("all_code_files.txt", "utf-8")).split("\n").filter(Boolean);
  let totalIssues = 0;
  let totalFiles = 0;
  for (const file of fileList) {
    totalFiles++;
    const language = detectLanguage(file);
    console.log(`\n\u25B6\uFE0F Revisando: ${file} (${language})`);
    const feedback = await reviewFile(file, language);
    if (feedback.length === 0) {
      console.log("  ✅ Sin problemas detectados.");
    } else {
      totalIssues += feedback.length;
      feedback.forEach(item => {
        console.log(`  - [${item.severity}] Línea ${item.line_number ?? "-"}: ${item.message}`);
        if (item.recommendation) {
          console.log(`    Recomendación: ${item.recommendation}`);
        }
      });
    }
  }
  console.log(`\n\u2B50\uFE0F Revisión completada. Archivos revisados: ${totalFiles}. Total de issues encontrados: ${totalIssues}`);
}

main(); 