import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, Info, UserCheck } from "lucide-react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import LocationPicker from "@/components/LocationPicker";

const GetUser = () => {
    const { role, id } = useParams();
    console.log(role + "  " + id);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.post(`${ADMIN_API_END_POINT}/get-user-profile`,{ id, role },
                    { withCredentials: true }
                );
                if (res.data.success) {
                    setUser(res.data.user);
                    console.log(res.data.user);
                }
            } catch (error) {
                console.error("Error fetching user details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id, role]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-indigo-600 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mr-3"></div>
            Loading User Details...
        </div>
    );

    if (!user) return <div className="p-10 text-center">User not found.</div>;

    return (
        <div className="max-w-6xl mx-auto pb-10 pt-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 font-medium">
                <ArrowLeft size={18} /> Back to Users
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-indigo-100  rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="relative">
                            <img
                                src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                                className="h-32 w-32 rounded-2xl object-cover border-4 border-gray-50 shadow-inner"
                                alt="Profile"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg border-4 border-white">
                                <UserCheck size={16} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-5">{user.name}</h2>
                        <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">{role}</p>

                        <div className="flex gap-2 mt-4">
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                {user.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                        </div>

                        <div className="w-full mt-8 space-y-3">
                            {
                                (!user.isVerified) ? <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm hover:bg-indigo-700 transition-all">
                                    Approve Account
                                </button> : ""
                            }

                            <button onClick={()=>navigate(`/message/send/${role}/${id}`)} className="w-full py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                                Send Message
                            </button>
                            <button className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all">
                                Block Access
                            </button>
                        </div>
                    </div>
                </div>


                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                            <Info className="text-indigo-500" size={20} />
                            <h3 className="text-lg font-bold text-gray-800">Complete Profile</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailItem icon={<Mail />} label="Email Address" value={user?.email} />
                            <DetailItem icon={<Phone />} label="Phone Number" value={user?.phone || "N/A"} />
                            <DetailItem icon={<MapPin />} label="Location" value={`${user.location.city}`} />
                            <DetailItem icon={<Calendar />} label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
                            <DetailItem icon={<Shield />} label="Account ID" value={`#${user._id.slice(-6).toUpperCase()}`} />
                            <DetailItem icon={<UserCheck />} label="Verification" value={user.isVerified ? "Verified" : "Pending"} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Location Map</h3>

                        <div className="lg:col-span-8 bg-white p-3 rounded-[3rem] shadow-sm border transition-all h-[450px] relative overflow-hidden">
                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">

                                {user?.location?.coordinates?.length === 2 && (
                                    <LocationPicker
                                        key={`${user.location.coordinates[0]}-${user.location.coordinates[1]}`}
                                        currentCoords={[
                                            user.location.coordinates[1],
                                            user.location.coordinates[0], 
                                        ]}
                                    />
                                )}

                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Internal Admin Notes</h3>
                        <textarea
                            placeholder="Add private notes about this user for other admins..."
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                            rows={3}
                        ></textarea>
                        <div className="mt-3 flex justify-end">
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Save Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="p-2.5 bg-slate-50 rounded-lg text-indigo-500">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

export default GetUser;