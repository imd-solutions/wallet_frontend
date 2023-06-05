import { useEffect } from 'react';
import CenteredWrapper from 'components/CenteredWrapper';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuccessCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => {
      navigate('/');
      clearTimeout(id);
    }, 3000);
  }, [navigate]);

  return (
    <CenteredWrapper centered="column">
      <Typography textAlign="center">
        Your wallet top up was a success, you will now be redirected back home
      </Typography>
    </CenteredWrapper>
  );
};

export default SuccessCallback;
