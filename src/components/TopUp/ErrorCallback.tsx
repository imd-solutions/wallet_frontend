import CenteredWrapper from 'components/CenteredWrapper';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorCallback = () => {
  const navigate = useNavigate();

  return (
    <CenteredWrapper centered="column">
      <Typography textAlign="center" sx={{ mb: 2 }}>
        An error occurred while trying to top up your account, would you like to
        try again?
      </Typography>
      <Box>
        <Button
          onClick={() => navigate('/topUp')}
          color="success"
          variant="contained"
        >
          Yes
        </Button>
        <Button onClick={() => navigate('/')} color="error" variant="outlined">
          No
        </Button>
      </Box>
    </CenteredWrapper>
  );
};

export default ErrorCallback;
