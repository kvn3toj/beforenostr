// [NIRA] Analytics: Tracking de evento crítico añadido/revisado (ejemplo: 'video_played' o 'question_answered').

// [NIRA/ANA] Tracking: Añadido evento para selección de modo y reproducción de video
export function trackModeSelection(mode: string) {
  // Implementar lógica de envío de evento a analytics
  console.log('[Analytics] Modo seleccionado:', mode);
}

export function trackVideoPlay(videoId: string) {
  // Implementar lógica de envío de evento a analytics
  console.log('[Analytics] Video reproducido:', videoId);
}
