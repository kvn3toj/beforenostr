import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  useGamificationStats,
  useActiveChallengesQuery,
  useStartChallengeMutation,
} from '../../../hooks/features/gamification';

export const GamificationDashboard: React.FC = () => {
  const { stats, isLoading: isLoadingStats, walletBalances, transactions, userChallenges } = useGamificationStats();
  const { data: activeChallenges = [], isLoading: isLoadingChallenges } = useActiveChallengesQuery();
  const startChallengeMutation = useStartChallengeMutation();

  const handleStartChallenge = (challengeId: string) => {
    startChallengeMutation.mutate(challengeId);
  };

  if (isLoadingStats || isLoadingChallenges) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gamification Dashboard
      </Typography>

      {/* User Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Balance
              </Typography>
              <Typography variant="h5" component="div">
                {stats.currentBalance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Merits Earned
              </Typography>
              <Typography variant="h5" component="div" color="success.main">
                +{stats.totalMeritsEarned}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Merits Spent
              </Typography>
              <Typography variant="h5" component="div" color="error.main">
                -{stats.totalMeritsSpent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Challenges Completed
              </Typography>
              <Typography variant="h5" component="div">
                {stats.challengesCompleted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Wallet Balances */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Wallet Balances
              </Typography>
              {walletBalances.length === 0 ? (
                <Typography color="textSecondary">No wallet balances found</Typography>
              ) : (
                <List>
                  {walletBalances.map((wallet) => (
                    <ListItem key={wallet.meritId} divider>
                      <ListItemText
                        primary={wallet.meritName}
                        secondary={`Balance: ${wallet.balance}`}
                      />
                      <Chip
                        label={wallet.meritSlug}
                        size="small"
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Active Challenges */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Challenges
              </Typography>
              {activeChallenges.length === 0 ? (
                <Typography color="textSecondary">No active challenges available</Typography>
              ) : (
                <List>
                  {activeChallenges.slice(0, 5).map((challenge) => (
                    <ListItem key={challenge.id} divider>
                      <ListItemText
                        primary={challenge.title}
                        secondary={challenge.description}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleStartChallenge(challenge.id)}
                        disabled={startChallengeMutation.isPending}
                      >
                        Start
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              {transactions.length === 0 ? (
                <Typography color="textSecondary">No transactions found</Typography>
              ) : (
                <List>
                  {transactions.slice(0, 5).map((transaction) => (
                    <ListItem key={transaction.id} divider>
                      <ListItemText
                        primary={`${transaction.amount > 0 ? '+' : ''}${transaction.amount} merits`}
                        secondary={`${transaction.source} - ${new Date(transaction.createdAt).toLocaleDateString()}`}
                      />
                      <Chip
                        label={transaction.amount > 0 ? 'Earned' : 'Spent'}
                        color={transaction.amount > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Challenges */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Challenges
              </Typography>
              {userChallenges.length === 0 ? (
                <Typography color="textSecondary">No challenges started</Typography>
              ) : (
                <List>
                  {userChallenges.slice(0, 5).map((userChallenge) => (
                    <ListItem key={userChallenge.id} divider>
                      <ListItemText
                        primary={userChallenge.challenge?.title || 'Unknown Challenge'}
                        secondary={`Started: ${new Date(userChallenge.startedAt).toLocaleDateString()}`}
                      />
                      <Chip
                        label={userChallenge.status}
                        color={
                          userChallenge.status === 'COMPLETED' ? 'success' :
                          userChallenge.status === 'FAILED' ? 'error' :
                          'primary'
                        }
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error handling */}
      {startChallengeMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error starting challenge: {startChallengeMutation.error?.message}
        </Alert>
      )}

      {startChallengeMutation.isSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Challenge started successfully!
        </Alert>
      )}
    </Box>
  );
}; 