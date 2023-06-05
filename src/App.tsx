import { createTheme, ThemeProvider, Stack } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Provider } from 'react-redux';
import Auth from 'pages/Auth';
import Main from 'pages/Main';
import TopUp from 'pages/TopUp';
import TopUpMain from 'components/TopUp/TopUpMain';
import TopUpCallback, {
  topUpCallbackLoader,
} from 'components/TopUp/TopUpCallback';
import Home from 'pages/Home';
import Registration from 'components/Auth/Registration';
import ErrorPage from 'components/ErrorPage';
import Settings from 'pages/Settings';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import './App.css';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
        },
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Auth />,
  },
  {
    path: '/register',
    element: <Registration />,
  },
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: '/settings', element: <Settings /> },
      {
        path: '/topUp',
        element: <TopUp />,
        children: [
          { index: true, element: <TopUpMain /> },
          {
            path: '/topUp/:callback',
            element: <TopUpCallback />,
            loader: topUpCallbackLoader,
          },
        ],
      },
    ],
  },
]);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('TOKEN');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const link = from([
  errorLink,
  authLink,
  new HttpLink({ uri: 'http://dev.pmd.com/graphql' }),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Stack
              id="outer"
              minHeight="100vh"
              alignItems="center"
              sx={{ p: 0, m: 0 }}
            >
              <RouterProvider router={router} />
            </Stack>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
