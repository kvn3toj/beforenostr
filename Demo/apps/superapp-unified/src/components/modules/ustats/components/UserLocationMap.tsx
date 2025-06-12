import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Stack,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Place as PlaceIcon } from '@mui/icons-material';

interface LocationData {
  country: string;
  city: string;
  users: number;
  lat: number;
  lng: number;
  color?: string;
}

interface UserLocationMapProps {
  data: LocationData[];
  title: string;
}

const UserLocationMap: React.FC<UserLocationMapProps> = ({ data, title }) => {
  const theme = useTheme();
  const [hoveredLocation, setHoveredLocation] = useState<LocationData | null>(
    null
  );

  const maxUsers = Math.max(...data.map((d) => d.users));

  // Simplified map of Latin America (approximate coordinates)
  const mapPath = `
    M 100 50 
    L 300 50 
    L 350 100 
    L 380 200 
    L 350 300 
    L 300 380 
    L 200 400 
    L 150 390 
    L 100 350 
    L 80 250 
    L 100 150 
    Z
  `;

  const getMarkerSize = (users: number) => {
    return 4 + (users / maxUsers) * 16;
  };

  const getLocationPosition = (country: string, city: string) => {
    // Simplified positions for demo - in real app would use actual coordinates
    const positions: { [key: string]: { x: number; y: number } } = {
      'México-Ciudad de México': { x: 150, y: 120 },
      'Colombia-Bogotá': { x: 200, y: 200 },
      'Argentina-Buenos Aires': { x: 220, y: 350 },
      'Perú-Lima': { x: 180, y: 280 },
      'Chile-Santiago': { x: 200, y: 340 },
      'Brasil-São Paulo': { x: 280, y: 300 },
      'Venezuela-Caracas': { x: 210, y: 180 },
      'Ecuador-Quito': { x: 170, y: 240 },
      'Uruguay-Montevideo': { x: 240, y: 360 },
      'Paraguay-Asunción': { x: 250, y: 320 },
    };

    return positions[`${country}-${city}`] || { x: 200, y: 200 };
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>

      <Box display="flex" gap={3} alignItems="flex-start">
        {/* Map */}
        <Box sx={{ flex: 1 }}>
          <svg width="400" height="420" viewBox="0 0 400 420">
            {/* Map background */}
            <path
              d={mapPath}
              fill={alpha(theme.palette.primary.main, 0.1)}
              stroke={theme.palette.primary.main}
              strokeWidth="2"
            />

            {/* Country borders (simplified) */}
            <path
              d="M 100 150 L 200 140 L 250 180 L 280 220 M 180 200 L 220 250 M 200 280 L 250 300"
              stroke={alpha(theme.palette.primary.main, 0.3)}
              strokeWidth="1"
              fill="none"
              strokeDasharray="2,2"
            />

            {/* Location markers */}
            {data.map((location, index) => {
              const position = getLocationPosition(
                location.country,
                location.city
              );
              const markerSize = getMarkerSize(location.users);
              const isHovered = hoveredLocation === location;

              return (
                <g key={`${location.country}-${location.city}`}>
                  {/* Pulse effect for hovered marker */}
                  {isHovered && (
                    <motion.circle
                      cx={position.x}
                      cy={position.y}
                      r={markerSize + 5}
                      fill={alpha(theme.palette.secondary.main, 0.3)}
                      animate={{
                        r: [markerSize + 5, markerSize + 15, markerSize + 5],
                        opacity: [0.6, 0.2, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Main marker */}
                  <motion.circle
                    cx={position.x}
                    cy={position.y}
                    r={markerSize}
                    fill={location.color || theme.palette.secondary.main}
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredLocation(location)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.2 }}
                  />

                  {/* User count label */}
                  <text
                    x={position.x}
                    y={position.y + 2}
                    fontSize="10"
                    fill="white"
                    textAnchor="middle"
                    fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                  >
                    {location.users > 99 ? '99+' : location.users}
                  </text>
                </g>
              );
            })}

            {/* Tooltip */}
            {hoveredLocation && (
              <g>
                <rect
                  x={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).x + 20
                  }
                  y={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).y - 20
                  }
                  width="140"
                  height="50"
                  fill={theme.palette.background.paper}
                  stroke={theme.palette.divider}
                  strokeWidth="1"
                  rx="4"
                  filter="drop-shadow(0 2px 8px rgba(0,0,0,0.15))"
                />
                <text
                  x={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).x + 30
                  }
                  y={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).y - 5
                  }
                  fontSize="12"
                  fill={theme.palette.text.primary}
                  fontWeight="600"
                >
                  {hoveredLocation.city}
                </text>
                <text
                  x={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).x + 30
                  }
                  y={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).y + 8
                  }
                  fontSize="10"
                  fill={theme.palette.text.secondary}
                >
                  {hoveredLocation.country}
                </text>
                <text
                  x={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).x + 30
                  }
                  y={
                    getLocationPosition(
                      hoveredLocation.country,
                      hoveredLocation.city
                    ).y + 22
                  }
                  fontSize="11"
                  fill={theme.palette.primary.main}
                  fontWeight="600"
                >
                  {hoveredLocation.users} usuarios
                </text>
              </g>
            )}
          </svg>
        </Box>

        {/* Legend and Stats */}
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Top Ubicaciones
          </Typography>

          <Stack spacing={2} sx={{ maxHeight: 300, overflow: 'auto' }}>
            {data
              .sort((a, b) => b.users - a.users)
              .slice(0, 8)
              .map((location, index) => (
                <motion.div
                  key={`${location.country}-${location.city}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={1.5}
                    sx={{
                      backgroundColor:
                        hoveredLocation === location
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.grey[100], 0.5),
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: `1px solid ${
                        hoveredLocation === location
                          ? alpha(theme.palette.primary.main, 0.3)
                          : 'transparent'
                      }`,
                    }}
                    onMouseEnter={() => setHoveredLocation(location)}
                    onMouseLeave={() => setHoveredLocation(null)}
                  >
                    <Box display="flex" alignItems="center">
                      <PlaceIcon
                        sx={{
                          fontSize: 16,
                          color: location.color || theme.palette.secondary.main,
                          mr: 1,
                        }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {location.city}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {location.country}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={location.users}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                        minWidth: 40,
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
          </Stack>

          <Box
            mt={3}
            p={2}
            sx={{
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              gutterBottom
              display="block"
            >
              Total de usuarios
            </Typography>
            <Typography variant="h5" color="primary.main" fontWeight={600}>
              {data
                .reduce((sum, location) => sum + location.users, 0)
                .toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserLocationMap;
