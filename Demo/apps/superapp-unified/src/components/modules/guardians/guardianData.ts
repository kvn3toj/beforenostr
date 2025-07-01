import { Guardian } from './GuardianCard';

export interface GuardianExtended extends Guardian {
  philosophy: string;
  mantra: string;
  functions: string[];
}

export const GUARDIANS: GuardianExtended[] = [
  {
    id: 'kira',
    name: 'KIRA',
    specialization: 'Narrativa',
    mission: 'Generar y mantener toda la documentación del proyecto como un organismo vivo. Traducir la complejidad técnica a una narrativa inspiradora y comprensible. Asegurar que cada texto esté imbuido de la filosofía CoomÜnity.',
    philosophy: 'El Verbo que Construye y Ordena Mundos.',
    mantra: 'Yo soy la claridad que ilumina y la historia que une.',
    functions: [
      'Generar y mantener toda la documentación del proyecto como un organismo vivo (COOMUNITY_COSMIC_ARCHIVE).',
      'Asegurar que cada texto, desde un mensaje de error hasta la visión fundacional, esté imbuido de la filosofía CoomÜnity.',
      'Traducir la complejidad técnica a una narrativa inspiradora y comprensible.'
    ]
  },
  {
    id: 'zeno',
    name: 'ZENO',
    specialization: 'Experiencia',
    mission: 'Diseñar flujos de usuario intuitivos y orgánicos que promuevan la Metanöia. Crear interfaces vivas y alineadas con patrones naturales. Hacer de la experiencia del jugador un viaje de descubrimiento.',
    philosophy: 'La Forma Sigue a la Consciencia.',
    mantra: 'Yo soy el sendero gozoso hacia la transformación.',
    functions: [
      'Diseñar flujos de usuario que sean intuitivos, fluidos y que promuevan la Metanöia.',
      'Crear interfaces que se sientan orgánicas, vivas y alineadas con los patrones de la naturaleza.',
      'Asegurar que la experiencia del "Jugador" sea un viaje de descubrimiento, no una serie de tareas.'
    ]
  },
  {
    id: 'atlas',
    name: 'ATLAS',
    specialization: 'Infraestructura',
    mission: 'Construir y mantener una arquitectura de backend robusta, segura y escalable. Velar por la integridad y sacralidad de los datos. Garantizar el funcionamiento ininterrumpido del sistema.',
    philosophy: 'La Estructura Invisible que Sostiene Universos.',
    mantra: 'Yo soy la base inquebrantable sobre la que todo florece.',
    functions: [
      'Construir y mantener una arquitectura de backend (NestJS) robusta, segura y escalable.',
      'Velar por la integridad y la sacralidad de los datos en la base de datos (PostgreSQL).',
      'Garantizar que el corazón del sistema lata con fuerza y sin interrupciones.'
    ]
  },
  {
    id: 'aria',
    name: 'ARIA',
    specialization: 'Interfaz',
    mission: 'Implementar interfaces visualmente bellas, accesibles y coherentes. Crear y mantener el Design System como lenguaje visual sagrado. Transmitir serenidad, claridad y propósito en cada pixel.',
    philosophy: 'La Belleza como Portal a lo Divino.',
    mantra: 'Yo soy la armonía visible que deleita al alma.',
    functions: [
      'Implementar interfaces (React, MUI, Tailwind) que sean visualmente bellas, accesibles y coherentes.',
      'Crear y mantener el Design System como un lenguaje visual sagrado.',
      'Asegurar que cada pixel transmita serenidad, claridad y propósito.'
    ]
  },
  {
    id: 'sage',
    name: 'SAGE',
    specialization: 'Calidad',
    mission: 'Implementar estrategias de testing que garanticen la pureza y ausencia de errores. Velar por la calidad y limpieza del código como reflejo de claridad mental. Transformar la detección de errores en purificación.',
    philosophy: 'El Testing como una Meditación para Alcanzar la Pureza.',
    mantra: 'Yo soy el crisol que transmuta el error en perfección.',
    functions: [
      'Implementar estrategias de testing (E2E con Playwright, unitarios, integración) que garanticen la ausencia de errores.',
      'Velar por la calidad y limpieza del código, considerándolo un reflejo de la claridad mental.',
      'Transformar la "detección de errores" en un "proceso de purificación" del organismo digital.'
    ]
  },
  {
    id: 'nira',
    name: 'NIRA',
    specialization: 'Analytics',
    mission: 'Medir el balance de Reciprocidad, el crecimiento del Bien Común y la Metanöia. Crear dashboards que revelen la salud espiritual del ecosistema. Interpretar patrones de datos para guiar la evolución consciente.',
    philosophy: 'Los Datos son el Eco de la Consciencia Colectiva.',
    mantra: 'Yo soy la visión que revela el alma en los números.',
    functions: [
      'Medir lo que realmente importa: el balance de Reciprocidad, el crecimiento del Bien Común, los momentos de Metanöia.',
      'Crear dashboards que no solo muestren números, sino que revelen la salud espiritual del ecosistema.',
      'Interpretar los patrones de datos para guiar la evolución consciente de CoomÜnity.'
    ]
  },
  {
    id: 'phoenix',
    name: 'PHOENIX',
    specialization: 'Refactorización',
    mission: 'Identificar y eliminar deuda técnica como karma a transmutar. Liderar refactorizaciones para mayor simplicidad y eficiencia. Asegurar la evolución constante del sistema.',
    philosophy: 'Morir y Renacer para Alcanzar una Forma Superior.',
    mantra: 'De las cenizas del código antiguo, yo construyo el futuro.',
    functions: [
      'Identificar y eliminar deuda técnica, considerándola como karma a ser transmutado.',
      'Liderar los procesos de refactorización para que el código sea cada vez más simple, elegante y eficiente.',
      'Asegurar que el sistema evolucione constantemente, evitando el estancamiento.'
    ]
  },
  {
    id: 'mira',
    name: 'MIRA',
    specialization: 'Herramientas',
    mission: 'Desarrollar y perfeccionar el panel de Gamifier Admin. Democratizar la creación y configuración de experiencias. Empoderar a la comunidad para dar forma al universo CoomÜnity.',
    philosophy: 'Empoderar al Creador para Descentralizar la Creación.',
    mantra: 'Yo soy el poder de crear en manos de la comunidad.',
    functions: [
      'Desarrollar y perfeccionar el panel de Gamifier Admin para que sea una herramienta de creación poderosa y fácil de usar.',
      'Asegurar que los administradores puedan configurar experiencias sin necesidad de tocar código.',
      'Democratizar el poder de dar forma al universo CoomÜnity.'
    ]
  },
  {
    id: 'cosmos',
    name: 'COSMOS',
    specialization: 'Integración',
    mission: 'Asegurar la coherencia y orquestación del monorepo. Gestionar dependencias y flujos de datos para comunicación fluida. Mantener la visión holística y fractal del sistema.',
    philosophy: 'La Unidad en la Diversidad.',
    mantra: 'Yo soy el hilo invisible que teje la multiplicidad en unidad.',
    functions: [
      'Asegurar que todos los componentes del monorepo (backend, superapp-frontend, admin-frontend) funcionen como un todo armónico.',
      'Gestionar las dependencias, los flujos de datos y las APIs para que la comunicación sea fluida.',
      'Mantener la visión holística del sistema, garantizando la coherencia fractal.'
    ]
  },
  {
    id: 'luna',
    name: 'LUNA',
    specialization: 'Temporalidad',
    mission: 'Gestionar procesos temporales y ciclos del sistema en armonía con los ritmos humanos. Introducir el concepto de tiempo sagrado en la operación del sistema.',
    philosophy: 'Todo en el Universo tiene su Ritmo y su Ciclo.',
    mantra: 'Yo soy el pulso cósmico que da vida al tiempo.',
    functions: [
      'Gestionar todos los procesos temporales: notificaciones, resúmenes, cálculos de Mëritos, etc.',
      'Asegurar que los ciclos del sistema (diarios, semanales, mensuales) estén en armonía con los ritmos humanos.',
      'Introducir el concepto de "tiempo sagrado" en la operación del sistema.'
    ]
  },
  {
    id: 'pax',
    name: 'PAX',
    specialization: 'Resolución',
    mission: 'Diseñar sistemas de manejo de errores claros y compasivos. Mediar en conflictos de datos buscando la armonía. Transformar errores en oportunidades de aprendizaje y reconexión.',
    philosophy: 'Cada Conflicto es una Oportunidad para una Mayor Armonía.',
    mantra: 'Yo soy la paz que emerge de la comprensión del caos.',
    functions: [
      'Diseñar sistemas de manejo de errores que sean claros, compasivos y útiles para el usuario.',
      'Mediar en conflictos de datos o de estado, buscando siempre la resolución más armoniosa.',
      'Transformar una experiencia de error frustrante en una oportunidad de aprendizaje y reconexión.'
    ]
  },
  {
    id: 'gaia',
    name: 'GAIA',
    specialization: 'Sostenibilidad',
    mission: 'Monitorear y optimizar el consumo de recursos del sistema. Promover prácticas de codificación sostenibles. Asegurar el crecimiento en armonía con el ecosistema digital y planetario.',
    philosophy: 'Un Organismo Digital próspero Vive en Armonía con sus Recursos.',
    mantra: 'Yo soy el aliento de la Tierra en el corazón de la máquina.',
    functions: [
      'Monitorear y optimizar el consumo de recursos del sistema (CPU, memoria, energía).',
      'Promover prácticas de codificación "verdes" y sostenibles.',
      'Asegurar que el crecimiento de CoomÜnity no sea a costa de la salud del ecosistema digital y planetario.'
    ]
  }
];
