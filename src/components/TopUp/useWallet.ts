import { useEffect, useState, useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { WALLET_LOGIN, WALLET_FORM_REQUEST } from '../../graphql/wallet';
import { getApiResponse } from 'utils/getApiResponse';
import { useToast } from 'hooks/useToast';
import decodeEntities from 'utils/decodeHtmlEntities';
import { RootState } from 'store';
import { useSelector } from 'react-redux';

export enum Stages {
  EnterAmount = 'Enter top up amount',
  GetForm = 'Getting top up form',
  RenderForm = 'Rendering top up form',
}

export type Stage = Stages | null;

const generateUniqueTransactionId = (): number => {
  const min = 100000000;
  const max = 100000000000;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const useWallet = () => {
  const [walletLogin, walletLoginState] = useMutation(WALLET_LOGIN);
  const [walletPaymentForm, walletPaymentFormState] =
    useMutation(WALLET_FORM_REQUEST);
  const uid = useSelector((state: RootState) => state.auth.uid);
  const countryId = useSelector(
    (state: RootState) => state.user.walletConfig.countryId
  );
  const toast = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<number>();
  const [paymentForm, setForm] = useState<string>('');
  const [stage, setStage] = useState<Stage>(null);

  const handleLogin = useCallback(() => {
    setStage(null);
    const generatedTransactionId = generateUniqueTransactionId();
    setTransactionId(generatedTransactionId);
    walletLogin({
      variables: {
        input: {
          email: process.env.REACT_APP_ATLASPAY_USERNAME,
          password: process.env.REACT_APP_ATLASPAY_PASSWORD,
          transaction_id: `${generatedTransactionId}`,
        },
      },
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPaymentForm = useCallback(
    (amount: string, language = 'en') => {
      let numAmount = amount.split(' ')[1];
      if (!numAmount) numAmount = '1.00';

      walletPaymentForm({
        variables: {
          input: {
            token,
            country_id: Number(countryId),
            customer_id: 25,
            amount: numAmount,
            transaction_id: transactionId,
            language
          },
        },
      });
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [token, countryId, uid]
  );

  const handleWalletLoginResponse = useCallback(() => {
    getApiResponse('walletLogin', walletLoginState)
      .then((data) => {
        if (data) {
          setToken(data.token as string);
          setStage(Stages.EnterAmount);
          walletLoginState.reset();
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          'Sorry an error occurred while trying to top up your wallet',
          error
        );
        walletLoginState.reset();
      });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletLoginState]);

  const handleWalletPaymentFormResponse = useCallback(() => {
    getApiResponse('walletPaymentForm', walletPaymentFormState)
      .then((data) => {
        if (data) {
          const htmlForm = decodeEntities(data.html as string);
          if (!htmlForm) throw new Error('HTML form is not downloadable');
          setForm(htmlForm);
          setStage(Stages.RenderForm);
          walletPaymentFormState.reset();
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          'Sorry an error occurred while trying to top up your wallet, please try again',
          error
        );
        setStage(Stages.EnterAmount);
        walletPaymentFormState.reset();
      });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletPaymentFormState]);

  useEffect(() => {
    handleWalletLoginResponse();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletLoginState]);

  useEffect(() => {
    handleWalletPaymentFormResponse();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletPaymentFormState]);

  return useMemo(
    () => ({
      handleLogin,
      getPaymentForm,
      setStage,
      toast, 
      paymentForm,
      loading: walletLoginState.loading || walletPaymentFormState.loading,
      stage,
    }),
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [
      toast,
      walletLoginState.loading,
      walletPaymentFormState.loading,
      paymentForm,
      stage,
    ]
  );
};
