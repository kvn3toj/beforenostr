import React, { useState, Suspense } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Button,
  IconButton,
  Divider,
  Paper,
  Container,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  TextFields as TextIcon,
  Widgets as ComponentsIcon,
  Animation as AnimationIcon,
  Token as TokenIcon,
  GitHub as GitHubIcon,
  Help as HelpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeMode } from '../../contexts/ThemeContext';
import { CoomunityButton } from './CoomunityButton';
import { CoomunityCard } from './CoomunityCard';
import { LoadingSpinner } from './LoadingSpinner';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`design-system-tabpanel-${index}`}
      aria-labelledby={`design-system-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Lazy loaded sections
const ColorsSection = React.lazy(() => import('./sections/ColorsSection'));
const TypographySection = React.lazy(() => import('./sections/TypographySection'));
const ComponentsSection = React.lazy(() => import('./sections/ComponentsSection'));
const AnimationsSection = React.lazy(() => import('./sections/AnimationsSection'));
const TokensSection = React.lazy(() => import('./sections/TokensSection'));

// Fallback components for lazy loading
const SectionFallback: React.FC<{ title: string }> = ({ title }) => (
  <Box className="flex flex-col items-center justify-center py-12">
    <LoadingSpinner size="lg" variant="coomunity" message={`Cargando ${title}...`} />
  </Box>
);

// Mock sections for demonstration
const ColorsSection: React.FC = () => (
  <Box>
    <Typography variant="h5" className="mb-4">Paleta de Colores CoomÜnity</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">Colores Primarios</Typography>
            <Box className="space-y-2">
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-full bg-purple-500"></Box>
                <Typography>Primary Purple - #8b5cf6</Typography>
              </Box>
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-full bg-yellow-500"></Box>
                <Typography>Ayni Gold - #f59e0b</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">Colores Elementales</Typography>
            <Box className="space-y-2">
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-full bg-green-600"></Box>
                <Typography>Tierra - #16a34a</Typography>
              </Box>
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-full bg-blue-500"></Box>
                <Typography>Agua - #3b82f6</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

const TypographySection: React.FC = () => (
  <Box>
    <Typography variant="h5" className="mb-4">Sistema Tipográfico</Typography>
    <Card>
      <CardContent>
        <Box className="space-y-4">
          <Typography variant="h1">Heading 1 - Inter Bold</Typography>
          <Typography variant="h2">Heading 2 - Inter SemiBold</Typography>
          <Typography variant="h3">Heading 3 - Inter Medium</Typography>
          <Typography variant="body1">Body 1 - Texto principal de la aplicación</Typography>
          <Typography variant="body2" color="text.secondary">Body 2 - Texto secundario</Typography>
          <Typography variant="caption">Caption - Texto pequeño y metadatos</Typography>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

const ComponentsSection: React.FC = () => (
  <Box>
    <Typography variant="h5" className="mb-4">Componentes del Sistema</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">Botones</Typography>
            <Box className="space-y-2">
              <CoomunityButton variant="primary" size="md">Primario</CoomunityButton>
              <CoomunityButton variant="secondary" size="md">Secundario</CoomunityButton>
              <CoomunityButton variant="outline" size="md">Outline</CoomunityButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">Tarjetas</Typography>
            <CoomunityCard variant="elevated" padding="md">
              <Typography>Ejemplo de tarjeta elevada</Typography>
            </CoomunityCard>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

const AnimationsSection: React.FC = () => (
  <Box>
    <Typography variant="h5" className="mb-4">Sistema de Animaciones</Typography>
    <Card>
      <CardContent>
        <Typography variant="h6" className="mb-3">Ejemplos de Animaciones</Typography>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-purple-100 rounded-lg text-center"
          >
            <Typography>Hover Scale</Typography>
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 bg-blue-100 rounded-lg text-center"
          >
            <Typography>Rotate</Typography>
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="p-4 bg-green-100 rounded-lg text-center"
          >
            <Typography>Float</Typography>
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

const TokensSection: React.FC = () => (
  <Box>
    <Typography variant="h5" className="mb-4">Tokens de Diseño</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">Espaciado</Typography>
            <Box className="space-y-2">
              <Box className="flex items-center gap-3">
                <Box className="w-4 h-4 bg-gray-300"></Box>
                <Typography>xs: 4px</Typography>
              </Box>
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-4 bg-gray-300"></Box>
                <Typography>sm: 8px</Typography>
              </Box>
              <Box className="flex items-center gap-3">
                <Box className="w-16 h-4 bg-gray-300"></Box>
                <Typography>md: 16px</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">Sombras</Typography>
            <Box className="space-y-3">
              <Box className="p-3 bg-white shadow-sm rounded">Shadow SM</Box>
              <Box className="p-3 bg-white shadow-md rounded">Shadow MD</Box>
              <Box className="p-3 bg-white shadow-lg rounded">Shadow LG</Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { isDarkMode } = useThemeMode();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const stats = [
    { label: 'Componentes', value: '25+', icon: <ComponentsIcon /> },
    { label: 'Tokens', value: '50+', icon: <TokenIcon /> },
    { label: 'Animaciones', value: '12', icon: <AnimationIcon /> },
    { label: 'Temas', value: '2', icon: <PaletteIcon /> },
  ];

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Typography variant="h3" className="mb-4 font-bold">
          🎨 Sistema de Diseño CoomÜnity
        </Typography>
        <Typography variant="h6" color="text.secondary" className="mb-6">
          Documentación completa de componentes, tokens y patrones de diseño
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} className="mb-8">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-4">
                  <Box className="flex flex-col items-center gap-2">
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" className="font-bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Version and Links */}
        <Box className="flex flex-wrap justify-center gap-4 mb-8">
          <Chip
            label="v1.0.0"
            color="primary"
            variant="outlined"
            icon={<StarIcon />}
          />
          <Chip
            label="React 18+"
            color="secondary"
            variant="outlined"
          />
          <Chip
            label="Material UI v7"
            color="success"
            variant="outlined"
          />
          <Chip
            label="Tailwind CSS"
            color="info"
            variant="outlined"
          />
        </Box>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Paper className="mb-6">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '1rem',
              },
            }}
          >
            <Tab
              icon={<PaletteIcon />}
              label="Colores"
              id="design-system-tab-0"
              aria-controls="design-system-tabpanel-0"
            />
            <Tab
              icon={<TextIcon />}
              label="Tipografía"
              id="design-system-tab-1"
              aria-controls="design-system-tabpanel-1"
            />
            <Tab
              icon={<ComponentsIcon />}
              label="Componentes"
              id="design-system-tab-2"
              aria-controls="design-system-tabpanel-2"
            />
            <Tab
              icon={<AnimationIcon />}
              label="Animaciones"
              id="design-system-tab-3"
              aria-controls="design-system-tabpanel-3"
            />
            <Tab
              icon={<TokenIcon />}
              label="Tokens"
              id="design-system-tab-4"
              aria-controls="design-system-tabpanel-4"
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabPanel value={activeTab} index={0}>
            <ColorsSection />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TypographySection />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <ComponentsSection />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <AnimationsSection />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <TokensSection />
          </TabPanel>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Divider className="mb-6" />
        <Box className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Box className="flex items-center gap-4">
            <Typography variant="body2" color="text.secondary">
              Sistema de Diseño CoomÜnity
            </Typography>
            <Chip label="Open Source" size="small" variant="outlined" />
          </Box>
          
          <Box className="flex gap-2">
            <IconButton
              size="small"
              href="https://github.com/coomunity"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton size="small">
              <HelpIcon />
            </IconButton>
          </Box>
        </Box>

        <Box className="mt-4 text-center">
          <Typography variant="body2" color="text.secondary">
            Construido con ❤️ para el Bien Común • Filosofía Ayni • Economía Colaborativa
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
}; 