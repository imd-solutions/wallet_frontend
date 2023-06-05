import { useState } from 'react';
import OtpInput from 'react18-input-otp';
import { Stack, Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { green } from '@mui/material/colors';
import { useDispatch } from '../../store';
import { VERIFY_OTP, VERIFY_PHONE_NUMBER } from '../../graphql/auth';
import CenteredWrapper from '../CenteredWrapper';
import { RootState } from '../../store';
import { HandleStepChangeProps } from './useStepChange';
import { getApiResponse } from '../../utils/getApiResponse';
import { setAccessToken, setUserId } from '../../store/auth';
import Toast from 'components/Toast';
import { useToast } from 'hooks/useToast';
import { LOGIN } from './constants';

interface Props {
  handleStepChange: (params: HandleStepChangeProps) => void;
}

const otpLength = 4;

/* eslint-disable react-hooks/exhaustive-deps */
const OTP = ({ handleStepChange }: Props) => {
  const dispatch = useDispatch();
  const [userConfirmOTP, confirmOtpState] = useMutation(VERIFY_OTP);
  const [userOTP, verifyPhoneState] = useMutation(VERIFY_PHONE_NUMBER);

  const { typography, spacing, palette } = useTheme();

  const [resendClicked, setResendClicked] = useState(false);
  const [otp, setOtp] = useState('');
  const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<boolean>(false);
  const toast = useToast();

  const reset = () => {
    setSuccess(false);
    setError(null);
    setResendClicked(false);
    confirmOtpState.reset();
    verifyPhoneState.reset();
  };

  const handleConfirmOtpResponse = () => {
    getApiResponse('userConfirmOTP', confirmOtpState)
      .then((data) => {
        if (data) {
          setError(null);
          setSuccess(true);
          dispatch(setAccessToken(data.access_token));
          localStorage.setItem('TOKEN', data.access_token);
          dispatch(setUserId(data.uid));
          toast.showToast(
            'success',
            'Congratulations your OTP has been verified.'
          );
          if (!data.verified) handleStepChange({ value: '/register' });
          else handleStepChange({ value: '/' });
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          error.message
            ? error.message
            : 'There was an error when verifying your OTP, please try again.',
          error
        );
        reset();
        setOtp('');
      });
  };

  useEffect(() => {
    handleConfirmOtpResponse();
  }, [confirmOtpState]);

  const handleVerifyPhoneResponse = () => {
    getApiResponse('userOTP', verifyPhoneState)
      .then((data) => {
        if (data && resendClicked) {
          setOtp('');
          toast.showToast(
            'success',
            'Kindly check your phone and re-enter the OTP.'
          );
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          error.message
            ? error.message
            : 'There was an error resending your phone number, please try again.'
        );
        reset();
        setSuccess(false);
      });
  };

  useEffect(() => {
    handleVerifyPhoneResponse();
  }, [verifyPhoneState]);

  const handleChange = (value: string) => {
    reset();
    setOtp(value);
  };

  const confirmOtp = () => {
    userConfirmOTP({
      variables: {
        input: {
          code: otp,
          phone: `${phoneNumber?.areaCode}${phoneNumber?.phone}`,
        },
      },
    });
  };

  const reverifyPhone = () => {
    if (phoneNumber) {
      setResendClicked(true);
      userOTP({
        variables: {
          input: {
            phone: phoneNumber.phone,
            areaCode: phoneNumber.areaCode,
          },
        },
      });
    } else {
      toast.showToast(
        'warning',
        'No phone number available, please try again.'
      );
      handleStepChange({ value: '/login' });
    }
  };

  return (
    <>
      <CenteredWrapper>
        <Typography
          textAlign="center"
          component="h1"
          variant="body1"
          sx={{ mb: 3 }}
        >
          Next, enter the OTP sent to the phone number
        </Typography>

        <Stack component="form" sx={{ m: 1 }} onSubmit={confirmOtp}>
          <Box sx={{ mb: 1 }}>
            <OtpInput
              id="otp"
              value={otp}
              onChange={handleChange}
              numInputs={otpLength}
              separator={<Box sx={{ p: 1 }}>-</Box>}
              isInputNum
              containerStyle={{
                width: '100%',
                margin: 1,
                marginBottom: 1.5,
                display: 'flex',
                justifyContent: 'center',
                '& > div': {
                  width: 'calc(25% - 16px)',
                },
              }}
              inputStyle={{
                fontSize: typography.h3.fontSize,
                padding: spacing(1),
                boxSizing: 'content-box',
                height: '64px',
                borderRadius: '5px',
                border: `1px solid ${palette.primary.main}`,
              }}
              focusStyle={{
                border: `1px solid ${palette.primary.main}`,
              }}
              hasErrored={error === 'CONFIRM_ERROR'}
              errorStyle={{
                border: `1px solid ${palette.error.main}`,
              }}
              isSuccessed={success}
              successStyle={{
                border: `1px solid ${green[500]}`,
              }}
              isDisabled={confirmOtpState.loading}
              shouldAutoFocus
              onSubmit={confirmOtp}
            />
          </Box>
          <Stack justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              sx={{ borderRadius: 5, mt: 4, width: '100%' }}
              onClick={confirmOtp}
              type="submit"
              disabled={
                confirmOtpState.loading ||
                verifyPhoneState.loading ||
                !otp ||
                otp.length !== otpLength
              }
            >
              Continue
            </Button>
            <Button
              onClick={reverifyPhone}
              sx={({ spacing }) => ({
                borderRadius: 5,
                mt: 4,
                maxWidth: 'fit-content',
                px: spacing(2.5),
                textTransform: 'capitalize',
              })}
              disabled={confirmOtpState.loading || verifyPhoneState.loading}
            >
              Resend verification code
            </Button>
            <Button
              onClick={() => {
                handleStepChange({ value: LOGIN, delay: 300 });
              }}
              sx={({ spacing }) => ({
                borderRadius: 5,
                mt: 3,
                maxWidth: 'fit-content',
                px: spacing(2.5),
                textTransform: 'capitalize',
              })}
              disabled={confirmOtpState.loading || verifyPhoneState.loading}
            >
              Try another number
            </Button>
          </Stack>
        </Stack>
      </CenteredWrapper>
      <Toast
        severity={toast.severity}
        open={toast.toastOpen}
        handleClose={toast.close}
        id="otp-toast"
      >
        {toast.message}
      </Toast>
    </>
  );
};

export default OTP;
