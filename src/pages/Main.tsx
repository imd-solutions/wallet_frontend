import Header from '../components/Header';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const Main = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return accessToken ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default Main;
