import { useEffect } from 'react';
import { Stack, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { SOCIAL_REGISTER } from '../../graphql/auth';
import Field from '../Field';
import { HandleStepChangeProps } from './useStepChange';
import * as Yup from 'yup';
import { getApiResponse } from '../../utils/getApiResponse';
import { useToast } from 'hooks/useToast';
import Toast from 'components/Toast';

interface Props {
  handleStepChange: (params: HandleStepChangeProps) => void;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('A first name is required'),
  lastName: Yup.string().required('A last name is required'),
  email: Yup.string().required('An email is required'),
  password: Yup.string().required('A password is required'),
  confirmPassword: Yup.string().required('A password confirmation is required'),
});

/* eslint-disable react-hooks/exhaustive-deps */
const SocialRegistration = ({ handleStepChange }: Props) => {
  const [socialRegister, registerState] = useMutation(SOCIAL_REGISTER);
  const toast = useToast();

  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      socialRegister({
        variables: {
          input: {
            firstname: values.firstName,
            lastname: values.lastName,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
        },
      });
    },
  });

  const handleRegisterResponse = () => {
    getApiResponse('socialRegister', registerState)
      .then((data) => {
        if (data) {
          toast.showToast(
            'success',
            "Congratulations you're successfully registered."
          );
          handleStepChange({ value: '/main' });
        }
      })
      .catch((error) =>
        toast.showToast(
          'error',
          'Sorry an error occurred with your registration, please try again.',
          error
        )
      );
  };

  useEffect(() => {
    handleRegisterResponse();
  }, [registerState]);

  return (
    <>
      <Typography
        textAlign="center"
        component="h1"
        variant="body1"
        sx={{ mb: 3 }}
      >
        Register with Facebook
      </Typography>
      <Stack component="form" sx={{ m: 1 }} onSubmit={handleSubmit}>
        <Field
          id="firstName"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          label="First Name"
          variant="outlined"
          error={!!errors?.firstName && touched.firstName}
        />
        <Field
          id="lastName"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          label="Last Name"
          variant="outlined"
          error={!!errors?.lastName && touched.lastName}
        />
        <Field
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          label="E-mail"
          variant="outlined"
          error={!!errors?.email && touched.email}
        />
        <Field
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          type="password"
          label="Password"
          error={!!errors?.password && touched.password}
        />
        <Field
          id="confirmPassword"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          type="confirmPassword"
          label="Confirm Password"
          error={!!errors?.confirmPassword && touched.confirmPassword}
        />
        <Button
          variant="contained"
          onClick={() => handleSubmit()}
          type="submit"
          sx={{ borderRadius: 5, mt: 4 }}
          disabled={registerState.loading}
        >
          Confirm Registration
        </Button>
      </Stack>
      <Toast
        severity={toast.severity}
        open={toast.toastOpen}
        handleClose={toast.close}
        id="social-registration-toast"
      >
        {toast.message}
      </Toast>
    </>
  );
};

export default SocialRegistration;
