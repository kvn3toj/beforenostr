import React, { useState } from 'react';
// ❌ REMOVIDO: import './solar-system-svg.css' (archivo no existe)

// Helpers para aleatoriedad (inspirados en Cloud Four)
function random(min: number, max: number) {
  return min + (max - min) * Math.random();
}
function randomInt(min: number, max: number) {
  return Math.round(random(min, max));
}
function randomItemInArray<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

// Genera datos de planetas
function generatePlanets(starSize: number) {
  const planets = [];
  let planetSize = randomInt(12, 32);
  let orbitDistance = starSize + randomInt(60, 90);
  let i = 0;
  while (orbitDistance + planetSize < 480) {
    const hue = randomInt(0, 360);
    const color = `hsl(${hue}, ${randomInt(60, 100)}%, ${randomInt(45, 70)}%)`;
    const speed = orbitDistance * randomInt(40, 70); // ms
    planets.push({
      id: i,
      size: planetSize,
      orbit: orbitDistance,
      color,
      speed,
      startRotation: randomInt(0, 360),
      name: `Planeta ${i + 1}`,
    });
    planetSize = randomInt(12, 32);
    orbitDistance += randomInt(50, 90);
    i++;
  }
  return planets;
}

// Genera estrellas de fondo
function generateStars(count = 60) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: random(0, 1000),
    y: random(0, 1000),
    r: random(0.5, 2.2),
    opacity: random(0.2, 0.8),
  }));
}

const width = 1000;
const height = 1000;

const SolarSystemSVG: React.FC = () => {
  const [seed, setSeed] = useState(Date.now());
  // For reproducibility, could use a seeded RNG
  const starSize = randomInt(70, 120);
  const planets = generatePlanets(starSize);
  const stars = generateStars();

  // Sol central: solo rojo, amarillo o azul (ver Cloud Four)
  const starHueRanges = [
    [330, 390], // rojo
    [40, 60],   // amarillo
    [190, 240], // azul
  ];
  let hueRange = randomItemInArray(starHueRanges);
  let starHue = randomInt(hueRange[0], hueRange[1]);
  if (starHue > 360) starHue -= 360;
  const starColor = `hsl(${starHue}, ${randomInt(90, 100)}%, ${randomInt(60, 80)}%)`;

  // Tooltip state
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="solar-system-svg-wrapper">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, #10131a 70%, #000 100%)' }}
        role="img"
        aria-labelledby="solarSystemTitle"
        aria-describedby="solarSystemDescription"
      >
        <title id="solarSystemTitle">Sistema solar SVG animado</title>
        <desc id="solarSystemDescription">Sistema solar procedural con planetas y órbitas animadas</desc>
        {/* Estrellas de fondo */}
        {stars.map(star => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#fff"
            opacity={star.opacity}
            className="solar-star"
          />
        ))}
        {/* Órbitas */}
        {planets.map(planet => (
          <ellipse
            key={`orbit-${planet.id}`}
            cx={width / 2}
            cy={height / 2}
            rx={planet.orbit}
            ry={planet.orbit * random(0.95, 1.05)}
            fill="none"
            stroke="#fff2"
            strokeDasharray="4 6"
            strokeWidth={planet.id === hovered ? 2.5 : 1.2}
            className="solar-orbit"
          />
        ))}
        {/* Sol central */}
        <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="60%" stopColor={starColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fff0" stopOpacity="0" />
        </radialGradient>
        <circle
          cx={width / 2}
          cy={height / 2}
          r={starSize}
          fill={starColor}
          filter="url(#star-blur)"
        />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={starSize * 1.25}
          fill="url(#star-glow)"
          opacity="0.7"
        />
        {/* Planetas */}
        {planets.map(planet => {
          // Animación de órbita: cada planeta en un <g> rotado
          const orbitAnim = {
            animation: `orbit ${planet.speed}ms linear infinite`,
            transformOrigin: `${width / 2}px ${height / 2}px`,
            animationDelay: `${planet.startRotation}ms`,
          } as React.CSSProperties;
          // Posición inicial (en el eje X)
          const px = width / 2 + planet.orbit;
          const py = height / 2;
          return (
            <g
              key={planet.id}
              style={orbitAnim}
              className="solar-planet-group"
              onMouseEnter={() => setHovered(planet.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle
                cx={px}
                cy={py}
                r={planet.size}
                fill={planet.color}
                stroke="#fff8"
                strokeWidth={hovered === planet.id ? 4 : 2}
                className={hovered === planet.id ? 'solar-planet hovered' : 'solar-planet'}
                style={{ filter: hovered === planet.id ? 'drop-shadow(0 0 16px #fff8)' : undefined }}
              />
              {/* Atmósfera/halo */}
              <circle
                cx={px}
                cy={py}
                r={planet.size * 1.25}
                fill={planet.color}
                opacity={0.18}
                filter="blur(2px)"
              />
              {/* Tooltip */}
              {hovered === planet.id && (
                <foreignObject x={px - 60} y={py - planet.size - 40} width="120" height="32">
                  <div className="solar-tooltip">
                    <strong>{planet.name}</strong>
                    <br />
                    <span>{planet.size} km</span>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
        {/* Filtros SVG para glow del sol */}
        <filter id="star-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </svg>
      <button className="solar-refresh-btn" onClick={() => setSeed(Date.now())}>
        Regenerar Sistema Solar
      </button>
    </div>
  );
};

export default SolarSystemSVG; 