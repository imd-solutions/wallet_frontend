import { styled, TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';

const Field = styled((props: TextFieldProps) => (
  <TextField
    {...props}
    fullWidth
    variant="outlined"
    size="small"
    sx={{ mb: 2 }}
  />
))``;

export default Field;
