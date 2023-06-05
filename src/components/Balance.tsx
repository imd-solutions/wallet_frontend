import { useState, useEffect, useCallback } from 'react';
import { Paper, Typography, Skeleton, Box, Stack } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { getApiResponse } from 'utils/getApiResponse';
import { GET_USER } from 'graphql/user';

const Balance = () => {
  const [getUser, getUserState] = useLazyQuery(GET_USER);
  const { uid } = useSelector((state: RootState) => state.auth);
  const { currencySymbol: symbol, currencyPlacement } = useSelector(
    (state: RootState) => state.user.walletConfig
  );

  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState(false);

  const handleGetUserResponse = useCallback(() => {
    getApiResponse('user', getUserState)
      .then((data) => {
        if (data) {
          setError(false);
          setUsername(`${data.profile.firstname} ${data.profile.lastname}`);
          setBalance(data.profile.balance || 0);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, [getUserState]);

  useEffect(() => {
    if (uid) {
      setError(false);
      getUser({ variables: { id: uid } });
    }
  }, [uid]);

  useEffect(() => {
    handleGetUserResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserState]);

  const maskedBalance =
    currencyPlacement === 'Suffix'
      ? `${balance} ${symbol}`
      : `${symbol} ${balance}`;

  return (
    <Paper sx={{ my: 2, p: 2 }} id="homepage-balance">
      <Typography variant="h5" sx={{  }}>
        Welcome,{' '}
        <Typography component="span" textTransform="uppercase" variant="h5">
          {username}
        </Typography>
      </Typography>
      <Typography flexDirection="row" sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="span">Your current balance is:</Typography>&nbsp;
        <Typography component="span" variant="h4">
          {maskedBalance}
        </Typography>
      </Typography>
    </Paper>
  );
};

export default Balance;
