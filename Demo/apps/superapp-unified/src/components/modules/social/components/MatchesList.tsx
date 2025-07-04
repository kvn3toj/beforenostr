import React from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Badge,
  Chip,
  Avatar,
  InputAdornment,
  Skeleton,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { SocialMatch } from '../../../../types';

interface MatchesListProps {
  matches: SocialMatch[];
  selectedMatch: string | null;
  onSelectMatch: (matchId: string) => void;
  isLoading: boolean;
  formatTime: (dateString: string) => string;
}

const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  selectedMatch,
  onSelectMatch,
  isLoading,
  formatTime,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filtrar matches por término de búsqueda
  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Componente de skeleton para loading
  const MatchSkeleton = () => (
    <ListItem sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width="70%" />}
        secondary={<Skeleton variant="text" width="90%" />}
      />
    </ListItem>
  );

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Conversaciones
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar conversaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Lista de matches */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {isLoading ? (
          <List sx={{ p: 0 }}>
            {[...Array(5)].map((_, index) => (
              <MatchSkeleton key={index} />
            ))}
          </List>
        ) : filteredMatches.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            {searchTerm ? (
              <Alert severity="info">
                No se encontraron conversaciones que coincidan con "{searchTerm}"
              </Alert>
            ) : (
              <Alert severity="info">
                No tienes conversaciones activas aún.
                ¡Haz un match en el marketplace para comenzar a chatear!
              </Alert>
            )}
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredMatches.map((match) => (
              <ListItem
                key={match.id}
                button
                selected={selectedMatch === match.id}
                onClick={() => onSelectMatch(match.id)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' },
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    '&:hover': { bgcolor: 'primary.light' }
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: match.status === 'online' ? 'success.main' :
                                  match.status === 'away' ? 'warning.main' : 'grey.400',
                          border: 2,
                          borderColor: 'background.paper'
                        }}
                      />
                    }
                  >
                    <Avatar src={match.avatar} alt={match.name}>
                      {match.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{
                          fontWeight: match.unread > 0 ? 'bold' : 'normal',
                          color: selectedMatch === match.id ? 'primary.contrastText' : 'inherit'
                        }}
                      >
                        {match.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={selectedMatch === match.id ? 'primary.contrastText' : 'text.secondary'}
                      >
                        {formatTime(match.timestamp)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="body2"
                        component="span"
                        color={selectedMatch === match.id ? 'primary.contrastText' : 'text.secondary'}
                        noWrap
                        sx={{
                          flex: 1,
                          fontWeight: match.unread > 0 ? 'bold' : 'normal'
                        }}
                      >
                        {match.lastMessage}
                      </Typography>
                      {match.unread > 0 && (
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.25,
                            backgroundColor: selectedMatch === match.id ? 'primary.dark' : 'primary.main',
                            color: 'white',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            lineHeight: 1.2,
                            ml: 1,
                            minWidth: '20px',
                            height: '20px',
                            textAlign: 'center'
                          }}
                        >
                          {match.unread}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default MatchesList;
