export interface UserChallengeProgress {
  completedSteps?: number; // How many steps/completions are done
  completionPercentage?: number; // Percentage of completion (0-100)
  // Add other potential fields based on challenge types (e.g., quiz scores, items collected)
  [key: string]: any; // Allow for arbitrary additional properties
} 