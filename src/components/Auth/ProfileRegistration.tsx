import { Stack, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_PHONE_NUMBER, REGISTER_PROFILE } from '../../graphql/auth';
import Field from '../Field';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { OTP } from './constants';
import { HandleStepChangeProps } from './useStepChange';
import * as Yup from 'yup';
import { getApiResponse } from '../../utils/getApiResponse';
import Toast from 'components/Toast';
import { useToast } from 'hooks/useToast';
import { setAccessToken } from 'store/auth';
import { useDispatch } from '../../store';

interface Props {
  handleStepChange: (params: HandleStepChangeProps) => void;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('A first name is required'),
  lastName: Yup.string().required('A last name is required'),
  email: Yup.string().required('An email is required'),
  phone: Yup.string().required('A phone number is required'),
});

/* eslint-disable react-hooks/exhaustive-deps */
const ProfileRegistration = ({ handleStepChange }: Props) => {
  const dispatch = useDispatch();
  const [verifyPhoneNumber, verifyPhoneState] =
    useMutation(VERIFY_PHONE_NUMBER);
  const [registerProfile, registerState] = useMutation(REGISTER_PROFILE);

  const { uid, phoneNumber } = useSelector((state: RootState) => state.auth);
  const { countryId, currencyCode } = useSelector(
    (state: RootState) => state.user.walletConfig
  );
  const toast = useToast();

  useEffect(() => {
    if (!phoneNumber || !uid) handleStepChange({ value: '/login' });
  }, [phoneNumber]);

  const handleVerifyPhoneResponse = () => {
    getApiResponse('verifyPhoneNumber', verifyPhoneState)
      .then((data) => {
        if (data) {
          toast.showToast(
            'success',
            'Congratulations your OTP has been verified.'
          );
          handleStepChange({ value: OTP });
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

  const handleRegisterResponse = () => {
    getApiResponse('userUpdate', registerState)
      .then((data) => {
        if (data) {
          toast.showToast(
            'success',
            "Congratulations you're successfully registered."
          );
          dispatch(setAccessToken(data.access_token));
          localStorage.setItem('TOKEN', data.access_token);
          handleStepChange({ value: '/' });
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          'Sorry an error occurred with your registration, please try again.',
          error
        );
        registerState.reset();
      });
  };

  useEffect(() => {
    handleVerifyPhoneResponse();
  }, [verifyPhoneState]);

  useEffect(() => {
    handleRegisterResponse();
  }, [registerState]);

  const { values, handleChange, handleSubmit, errors, touched, ...formik } =
    useFormik({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: phoneNumber
          ? `${phoneNumber?.areaCode}${phoneNumber?.phone}`
          : '',
      },
      validationSchema,
      onSubmit: (values) => {
        registerProfile({
          variables: {
            input: {
              id: uid,
              firstname: values.firstName,
              lastname: values.lastName,
              email: values.email,
              country_id: countryId,
              currency_code: currencyCode,
            },
          },
        });
      },
    });

  const reverifyPhone = () => {
    verifyPhoneNumber({
      variables: {
        input: { ...phoneNumber },
      },
    });
  };

  return (
    <>
      <Typography
        textAlign="center"
        component="h1"
        variant="body1"
        sx={{ mb: 3 }}
      >
        Complete your profile
      </Typography>
      <Stack component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Field
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          label="First Name"
          error={!!errors?.firstName && touched.firstName}
        />
        <Field
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          label="Last Name"
          error={!!errors?.lastName && touched.lastName}
        />
        <Field
          name="email"
          value={values.email}
          onChange={handleChange}
          type="email"
          label="E-mail"
          error={!!errors?.email && touched.email}
        />
        <Field
          name="phone"
          value={values.phone}
          onChange={handleChange}
          type="tel"
          label="Phone Number"
          disabled={!!phoneNumber}
          error={!!errors?.phone && touched.phone}
        />
        <Button
          variant="text"
          size="small"
          onClick={reverifyPhone}
          sx={{ borderRadius: 5, mb: 4, mt: 4 }}
          disabled={verifyPhoneState?.loading || registerState?.loading}
        >
          Confirm your phone
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleSubmit()}
          sx={{ borderRadius: 5 }}
          disabled={
            verifyPhoneState?.loading ||
            registerState?.loading ||
            !formik.isValid
          }
        >
          Update
        </Button>
      </Stack>
      <Toast
        severity={toast.severity}
        open={toast.toastOpen}
        handleClose={toast.close}
        id="profile-registration-toast"
      >
        {toast.message}
      </Toast>
    </>
  );
};

export default ProfileRegistration;
