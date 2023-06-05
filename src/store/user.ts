import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WalletConfig {
  languageCode?: string;
  countryId?: number;
  currencyCode?: string;
  currencySymbol?: string;
  currencyPlacement?: 'Prefix' | 'Suffix';
}

interface UserState {
  phoneNumber?: string;
  email?: string;
  walletConfig: WalletConfig;
}

const initialState: UserState = {
  walletConfig: {
    languageCode: 'en',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_, action: PayloadAction<UserState>) {
      return action.payload;
    },
    setWalletConfig(state, action: PayloadAction<WalletConfig>) {
      state.walletConfig = action.payload;
    },
  },
});

export const { setUser, setWalletConfig } = userSlice.actions;
export default userSlice.reducer;
