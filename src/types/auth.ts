export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
