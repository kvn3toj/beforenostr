import React from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { Whatshot, WaterDrop, Landscape, Air } from '@mui/icons-material';
import { useThemeContext } from '../../styles/theme.context';

const elementIcons = {
  fuego: <Whatshot />,
  agua: <WaterDrop />,
  tierra: <Landscape />,
  aire: <Air />,
};

type ElementKey = keyof typeof elementIcons;

export const ThemeSelector: React.FC = () => {
  const { element, changeElement } = useThemeContext();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, gap: 1 }}>
      {(Object.keys(elementIcons) as ElementKey[]).map((el) => (
        <Tooltip title={`Tema ${el.charAt(0).toUpperCase() + el.slice(1)}`} key={el}>
          <IconButton
            onClick={() => changeElement(el)}
            sx={{
              color: element === el ? theme.palette.primary.contrastText : theme.palette.text.secondary,
              backgroundColor: element === el ? theme.palette.primary.main : 'transparent',
              '&:hover': {
                backgroundColor: element === el ? theme.palette.primary.dark : theme.palette.action.hover,
              },
            }}
          >
            {elementIcons[el]}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};
