import { AlertColor } from '@mui/material/Alert';
import { useMemo, useState } from 'react';

export const useToast = () => {
  const [toastInfo, setToastInfo] = useState<{
    severity: AlertColor;
    message?: string;
  }>({
    severity: 'error',
    message: '',
  });

  const [toastOpen, setToastOpen] = useState(false);

  return useMemo(() => {
    const showToast = (
      severity: AlertColor,
      message?: string,
      error?: Error
    ) => {
      setToastInfo({
        severity,
        message: message || 'An error has occurred.',
      });
      setToastOpen(true);
      if (error) {
        console.error(error);
      }
    };

    const close = () => {
      setToastOpen(false);
    };

    return {
      ...toastInfo,
      toastOpen,
      close,
      showToast,
    };
  }, [toastInfo, toastOpen, setToastInfo, setToastOpen]);
};
