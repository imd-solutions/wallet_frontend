import { gql } from '@apollo/client';

export const VERIFY_PHONE_NUMBER = gql`
  mutation userOTP($input: OTPInput) {
    userOTP(input: $input) {
      status
      message
      text
      css
      title
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation userConfirmOTP($input: ConfirmOTPInput) {
    userConfirmOTP(input: $input) {
      access_token
      uid
      status
      message
      verified
    }
  }
`;

export const SOCIAL_REGISTER = gql`
  mutation userSocialLogin($input: UserSocialInput) {
    userSocialLogin(input: $input) {
      access_token
      uid
      status
      message
    }
  }
`;

export const REGISTER_PROFILE = gql`
  mutation userUpdate($input: UserUpdateInput) {
    userUpdate(input: $input) {
      access_token
      uid
      status
      message
    }
  }
`;
