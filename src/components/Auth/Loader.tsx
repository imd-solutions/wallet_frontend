import { Stack, CircularProgress } from '@mui/material';
import CenteredWrapper from '../CenteredWrapper';

export default function Loader() {
  return (
    <CenteredWrapper>
      <Stack alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    </CenteredWrapper>
  );
}
