import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./features/store";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { useAuth } from "./hooks/useAuth";
import ConnectPage from "./pages/connect";
import { initializeSocket } from "./services/videoCallService";
// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
    }
  }, [isAuthenticated]);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/connect"
            element={
              isAuthenticated ? <ConnectPage /> : <Navigate to="/login" />
            }
          />
          {/* Example of a protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard (Protected)</div>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
