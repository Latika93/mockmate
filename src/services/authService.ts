import axios from "axios";
import { LoginCredentials, AuthResponse } from "../types/auth";
import { apiService } from "./apiService";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // In a real application, replace this with your actual API endpoint
    const response = await apiService.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Store token in localStorage for persistence
    localStorage.setItem("token", response.token);

    return response;
  }

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
