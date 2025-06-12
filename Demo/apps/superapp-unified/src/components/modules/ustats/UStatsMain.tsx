import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Download as DownloadIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';

// Gaming Dashboard Components
import GamingStatsCard from './components/GamingStatsCard';
import ProgressRing from './components/ProgressRing';
import ActivityChart from './components/ActivityChart';
import AchievementBar from './components/AchievementBar';
import RealTimeMetrics from './components/RealTimeMetrics';

interface SearchStat {
  term: string;
  category: string;
  requests: number;
  success: number;
  avgTime: number;
}

interface ResourceMetric {
  type: string;
  count: number;
  percentage: number;
  growth: number;
}

interface PerformanceData {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface ActivityData {
  time: string;
  searches: number;
  conversions: number;
  users: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const UStatsMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  // Gaming colors palette
  const GAMING_COLORS = {
    primary: '#00ff88',
    secondary: '#ff0088',
    accent: '#ffaa00',
    background: '#0a0a0a',
    cardBg: '#1a1a1a',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff4444',
    neon: '#00ffff',
  };

  // Mock real-time data
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    searchesPerMinute: 23,
    conversionRate: 18.5,
    serverLoad: 67,
  });

  // Activity chart data with more dynamic points
  const activityData: ActivityData[] = [
    { time: '00:00', searches: 45, conversions: 8, users: 120 },
    { time: '04:00', searches: 28, conversions: 5, users: 89 },
    { time: '08:00', searches: 89, conversions: 16, users: 234 },
    { time: '12:00', searches: 156, conversions: 29, users: 421 },
    { time: '16:00', searches: 134, conversions: 25, users: 367 },
    { time: '20:00', searches: 112, conversions: 21, users: 298 },
  ];

  // Category breakdown data
  const categoryData: CategoryData[] = [
    {
      name: 'Trasciende',
      value: 35,
      color: GAMING_COLORS.primary,
      icon: <PsychologyIcon />,
    },
    {
      name: 'Evoluciona',
      value: 28,
      color: GAMING_COLORS.secondary,
      icon: <PersonIcon />,
    },
    {
      name: 'Crea',
      value: 22,
      color: GAMING_COLORS.accent,
      icon: <BusinessIcon />,
    },
    {
      name: 'Vive',
      value: 15,
      color: GAMING_COLORS.neon,
      icon: <SchoolIcon />,
    },
  ];

  // Performance metrics with gaming-style presentation
  const performanceData: PerformanceData[] = [
    {
      metric: 'Speed Score',
      value: 94,
      unit: '/100',
      trend: 'up',
      change: 8.5,
    },
    {
      metric: 'Active Users',
      value: 1247,
      unit: '',
      trend: 'up',
      change: 23.7,
    },
    {
      metric: 'Success Rate',
      value: 94.2,
      unit: '%',
      trend: 'up',
      change: 2.1,
    },
    {
      metric: 'Load Time',
      value: 2.1,
      unit: 's',
      trend: 'down',
      change: -15.3,
    },
    { metric: 'Conversions', value: 18.5, unit: '%', trend: 'up', change: 5.8 },
    {
      metric: 'Bounce Rate',
      value: 32.1,
      unit: '%',
      trend: 'down',
      change: -7.2,
    },
  ];

  // Server performance data
  const serverData = [
    { name: 'CPU', value: 67, color: GAMING_COLORS.primary },
    { name: 'RAM', value: 78, color: GAMING_COLORS.secondary },
    { name: 'Disk', value: 45, color: GAMING_COLORS.accent },
    { name: 'Network', value: 89, color: GAMING_COLORS.neon },
  ];

  // Search analytics
  const searchStats: SearchStat[] = [
    {
      term: 'coaching',
      category: 'trasciende',
      requests: 21,
      success: 19,
      avgTime: 2.4,
    },
    {
      term: 'desarrollo personal',
      category: 'evoluciona',
      requests: 18,
      success: 17,
      avgTime: 1.8,
    },
    {
      term: 'emprendimiento',
      category: 'crea',
      requests: 15,
      success: 14,
      avgTime: 2.1,
    },
    {
      term: 'bienestar',
      category: 'vive',
      requests: 12,
      success: 12,
      avgTime: 1.5,
    },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        searchesPerMinute: Math.max(
          10,
          prev.searchesPerMinute + Math.floor(Math.random() * 6 - 3)
        ),
        conversionRate: Math.max(
          10,
          Math.min(30, prev.conversionRate + (Math.random() - 0.5))
        ),
        serverLoad: Math.max(
          30,
          Math.min(90, prev.serverLoad + Math.floor(Math.random() * 10 - 5))
        ),
      }));
    }, 3000);

    // Initial loading simulation
    setTimeout(() => setIsLoading(false), 1000);

    return () => clearInterval(interval);
  }, []);

  const GamingHeader = () => (
    <AppBar
      position="sticky"
      sx={{
        background: `linear-gradient(45deg, ${GAMING_COLORS.background} 0%, #1a1a1a 100%)`,
        boxShadow: `0 0 20px ${GAMING_COLORS.primary}40`,
        borderBottom: `2px solid ${GAMING_COLORS.primary}`,
      }}
    >
      <Toolbar>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
        >
          <AssessmentIcon sx={{ mr: 2, color: GAMING_COLORS.primary }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: GAMING_COLORS.primary,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${GAMING_COLORS.primary}80`,
            }}
          >
            ÜStats - Gaming Analytics Dashboard
          </Typography>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <IconButton sx={{ color: GAMING_COLORS.accent }}>
            <DownloadIcon />
          </IconButton>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <IconButton sx={{ color: GAMING_COLORS.secondary }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </motion.div>
      </Toolbar>
    </AppBar>
  );

  const OverviewTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {/* Real-time Metrics Cards */}
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              color: GAMING_COLORS.primary,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${GAMING_COLORS.primary}60`,
              mb: 3,
            }}
          >
            🎮 Real-Time Gaming Metrics
          </Typography>
        </Grid>

        {/* Performance Cards Grid */}
        {performanceData.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={metric.metric}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GamingStatsCard
                title={metric.metric}
                value={metric.value}
                unit={metric.unit}
                trend={metric.trend}
                change={metric.change}
                color={
                  metric.trend === 'up'
                    ? GAMING_COLORS.success
                    : metric.trend === 'down'
                      ? GAMING_COLORS.error
                      : GAMING_COLORS.accent
                }
              />
            </motion.div>
          </Grid>
        ))}

        {/* Activity Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
                border: `1px solid ${GAMING_COLORS.primary}40`,
                borderRadius: 2,
                boxShadow: `0 0 20px ${GAMING_COLORS.primary}20`,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ color: GAMING_COLORS.primary, fontWeight: 'bold' }}
              >
                📈 Activity Timeline
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient
                        id="searchesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={GAMING_COLORS.primary}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={GAMING_COLORS.primary}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="conversionsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={GAMING_COLORS.secondary}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={GAMING_COLORS.secondary}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: GAMING_COLORS.cardBg,
                        border: `1px solid ${GAMING_COLORS.primary}`,
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="searches"
                      stroke={GAMING_COLORS.primary}
                      strokeWidth={2}
                      fill="url(#searchesGradient)"
                      name="Searches"
                    />
                    <Area
                      type="monotone"
                      dataKey="conversions"
                      stroke={GAMING_COLORS.secondary}
                      strokeWidth={2}
                      fill="url(#conversionsGradient)"
                      name="Conversions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Category Pie Chart */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
                border: `1px solid ${GAMING_COLORS.secondary}40`,
                borderRadius: 2,
                boxShadow: `0 0 20px ${GAMING_COLORS.secondary}20`,
                height: 350,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ color: GAMING_COLORS.secondary, fontWeight: 'bold' }}
              >
                🎯 Category Distribution
              </Typography>
              <Box height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={30}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: GAMING_COLORS.cardBg,
                        border: `1px solid ${GAMING_COLORS.secondary}`,
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box mt={2}>
                {categoryData.map((category, index) => (
                  <Box
                    key={category.name}
                    display="flex"
                    alignItems="center"
                    mb={1}
                  >
                    <Box
                      width={12}
                      height={12}
                      bgcolor={category.color}
                      borderRadius="50%"
                      mr={1}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: '#fff', fontSize: '0.8rem' }}
                    >
                      {category.name}: {category.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Progress Rings for Server Performance */}
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              color: GAMING_COLORS.accent,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${GAMING_COLORS.accent}60`,
              mt: 2,
              mb: 3,
            }}
          >
            ⚡ Server Performance
          </Typography>
        </Grid>

        {serverData.map((server, index) => (
          <Grid item xs={12} sm={6} md={3} key={server.name}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProgressRing
                title={server.name}
                value={server.value}
                color={server.color}
                maxValue={100}
              />
            </motion.div>
          </Grid>
        ))}

        {/* Real-time Metrics */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <RealTimeMetrics data={realTimeData} />
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );

  const SearchAnalyticsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              color: GAMING_COLORS.neon,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${GAMING_COLORS.neon}60`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            🔍 Search Analytics Gaming Console
          </Typography>
        </Grid>

        {/* Search Performance Bar Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
                border: `1px solid ${GAMING_COLORS.neon}40`,
                borderRadius: 2,
                boxShadow: `0 0 20px ${GAMING_COLORS.neon}20`,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ color: GAMING_COLORS.neon, fontWeight: 'bold' }}
              >
                📊 Search Performance Analysis
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={searchStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="term" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: GAMING_COLORS.cardBg,
                        border: `1px solid ${GAMING_COLORS.neon}`,
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="requests"
                      fill={GAMING_COLORS.primary}
                      name="Total Requests"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="success"
                      fill={GAMING_COLORS.success}
                      name="Successful"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Search Categories */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
                border: `1px solid ${GAMING_COLORS.accent}40`,
                borderRadius: 2,
                boxShadow: `0 0 20px ${GAMING_COLORS.accent}20`,
                height: 350,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ color: GAMING_COLORS.accent, fontWeight: 'bold' }}
              >
                🏆 Top Categories
              </Typography>
              {categoryData.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                    p={2}
                    sx={{
                      background: `linear-gradient(90deg, ${category.color}20 0%, transparent 100%)`,
                      borderLeft: `3px solid ${category.color}`,
                      borderRadius: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: category.color,
                          mr: 2,
                          boxShadow: `0 0 10px ${category.color}60`,
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                        {category.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${category.value}%`}
                      sx={{
                        bgcolor: category.color,
                        color: '#000',
                        fontWeight: 'bold',
                        boxShadow: `0 0 8px ${category.color}60`,
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
            </Paper>
          </motion.div>
        </Grid>

        {/* Achievement Progress Bars */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{
                color: GAMING_COLORS.primary,
                fontWeight: 'bold',
                textShadow: `0 0 10px ${GAMING_COLORS.primary}60`,
                mt: 2,
                mb: 3,
              }}
            >
              🎯 Achievement Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <AchievementBar
                  title="Search Master"
                  description="Complete 1000 searches"
                  current={856}
                  target={1000}
                  color={GAMING_COLORS.primary}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <AchievementBar
                  title="Conversion Hero"
                  description="Achieve 25% conversion rate"
                  current={18.5}
                  target={25}
                  color={GAMING_COLORS.secondary}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <AchievementBar
                  title="Speed Demon"
                  description="Load time under 2 seconds"
                  current={2.1}
                  target={2.0}
                  color={GAMING_COLORS.accent}
                  inverted={true}
                />
              </Grid>
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );

  const PerformanceTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              color: GAMING_COLORS.secondary,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${GAMING_COLORS.secondary}60`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TimelineIcon sx={{ mr: 1 }} />⚡ Performance Gaming Console
          </Typography>
        </Grid>

        {/* Radial Performance Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
                border: `1px solid ${GAMING_COLORS.secondary}40`,
                borderRadius: 2,
                boxShadow: `0 0 20px ${GAMING_COLORS.secondary}20`,
                height: 400,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ color: GAMING_COLORS.secondary, fontWeight: 'bold' }}
              >
                🎮 Performance Radar
              </Typography>
              <Box height={320}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    data={performanceData.map((metric) => ({
                      name: metric.metric,
                      value: metric.value,
                      fill:
                        metric.trend === 'up'
                          ? GAMING_COLORS.success
                          : metric.trend === 'down'
                            ? GAMING_COLORS.error
                            : GAMING_COLORS.accent,
                    }))}
                  >
                    <RadialBar
                      minAngle={15}
                      label={{ position: 'insideStart', fill: '#fff' }}
                      background
                      clockWise
                      dataKey="value"
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: GAMING_COLORS.cardBg,
                        border: `1px solid ${GAMING_COLORS.secondary}`,
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Live Activity Feed */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <ActivityChart data={activityData} />
          </motion.div>
        </Grid>

        {/* System Health Status */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
                border: `1px solid ${GAMING_COLORS.primary}40`,
                borderRadius: 2,
                boxShadow: `0 0 20px ${GAMING_COLORS.primary}20`,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ color: GAMING_COLORS.primary, fontWeight: 'bold', mb: 3 }}
              >
                🖥️ System Health Status
              </Typography>
              <Grid container spacing={3}>
                {serverData.map((metric, index) => (
                  <Grid item xs={12} sm={6} md={3} key={metric.name}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Box
                        textAlign="center"
                        p={2}
                        sx={{
                          background: `linear-gradient(135deg, ${metric.color}20 0%, transparent 100%)`,
                          border: `1px solid ${metric.color}40`,
                          borderRadius: 2,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            color: metric.color,
                            fontWeight: 'bold',
                            textShadow: `0 0 10px ${metric.color}60`,
                            mb: 1,
                          }}
                        >
                          {metric.value}%
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: '#fff', textTransform: 'uppercase' }}
                        >
                          {metric.name}
                        </Typography>
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          width={`${metric.value}%`}
                          height={4}
                          sx={{
                            background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}80 100%)`,
                            boxShadow: `0 0 10px ${metric.color}60`,
                            transition: 'width 0.5s ease-out',
                          }}
                        />
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 0:
        return <OverviewTab />;
      case 1:
        return <SearchAnalyticsTab />;
      case 2:
        return <PerformanceTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: `linear-gradient(135deg, ${GAMING_COLORS.background} 0%, #1a1a1a 100%)`,
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <AssessmentIcon
            sx={{
              fontSize: 64,
              color: GAMING_COLORS.primary,
              filter: `drop-shadow(0 0 20px ${GAMING_COLORS.primary}60)`,
            }}
          />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${GAMING_COLORS.background} 0%, #1a1a1a 100%)`,
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <GamingHeader />

      <Box
        sx={{
          background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
          py: 4,
          borderBottom: `2px solid ${GAMING_COLORS.primary}40`,
          boxShadow: `0 0 30px ${GAMING_COLORS.primary}20`,
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                background: `linear-gradient(45deg, ${GAMING_COLORS.primary}, ${GAMING_COLORS.secondary})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              }}
            >
              🎮 ÜStats Gaming Dashboard
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: GAMING_COLORS.accent,
                textShadow: `0 0 10px ${GAMING_COLORS.accent}40`,
              }}
            >
              Advanced Analytics & Real-Time Performance Monitoring
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                color: '#666',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  color: GAMING_COLORS.primary,
                  textShadow: `0 0 10px ${GAMING_COLORS.primary}60`,
                },
                '&:hover': {
                  color: GAMING_COLORS.accent,
                  transform: 'translateY(-2px)',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: GAMING_COLORS.primary,
                height: 3,
                borderRadius: '3px 3px 0 0',
                boxShadow: `0 0 10px ${GAMING_COLORS.primary}60`,
              },
            }}
          >
            <Tab label="🎮 Gaming Overview" />
            <Tab label="🔍 Search Console" />
            <Tab label="⚡ Performance Hub" />
          </Tabs>
        </motion.div>

        <AnimatePresence mode="wait">
          <TabContent />
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default UStatsMain;
