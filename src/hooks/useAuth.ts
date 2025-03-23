import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../features/store";
import { login, logout } from "../features/auth/authSlice";
import { AuthResponse, LoginCredentials } from "../types/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  //   const handleLogin = async (credentials: LoginCredentials) => {
  //     return dispatch(login(credentials));
  //   };

  //   const handleLogout = async () => {
  //     return dispatch(logout());
  //   };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: () => {},
    // login: handleLogin,
    logout: () => {},
    // logout: handleLogout,
  };
};
