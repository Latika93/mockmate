// import axios from "axios";
// import { LoginCredentials, AuthResponse } from "../types/auth";
// import { apiService } from "./apiService";

// class AuthService {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     // In a real application, replace this with your actual API endpoint
//     const response = await apiService.post<AuthResponse>(
//       "/auth/login",
//       credentials
//     );

//     // Store token in localStorage for persistence
//     localStorage.setItem("token", response.token);

//     return response;
//   }

//   async logout(): Promise<void> {
//     // Clear local storage
//     localStorage.removeItem("token");
//   }

//   getToken(): string | null {
//     return localStorage.getItem("token");
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }
// }

// export const authService = new AuthService();


// src/services/authService.ts
import axios from 'axios'; // You might need to install axios: npm install axios
import { RegisterCredentials } from '../types/auth';

const API_BASE_URL = 'http://localhost:5000';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data; // Assuming your backend returns user info and a token
  } catch (error: any) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const registerUser = async (credentials: RegisterCredentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, credentials);
    return response.data;
  } catch (error: any) {
    console.error('Signup failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  } catch (error: any) {
    console.error('Logout failed:', error.response?.data?.message || error.message);
    throw error;
  }
};
