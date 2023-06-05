import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PhoneNumber {
  areaCode: string;
  phone: string;
}

interface AuthState {
  phoneNumber?: PhoneNumber;
  email?: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  uid?: number;
}

const initialState: AuthState = {
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber(state, action: PayloadAction<PhoneNumber | undefined>) {
      state.phoneNumber = action.payload;
    },
    setUserId(state, action: PayloadAction<number | undefined>) {
      state.uid = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      delete state.accessToken;
      delete state.email;
      delete state.refreshToken;
      delete state.uid;
      delete state.phoneNumber;
      localStorage.removeItem('TOKEN');
    },
  },
});

export const { setPhoneNumber, setUserId, setAccessToken, logout } =
  authSlice.actions;
export default authSlice.reducer;
