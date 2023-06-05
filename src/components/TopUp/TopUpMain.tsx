import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useEffect, useState } from 'react';
import Toast from 'components/Toast';
import EnterAmount from './EnterAmount';
import CenteredWrapper from 'components/CenteredWrapper';
import { useWallet, Stages } from './useWallet';

const TopUp = () => {
  const {
    loading,
    getPaymentForm,
    handleLogin,
    toast,
    stage,
    setStage,
    paymentForm,
  } = useWallet();
  const languageCode = useSelector(
    (state: RootState) => state.user.walletConfig.languageCode
  );
  const [amount, setAmount] = useState('0');

  useEffect(() => {
    handleLogin();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage === Stages.GetForm) getPaymentForm(amount, languageCode);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return (
    <>
      {loading ? (
        <CenteredWrapper id="enterAmount">
          <Paper
            sx={{
              p: 4,
              boxSizing: 'border-box',
              display: 'flex',
              flexFlow: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
              {!stage ? 'Loading' : stage}
            </Typography>
            <CircularProgress size={50} />
          </Paper>
        </CenteredWrapper>
      ) : stage === Stages.EnterAmount ? (
        <EnterAmount
          amount={amount}
          setAmount={setAmount}
          setStage={setStage}
        />
      ) : stage === Stages.RenderForm ? (
        <Box
          component="iframe"
          srcDoc={paymentForm}
          sx={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
          }}
        />
      ) : null}
      <Toast
        severity={toast.severity}
        open={toast.toastOpen}
        handleClose={toast.close}
        id="topUp-toast"
      >
        {toast.message}
      </Toast>
    </>
  );
};

export default TopUp;
