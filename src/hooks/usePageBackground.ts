import { useEffect } from 'react';
import { useTheme } from '@mui/material';

export const usePageBackground = (colour?: string) => {
  const theme = useTheme();
  useEffect(() => {
    const outerDiv = window.document.getElementById('outer');
    if (outerDiv)
      outerDiv.style.backgroundColor = colour
        ? colour
        : theme.palette.common.white;
  }, [theme.palette.common.white, colour]);
};
