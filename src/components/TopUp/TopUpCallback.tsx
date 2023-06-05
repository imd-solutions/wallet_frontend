import {
  redirect,
  useLoaderData,
  LoaderFunctionArgs,
  RedirectFunction,
} from 'react-router-dom';
import ErrorCallback from './ErrorCallback';
import SuccessCallback from './SuccessCallback';

type LoaderData = {
  type?: 'ERROR' | 'SUCCESS';
  query?: {
    [k: string]: string;
  };
  redirect?: RedirectFunction;
};

export const topUpCallbackLoader = ({
  request,
  params,
}: LoaderFunctionArgs) => {
  console.log('-----topUpReq\n', request);
  console.log('-----topUpParams\n', params);

  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  if (params.callback === 'error') {
    return { type: 'ERROR', query };
  }
  if (params.callback === 'success') {
    return { type: 'SUCCESS', query };
  }

  return redirect('/topUp');
};

const TopUpCallback = () => {
  const { type } = useLoaderData() as LoaderData;
  return type === 'SUCCESS' ? <SuccessCallback /> : <ErrorCallback />;
};

export default TopUpCallback;
