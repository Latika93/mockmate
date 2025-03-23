import React from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © Mockmate Technology Limited {new Date().getFullYear()}
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Cookie Settings
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Accessibility
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
