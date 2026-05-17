import React, { useState, useEffect } from 'react';
import { User, Phone, Image as ImageIcon, ShieldCheck, Loader2, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useGetProfile from '@/hooks/adminHooks/useGetProfile';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constants';

const AdminProfileUpdate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");
    const [errors, setErrors] = useState({});
    const [input, setInput] = useState({
        name: "",
        phone: "",
        file: null
    });

    const { admin, loading: profileLoading } = useGetProfile();

    const validate = () => {
        const newErrors = {};
        const phoneregx = /^(98|97)\d{8}$/;

        if (!input.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (input.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        } else if (/[^a-zA-Z\s]/.test(input.name.trim())) {
            newErrors.name = "Name can only contain letters";
        }

        if (!input.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneregx.test(input.phone)) {
            newErrors.phone = "Must start with 98/97 and be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (admin) {
            setInput({
                name: admin.name || "",
                phone: admin.phone || "",
                file: null
            });

            if (admin.profileImage?.url) {
                setPreview(admin.profileImage.url);
            }
        }
    }, [admin]);


    const changeEventHandler = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const selectedFile = files[0];
            setInput({ ...input, file: selectedFile });
            setPreview(URL.createObjectURL(selectedFile));

            toast.success("Image selected!");
        } else {
            setInput({ ...input, [name]: value });
        }
    };


    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("phone", input.phone);

        if (input.file) {
            formData.append("profileImage", input.file);
        }

        const promise = axios.put(
            `${ADMIN_API_END_POINT}/update-profile`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            }
        );

        toast.promise(promise, {
            loading: "Updating profile...",
            success: (res) => {
                if (res.data.success) {
                    navigate("/admin/admin-profile");
                    return "Profile updated successfully!";
                }
                throw new Error("Update failed");
            },
            error: (err) =>
                err?.response?.data?.message || "Update failed"
        });

        try {
            await promise;
        } catch (error) {
            console.error(error);
        }
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <div className="h-64 bg-indigo-600 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-600 opacity-90" />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 text-white">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="uppercase tracking-widest text-xs font-bold text-indigo-100">Administrative Access</span>
                    </div>
                    <h1 className="text-4xl font-black">Account Settings</h1>
                    <p className="text-indigo-100 mt-2 opacity-80">Manage your administrative identity and contact details.</p>
                </div>
            </div>


            <div className="max-w-5xl w-full mx-auto px-6 -mt-16 pb-20 relative z-20">
                <div className="bg-gray-900     rounded-[2rem]  border border-indigo-400 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12">

                        <div className="lg:col-span-4  p-8 flex flex-col items-center text-center border-r border-indigo-400">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden border-4 border-white shadow-lg">
                                    {preview ? (
                                        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} />
                                    )}
                                </div>
                                <label htmlFor="profileImage" className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                                    <Camera size={18} />
                                </label>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-bold text-slate-100 text-lg">{input.name || "Admin Name"}</h3>
                                <p className="text-slate-500 text-sm font-medium">System Administrator</p>
                            </div>

                            <div className="mt-8 w-full">
                                <div className="p-4 bg-gray-900 rounded-2xl border border-indigo-400 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Status: Verified Official</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="lg:col-span-8 p-8 md:p-12 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-200">
                            <form onSubmit={submitHandler} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Full Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Full Identity Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={input.name}
                                                onChange={changeEventHandler}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600"
                                                placeholder="Enter Full Name"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.name}</p>}
                                    </div>

                                    {/* Contact Number Field */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Contact Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={input.phone}
                                                onChange={changeEventHandler}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600"
                                                placeholder="98XXXXXXXX"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.phone}</p>}
                                    </div>

                                    {/* Profile Avatar Field */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Profile Avatar
                                        </label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                            <input
                                                type="file"
                                                id="profileImage"
                                                name="profileImage"
                                                accept="image/*"
                                                onChange={changeEventHandler}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="profileImage"
                                                className="cursor-pointer flex items-center w-full pl-12 pr-4 py-3 bg-slate-950 border border-dashed border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-indigo-500 hover:text-indigo-400 transition-all text-sm font-medium text-slate-400"
                                            >
                                                {input.file ? (
                                                    <span className="text-indigo-400 font-bold truncate">{input.file.name}</span>
                                                ) : (
                                                    "Click to upload identity image"
                                                )}
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1 ml-1 font-medium italic">
                                            * Support for JPG, PNG or WEBP (Max 2MB)
                                        </p>
                                    </div>
                                </div>

                                {/* Form Footer */}
                                <div className="pt-6 border-t border-slate-800 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-950/20 font-black flex items-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Syncing Data...</span>
                                            </>
                                        ) : (
                                            "Save Official Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileUpdate;