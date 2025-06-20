import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
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
        <IconButton sx={{ width: '23px', height: '23px', padding: 0 }}>
          <ArrowUpward />
        </IconButton>

        <Box
          sx={{
            alignSelf: 'stretch',
            position: 'relative',
            display: 'flex',
            minWidth: '240px',
            marginTop: 'auto',
            marginBottom: 'auto',
            alignItems: 'start',
            gap: '40px 45px',
            justifyContent: 'start',
          }}
        >
          <Box
            sx={{
              zIndex: 0,
              display: 'flex',
              alignItems: 'start',
              gap: '35px',
              justifyContent: 'start',
            }}
          >
            <IconButton sx={{ width: '21px', height: '21px', padding: 0 }}>
              <SentimentSatisfied />
            </IconButton>
            <IconButton sx={{ width: '21px', height: '21px', padding: 0 }}>
              <Language />
            </IconButton>
            <IconButton sx={{ width: '20px', height: '20px', padding: 0 }}>
              <Language />
            </IconButton>
            <IconButton sx={{ width: '21px', height: '21px', padding: 0 }}>
              <SentimentSatisfied />
            </IconButton>
          </Box>

          <Box
            sx={{
              zIndex: 0,
              display: 'flex',
              alignItems: 'start',
              gap: '26px',
              justifyContent: 'start',
            }}
          >
            <IconButton sx={{ width: '21px', height: '21px', padding: 0 }}>
              <MoreHoriz />
            </IconButton>
            <IconButton sx={{ width: '21px', height: '21px', padding: 0 }}>
              <Mic />
            </IconButton>
          </Box>
        </Box>
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
