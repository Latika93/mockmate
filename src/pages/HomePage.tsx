import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { ScheduleInterviewModal } from "../components/interview/ScheduleInterviewModal";

export const HomePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-[#0f3932] mb-6">
              Mock interviews with same level peer or Experts
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Pairing with same level/or expert peer for mock interview practice
              AND Network
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/demo">
                <Button variant="outline">Request a demo</Button>
              </Link>
              <Link to="/trial">
                <Button>Start a free trial</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-[#84b8f5] rounded-full absolute w-72 h-72 -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  alt="Person"
                  className="rounded-md w-full h-auto"
                />
              </div>

              <div className="bg-white p-3 rounded-md shadow-md mt-8">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  alt="Person"
                  className="rounded-md w-full h-auto"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0f3932] to-[#3b82f6] rounded-lg absolute w-24 h-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <ScheduleInterviewModal 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </Layout>
  );
};

