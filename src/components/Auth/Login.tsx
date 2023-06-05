import { useEffect } from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Image from 'mui-image';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import {
  LoginSocialFacebook,
  LoginSocialTwitter,
  IResolveParams,
} from 'reactjs-social-login';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { blue } from '@mui/material/colors';
import * as Yup from 'yup';
import { useDispatch } from '../../store';
import { VERIFY_PHONE_NUMBER, SOCIAL_REGISTER } from '../../graphql/auth';
import countryCodes from 'utils/country_dial_codes.json';
import { getApiResponse } from '../../utils/getApiResponse';
import { OTP, SOCIAL_REGISTRATION } from './constants';
import CenteredWrapper from '../CenteredWrapper';
import { HandleStepChangeProps } from './useStepChange';
import Toast from 'components/Toast';
import { useToast } from 'hooks/useToast';
import { PhoneNumber, setPhoneNumber } from 'store/auth';
import { WalletConfig, setWalletConfig } from 'store/user';
import pick from 'lodash.pick';

interface Props {
  handleStepChange: (params: HandleStepChangeProps) => void;
}

const validationSchema = Yup.object().shape({
  areaCode: Yup.string().required('An area code is required'),
  phone: Yup.string().required('A phone number is required'),
});

/* eslint-disable react-hooks/exhaustive-deps */
const Login = ({ handleStepChange }: Props) => {
  const dispatch = useDispatch();
  const [userOTP, verifyPhoneState] = useMutation(VERIFY_PHONE_NUMBER);
  const [userSocialLogin, socialRegisterState] = useMutation(SOCIAL_REGISTER);
  const toast = useToast();

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    isValid,
  } = useFormik<PhoneNumber & WalletConfig>({
    initialValues: {
      areaCode: '+44',
      phone: '',
      countryId: 826,
      currencyCode: 'GBP',
      currencySymbol: '£',
      currencyPlacement: 'Prefix',
    },
    validationSchema,
    onSubmit: (values) => {
      userOTP({
        variables: {
          input: pick(values, ['areaCode', 'phone']),
        },
      });
    },
  });

  const handleVerifyPhoneResponse = () => {
    getApiResponse('userOTP', verifyPhoneState)
      .then((data) => {
        if (data) {
          dispatch(setPhoneNumber(pick(values, ['areaCode', 'phone'])));
          dispatch(
            setWalletConfig(
              pick(values, [
                'countryId',
                'currencyCode',
                'currencySymbol',
                'currencyPlacement',
              ])
            )
          );
          toast.showToast(
            'success',
            'Kindly enter the OTP sent to your phone.'
          );
          handleStepChange({ value: OTP, delay: 300 });
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          'Sorry an error occurred when verifying your phone number, please try again.',
          error
        );
        verifyPhoneState.reset();
      });
  };

  const handleSocialRegisterResponse = () => {
    getApiResponse('userSocialLogin', socialRegisterState)
      .then((data) => {
        if (data) {
          toast.showToast(
            'success',
            "Congratulations you're successfully registered."
          );
          if (data.isVerified) {
            handleStepChange({
              value: '/',
            });
          } else {
            handleStepChange({
              value: '/register',
              delay: 300,
              navOptions: {
                state: {
                  type: SOCIAL_REGISTRATION,
                },
              },
            });
          }
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          'Sorry an error occurred when using social login, please try again.',
          error
        );
        socialRegisterState.reset();
      });
  };

  useEffect(() => {
    handleVerifyPhoneResponse();
  }, [verifyPhoneState]);

  useEffect(() => {
    handleSocialRegisterResponse();
  }, [socialRegisterState]);

  const handleSocialLogin = ({ data }: IResolveParams) => {
    userSocialLogin({
      variables: {
        input: {
          firstname: data?.first_name || '',
          lastname: data?.last_name || '',
          email: data?.email || '',
          provider_id: data?.userID,
        },
      },
    });
  };

  return (
    <>
      <CenteredWrapper>
        <Stack alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
          <Image src="./images/KamaPay.png" width="200px" height="100px" />
        </Stack>

        <Typography
          textAlign="center"
          component="h1"
          variant="body1"
          sx={{ mb: 3 }}
        >
          Let's start by adding your phone number
        </Typography>

        <Stack component="form" onSubmit={handleSubmit}>
          <Box alignItems="center">
            <Grid container spacing={1}>
              <Grid item xs={3} md={2}>
                <FormControl
                  variant="standard"
                  fullWidth
                  required
                  error={!!errors?.areaCode && touched?.areaCode}
                >
                  <InputLabel id="country-code-label">Dial Code</InputLabel>
                  <Select
                    labelId="country-code-label"
                    id="country-code-select"
                    name="areaCode"
                    value={values.areaCode}
                    onChange={handleChange}
                    label="Dial Code"
                    renderValue={(value) => value}
                    sx={{ textAlign: 'right' }}
                  >
                    {countryCodes.map((c) => (
                      <MenuItem
                        key={c.id}
                        value={c.dial_code || ''}
                        onClick={() => {
                          setFieldValue('countryId', c.id, false);
                          setFieldValue('currencyCode', c.currency_code, false);
                          setFieldValue(
                            'currencySymbol',
                            c.currency_symbol,
                            false
                          );
                          setFieldValue(
                            'currencyPlacement',
                            c.symbol_placement,
                            false
                          );
                        }}
                      >
                        <Typography
                          variant="body2"
                          component="span"
                          fontStyle="italic"
                        >
                          {c.country_name}
                        </Typography>
                        &nbsp;
                        <Typography
                          variant="body2"
                          component="span"
                          fontWeight="bold"
                          color="GrayText"
                        >
                          ({c.dial_code})
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={9} md={10}>
                <TextField
                  id="phone-number"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  type="tel"
                  label="Phone number"
                  variant="standard"
                  fullWidth
                  required
                  error={!!errors?.phone && touched?.phone}
                />
              </Grid>
            </Grid>
          </Box>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            sx={{ borderRadius: 5, mt: 4 }}
            disabled={verifyPhoneState?.loading || !isValid}
            type="submit"
          >
            {verifyPhoneState?.loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              'Continue'
            )}
          </Button>
        </Stack>

        <Stack alignItems="center" justifyContent="center" sx={{ my: 4 }}>
          <Typography>Login by other options</Typography>
          <Stack direction="row" spacing={1}>
            <LoginSocialFacebook
              appId={process.env.REACT_APP_FB_APP_ID || ''}
              onResolve={handleSocialLogin}
              onReject={console.error}
            >
              <IconButton size="large">
                <FacebookIcon sx={{ fontSize: 40, color: blue[600] }} />
              </IconButton>
            </LoginSocialFacebook>
            <LoginSocialTwitter
              client_id={process.env.REACT_APP_TWITTER_CLIENT_ID || ''}
              redirect_uri={process.env.REACT_APP_TWITTER_REDIRECT_URI || ''}
              onResolve={(response) => {
                console.log('---tw', response);
              }}
              onReject={(error) => {
                console.log('---err', error);
              }}
            >
              <IconButton size="large">
                <TwitterIcon sx={{ fontSize: 40, color: blue[700] }} />
              </IconButton>
            </LoginSocialTwitter>
          </Stack>
        </Stack>
      </CenteredWrapper>
      <Toast
        severity={toast.severity}
        open={toast.toastOpen}
        handleClose={toast.close}
        id="login-toast"
      >
        {toast.message}
      </Toast>
    </>
  );
};

export default Login;
