import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { register } from "../features/auth/authSlice";
import { RootState } from "../features/store";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../features/auth/authSlice";

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India for the mockup
  const [receiveResources, setReceiveResources] = useState(false);
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]); // State for form validation errors
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/connect"); // Or maybe navigate to login after successful registration
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validateForm = () => {
    const errors: string[] = [];
    if (!firstName) errors.push("First name is required.");
    if (!lastName) errors.push("Last name is required.");
    if (!email) {
      errors.push("Email is required.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Email is invalid.");
    }
    if (!password) errors.push("Password is required.");
    if (password.length < 6)
      errors.push("Password must be at least 6 characters long.");
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate form before proceeding
    try {
      await dispatch(
        register({
          name: firstName + " " + lastName,
          email,
          password: password,
        })
      ).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
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
          <h1 className="text-2xl font-bold text-center text-[#0f3932] mb-2">
            Register
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Blah blah blah... we'll change it later
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {formErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {formErrors.map((err, index) => (
                <div key={index}>{err}</div>
              ))}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <Input
                label="First name*"
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <Input
                label="Last name*"
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <Input
                label="Work email*"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password*"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <div className="flex">
                  <select
                    className="px-3 py-2 bg-white border shadow-sm border-slate-300 focus:outline-none focus:border-[#0f3932] focus:ring-[#0f3932] rounded-l-md sm:text-sm focus:ring-1 w-24"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="+91">India (+91)</option>
                    <option value="+1">US (+1)</option>
                    <option value="+44">UK (+44)</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#0f3932] focus:ring-[#0f3932] block rounded-r-md sm:text-sm focus:ring-1 w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div> 
*/}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="resources"
                    type="checkbox"
                    className="h-4 w-4 text-[#0f3932] focus:ring-[#0f3932] border-gray-300 rounded"
                    checked={receiveResources}
                    onChange={(e) => setReceiveResources(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="resources" className="text-gray-600">
                    Yes, I'd like to receive helpful resources like tutorials,
                    templates and the latest hiring advice, as well as
                    invitations to Workable events. (You can opt out any time).
                    View our{" "}
                    <a href="#" className="text-[#0f3932] underline">
                      privacy policy
                    </a>
                  </label>
                </div>
              </div>

              <Button type="submit" fullWidth loading={isLoading}>
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
