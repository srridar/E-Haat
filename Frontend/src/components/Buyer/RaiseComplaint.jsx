import React, { useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Package,
  FileText,
  Loader2,
  Upload,
  Send,
  X,
  CheckCircle2,
  ImagePlus
} from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";

const RaiseComplaint = ({ sellerOrderId }) => {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
  });

  const [complaintId, setComplaintId] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const issueTypes = [
    "damaged_product",
    "missing_items",
    "wrong_product",
    "late_delivery",
    "fake_product",
    "bad_quality",
    "package_opened",
    "other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        sellerOrderId,
        issueType: formData.issueType,
        description: formData.description,
      };

      const res = await axios.post(`${BUYER_API_END_POINT}/complaint/raise`, payload, { withCredentials: true });

      if (res.data.success) {
        setComplaintId(res.data.complaint._id);
        alert("Case file initialized. Please proceed to attach your proof images.");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to initialize complaint ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProofs = async () => {
    if (!files.length) return alert("Please add at least one proof image first");

    try {
      setImgLoading(true);
      const data = new FormData();
      files.forEach((file) => {
        data.append("proofImages", file);
      });

      const res = await axios.post(
        `${BUYER_API_END_POINT}/complaint/upload/${complaintId}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setSuccess(true);
        setFiles([]);
        setPreviews([]);
        setFormData({ issueType: "", description: "" });
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Media target validation upload error");
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">

        {/* Header Branding */}
        <div className="relative bg-slate-900 p-10 text-white overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-rose-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="bg-rose-500 p-4 rounded-2xl shadow-lg shadow-rose-500/30">
              <AlertTriangle size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Raise Complaint</h1>
              <p className="text-slate-400 font-medium mt-1">
                Order Reference: <span className="text-rose-400 font-mono">#{sellerOrderId?.slice(-8).toUpperCase() || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Success Splash Card */}
        {success ? (
          <div className="p-12 text-center space-y-4">
            <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Complaint Logged Successfully</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Your claim reference is safely saved. Our compliance moderation team is checking the order details.
            </p>
            <button onClick={() => setSuccess(false)} className="btn btn-outline border-slate-200 mt-4 capitalize">Raise Another Issue</button>
          </div>
        ) : (
          <div className="p-10">
            {/* Step 1 Form Layout */}
            <form onSubmit={handleSubmitDetails} className={`space-y-6 ${complaintId ? "opacity-40 pointer-events-none transition-opacity" : ""}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category Issue</label>
                  <div className="relative group">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                    <select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-semibold text-slate-700"
                    >
                      <option value="">Select Category</option>
                      {issueTypes.map((item, index) => (
                        <option key={index} value={item}>
                          {item.replaceAll("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
                  <p className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">
                    Step 1: Write case summary & submit to initiate tracking.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Statement Details</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Provide explicit context for your dispute files..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium text-slate-700 resize-none"
                  />
                </div>
              </div>

              {!complaintId && (
                <button type="submit" disabled={loading} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-rose-600 transition-all flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={16} />}
                  INITIALIZE ACCOUNT CLAIM
                </button>
              )}
            </form>

            {/* Step 2 Dynamic Media Section */}
            {complaintId && (
              <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-100 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-rose-600">
                  <ImagePlus size={20} />
                  <h3 className="font-black text-sm uppercase tracking-wider">Step 2: Attach Evidence Attachments</h3>
                </div>

                <label className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                  <Upload size={24} className="text-slate-400 group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-slate-700 text-sm font-bold">Select Proof Images</span>
                  <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                </label>

                {previews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 pt-2">
                    {previews.map((src, index) => (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border">
                        <img src={src} className="w-full h-full object-cover" alt="preview" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white p-1 rounded-full text-rose-600 shadow-sm">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleUploadProofs}
                  disabled={imgLoading}
                  className="w-full h-14 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 transition-all flex justify-center items-center gap-2"
                >
                  {imgLoading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={16} />}
                  UPLOAD FILES & COMPLETE CASE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RaiseComplaint;