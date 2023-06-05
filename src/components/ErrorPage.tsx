import { useRouteError } from 'react-router-dom';
import CenteredWrapper from './CenteredWrapper';
import { Typography } from '@mui/material';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <CenteredWrapper id="error-page">
      <Typography variant="h3">404</Typography>
      <Typography variant="body1">
        Sorry, an unexpected error has occurred.
      </Typography>
      {/* <Typography variant="body2" fontStyle="italic">{error.statusText || error.message}</Typography> */}
    </CenteredWrapper>
  );
}
