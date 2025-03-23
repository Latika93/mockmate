import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      await login();
      //   await login({ email, password });
      navigate("/");
    } catch (err) {
      // Error is handled by the auth slice
    }
  };

  return (
    <div className="min-h-screen bg-[#0f3932] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src="/logo-white.svg" alt="Workable" className="h-8" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-[#0f3932] mb-6">
            Log in
          </h1>

          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Work email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-[#0f3932] focus:ring-[#0f3932] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-[#0f3932] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" fullWidth loading={isLoading}>
                Log in
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0f3932] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
