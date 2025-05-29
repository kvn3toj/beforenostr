import { useState, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestoreIcon from '@mui/icons-material/Restore';
import { useMundoVersionsQuery } from '../hooks/features/mundos/useMundoVersionsQuery';
import { useRestoreMundoVersionMutation } from '../hooks/features/mundos/useRestoreMundoVersionMutation';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { MundoVersion } from '../types/mundo.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mundo-tabpanel-${index}`}
      aria-labelledby={`mundo-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Define the state interface for the reducer
interface MundoDetailState {
  isRestoreConfirmDialogOpen: boolean;
  versionToRestore: MundoVersion | null;
}

// Define the initial state
const initialState: MundoDetailState = {
  isRestoreConfirmDialogOpen: false,
  versionToRestore: null,
};

// Define action types
type MundoDetailAction =
  | { type: 'OPEN_RESTORE_DIALOG'; payload: MundoVersion }
  | { type: 'CLOSE_RESTORE_DIALOG' }
  | { type: 'SET_VERSION_TO_RESTORE'; payload: MundoVersion | null }
  | { type: 'RESET_RESTORE_STATE' }; // Optional: to reset just the restore state

// Implement the reducer function
const mundoDetailReducer = (state: MundoDetailState, action: MundoDetailAction): MundoDetailState => {
  switch (action.type) {
    case 'OPEN_RESTORE_DIALOG':
      return {
        ...state,
        isRestoreConfirmDialogOpen: true,
        versionToRestore: action.payload,
      };
    case 'CLOSE_RESTORE_DIALOG':
      return {
        ...state,
        isRestoreConfirmDialogOpen: false,
        versionToRestore: null, // Clear the version when closing
      };
    case 'SET_VERSION_TO_RESTORE':
      return {
        ...state,
        versionToRestore: action.payload,
      };
    case 'RESET_RESTORE_STATE':
      return initialState;
    default:
      return state;
  }
};

export const MundoDetailPage = () => {
  const { mundoId } = useParams<{ mundoId: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // Use useReducer for managing restore dialog state
  const [state, dispatch] = useReducer(mundoDetailReducer, initialState);
  const { isRestoreConfirmDialogOpen, versionToRestore } = state;

  const { data: versions, isLoading, isError, error } = useMundoVersionsQuery(mundoId);
  const { mutate: restoreVersion, isPending: isRestoring } = useRestoreMundoVersionMutation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRestoreClick = (version: MundoVersion) => {
    dispatch({ type: 'OPEN_RESTORE_DIALOG', payload: version });
  };

  const handleRestoreConfirm = () => {
    if (versionToRestore && mundoId) {
      restoreVersion(
        { mundoId, versionId: versionToRestore.id },
        {
          onSuccess: () => {
            dispatch({ type: 'CLOSE_RESTORE_DIALOG' });
          },
        }
      );
    }
  };

  const handleRestoreCancel = () => {
    dispatch({ type: 'CLOSE_RESTORE_DIALOG' });
  };

  return (
    <Container maxWidth="lg">
      <Box py={3}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton 
            onClick={() => navigate('/mundos')}
            sx={{ mr: 2 }}
            aria-label="volver"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Detalles del Mundo
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="mundo tabs">
            <Tab label="Información" />
            <Tab label="Historial de versiones" />
          </Tabs>

          {/* Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" component="h2" gutterBottom>
              Información del Mundo
            </Typography>
            {/* Add mundo information here */}
          </TabPanel>

          {/* Versions Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" component="h2" gutterBottom>
              Historial de versiones
            </Typography>

            {isLoading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            )}

            {isError && (
              <Alert severity="error" sx={{ my: 2 }}>
                Error al cargar el historial de versiones: {error instanceof Error ? error.message : 'Error desconocido'}
              </Alert>
            )}

            {!isLoading && !isError && versions && versions.length === 0 && (
              <Alert severity="info" sx={{ my: 2 }}>
                No hay versiones anteriores disponibles
              </Alert>
            )}

            {versions && versions.length > 0 && (
              <Paper sx={{ mt: 2 }}>
                <List>
                  {versions.map((version, index) => (
                    <Box key={version.id}>
                      <ListItem
                        secondaryAction={
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RestoreIcon />}
                            onClick={() => handleRestoreClick(version)}
                          >
                            Restaurar
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              Versión {version.version}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {version.name}
                              </Typography>
                              {' — '}
                              {format(new Date(version.timestamp), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                            </>
                          }
                        />
                      </ListItem>
                      {index < versions.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </Paper>
            )}
          </TabPanel>
        </Paper>
      </Box>

      {/* Restore Version Confirmation Dialog */}
      <ConfirmDialog
        open={isRestoreConfirmDialogOpen}
        onClose={handleRestoreCancel}
        onConfirm={handleRestoreConfirm}
        title="Confirmar Restauración"
        content={`¿Estás seguro de que deseas restaurar la versión ${versionToRestore?.version}? Esta acción creará una nueva versión con los datos de la versión seleccionada.`}
        isLoading={isRestoring}
      />
    </Container>
  );
}; 