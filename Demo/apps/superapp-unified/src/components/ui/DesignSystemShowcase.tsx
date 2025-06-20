import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Palette,
  TextFields,
  ViewModule,
  Animation,
  Star,
  TrendingUp,
  Nature,
  Handshake,
} from '@mui/icons-material';
import { cn, animations, coomunityColors } from '../../utils/styles';
import { Card as CoomunityCard, Button as CoomunityButton } from './';
import { useTheme } from '../../contexts/ThemeContext';

// 🎯 Types
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 📋 Tab Panel Component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`design-system-tabpanel-${index}`}
    >
      {value === index && children}
    </div>
  );
};

// 🌟 Design System Showcase Component
export const DesignSystemShowcase: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { toggleTheme, isDark } = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // 🎨 Color Palette Section
  const ColorPalette: React.FC = () => (
    <Box className="space-y-6">
      <Typography variant="h5" className="font-semibold mb-4">
        Sistema de Colores CoomÜnity
      </Typography>

      {/* Primary Colors */}
      <Box>
        <Typography variant="h6" className="mb-3">Colores Primarios</Typography>
        <Grid container spacing={2}>
          {Object.entries(coomunityColors.primary).map(([shade, color]) => (
            <Grid size={{xs:6,sm:4,md:2}} key={shade}>
              <CoomunityCard variant="outlined" padding="sm" className="text-center">
                <Box
                  className="w-full h-16 rounded-lg mb-2"
                  style={{ backgroundColor: color }}
                />
                <Typography variant="caption" className="font-mono">
                  {shade}
                </Typography>
                <Typography variant="caption" className="block text-gray-500 font-mono">
                  {color}
                </Typography>
              </CoomunityCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CoomÜnity Elements */}
      <Box>
        <Typography variant="h6" className="mb-3">Elementos CoomÜnity</Typography>
        <Grid container spacing={2}>
          {[
            { name: 'Tierra', color: '#92400e', icon: '🌍', concept: 'Solidez, Seguridad' },
            { name: 'Agua', color: '#0891b2', icon: '💧', concept: 'Fluidez, Claridad' },
            { name: 'Fuego', color: '#dc2626', icon: '🔥', concept: 'Acción, Energía' },
            { name: 'Aire', color: '#7c3aed', icon: '💨', concept: 'Visión, Estructura' },
          ].map((element) => (
            <Grid size={{xs:6,sm:3}} key={element.name}>
              <CoomunityCard variant="outlined" padding="sm" className="text-center">
                <Box
                  className="w-full h-16 rounded-lg mb-2 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: element.color }}
                >
                  {element.icon}
                </Box>
                <Typography variant="subtitle2" className="font-semibold">
                  {element.name}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {element.concept}
                </Typography>
              </CoomunityCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  // 📝 Typography Section
  const TypographyShowcase: React.FC = () => (
    <Box className="space-y-6">
      <Typography variant="h5" className="font-semibold mb-4">
        Sistema Tipográfico
      </Typography>

      {/* Headings */}
      <Box>
        <Typography variant="h6" className="mb-3">Jerarquía de Títulos</Typography>
        <CoomunityCard variant="outlined" padding="lg">
          <Typography variant="h1" className="mb-2">
            Heading 1 - CoomÜnity SuperApp
          </Typography>
          <Typography variant="h2" className="mb-2">
            Heading 2 - Economía Colaborativa
          </Typography>
          <Typography variant="h3" className="mb-2">
            Heading 3 - Ayni y Reciprocidad
          </Typography>
          <Typography variant="h4" className="mb-2">
            Heading 4 - Mëritos y Öndas
          </Typography>
          <Typography variant="h5" className="mb-2">
            Heading 5 - Bien Común
          </Typography>
          <Typography variant="h6" className="mb-2">
            Heading 6 - Emprendedores Confiables
          </Typography>
        </CoomunityCard>
      </Box>

      {/* CoomÜnity Terminology */}
      <Box>
        <Typography variant="h6" className="mb-3">Terminología CoomÜnity</Typography>
        <Grid container spacing={2}>
          {[
            { term: 'Ayni', definition: 'Principio de reciprocidad equilibrada', color: 'primary' },
            { term: 'Mëritos', definition: 'Recompensas por contribuir al Bien Común', color: 'warning' },
            { term: 'Öndas', definition: 'Unidades de energía vibracional positiva', color: 'info' },
            { term: 'Lükas', definition: 'Moneda interna de CoomÜnity', color: 'success' },
            { term: 'Bien Común', definition: 'Beneficio colectivo sobre individual', color: 'success' },
            { term: 'Emprendedores Confiables', definition: 'Usuarios verificados con alta reputación', color: 'warning' },
          ].map((item) => (
            <Grid size={{xs:12,sm:6,md:4}} key={item.term}>
              <CoomunityCard variant="outlined" padding="md">
                <Chip
                  label={item.term}
                  color={item.color as any}
                  className="mb-2"
                />
                <Typography variant="body2" className="text-gray-600">
                  {item.definition}
                </Typography>
              </CoomunityCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  // 🧩 Components Section
  const ComponentsShowcase: React.FC = () => (
    <Box className="space-y-6">
      <Typography variant="h5" className="font-semibold mb-4">
        Componentes del Sistema
      </Typography>

      {/* Buttons */}
      <Box>
        <Typography variant="h6" className="mb-3">Botones</Typography>
        <CoomunityCard variant="outlined" padding="lg">
          <Box className="flex flex-wrap gap-3 mb-4">
            <CoomunityButton variant="primary" size="sm">
              Primario SM
            </CoomunityButton>
            <CoomunityButton variant="primary" size="md">
              Primario MD
            </CoomunityButton>
            <CoomunityButton variant="primary" size="lg">
              Primario LG
            </CoomunityButton>
          </Box>
          
          <Box className="flex flex-wrap gap-3 mb-4">
            <CoomunityButton variant="secondary">
              Secundario
            </CoomunityButton>
            <CoomunityButton variant="outline">
              Outline
            </CoomunityButton>
            <CoomunityButton variant="ghost">
              Ghost
            </CoomunityButton>
          </Box>

          <Box className="flex flex-wrap gap-3">
            <CoomunityButton variant="success">
                              <Nature className="w-4 h-4 mr-2" />
              Bien Común
            </CoomunityButton>
            <CoomunityButton variant="warning">
              <Star className="w-4 h-4 mr-2" />
              Mëritos
            </CoomunityButton>
            <CoomunityButton variant="error">
              <Handshake className="w-4 h-4 mr-2" />
              Ayni
            </CoomunityButton>
          </Box>
        </CoomunityCard>
      </Box>

      {/* Cards */}
      <Box>
        <Typography variant="h6" className="mb-3">Tarjetas</Typography>
        <Grid container spacing={3}>
          <Grid size={{xs:12,sm:6,md:4}}>
            <CoomunityCard variant="elevated" padding="md">
              <Typography variant="h6" className="mb-2">
                Tarjeta Elevada
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-3">
                Perfecta para contenido principal con sombra sutil.
              </Typography>
              <CoomunityButton variant="primary" size="sm">
                Acción
              </CoomunityButton>
            </CoomunityCard>
          </Grid>

          <Grid size={{xs:12,sm:6,md:4}}>
            <CoomunityCard variant="outlined" padding="md">
              <Typography variant="h6" className="mb-2">
                Tarjeta Outlined
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-3">
                Ideal para contenido secundario con borde definido.
              </Typography>
              <CoomunityButton variant="outline" size="sm">
                Acción
              </CoomunityButton>
            </CoomunityCard>
          </Grid>

          <Grid size={{xs:12,sm:6,md:4}}>
            <CoomunityCard variant="coomunity" padding="md">
              <Typography variant="h6" className="mb-2">
                Tarjeta CoomÜnity
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-3">
                Especial para contenido destacado con gradiente.
              </Typography>
              <CoomunityButton variant="primary" size="sm">
                Acción
              </CoomunityButton>
            </CoomunityCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  // ✨ Animations Section
  const AnimationsShowcase: React.FC = () => (
    <Box className="space-y-6">
      <Typography variant="h5" className="font-semibold mb-4">
        Sistema de Animaciones
      </Typography>

      {/* Micro-interactions */}
      <Box>
        <Typography variant="h6" className="mb-3">Micro-interacciones</Typography>
        <CoomunityCard variant="outlined" padding="lg">
          <Grid container spacing={3}>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Box className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-16 h-16 bg-coomunity-500 rounded-lg mx-auto mb-2',
                    'flex items-center justify-center cursor-pointer',
                    animations.hoverLift
                  )}
                >
                  <Star className="text-white" />
                </motion.div>
                <Typography variant="caption">Hover Lift</Typography>
              </Box>
            </Grid>

            <Grid size={{xs:12,sm:6,md:3}}>
              <Box className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-success-500 rounded-lg mx-auto mb-2 flex items-center justify-center"
                >
                  <TrendingUp className="text-white" />
                </motion.div>
                <Typography variant="caption">Continuous Rotation</Typography>
              </Box>
            </Grid>

            <Grid size={{xs:12,sm:6,md:3}}>
              <Box className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 bg-warning-500 rounded-lg mx-auto mb-2 flex items-center justify-center"
                >
                  <Handshake className="text-white" />
                </motion.div>
                <Typography variant="caption">Pulse</Typography>
              </Box>
            </Grid>

            <Grid size={{xs:12,sm:6,md:3}}>
              <Box className="text-center">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="w-16 h-16 bg-info-500 rounded-lg mx-auto mb-2 flex items-center justify-center cursor-pointer"
                >
                                     <Nature className="text-white" />
                </motion.div>
                <Typography variant="caption">Hover Float</Typography>
              </Box>
            </Grid>
          </Grid>
        </CoomunityCard>
      </Box>
    </Box>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6"
    >
      {/* Header */}
      <Box className="mb-8">
        <Typography variant="h3" className="font-bold mb-2">
          Sistema de Diseño CoomÜnity
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-4">
          Documentación completa de tokens, componentes y patrones de diseño
        </Typography>
        
        <Box className="flex items-center gap-4">
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label="Modo Oscuro"
          />
          
          <Chip label="v1.0.0" color="primary" variant="outlined" />
          <Chip label="React 18+" color="success" variant="outlined" />
          <Chip label="Material UI v7" color="info" variant="outlined" />
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Paper className="mb-6">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Palette />} label="Colores" />
          <Tab icon={<TextFields />} label="Tipografía" />
          <Tab icon={<ViewModule />} label="Componentes" />
          <Tab icon={<Animation />} label="Animaciones" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={currentTab} index={0}>
        <ColorPalette />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <TypographyShowcase />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <ComponentsShowcase />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <AnimationsShowcase />
      </TabPanel>

      {/* Footer */}
      <Box className="text-center mt-8 pt-8 border-t border-gray-200">
        <Typography variant="body2" className="text-gray-500">
          Sistema de Diseño CoomÜnity • Construido con ❤️ para el Bien Común
        </Typography>
      </Box>
    </motion.div>
  );
};

export default DesignSystemShowcase; 