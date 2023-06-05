import React from 'react';
import { Stack, SxProps } from '@mui/material';

interface Props {
  children: React.ReactNode;
  id?: string;
  centered?: 'row' | 'column';
  sx?: SxProps;
}

const centeredProps = {
  justifyContent: 'center',
  alignItems: 'center',
};

function MidWrapper({ children, id, centered, sx }: Props) {
  return (
    <Stack
      justifyContent="center"
      sx={{
        maxWidth: { xs: '480px', md: '640px' },
        width: '100%',
        p: 2,
        boxSizing: 'border-box',
        paddingTop: '5em',
        ...sx,
      }}
      id={`midWrap${id ? `-${id}` : ''}`}
    >
      <Stack
        flexDirection={centered}
        sx={{ width: '100%', ...(centered ? centeredProps : {}) }}
        className="centeredWrap-inner"
      >
        {children}
      </Stack>
    </Stack>
  );
}

export default MidWrapper;
