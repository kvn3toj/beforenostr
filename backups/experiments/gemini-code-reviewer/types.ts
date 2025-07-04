
export interface LanguageOption {
  value: string;
  label: string;
}

export enum FeedbackSeverity {
  Error = "Error",
  Warning = "Warning",
  Suggestion = "Suggestion",
  Info = "Info"
}

export interface FeedbackItem {
  line_number: number | null;
  severity: FeedbackSeverity;
  message: string;
  recommendation?: string;
}

export interface GeminiReviewResponse {
  review_feedback: FeedbackItem[];
}
