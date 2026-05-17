import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, 
  Shield, Info, UserCheck, MessageSquare, 
  Ban, Unlock, Fingerprint, Globe 
} from "lucide-react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import LocationPicker from "@/components/LocationPicker";

const GetUser = () => {
    const { role, id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const blockAndUnblock = async ({ id, role, action }) => {
        try {
            const res = await axios.put(`${ADMIN_API_END_POINT}/block-unblock`, { id, role, action }, { withCredentials: true });
            return res.data.success 
                ? { success: true, message: res.data.message }
                : { success: false, message: res.data.message || "Something went wrong" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Server error. Try again later.",
            };
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.post(`${ADMIN_API_END_POINT}/get-user-profile`, { id, role }, { withCredentials: true });
                if (res.data.success) setUser(res.data.user);
            } catch (error) {
                console.error("Error fetching user details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id, role]);

    if (loading) return (
        <div className="min-h-screen bg-[#121212] flex flex-col justify-center items-center">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-400 font-mono text-sm tracking-widest animate-pulse uppercase">Decrypting Profile...</p>
        </div>
    );

    if (!user) return <div className="min-h-screen bg-[#121212] text-white p-10 text-center">User record not found.</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-gray-100 pb-20">
            <div className="max-w-7xl mx-auto p-4 md:p-8 pt-6">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e1e1e] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all mb-8 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span className="text-sm font-bold">Back to Records</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#1e1e1e] rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl relative">
                            {/* Decorative Header */}
                            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 flex items-end px-8 pb-4">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Identity Profile</span>
                            </div>

                            <div className="px-8 pb-8 -mt-12 flex flex-col items-center text-center">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                                    <img
                                        src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                                        className="relative h-32 w-32 rounded-3xl object-cover border-4 border-[#1e1e1e] shadow-2xl"
                                        alt="Profile"
                                    />
                                    {user.isVerified && (
                                        <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-xl border-4 border-[#1e1e1e]">
                                            <UserCheck size={16} />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-white mt-6 tracking-tight">{user.name}</h2>
                                <p className="text-indigo-400 font-mono text-xs uppercase tracking-[0.2em] mt-1">{role}</p>

                                <div className="mt-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-widest ${user.isBlocked ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                                        {user.isBlocked ? "ACCOUNT BLOCKED" : "SYSTEM ACTIVE"}
                                    </span>
                                </div>

                                <div className="w-full mt-10 space-y-3">
                                    <button onClick={() => navigate(`/message/send/${role}/${id}`)} className="w-full flex items-center justify-center gap-2 py-3 bg-[#121212] border border-gray-800 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                                        <MessageSquare size={18} /> Direct Message
                                    </button>

                                    <button
                                        onClick={async () => {
                                            const action = user.isBlocked ? "unblock" : "block";
                                            const res = await blockAndUnblock({ id: user._id, role: role, action });
                                            if (res.success) setUser((prev) => ({ ...prev, isBlocked: !prev.isBlocked }));
                                            else alert(res.message);
                                        }}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${user.isBlocked ? "bg-emerald-600/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/20" : "bg-red-600/10 text-red-400 border-red-500/30 hover:bg-red-600/20"}`}
                                    >
                                        {user.isBlocked ? <><Unlock size={18} /> Unblock User</> : <><Ban size={18} /> Restrict Access</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Node Coordinates Card */}
                        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 rounded-3xl p-6 border border-indigo-500/20">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-black mb-4 flex items-center gap-2">
                                <Globe size={14} /> Registered Node
                            </h4>
                            <div className="font-mono space-y-1">
                                <p className="text-lg text-white">Lat: {user?.location?.coordinates?.[1]?.toFixed(4)}</p>
                                <p className="text-lg text-white">Lng: {user?.location?.coordinates?.[0]?.toFixed(4)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Intelligence */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Profile Info Grid */}
                        <div className="bg-[#1e1e1e] rounded-[2rem] border border-gray-800 p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Info className="text-indigo-400" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Core Credentials</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                <DetailItem icon={<Mail />} label="Secure Email" value={user?.email} />
                                <DetailItem icon={<Phone />} label="Communication Node" value={user?.phone || "N/A"} />
                                <DetailItem icon={<MapPin />} label="Operational Base" value={`${user?.location?.city || user?.location?.address}`} />
                                <DetailItem icon={<Calendar />} label="Onboarding Date" value={new Date(user.createdAt).toLocaleDateString()} />
                                <DetailItem icon={<Shield />} label="Protocol ID" value={user._id.toUpperCase()} isID />
                                <DetailItem icon={<Fingerprint />} label="Verification Status" value={user.isVerified ? "AUTHENTICATED" : "PENDING"} />
                            </div>
                        </div>

                        {/* Integrated Map */}
                        <div className="bg-[#1e1e1e] rounded-[2rem] border border-gray-800 p-3 shadow-xl overflow-hidden h-[450px] relative">
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                                    <MapPin size={14} className="text-red-400" /> Geolocation Tracking
                                </span>
                            </div>
                            <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-[#121212]">
                                {user?.location?.coordinates?.length === 2 && (
                                    <LocationPicker
                                        key={`${user.location.coordinates[0]}-${user.location.coordinates[1]}`}
                                        currentCoords={[user.location.coordinates[1], user.location.coordinates[0]]}
                                        isEditable={false}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Admin Internal Notes */}
                        <div className="bg-[#1e1e1e] rounded-[2rem] border border-gray-800 p-8 shadow-xl group">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-indigo-400" /> Internal Security Log
                            </h3>
                            <textarea
                                placeholder="Add encrypted private notes regarding user behavior..."
                                className="w-full bg-[#121212] border border-gray-800 rounded-2xl p-5 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                rows={4}
                            ></textarea>
                            <div className="mt-4 flex justify-end">
                                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all">
                                    Commit Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value, isID }) => (
    <div className="flex items-start gap-4 group">
        <div className="p-3 bg-[#121212] rounded-xl text-indigo-400 border border-gray-800 group-hover:border-indigo-500/30 transition-colors">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-semibold text-gray-200 truncate ${isID ? 'font-mono text-indigo-300' : ''}`}>
                {value}
            </p>
        </div>
    </div>
);

export default GetUser;