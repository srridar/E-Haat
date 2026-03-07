import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, Truck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/order-confirmation');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Shipping & Payment (8 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              Checkout <Lock className="text-gray-400" size={24} />
            </h2>
            <p className="mt-2 text-gray-600">Please enter your shipping and payment information.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" /> Shipping Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="First Name" required onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none" />
                <input type="text" name="lastName" placeholder="Last Name" required onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none" />
                <input type="email" name="email" placeholder="Email Address" required className="md:col-span-2 w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none" />
                <input type="text" name="address" placeholder="Street Address" required className="md:col-span-2 w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-green-600" /> Payment Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 border-2 border-black rounded-xl bg-gray-50 flex justify-between items-center">
                  <span className="font-semibold">Credit / Debit Card</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-gray-300 rounded" />
                    <div className="w-8 h-5 bg-gray-400 rounded" />
                  </div>
                </div>
                <input type="text" placeholder="Card Number" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl">
              Complete Purchase
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-8">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            {/* Sample Item List */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl"></div>
                  <div>
                    <p className="font-bold">Premium Sneakers</p>
                    <p className="text-sm text-gray-500">Qty: 1</p>
                  </div>
                </div>
                <span className="font-bold">$120.00</span>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* Calculations */}
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-semibold">$120.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-xl text-gray-900 font-bold pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>$120.00</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-gray-400 uppercase tracking-widest font-bold">
              <ShieldCheck size={18} className="text-green-500" />
              Encrypted & Secure
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;