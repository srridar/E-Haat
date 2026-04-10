import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, XCircle, Loader2, Printer, Home, ArrowRight } from "lucide-react";
import { PAYMENT_API_END_POINT } from "@/utils/constants";

const PaymentComplete = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId"); 
  const statusFromUrl = queryParams.get("status"); 
  const pidx = queryParams.get("pidx"); 

  const [lookupResult, setLookupResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!pidx) {
      setError("No payment reference found.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.post(`${PAYMENT_API_END_POINT}/lookup-payment`, {
          pidx,
          status: statusFromUrl,
          orderId,
        });
        setLookupResult(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "We couldn't verify your payment. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [pidx, statusFromUrl]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Verifying Transaction</h2>
        <p className="text-gray-500">Please do not refresh the page...</p>
      </div>
    );
  }

  const isSuccess = lookupResult?.status === "Completed" || lookupResult?.status === "Success";

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">


        <div className={`p-8 text-center ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
          {isSuccess ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}

          <h1 className={`text-2xl font-bold ${isSuccess ? "text-green-800" : "text-red-800"}`}>
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isSuccess
              ? "Your transaction has been processed successfully."
              : error || "Something went wrong during the checkout process."}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Status</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {lookupResult?.status || "Unknown"}
              </span>
            </div>

            <div className="flex justify-between pb-4 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Transaction ID</span>
              <span className="text-sm font-mono text-gray-800">{pidx?.substring(0, 12)}...</span>
            </div>

            {lookupResult && (
              <>
                <div className="flex justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Amount Paid</span>
                  <span className="text-sm font-bold text-gray-900">
                    Rs. {lookupResult.total_amount}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>

            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>


        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Having issues? <a href="mailto:support@example.com" className="text-blue-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentComplete;