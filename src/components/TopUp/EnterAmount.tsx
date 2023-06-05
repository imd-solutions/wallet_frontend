import {
  Box,
  Typography,
  FormControl,
  Button as MuiButton,
  Paper,
  styled,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CenteredWrapper from 'components/CenteredWrapper';
import { Stages, Stage } from './useWallet';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { IMaskInput } from 'react-imask';
import { useRef } from 'react';

const Button = styled(MuiButton)({
  borderRadius: '30px',
  minWidth: '150px',
});

const CurrencyInput = styled(IMaskInput)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: theme.typography.h3.fontSize,
  textAlign: 'center',
  border: 0,
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
  maxWidth: 'fit-content',
  outline: 'none',
  transition: 'all .5s ease-in-out',
  '&:focus': {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

const AmountInput = ({
  amount,
  handleChange,
}: {
  amount: string;
  handleChange: (value: string) => void;
}) => {
  const ref = useRef();
  const inputRef = useRef();
  const { currencySymbol: symbol, currencyPlacement } = useSelector(
    (state: RootState) => state.user.walletConfig
  );
  const mask =
    currencyPlacement === 'Suffix' ? `num ${symbol}` : `${symbol} num`;

  return (
    <FormControl fullWidth>
      <CurrencyInput
        lazy={false}
        mask={mask}
        blocks={{
          num: {
            lazy: false,
            mask: Number,
            scale: 2,
            signed: false,
            thousandsSeparator: ',',
            padFractionalZeros: true,
            normalizeZeros: true,
            radix: '.',
            mapToRadix: ['.'],
            min: 0,
            max: 1000,
          },
        }}
        value={amount || 0}
        unmask={false}
        ref={ref}
        inputRef={inputRef}
        onAccept={(value: string) => {
          handleChange(value);
        }}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          // handleChange(e.currentTarget.value);
        }}
      />
    </FormControl>
  );
};

const EnterAmount = ({
  amount,
  setAmount,
  setStage,
}: {
  amount: string;
  setAmount: (amount: string) => void;
  setStage: (stage: Stage) => void;
}) => {
  const navigate = useNavigate();

  return (
    <CenteredWrapper id="enterAmount">
      <Paper sx={{ p: 4, boxSizing: 'border-box' }}>
        <Typography
          variant="h6"
          fontWeight="normal"
          sx={{ mb: 2 }}
          textAlign="center"
        >
          Enter top-up amount
        </Typography>
        <Box sx={{ mb: 4 }}>
          <AmountInput
            amount={amount}
            handleChange={(value) => setAmount(value)}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            onClick={() => navigate('/')}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.common.black}`,
              color: theme.palette.common.black,
            })}
            type="button"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            sx={(theme) => ({
              backgroundColor: '#E5AE05',
              color: theme.palette.common.black,
              '&:focus, &:hover': {
                backgroundColor: '#F1CA50',
              },
            })}
            onClick={() => setStage(Stages.GetForm)}
            type="button"
          >
            Next
          </Button>
        </Box>
      </Paper>
    </CenteredWrapper>
  );
};

export default EnterAmount;
