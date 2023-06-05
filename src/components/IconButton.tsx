import React from 'react';
import {
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

export interface IconButtonProps extends MuiIconButtonProps {
  Icon: SvgIconComponent;
  width?: number;
  height?: number;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ Icon, width = '0.85em', height = '0.85em', ...buttonProps }, ref) => {
    return (
      <MuiIconButton {...buttonProps} ref={ref}>
        <Icon width={width} height={height} />
      </MuiIconButton>
    );
  }
);

export default IconButton;
