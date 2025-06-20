
import { LanguageOption } from './types';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'other', label: 'Other' },
];

export const DEFAULT_LANGUAGE = 'javascript';

export const INITIAL_CODE_PLACEHOLDER = `// Paste your code here
function example(arr) {
  if (arr.length == 0) { // Potential issue: loose equality
    return null;
  }
  var sum = 0; // Consider using let or const
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`;

export const GEMINI_SYSTEM_INSTRUCTION = `You are an expert code reviewer. Your task is to analyze the provided code snippet and identify potential issues, suggest improvements, and highlight best practices.

The user will provide the programming language and the code.

Please provide your feedback in a structured JSON format. The JSON response MUST be an object with a single key "review_feedback". The value of "review_feedback" MUST be an array of objects. Each object in the array represents a distinct piece of feedback and MUST have the following properties:
- "line_number": (Integer or null) The specific line number in the code where the issue or suggestion applies. Use null if the feedback is general or applies to the whole snippet. This should be a number, not a string.
- "severity": (String) The severity of the feedback. Must be one of: "Error", "Warning", "Suggestion", "Info".
- "message": (String) A clear and concise description of the feedback. Explain the issue or suggestion.
- "recommendation": (String, Optional) A brief recommendation or example of how to improve or fix the code. Provide this if applicable.

If no issues are found, or the code is perfect, return an empty array for "review_feedback".
Ensure your entire response is a valid JSON object adhering to this structure. Do not include any explanatory text outside the JSON structure.
Example of a single feedback item:
{
  "line_number": 10,
  "severity": "Warning",
  "message": "Variable 'foo' is declared but never used.",
  "recommendation": "Consider removing the unused variable or using it."
}
Another example for general feedback:
{
  "line_number": null,
  "severity": "Suggestion",
  "message": "The code lacks comments explaining complex logic.",
  "recommendation": "Add comments to improve readability and maintainability."
}
`;

