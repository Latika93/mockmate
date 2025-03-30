import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../features/store";
import { login, logout } from "../features/auth/authSlice";
import { AuthResponse, LoginCredentials } from "../types/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: () => {},
    logout: () => {},
  };
};
