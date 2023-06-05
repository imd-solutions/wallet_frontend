import { Navigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import OTP from '../components/Auth/OTP';
import Loader from '../components/Auth/Loader';
import { OTP as OTPStep } from '../components/Auth/constants';
import useStepChange from '../components/Auth/useStepChange';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const Auth = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { step, stepChanging, handleStepChange } = useStepChange();

  if (accessToken) return <Navigate to="/" />;

  if (stepChanging) return <Loader />;
  if (step === OTPStep) return <OTP handleStepChange={handleStepChange} />;
  return <Login handleStepChange={handleStepChange} />;
};

export default Auth;
