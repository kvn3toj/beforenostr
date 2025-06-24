import React from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import {
  ArrowUpward,
  Backspace,
  KeyboardReturn,
  Language,
  Mic,
  MoreHoriz,
  SentimentSatisfied,
} from '@mui/icons-material';

interface MobileKeyboardProps {
  onKeyPress?: (key: string) => void;
  onBackspace?: () => void;
  onEnter?: () => void;
  visible?: boolean;
}

export const MobileKeyboard: React.FC<MobileKeyboardProps> = ({
  onKeyPress = () => {},
  onBackspace = () => {},
  onEnter = () => {},
  visible = true,
}) => {
  if (!visible) return null;

  const firstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const secondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const thirdRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  const KeyButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    width?: string;
    backgroundColor?: string;
  }> = ({ children, onClick, width = '30px', backgroundColor = '#FFF0F5' }) => (
    <Box
      onClick={onClick}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '5.243px',
        display: 'flex',
        minHeight: '40px',
        paddingLeft: '8px',
        paddingRight: '8px',
        flex: width === '30px' ? 1 : 'none',
        width: width !== '30px' ? width : 'auto',
        background: backgroundColor,
        cursor: 'pointer',
        fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif',
        fontSize: '18px',
        color: '#24181E',
        fontWeight: 400,
        textAlign: 'center',
        lineHeight: 1.14,
        '&:hover': {
          backgroundColor: '#E0E0E0',
        },
        '&:active': {
          backgroundColor: '#D0D0D0',
        },
      }}
    >
      <Box
        sx={{
          color: '#24181E',
          alignSelf: 'stretch',
          display: 'flex',
          marginTop: 'auto',
          marginBottom: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        paddingBottom: '9px',
        flexDirection: 'column',
        alignItems: 'stretch',
        background: '#FFF8F8',
        position: 'fixed',
        bottom: '70px', // Above bottom navigation
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '360px',
        width: '100%',
        zIndex: 15
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          display: 'flex',
          minHeight: '38px',
          width: '100%',
          paddingLeft: '7px',
          paddingRight: '7px',
          paddingTop: '8px',
          paddingBottom: '8px',
          alignItems: 'center',
          gap: '21px',
          justifyContent: 'center',
        }}
      >
        {/*
          Accesibilidad: Todos los IconButton deben tener un área táctil mínima de 44x44px (ideal 48x48px) según Material Design y recomendaciones de iOS/Android.
          Esto mejora la usabilidad y accesibilidad, especialmente en mobile.
        */}
        <Tooltip title="Retroceso" placement="top">
          <IconButton
            aria-label="Ir hacia arriba en el teclado"
            sx={{ width: 48, height: 48, minWidth: 44, minHeight: 44, padding: 0 }}
          >
            <ArrowUpward />
          </IconButton>
        </Tooltip>
        <Tooltip title="Emojis" placement="top">
          <IconButton
            aria-label="Abrir selector de emojis"
            sx={{ width: 48, height: 48, minWidth: 44, minHeight: 44, padding: 0 }}
          >
            <SentimentSatisfied />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cambiar idioma" placement="top">
          <IconButton
            aria-label="Cambiar idioma del teclado"
            sx={{ width: 48, height: 48, minWidth: 44, minHeight: 44, padding: 0 }}
          >
            <Language />
          </IconButton>
        </Tooltip>
        <Tooltip title="Micrófono" placement="top">
          <IconButton
            aria-label="Activar entrada por voz"
            sx={{ width: 48, height: 48, minWidth: 44, minHeight: 44, padding: 0 }}
          >
            <Mic />
          </IconButton>
        </Tooltip>
        <Tooltip title="Más opciones" placement="top">
          <IconButton
            aria-label="Ver más opciones del teclado"
            sx={{ width: 48, height: 48, minWidth: 44, minHeight: 44, padding: 0 }}
          >
            <MoreHoriz />
          </IconButton>
        </Tooltip>
        <Tooltip title="Borrar" placement="top">
          <IconButton
            onClick={onBackspace}
            aria-label="Borrar carácter anterior"
            sx={{ width: 48, height: 48, minWidth: 44, minHeight: 44, padding: 0 }}
          >
            <Backspace />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Keyboard */}
      <Box
        sx={{
          alignSelf: 'center',
          display: 'flex',
          marginTop: '7px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          width: '100%',
          maxWidth: '346px',
          paddingX: '7px',
        }}
      >
        {/* First Row */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'stretch',
            gap: '5px',
            marginBottom: '10px',
          }}
        >
          {firstRow.map((key) => (
            <KeyButton key={key} onClick={() => onKeyPress(key)}>
              {key}
            </KeyButton>
          ))}
        </Box>

        {/* Second Row */}
        <Box
          sx={{
            display: 'flex',
            width: '309px',
            maxWidth: '100%',
            alignItems: 'stretch',
            gap: '5px',
            marginBottom: '10px',
          }}
        >
          {secondRow.map((key) => (
            <KeyButton key={key} onClick={() => onKeyPress(key)}>
              {key}
            </KeyButton>
          ))}
        </Box>

        {/* Third Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            gap: '5px',
            justifyContent: 'start',
            marginBottom: '10px',
          }}
        >
          <KeyButton
            width="48px"
            backgroundColor="#F2DDE5"
            onClick={() => {
              /* Handle shift */
            }}
          >
            <ArrowUpward sx={{ width: '21px', height: '21px' }} />
          </KeyButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '5px',
              width: '239px',
            }}
          >
            {thirdRow.map((key) => (
              <KeyButton key={key} onClick={() => onKeyPress(key)}>
                {key}
              </KeyButton>
            ))}
          </Box>

          <KeyButton
            width="48px"
            backgroundColor="#F2DDE5"
            onClick={onBackspace}
          >
            <Backspace sx={{ width: '21px', height: '21px' }} />
          </KeyButton>
        </Box>

        {/* Bottom Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            gap: '5px',
            justifyContent: 'start',
          }}
        >
          <KeyButton
            width="48px"
            backgroundColor="#FFB1DB"
            onClick={() => {
              /* Handle numbers */
            }}
          >
            <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
              ?123
            </Typography>
          </KeyButton>

          <KeyButton
            width="30px"
            backgroundColor="#F2DDE5"
            onClick={() => onKeyPress(',')}
          >
            <Typography sx={{ fontSize: '18px' }}>,</Typography>
          </KeyButton>

          <KeyButton
            width="30px"
            onClick={() => {
              /* Handle language */
            }}
          >
            <Language sx={{ width: '21px', height: '21px' }} />
          </KeyButton>

          <Box
            sx={{
              borderRadius: '5.243px',
              display: 'flex',
              width: '135px',
              background: '#FFF0F5',
              minHeight: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#E0E0E0',
              },
            }}
            onClick={() => onKeyPress(' ')}
          >
            <Typography sx={{ fontSize: '14px', color: '#666' }}>
              espacio
            </Typography>
          </Box>

          <KeyButton
            width="30px"
            backgroundColor="#F2DDE5"
            onClick={() => onKeyPress('.')}
          >
            <Typography sx={{ fontSize: '18px' }}>.</Typography>
          </KeyButton>

          <KeyButton width="48px" backgroundColor="#FFAEDA" onClick={onEnter}>
            <KeyboardReturn sx={{ width: '21px', height: '21px' }} />
          </KeyButton>
        </Box>
      </Box>

      {/* Handle */}
      <Box
        sx={{
          alignSelf: 'end',
          display: 'flex',
          marginTop: '26px',
          width: '210px',
          maxWidth: '100%',
          flexDirection: 'column',
          paddingRight: '94px',
        }}
      >
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: '#202124',
            display: 'flex',
            width: '94px',
            flexShrink: 0,
            height: '3px',
          }}
        />
      </Box>
    </Box>
  );
};
