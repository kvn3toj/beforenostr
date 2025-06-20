/**
 * 🔴 GA4 Events - Red Pill Section
 * 
 * Ejemplos específicos para la sección Red Pill
 */

// Red Pill Journey - Iniciar cuestionario
document.getElementById('start-journey')?.addEventListener('click', () => {
  window.GA4Tracker.trackRedPillStep(0, 'journey_start', 'start', 0);
});

// Red Pill - Elección izquierda/derecha
document.getElementById('left-option')?.addEventListener('click', () => {
  const currentStep = getCurrentJourneyStep(); // Función que debes implementar
  const stepName = getStepName(currentStep);   // Función que debes implementar
  const progress = (currentStep / getTotalSteps()) * 100;
  
  window.GA4Tracker.trackRedPillStep(currentStep, stepName, 'left', progress);
});

document.getElementById('right-option')?.addEventListener('click', () => {
  const currentStep = getCurrentJourneyStep();
  const stepName = getStepName(currentStep);
  const progress = (currentStep / getTotalSteps()) * 100;
  
  window.GA4Tracker.trackRedPillStep(currentStep, stepName, 'right', progress);
});

// Video principal - Eventos de reproducción
const mainVideo = document.querySelector('video');
if (mainVideo) {
  mainVideo.addEventListener('play', () => {
    window.GA4Tracker.trackVideoInteraction(
      'play', 
      mainVideo.currentTime, 
      mainVideo.duration, 
      'button'
    );
  });

  mainVideo.addEventListener('pause', () => {
    window.GA4Tracker.trackVideoInteraction(
      'pause', 
      mainVideo.currentTime, 
      mainVideo.duration, 
      'button'
    );
  });

  mainVideo.addEventListener('ended', () => {
    window.GA4Tracker.trackVideoInteraction(
      'complete', 
      mainVideo.currentTime, 
      mainVideo.duration, 
      'timeline'
    );
  });
}