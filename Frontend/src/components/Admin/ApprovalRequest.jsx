import { useNavigate } from "react-router-dom";
import { Package, Store, Truck, X } from "lucide-react";

const ApprovalRequest = ({ open, setOpen }) => {
  const navigate = useNavigate();

  if (!open) return null;

  const options = [
    {
      label: "Product Approval",
      path: "/admin/product-approval-request",
      icon: <Package className="text-blue-600" size={22} />,
      bgColor: "bg-blue-50",
      description: "Review and verify new product listings"
    },
    {
      label: "Seller Approval",
      path: "/admin/seller-approval-request",
      icon: <Store className="text-indigo-600" size={22} />,
      bgColor: "bg-indigo-50",
      description: "Verify merchant credentials and stores"
    },
    {
      label: "Transporter Approval",
      path: "/admin/transporter-approval-request",
      icon: <Truck className="text-emerald-600" size={22} />,
      bgColor: "bg-emerald-50",
      description: "Approve logistics and delivery partners"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Approval Type</h2>
          <button 
            onClick={() => setOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(option.path);
                setOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 group text-left"
            >
              <div className={`p-3 rounded-lg ${option.bgColor} group-hover:scale-110 transition-transform`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 leading-none mb-1">{option.label}</p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 text-center">
          <button
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalRequest;