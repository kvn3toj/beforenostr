// [PHOENIX/ANA] Hook personalizado para lógica de progreso compartida en ÜPlay
import { useMemo } from 'react';
import { usePlayerMetrics } from '../../../../stores/uplayStore';

export function useUPlayProgress() {
  const playerMetrics = usePlayerMetrics();
  // Ejemplo: calcular porcentaje de videos completados
  const progress = useMemo(() => {
    const total = playerMetrics?.completedVideos || 0;
    const level = playerMetrics?.level || 1;
    return {
      completedVideos: total,
      level,
      // ...otros cálculos de progreso
    };
  }, [playerMetrics]);
  return progress;
}
