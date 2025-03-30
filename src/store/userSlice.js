import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  userId: null,
  userName: null,
  // Add other user-related state here if needed
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId; // Assuming your backend sends userId
      state.userName = action.payload.name; // Assuming your backend sends name
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.userName = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;