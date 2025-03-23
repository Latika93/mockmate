import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India for the mockup
  const [receiveResources, setReceiveResources] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic validation
    if (!firstName || !lastName || !email) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // This would be replaced with actual API registration logic
      console.log("Registration data:", {
        firstName,
        lastName,
        email,
        phone: countryCode + phone,
        receiveResources,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, would navigate to a confirmation page or login
      alert("Registration submitted successfully");

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setIsLoading(false);
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

          <form onSubmit={handleSubmit}>
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

              <div>
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
                Get a demo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
