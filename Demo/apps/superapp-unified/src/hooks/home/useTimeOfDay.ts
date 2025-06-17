import { useState, useEffect } from 'react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeOfDayData {
  timeOfDay: TimeOfDay;
  greeting: string;
  contextualMessage: string;
  weatherElement: 'tierra' | 'agua' | 'fuego' | 'aire';
  hour: number;
  formattedTime: string;
}

export const useTimeOfDay = (
  ayniLevel: string = 'Colaborador Equilibrado'
): TimeOfDayData => {
  const [timeData, setTimeData] = useState<TimeOfDayData>(() => {
    const now = new Date();
    const hour = now.getHours();
    return generateTimeData(hour, ayniLevel);
  });

  useEffect(() => {
    const updateTimeData = () => {
      const now = new Date();
      const hour = now.getHours();
      setTimeData(generateTimeData(hour, ayniLevel));
    };

    // Update immediately
    updateTimeData();

    // Update every hour
    const interval = setInterval(updateTimeData, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [ayniLevel]);

  return timeData;
};

const generateTimeData = (hour: number, ayniLevel: string): TimeOfDayData => {
  const timeOfDay = getTimeOfDay(hour);
  const greeting = getTimeBasedGreeting(timeOfDay, ayniLevel);
  const contextualMessage = getContextualMessage(timeOfDay, ayniLevel);
  const weatherElement = getWeatherElement(timeOfDay);
  const formattedTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    timeOfDay,
    greeting,
    contextualMessage,
    weatherElement,
    hour,
    formattedTime,
  };
};

const getTimeOfDay = (hour: number): TimeOfDay => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getTimeBasedGreeting = (
  timeOfDay: TimeOfDay,
  ayniLevel: string
): string => {
  const greetings = {
    morning: `🌅 Buenos días! Que este nuevo amanecer traiga equilibrio a tu Ayni`,
    afternoon: `☀️ ¡Tarde productiva! Tu energía ${ayniLevel} está en pleno flujo`,
    evening: `🌅 Buenas tardes! Momento perfecto para reflexionar sobre el Bien Común`,
    night: `🌙 Buenas noches! Tu día de contribuciones ha nutrido la comunidad`,
  };

  return greetings[timeOfDay];
};

const getContextualMessage = (
  timeOfDay: TimeOfDay,
  ayniLevel: string
): string => {
  const messages = {
    morning: `Es un buen momento para establecer intenciones de reciprocidad para el día`,
    afternoon: `Tu energía está en su punto más alto, ideal para contribuir al Bien Común`,
    evening: `Tiempo de reflexión sobre los intercambios del día y planificar el mañana`,
    night: `Descansa sabiendo que tus acciones han fortalecido la red de Ayni`,
  };

  return messages[timeOfDay];
};

const getWeatherElement = (
  timeOfDay: TimeOfDay
): 'tierra' | 'agua' | 'fuego' | 'aire' => {
  const elementMap = {
    morning: 'aire' as const, // Nuevos comienzos, claridad mental
    afternoon: 'fuego' as const, // Energía, acción, productividad
    evening: 'agua' as const, // Fluidez, reflexión, adaptabilidad
    night: 'tierra' as const, // Estabilidad, descanso, grounding
  };

  return elementMap[timeOfDay];
};
