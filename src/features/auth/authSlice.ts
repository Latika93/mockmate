import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoginCredentials, User, RegisterCredentials } from "../../types/auth";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  level: string | null;
  status: string | null;
  _id: string | null;
  name: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  level: null,
  status: null,
  _id: null,
  name: '',
};

export const login: any = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials.email, credentials.password);

      console.log("login response", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

export const register: any = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await registerUser(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            token: string;
            level: string;
            status: string;
            _id: string;
            name: string;
          }>
        ) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.level = action.payload.level;
          state.status = action.payload.status;
          state._id = action.payload._id;
          state.name = action.payload.name;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
