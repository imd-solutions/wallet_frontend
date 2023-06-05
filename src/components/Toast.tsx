import React, { ReactNode } from 'react';
import { Snackbar, styled, Alert } from '@mui/material';
import { AlertColor } from '@mui/material/Alert';
import IconButton from './IconButton';
import { Close } from '@mui/icons-material';

export interface ToastProps {
  open: boolean;
  children: ReactNode;
  severity: AlertColor;
  hideDuration?: number;
  icon?: ReactNode;
  handleClose: () => void;
  id: string;
}

const DEFAULT_AUTO_HIDE_DURATION = 8000;

const StyledAlert = styled(Alert)(({ theme }) => ({
  fontSize: theme.typography.fontSize,
  alignItems: 'center',
}));

/**
 * A wrapper around the Material UI SnackBar and Alert components.
 * Provides close button automatically.
 */
const Toast = ({
  open,
  children,
  severity,
  id,
  hideDuration,
  icon,
  handleClose,
}: ToastProps) => {
  const closeTooEarlySnack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    handleClose();
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      autoHideDuration={hideDuration || DEFAULT_AUTO_HIDE_DURATION}
      onClose={closeTooEarlySnack}
    >
      <StyledAlert
        id={id}
        icon={icon}
        severity={severity}
        data-xml-testing-id="alert"
        action={
          <IconButton
            Icon={Close}
            size="small"
            width={20}
            height={20}
            onClick={closeTooEarlySnack}
            aria-label="Close"
            title="Close"
            id={id && `${id}__close-button`}
            data-xml-testing-id="close-button"
          />
        }
      >
        {children}
      </StyledAlert>
    </Snackbar>
  );
};

export default Toast;
