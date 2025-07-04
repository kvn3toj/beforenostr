import { Card, CardContent, Typography } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'secondary';
  isLoading?: boolean;
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  variant = 'default',
  isLoading = false 
}: MetricCardProps) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary.main';
      case 'secondary':
        return 'secondary.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          component="div" 
          color={getVariantColor()}
          sx={{ mt: 1, mb: 1 }}
        >
          {isLoading ? '...' : value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}; 