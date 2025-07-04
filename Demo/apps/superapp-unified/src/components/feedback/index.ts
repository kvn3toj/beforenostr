// Sistema de Feedback - Oráculo de CoomÜnity
export { default as FeedbackSystem } from './FeedbackSystem';
export { default as FeedbackAgent } from './FeedbackAgent';
export { default as FeedbackModeToggle } from './FeedbackModeToggle';
export { default as FeedbackFloatingButton } from './FeedbackFloatingButton';
export { default as FeedbackCaptureModal } from './FeedbackCaptureModal';

// Componentes comunes
export { default as FeedbackModal } from '../common/FeedbackModal';
export { default as FeedbackButton } from '../common/FeedbackButton';

// Contexto
export { useFeedback, FeedbackProvider } from '../../contexts/FeedbackContext';
export type { FeedbackData, FeedbackContextType } from '../../contexts/FeedbackContext';
