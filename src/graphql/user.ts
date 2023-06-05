import { gql } from '@apollo/client';

export const GET_USER = gql`
  query user($id: ID) {
    user(id: $id) {
      name
      email
      phone
      profile {
        firstname
        lastname
        country_id
        currency_code
        language_code
        balance
      }
    }
  }
`;
