import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react"; 
import { ScheduleInterviewModal } from "../interview/ScheduleInterviewModal";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="MockMate" />
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/network"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Network
              </Link>
              <span
                onClick={() => setOpen(true)}
                className="border-transparent cursor-pointer text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Schedule Interview
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                className="border border-transparent text-[#0f3932] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
              >
                Log out
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="border border-transparent text-[#0f3932] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0f3932] text-white hover:bg-[#0a2b26] px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <ScheduleInterviewModal 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </nav>
  );
};
