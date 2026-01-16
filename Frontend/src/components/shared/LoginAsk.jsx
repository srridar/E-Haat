import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Store, Truck } from "lucide-react";

const LoginAsk = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-[100vh] bg-gradient-to-br from-orange-300 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
        
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-green-500">
          Welcome to <span className="text-orange-400"> E-Haat</span>
        </h1>
        <p className="mt-3 text-gray-500 text-sm md:text-base">
          Select your role to continue securely
        </p>

        {/* Divider */}
        <div className="w-20 h-1 bg-green-600 mx-auto my-6 rounded-full" />

        {/* Login Options */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-700">
            Log in as
          </h2>

          <div className="flex flex-col gap-4">
            
            {/* Buyer */}
            <Button
              onClick={() => navigate("/buyer/login")}
              className="flex items-center justify-center gap-3 w-full py-6 text-lg font-semibold bg-green-300 hover:bg-green-400 shadow-md hover:shadow-lg transition-all"
            >
              <User className="w-5 h-5" />
              Buyer
            </Button>

            {/* Seller */}
            <Button
              onClick={() => navigate("/seller/login")}
              className="flex items-center justify-center gap-3 w-full py-6 text-lg font-semibold bg-orange-300 hover:bg-orange-400 shadow-md hover:shadow-lg transition-all"
            >
              <Store className="w-5 h-5" />
              Seller
            </Button>

            {/* Transporter */}
            <Button
              onClick={() => navigate("/transporter/login")}
              className="flex items-center justify-center gap-3 w-full py-6 text-lg font-semibold bg-blue-300 hover:bg-blue-400 shadow-md hover:shadow-lg transition-all"
            >
              <Truck className="w-5 h-5" />
              Transporter
            </Button>

          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-400">
          Secure access for buyers, sellers & logistics partners
        </p>

      </div>
    </section>
  );
};

export default LoginAsk;
