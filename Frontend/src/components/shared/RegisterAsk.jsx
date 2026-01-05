import React from "react";
import { Button } from "@/components/ui/button";

const RegisterAsk = () => {
  return (
    <section className="w-full min-h-[100vh] bg-[var(--primary-greenn)] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
        
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Who are you?
        </h1>
        <p className="mt-2 text-gray-500">
          Choose how you want to join E-Haat
        </p>

        {/* Divider */}
        <div className="w-16 h-1 bg-green-600 mx-auto my-6 rounded-full" />

        {/* Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Register as
          </h2>

          <div className="flex flex-col gap-4">
            <Button className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 transition">
              Buyer
            </Button>

            <Button className="w-full py-3 text-lg bg-orange-500 hover:bg-orange-600 transition">
              Seller
            </Button>

            <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 transition">
              Transporter
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RegisterAsk;
