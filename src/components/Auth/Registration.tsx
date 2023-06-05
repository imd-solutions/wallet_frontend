import { useLocation, Navigate } from 'react-router-dom';
import CenteredWrapper from '../CenteredWrapper';
import ProfileRegistration from './ProfileRegistration';
import SocialRegistration from './SocialRegistration';
import { SOCIAL_REGISTRATION } from './constants';
import useStepChange from './useStepChange';
import Loader from './Loader';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const Registration = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { state } = useLocation();
  const { stepChanging, handleStepChange } = useStepChange();

  if (accessToken) return <Navigate to="/" />;

  return (
    <CenteredWrapper>
      {stepChanging ? (
        <Loader />
      ) : !!state && state?.type === SOCIAL_REGISTRATION ? (
        <SocialRegistration handleStepChange={handleStepChange} />
      ) : (
        <ProfileRegistration handleStepChange={handleStepChange} />
      )}
    </CenteredWrapper>
  );
};

export default Registration;
