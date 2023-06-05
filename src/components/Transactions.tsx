import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from 'graphql/wallet';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { getApiResponse } from 'utils/getApiResponse';
import { Box, Stack, Typography, Button, Paper } from '@mui/material';
import {
  ArrowCircleRight,
  ArrowCircleLeft,
  Cancel,
} from '@mui/icons-material';
import { yellow, green, red } from '@mui/material/colors';
import { format } from 'date-fns';

interface Transaction {
  amount: number;
  reference: string;
  status: string;
  payment_method: string;
  type: TransactionType;
  user?: string;
  date: string;
}

export enum TransactionStatus {
  Completed = 'completed',
  Pending = 'pending',
  Failed = 'failed',
}

export enum TransactionType {
  Credit = 'credit',
  Debit = 'debit',
}

const newDate = () => new Date(2023, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) + 1).toISOString();

const trans = [
  {
    amount: 50,
    date: newDate(),
    reference: 'ref',
    status: 'pending',
    payment_method: 'visa',
    type: TransactionType.Credit,
  },
  {
    amount: 250,
    date: newDate(),
    reference: 'ref9',
    status: 'completed',
    payment_method: 'visa',
    type: TransactionType.Debit,
    user: 'John Jegede',
  },
  {
    amount: 250,
    date: newDate(),
    reference: 'ref2',
    status: 'completed',
    payment_method: 'visa',
    type: TransactionType.Debit,
    user: 'Joe Smith',
  },
  {
    amount: 350,
    date: newDate(),
    reference: 'ref4',
    status: 'failed',
    payment_method: 'visa',
    type: TransactionType.Credit,
  },
  {
    amount: 350,
    date: newDate(),
    reference: 'ref5',
    status: 'completed',
    payment_method: 'visa',
    type: TransactionType.Credit,
  },
];

const transactionStatuses = (transaction: Transaction) => {
  const statuses = {
    [TransactionStatus.Completed]: {
      colour: transaction.type === TransactionType.Debit ? green['A200'] : red[500],
      Icon: transaction.type === TransactionType.Credit ? ArrowCircleLeft : ArrowCircleRight
    },
    [TransactionStatus.Pending]: {
      colour: yellow[600],
      Icon: transaction.type === TransactionType.Credit ? ArrowCircleLeft : ArrowCircleRight
    },
    [TransactionStatus.Failed]: {
      colour: red[500],
      Icon: Cancel
    },
  };

  const text = transaction.user ? transaction.type === TransactionType.Debit ? 'sent' : 'received' : 'added';

  return {
    text,
    statusIcon: statuses[transaction.status as TransactionStatus]
  };
};

const Transactions = () => {
  const [getTransactions, getTransactionsState] =
    useLazyQuery(GET_TRANSACTIONS);
  const { currencySymbol: symbol, currencyPlacement } = useSelector(
    (state: RootState) => state.user.walletConfig
  );
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(false);

  const handleGetTransactionsResponse = useCallback(() => {
    getApiResponse('userTransactions', getTransactionsState)
      .then((data) => {
        if (data) {
          setTransactions(data);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, [getTransactionsState]);

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    handleGetTransactionsResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTransactionsState]);

  return (
    <Stack>
      {getTransactionsState.loading ? (
        'Loading...'
      ) : (
        <Stack>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              component="p"
              variant="body1"
              sx={{ textTransform: 'uppercase' }}
            >
              Recent Transactions
            </Typography>
            {/* <Button type="button" variant="text">
              See all
            </Button> */}
          </Box>
          {transactions.map((transaction: Transaction) => {
            const { text, statusIcon: { colour, Icon }} = transactionStatuses(transaction);

            const maskedAmount = currencyPlacement === 'Prefix' ? `${symbol}${transaction.amount}` : `${transaction.amount}${symbol}`

            return (
              <Box
                key={transaction.reference}
                component={Paper}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Icon fontSize="large" sx={{ color: colour }}  />
                  <Typography component="p" sx={{ marginLeft: 1.5 }}>
                    <Typography component="span" variant="body2" color="slategray">You&nbsp;{text}&nbsp;
                      <Typography component="span" variant="body1" color="MenuText">
                        {maskedAmount}
                      </Typography>
                    </Typography>
                    <Typography component="span" variant="body2" display="block" fontStyle="italic">
                      {format(new Date(transaction.date), 'dd/mm/yyyy')}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default Transactions;
