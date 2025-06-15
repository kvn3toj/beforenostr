import { Card, CardContent, Typography } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export const MetricCard = ({ title, value, subtitle }: MetricCardProps) => (
  <Card sx={{ p: 2 }}>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>{value}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </CardContent>
  </Card>
); 