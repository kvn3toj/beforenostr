/**
 * 📱 PWA Features Component - Advanced Native Capabilities
 * 
 * Componente que implementa funcionalidades PWA avanzadas:
 * - Compartir nativo (Web Share API)
 * - Vibración del dispositivo
 * - Geolocalización y brújula
 * - Acceso a cámara y micrófono
 * - Notificaciones push
 * - Instalación de la app
 * - Detección de conectividad
 * - Almacenamiento offline
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Snackbar,
  LinearProgress,
  Avatar,
  Tooltip,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Badge,
} from '@mui/material';
import {
  Share as ShareIcon,
  Vibration as VibrationIcon,
  LocationOn as LocationIcon,
  CameraAlt as CameraIcon,
  Mic as MicIcon,
  Notifications as NotificationIcon,
  InstallMobile as InstallIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  Explore as CompassIcon,
  FlashlightOn as FlashIcon,
  VolumeUp as SoundIcon,
  Brightness6 as BrightnessIcon,
  Battery90 as BatteryIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// 🎮 Tipos para funcionalidades PWA
interface PWACapabilities {
  share: boolean;
  vibration: boolean;
  geolocation: boolean;
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
  installation: boolean;
  deviceOrientation: boolean;
  battery: boolean;
  fullscreen: boolean;
}

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface DeviceInfo {
  online: boolean;
  battery?: {
    level: number;
    charging: boolean;
  };
  orientation: number;
  vibrationSupported: boolean;
  installPrompt?: any;
}

const PWAFeatures: React.FC = () => {
  // 🎛️ Estados principales
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    share: false,
    vibration: false,
    geolocation: false,
    camera: false,
    microphone: false,
    notifications: false,
    installation: false,
    deviceOrientation: false,
    battery: false,
    fullscreen: false,
  });

  // 📱 Estados de funcionalidades
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    online: navigator.onLine,
    orientation: 0,
    vibrationSupported: false,
  });

  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // 🎨 Estados de UI
  const [showPWADialog, setShowPWADialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  // 🔍 Detectar capacidades PWA al cargar
  useEffect(() => {
    const detectCapabilities = () => {
      setCapabilities({
        share: 'share' in navigator,
        vibration: 'vibrate' in navigator,
        geolocation: 'geolocation' in navigator,
        camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        microphone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        notifications: 'Notification' in window,
        installation: 'serviceWorker' in navigator,
        deviceOrientation: 'DeviceOrientationEvent' in window,
        battery: 'getBattery' in navigator,
        fullscreen: 'requestFullscreen' in document.documentElement,
      });

      setDeviceInfo(prev => ({
        ...prev,
        vibrationSupported: 'vibrate' in navigator,
      }));
    };

    detectCapabilities();
  }, []);

  // 🔋 Monitorear estado del dispositivo
  useEffect(() => {
    // Conectividad
    const handleOnline = () => setDeviceInfo(prev => ({ ...prev, online: true }));
    const handleOffline = () => setDeviceInfo(prev => ({ ...prev, online: false }));

    // Orientación
    const handleOrientationChange = () => {
      setDeviceInfo(prev => ({ ...prev, orientation: window.orientation || 0 }));
    };

    // Batería (si está disponible)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setDeviceInfo(prev => ({
            ...prev,
            battery: {
              level: Math.round(battery.level * 100),
              charging: battery.charging,
            },
          }));
        };

        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    }

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Prompt de instalación
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 📍 Funciones de geolocalización
  const startLocationTracking = useCallback(() => {
    if (!capabilities.geolocation) {
      showSnackbar('Geolocalización no disponible', 'error');
      return;
    }

    setIsTracking(true);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    const success = (position: GeolocationPosition) => {
      const locationData: GeolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
        timestamp: position.timestamp,
      };
      
      setLocation(locationData);
      showSnackbar('Ubicación actualizada 📍', 'success');
    };

    const error = (err: GeolocationPositionError) => {
      setIsTracking(false);
      showSnackbar(`Error de geolocalización: ${err.message}`, 'error');
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
    
    // Tracking continuo
    const watchId = navigator.geolocation.watchPosition(success, error, options);
    
    // Cleanup después de 30 segundos
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    }, 30000);
  }, [capabilities.geolocation]);

  // 📤 Función de compartir nativo
  const handleNativeShare = useCallback(async (data: { title: string; text: string; url?: string }) => {
    if (!capabilities.share) {
      showSnackbar('Compartir nativo no disponible', 'error');
      return;
    }

    try {
      await navigator.share(data);
      showSnackbar('Contenido compartido exitosamente 🎉', 'success');
      
      // Vibración de confirmación
      if (capabilities.vibration) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        showSnackbar('Error al compartir', 'error');
      }
    }
  }, [capabilities.share, capabilities.vibration]);

  // 📳 Funciones de vibración
  const triggerVibration = useCallback((pattern: number | number[]) => {
    if (!capabilities.vibration) {
      showSnackbar('Vibración no disponible', 'error');
      return;
    }

    navigator.vibrate(pattern);
    showSnackbar('Vibración activada 📳', 'info');
  }, [capabilities.vibration]);

  // 🔔 Gestión de notificaciones
  const requestNotificationPermission = useCallback(async () => {
    if (!capabilities.notifications) {
      showSnackbar('Notificaciones no disponibles', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        showSnackbar('Notificaciones habilitadas ✅', 'success');
        
        // Notificación de prueba
        new Notification('¡CoomÜnity PWA!', {
          body: 'Las notificaciones están ahora habilitadas 🎉',
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
        });
      } else {
        showSnackbar('Permisos de notificación denegados', 'warning');
      }
    } catch (error) {
      showSnackbar('Error al solicitar permisos', 'error');
    }
  }, [capabilities.notifications]);

  // 📱 Instalación de la app
  const handleInstallApp = useCallback(async () => {
    if (!installPrompt) {
      showSnackbar('Instalación no disponible', 'info');
      return;
    }

    try {
      const result = await installPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        showSnackbar('¡App instalada exitosamente! 🎉', 'success');
        triggerVibration([200, 100, 200]);
      }
      
      setInstallPrompt(null);
    } catch (error) {
      showSnackbar('Error durante la instalación', 'error');
    }
  }, [installPrompt, triggerVibration]);

  // 📸 Acceso a cámara
  const handleCameraAccess = useCallback(async () => {
    if (!capabilities.camera) {
      showSnackbar('Cámara no disponible', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      showSnackbar('Acceso a cámara concedido 📸', 'success');
      
      // Detener el stream después de 3 segundos (demo)
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        showSnackbar('Cámara desconectada', 'info');
      }, 3000);
      
    } catch (error) {
      showSnackbar('Error al acceder a la cámara', 'error');
    }
  }, [capabilities.camera]);

  // 🎤 Acceso a micrófono
  const handleMicrophoneAccess = useCallback(async () => {
    if (!capabilities.microphone) {
      showSnackbar('Micrófono no disponible', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      showSnackbar('Acceso a micrófono concedido 🎤', 'success');
      
      // Detener el stream después de 3 segundos (demo)
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        showSnackbar('Micrófono desconectado', 'info');
      }, 3000);
      
    } catch (error) {
      showSnackbar('Error al acceder al micrófono', 'error');
    }
  }, [capabilities.microphone]);

  // 🔧 Función auxiliar para mostrar snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity as 'success' | 'error' | 'info');
    setSnackbarOpen(true);
  };

  // 🎨 Componente de estado del dispositivo
  const DeviceStatus = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          📱 Estado del Dispositivo
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip 
            icon={deviceInfo.online ? <OnlineIcon /> : <OfflineIcon />}
            label={deviceInfo.online ? 'Online' : 'Offline'}
            color={deviceInfo.online ? 'success' : 'error'}
            size="small"
          />
          
          {deviceInfo.battery && (
            <Chip 
              icon={<BatteryIcon />}
              label={`${deviceInfo.battery.level}% ${deviceInfo.battery.charging ? '⚡' : ''}`}
              color={deviceInfo.battery.level > 20 ? 'success' : 'warning'}
              size="small"
            />
          )}
          
          <Chip 
            icon={<CompassIcon />}
            label={`${deviceInfo.orientation}°`}
            size="small"
          />
          
          {location && (
            <Chip 
              icon={<LocationIcon />}
              label={`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
              color="primary"
              size="small"
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  // 🎛️ Panel de capacidades PWA
  const PWACapabilitiesPanel = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          🚀 Capacidades PWA
        </Typography>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShareIcon sx={{ mr: 1, color: capabilities.share ? 'success.main' : 'text.disabled' }} />
              <Typography variant="body2">Compartir Nativo</Typography>
            </Box>
            <Button 
              size="small" 
              disabled={!capabilities.share}
              onClick={() => handleNativeShare({
                title: 'CoomÜnity SuperApp',
                text: '¡Descubre la experiencia gamificada de CoomÜnity!',
                url: window.location.href
              })}
            >
              Probar
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VibrationIcon sx={{ mr: 1, color: capabilities.vibration ? 'success.main' : 'text.disabled' }} />
              <Typography variant="body2">Vibración</Typography>
            </Box>
            <Button 
              size="small" 
              disabled={!capabilities.vibration}
              onClick={() => triggerVibration([100, 50, 100, 50, 200])}
            >
              Vibrar
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1, color: capabilities.geolocation ? 'success.main' : 'text.disabled' }} />
              <Typography variant="body2">Geolocalización</Typography>
            </Box>
            <Button 
              size="small" 
              disabled={!capabilities.geolocation || isTracking}
              onClick={startLocationTracking}
            >
              {isTracking ? 'Rastreando...' : 'Ubicar'}
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NotificationIcon sx={{ mr: 1, color: capabilities.notifications ? 'success.main' : 'text.disabled' }} />
              <Typography variant="body2">Notificaciones</Typography>
            </Box>
            <Button 
              size="small" 
              disabled={!capabilities.notifications}
              onClick={requestNotificationPermission}
            >
              {notificationsEnabled ? 'Habilitadas' : 'Habilitar'}
            </Button>
          </Box>
          
          {installPrompt && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InstallIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">Instalar App</Typography>
              </Box>
              <Button 
                size="small" 
                variant="contained"
                onClick={handleInstallApp}
                sx={{ bgcolor: '#E91E63' }}
              >
                Instalar
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Estado del dispositivo */}
      <DeviceStatus />
      
      {/* Panel de capacidades */}
      <PWACapabilitiesPanel />
      
      {/* Acciones rápidas */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🎮 Acciones Rápidas
          </Typography>
          
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              startIcon={<CameraIcon />}
              onClick={handleCameraAccess}
              disabled={!capabilities.camera}
              size="small"
            >
              Cámara
            </Button>
            
            <Button
              startIcon={<MicIcon />}
              onClick={handleMicrophoneAccess}
              disabled={!capabilities.microphone}
              size="small"
            >
              Micrófono
            </Button>
            
            <Button
              startIcon={<VibrationIcon />}
              onClick={() => triggerVibration([50, 50, 50])}
              disabled={!capabilities.vibration}
              size="small"
            >
              Vibrar
            </Button>
            
            <Button
              startIcon={<ShareIcon />}
              onClick={() => handleNativeShare({
                title: 'Mi ubicación en CoomÜnity',
                text: location 
                  ? `Estoy en: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : 'Usando CoomÜnity SuperApp'
              })}
              disabled={!capabilities.share}
              size="small"
            >
              Compartir
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* SpeedDial para acceso rápido a funciones PWA */}
      <SpeedDial
        ariaLabel="Funciones PWA"
        sx={{ position: 'fixed', bottom: 80, left: 16 }}
        icon={<SpeedDialIcon />}
        direction="up"
      >
        <SpeedDialAction
          icon={<ShareIcon />}
          tooltipTitle="Compartir"
          onClick={() => handleNativeShare({
            title: 'CoomÜnity SuperApp',
            text: '¡Únete a la experiencia gamificada!'
          })}
        />
        <SpeedDialAction
          icon={<LocationIcon />}
          tooltipTitle="Mi Ubicación"
          onClick={startLocationTracking}
        />
        <SpeedDialAction
          icon={<VibrationIcon />}
          tooltipTitle="Vibrar"
          onClick={() => triggerVibration([100, 100, 100])}
        />
        <SpeedDialAction
          icon={<CameraIcon />}
          tooltipTitle="Cámara"
          onClick={handleCameraAccess}
        />
      </SpeedDial>

      {/* Snackbar para feedback */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbarSeverity} 
          onClose={() => setSnackbarOpen(false)}
          sx={{ fontWeight: 'bold' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PWAFeatures; 