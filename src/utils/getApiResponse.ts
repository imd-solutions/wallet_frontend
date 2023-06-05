import { MutationResult, QueryResult } from '@apollo/client';

export const getApiResponse = async (
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: MutationResult<any> | QueryResult<any>
) => {
  if (!state.called) return;

  if (state?.error) throw state.error;

  if (state?.data && !state?.error && !state?.loading) {
    const data = state?.data[endpoint];
    if (data) {
      if (!data.status) return data;
      if ((data.status >= 200 && data.status < 300) || data.status === 23000)
        return data;
      if (data.status >= 400 && data.status < 500) throw data;
      throw new Error(`${endpoint}, ${JSON.stringify(data)}`);
    }
    throw new Error(`Data was not returned for ${endpoint}`);
  }

  return;
};
