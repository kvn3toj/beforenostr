export interface ChallengeConfig {
  targetContentItemId?: string; // ID of the content item to complete (e.g., video)
  requiredCompletions?: number; // How many times the content item needs to be completed
  // Add other potential fields based on future challenge types (e.g., quiz config, transaction targets)
  [key: string]: unknown; // Allow for arbitrary additional properties
}
