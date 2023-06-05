import { gql } from '@apollo/client';

export const WALLET_LOGIN = gql`
  mutation walletLogin($input: AtlasLoginInput) {
    walletLogin(input: $input) {
      success
      token
    }
  }
`;

export const WALLET_FORM_REQUEST = gql`
  mutation walletPaymentForm($input: AtlasTopUpInput) {
    walletPaymentForm(input: $input) {
      status
      html
    }
  }
`;

export const GET_BALANCE = gql`
  query userWallet {
    userWallet {
      id
      balance
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query userTransactions {
    userTransactions {
      amount
      payment_method
      status
      reference
    } 
  }
`;