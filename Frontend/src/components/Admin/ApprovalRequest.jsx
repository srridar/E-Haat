import { useNavigate } from "react-router-dom";
import { Package, Store, Truck, X, ShieldCheck, ChevronRight } from "lucide-react";

const ApprovalRequest = ({ open, setOpen }) => {
  const navigate = useNavigate();

  if (!open) return null;

  const options = [
    {
      label: "Product Approval",
      path: "/admin/product-approval-request",
      icon: <Package className="text-blue-400" size={22} />,
      borderColor: "group-hover:border-blue-500/50",
      glow: "group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
      description: "Analyze and verify pending inventory logs"
    },
    {
      label: "Seller Approval",
      path: "/admin/seller-approval-request",
      icon: <Store className="text-indigo-400" size={22} />,
      borderColor: "group-hover:border-indigo-500/50",
      glow: "group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]",
      description: "Vet merchant credentials and store access"
    },
    {
      label: "Transporter Approval",
      path: "/admin/transporter-approval-request",
      icon: <Truck className="text-emerald-400" size={22} />,
      borderColor: "group-hover:border-emerald-500/50",
      glow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      description: "Authenticate logistics and delivery nodes"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={() => setOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-[#111111] w-full max-w-md rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <ShieldCheck className="text-indigo-500" size={18} />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Security Protocol</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Select Validation Channel</p>
            </div>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(option.path);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-5 p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 transition-all duration-300 group text-left ${option.borderColor} ${option.glow}`}
            >
              <div className={`p-3.5 rounded-xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-100 uppercase text-[11px] tracking-widest mb-1">{option.label}</p>
                  <ChevronRight size={14} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-[#0d0d0d] border-t border-white/5 text-center">
          <button
            onClick={() => setOpen(false)}
            className="text-[10px] font-black text-gray-600 hover:text-indigo-400 uppercase tracking-[0.2em] transition-colors"
          >
            Terminal Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalRequest;