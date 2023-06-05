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

function CenteredWrapper({ children, id, centered, sx }: Props) {
  return (
    <Stack
      justifyContent="center"
      sx={{
        m: 'auto',
        maxWidth: { xs: '480px', md: '640px' },
        width: '100%',
        p: 2,
        boxSizing: 'border-box',
        ...sx,
      }}
      id={`centeredWrap${id ? `-${id}` : ''}`}
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

export default CenteredWrapper;
