import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Camera, Save, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { SELLER_API_END_POINT } from '@/utils/constants';
import { Label } from '@/components/ui/label';

const SellerProfileUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", file: null });
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Memoized preview URL to prevent memory leaks
  const previewUrl = useMemo(() => formData.file ? URL.createObjectURL(formData.file) : null, [formData.file]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${SELLER_API_END_POINT}/profile`, { withCredentials: true });
        if (data.success) {
          const profile = { name: data.data.name || "", email: data.data.email || "", phone: data.data.phone || "", file: null };
          setFormData(profile);
          setInitialData(profile);
        }
      } catch (err) { console.error("Fetch error", err); }
    })();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (formData.name?.length < 3) errs.name = "Name too short";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email";
    if (!/^(?:\+977|977)?9[678]\d{8}$/.test(formData.phone)) errs.phone = "Invalid Nepali number";

    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'file' && val) data.append("profileImage", val);
        else if (val) data.append(key, val);
      });

      const res = await axios.put(`${SELLER_API_END_POINT}/update-profile`, data, { withCredentials: true });
      if (res.data.success) navigate('/seller/profile');
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4 group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <h2 className="text-3xl font-bold">Account Settings</h2>
          <p className="text-teal-100">Update your seller profile details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Full Name" icon={<User size={16}/>} name="name" value={formData.name} error={errors.name} onChange={handleChange} />
            <InputGroup label="Email Address" icon={<Mail size={16}/>} name="email" value={formData.email} error={errors.email} onChange={handleChange} />
            <InputGroup label="Phone" icon={<Phone size={16}/>} name="phone" value={formData.phone} error={errors.phone} onChange={handleChange} />
          </div>

          <div className="pt-4">
            <Label className="text-slate-700 font-semibold mb-3 block">Profile Image</Label>
            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center border shadow-sm overflow-hidden">
                {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" /> : <Camera className="text-slate-400" />}
              </div>
              <div className="flex-1">
                <input type="file" id="file-upload" className="hidden" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} accept="image/*" />
                <label htmlFor="file-upload" className="cursor-pointer inline-flex px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                  {formData.file ? "Change Photo" : "Upload Photo"}
                </label>
                {formData.file && <p className="text-xs text-emerald-600 mt-2 font-medium">✓ Selected: {formData.file.name}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setFormData(initialData)} className="flex items-center px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all">
              <XCircle className="w-4 h-4 mr-2" /> Discard
            </button>
            <button type="submit" disabled={loading} className="flex items-center px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, error, ...props }) => (
  <div className="space-y-1.5">
    <Label className="text-slate-700 font-medium ml-1">{label}</Label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input {...props} className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl outline-none focus:ring-4 transition-all ${error ? 'border-red-400 focus:ring-red-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-50'}`} />
    </div>
    {error && <p className="text-red-500 text-[11px] mt-1 ml-1">{error}</p>}
  </div>
);

export default SellerProfileUpdate;