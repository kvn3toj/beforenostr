import React, { memo, useMemo, useCallback, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface OptimizedComponentProps {
  data: any[];
  onAction?: (id: string) => void;
  loading?: boolean;
  error?: string;
}

/**
 * 🚀 PERFORMANCE OPTIMIZED COMPONENT TEMPLATE
 *
 * Features:
 * - React.memo for prop-based re-render prevention
 * - useMemo for expensive calculations
 * - useCallback for stable function references
 * - Proper TypeScript typing
 * - Error boundaries integration
 * - Loading states
 */
const OptimizedComponent: React.FC<OptimizedComponentProps> = memo(
  ({ data, onAction, loading = false, error }) => {
    const [localState, setLocalState] = useState<string>('');

    // 🎯 EXPENSIVE CALCULATIONS - Memoized
    const processedData = useMemo(() => {
      if (!data || data.length === 0) return [];

      return data
        .filter((item) => item.active)
        .map((item) => ({
          ...item,
          displayName: item.name?.toUpperCase() || 'Unknown',
          priority: item.priority || 0,
        }))
        .sort((a, b) => b.priority - a.priority);
    }, [data]);

    // 🎯 STABLE CALLBACKS - Prevents child re-renders
    const handleClick = useCallback(
      (id: string) => {
        // Local state update (if needed)
        setLocalState(id);

        // Parent callback (if provided)
        onAction?.(id);
      },
      [onAction]
    );

    const handleLocalAction = useCallback((value: string) => {
      setLocalState(value);
    }, []);

    // 🎯 EARLY RETURNS - Prevent unnecessary renders
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <Typography>Loading...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    if (processedData.length === 0) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <Typography>No data available</Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Optimized Component ({processedData.length} items)
        </Typography>

        {processedData.map((item) => (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{item.displayName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Priority: {item.priority}
              </Typography>
              <Box mt={2}>
                <button onClick={() => handleClick(item.id)}>Action</button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }
);

// 🎯 DISPLAY NAME - For better debugging
OptimizedComponent.displayName = 'OptimizedComponent';

export default OptimizedComponent;

/**
 * 🎯 USAGE EXAMPLE:
 *
 * const MyPage = () => {
 *   const [data, setData] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *
 *   const handleAction = useCallback((id: string) => {
 *     // Handle action
 *   }, []);
 *
 *   return (
 *     <OptimizedComponent
 *       data={data}
 *       loading={loading}
 *       onAction={handleAction}
 *     />
 *   );
 * };
 */
