import { useEffect, useCallback } from 'react';
import {
  Stack,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import * as Yup from 'yup';
import { useLazyQuery, useMutation } from '@apollo/client';
import { REGISTER_PROFILE } from 'graphql/auth';
import Field from 'components/Field';
import languageCodes from 'utils/language_code.json';
import { getApiResponse } from 'utils/getApiResponse';
import Toast from 'components/Toast';
import { useToast } from 'hooks/useToast';
import { GET_USER } from 'graphql/user';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('A first name is required'),
  lastName: Yup.string().required('A last name is required'),
  email: Yup.string().required('An email is required'),
  phone: Yup.string().required('A phone number is required'),
});

const LoadingAdornment = ({ loading }: { loading: boolean }) => {
  return loading ? (
    <InputAdornment position="end">
      <CircularProgress
        size={20}
        sx={({ palette }) => ({ color: palette.grey[500] })}
      />
    </InputAdornment>
  ) : null;
};

const Settings = () => {
  const [registerProfile, registerState] = useMutation(REGISTER_PROFILE);
  const [getUser, getUserState] = useLazyQuery(GET_USER);
  const { uid, phoneNumber } = useSelector((state: RootState) => state.auth);
  const { countryId, currencyCode } = useSelector(
    (state: RootState) => state.user.walletConfig
  );
  const toast = useToast();

  const handleRegisterResponse = useCallback(() => {
    getApiResponse('userUpdate', registerState)
      .then((data) => {
        if (data) {
          toast.showToast(
            'success',
            "Congratulations you're successfully registered."
          );
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
  }, [registerState, toast]);

  const handleGetUserResponse = useCallback(() => {
    getApiResponse('user', getUserState)
      .then((data) => {
        if (data) {
          const userData = {
            email: data.email,
            phone: data.phone,
            firstName: data.profile.firstname,
            lastName: data.profile.lastname,
            language: data.profile.language_code,
          };
          formik.setValues(userData);
        }
      })
      .catch((error) => {
        toast.showToast(
          'error',
          'An error occurred getting this user, please try again.',
          error
        );
      });
  }, [getUserState, toast]);

  useEffect(() => {
    if (uid) getUser({ variables: { id: uid } });
  }, [uid]);

  useEffect(() => {
    handleRegisterResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerState]);

  useEffect(() => {
    handleGetUserResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserState]);

  const { values, handleChange, handleSubmit, errors, touched, ...formik } =
    useFormik({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: phoneNumber
          ? `${phoneNumber?.areaCode}${phoneNumber?.phone}`
          : '',
        language: 'en',
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
              language_code: values.language,
            },
          },
        });
      },
    });

  return (
    <Stack width="100%" maxWidth="480px" padding={2}>
      <Stack width="100%" mb={4}>
        <Typography component="h1" variant="h4">
          Account
        </Typography>
        <Typography component="h1" variant="subtitle1">
          Edit your account settings below:
        </Typography>
      </Stack>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%', maxWidth: '480px' }}
      >
        <Field
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          label="First Name"
          error={!!errors?.firstName && touched.firstName}
          InputProps={{
            endAdornment: <LoadingAdornment loading={getUserState.loading} />,
          }}
        />
        <Field
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          label="Last Name"
          error={!!errors?.lastName && touched.lastName}
          InputProps={{
            endAdornment: <LoadingAdornment loading={getUserState.loading} />,
          }}
        />
        <Field
          name="email"
          value={values.email}
          onChange={handleChange}
          type="email"
          label="E-mail"
          error={!!errors?.email && touched.email}
          InputProps={{
            endAdornment: <LoadingAdornment loading={getUserState.loading} />,
          }}
        />
        <Field
          name="phone"
          value={values.phone}
          onChange={handleChange}
          type="tel"
          label="Phone Number"
          disabled={!!phoneNumber}
          error={!!errors?.phone && touched.phone}
          InputProps={{
            endAdornment: <LoadingAdornment loading={getUserState.loading} />,
          }}
        />
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            name="language"
            value={values.language || 'en'}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          >
            {languageCodes.map((lang) => {
              return (
                <MenuItem
                  key={lang.alpha2}
                  value={lang.alpha2}
                  sx={{ textOverflow: 'ellipsis' }}
                >
                  {lang.English}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => handleSubmit()}
          sx={{ borderRadius: 5 }}
          disabled={registerState?.loading || !formik.isValid}
        >
          Update
        </Button>
      </Stack>
      <Toast
        severity={toast.severity}
        open={toast.toastOpen}
        handleClose={toast.close}
        id="settings-toast"
      >
        {toast.message}
      </Toast>
    </Stack>
  );
};

export default Settings;
