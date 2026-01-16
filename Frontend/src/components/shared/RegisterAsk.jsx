import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom'

const RegisterAsk = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full min-h-[100vh] bg-gradient-to-br from-orange-300 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 max-w-lg w-full text-center">

        {/* Brand */}
        <p className="text-sm uppercase tracking-widest text-[var(--primary-green)] font-semibold mb-2">
          Welcome to E-Haat
        </p>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Who are you?
        </h1>

        <p className="mt-2 text-gray-500 text-sm">
          Choose how you want to join the E-Haat marketplace
        </p>

        {/* Divider */}
        <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-orange)] mx-auto my-6 rounded-full" />

        {/* Options */}
        <div className="space-y-5">

          <h2 className="text-base font-semibold text-gray-700">
            Register as
          </h2>

          {/* Buyer */}
          <button
            onClick={() => navigate("/buyer/sign-in")}
            className="group w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-all shadow-sm"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-green-700">Buyer</p>
              <p className="text-sm text-green-600">
                Purchase fresh products directly
              </p>
            </div>
            <span className="text-green-600 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </button>

          {/* Seller */}
          <button
            onClick={() => navigate("/seller/sign-in")}
            className="group w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all shadow-sm"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-orange-700">Seller</p>
              <p className="text-sm text-orange-600">
                Sell your goods to a wider market
              </p>
            </div>
            <span className="text-orange-600 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </button>

          {/* Transporter */}
          <button
            onClick={() => navigate("/transporter/register")}
            className="group w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all shadow-sm"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-blue-700">Transporter</p>
              <p className="text-sm text-blue-600">
                Deliver orders & earn income
              </p>
            </div>
            <span className="text-blue-600 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </button>

        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          Secure • Trusted • Local Marketplace
        </p>

      </div>

    </section>
  );
};

export default RegisterAsk;
