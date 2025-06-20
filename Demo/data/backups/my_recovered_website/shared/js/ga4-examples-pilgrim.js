/**
 * 🎒 GA4 Events - Pilgrim Section
 * 
 * Ejemplos específicos para la sección Pilgrim
 */

// Tracking de navegación por el journey del peregrino
document.querySelectorAll('.pilgrim-step, .journey-marker').forEach(step => {
  step.addEventListener('click', () => {
    window.GA4Tracker.trackEvent('pilgrim_journey_step', {
      step_id: step.dataset.stepId || 'unknown',
      step_name: step.dataset.stepName || 'unknown',
      step_type: step.dataset.stepType || 'checkpoint',
      progress_percentage: calculatePilgrimProgress() // Función a implementar
    });
  });
});

// Interacciones con mapa o elementos interactivos
document.querySelectorAll('.interactive-element').forEach(element => {
  element.addEventListener('click', () => {
    window.GA4Tracker.trackEvent('pilgrim_interactive_element', {
      element_type: element.dataset.elementType || 'unknown',
      element_id: element.id || 'unknown',
      interaction_method: 'click'
    });
  });
});