import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha, Icon } from '@mui/material';
import type { WalletKpiType } from '../../types/metrics.types';
import { SvgIconComponent } from '@mui/icons-material'; // For type hint if icon is MUI SvgIcon

// Helper to resolve color from theme or use as direct value
const getKpiColor = (theme: any, colorString?: string): string => {
  if (!colorString) return theme.palette.text.primary;
  // Check if it's a theme path like 'primary.main'
  if (colorString.includes('.')) {
    const [palette, shade] = colorString.split('.');
    if (theme.palette[palette] && theme.palette[palette][shade]) {
      return theme.palette[palette][shade];
    }
  }
  // Otherwise, assume it's a direct color value (hex, rgb, etc.)
  return colorString;
};

interface WalletKpiCardProps {
  kpi: WalletKpiType;
}

export const WalletKpiCard: React.FC<WalletKpiCardProps> = ({ kpi }) => {
  const theme = useTheme();
  const valueColor = getKpiColor(theme, kpi.color || 'text.primary');

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${valueColor}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        boxShadow: theme.shadows[2],
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out',
        cursor: kpi.action ? 'pointer' : 'default',
      }}
      onClick={kpi.action}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {kpi.icon && (
            <Box component="span" sx={{ mr: 1.5, color: valueColor, display: 'flex', alignItems: 'center' }}>
              {/* Cloning icon to apply sx props if it's a ReactElement, e.g. MUI SvgIcon */}
              {React.isValidElement(kpi.icon) ? React.cloneElement(kpi.icon, { sx: { fontSize: '1.75rem' } } as any) : null}
            </Box>
          )}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
            {kpi.label}
          </Typography>
        </Box>

        <Typography
          variant="h3"
          component="p"
          sx={{
            fontWeight: 'bold',
            color: valueColor,
            my: 0.5,
            lineHeight: 1.2,
          }}
        >
          {kpi.formattedValue}
          {/* Unit can be part of formattedValue or appended here if separate */}
          {/* {kpi.unit && <Typography variant="caption" component="span" sx={{ ml: 0.5, fontWeight: 'medium', color: 'text.secondary' }}>{kpi.unit}</Typography>} */}
        </Typography>

        {kpi.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {kpi.description}
          </Typography>
        )}
      </CardContent>

      {kpi.trend && kpi.trendValue && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(valueColor, 0.05),
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: kpi.trend === 'up' ? theme.palette.success.main : kpi.trend === 'down' ? theme.palette.error.main : 'text.secondary'
            }}
          >
            {/* TODO: Add trend icons */}
            {kpi.trendValue}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

// Notes:
// - The kpi.icon is assumed to be a ReactElement, like an MUI SvgIcon.
// - kpi.formattedValue should ideally contain the value AND its unit if they are tightly coupled (e.g., "1,234 ÜC").
//   Alternatively, kpi.unit can be displayed separately if `formattedValue` is just the number string.
//   The current implementation of mapWalletDataToKpis has `formattedValue` as the full string (e.g., "1,200 ÜC"),
//   so the separate display of `kpi.unit` in the Card is commented out.
// - Trend icons would be a good addition based on `kpi.trend`.
// - The card has a left border colored by `kpi.color`.
// - Added hover effect and optional onClick action.
// - Used alpha for background colors for a slightly transparent/frosted glass effect if desired by the theme.
// - `getKpiColor` helper is added to resolve theme color strings (e.g., 'primary.main') or use direct hex/rgb values.
// - Icon size is set via sx prop when cloning.
// - Typography for value is h3, label is h6.
// - Card is set to take full height of its container in a grid for alignment.
// - The structure seems flexible enough for various KPIs.
// - `justifyContent: 'space-between'` on Card ensures footer (trend) stays at bottom if content is short.
// - `flexGrow: 1` on CardContent allows it to take available space.
// - Added blur and transparency for a more "conscious" feel, can be adjusted.
// - Made card clickable if `kpi.action` is provided.
// - The `WalletKpiType` expects `icon?: ReactElement`. If using MUI icons, they are `SvgIconComponent`.
//   The cloning logic `React.cloneElement(kpi.icon, { sx: { fontSize: '1.75rem' } } as any)` should handle this.
//   If kpi.icon is just a string (e.g. icon name for an <Icon> component), the rendering would be different.
//   Assuming ReactElement for now.
// - The color resolution in `getKpiColor` is basic. For more complex theme structures, it might need enhancement.
//   It handles "palette.shade" and direct values.
// - The trend display is basic; could be enhanced with icons and more dynamic coloring.
// This completes the WalletKpiCard component.El componente `WalletKpiCard.tsx` ha sido creado.
*   Recibe un objeto `kpi` de tipo `WalletKpiType`.
*   Renderiza la etiqueta, el valor formateado, el icono (si se provee), la descripción y la tendencia.
*   Utiliza el color del KPI para un borde lateral y el color del valor.
*   Incluye efectos de hover y es clickeable si se proporciona una función `action` en el KPI.
*   Está estilizado usando `sx` prop de Material UI.

Este paso está completo. Pasaré al siguiente.
