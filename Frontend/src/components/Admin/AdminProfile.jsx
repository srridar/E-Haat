import React, { useEffect, useState } from "react";
import useGetProfile from "@/hooks/adminHooks/useGetProfile";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const getProfile = useGetProfile();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        if (!data) {
          setError("Unable to load profile");
          return;
        }

        setAdmin(data);
      } catch (err) {
        setError("Something went wrong : " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="relative">
      <div className="flex absolute top-3 left-52">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="max-w-4xl mx-auto  bg-white mt-12 shadow rounded-xl p-6">


        <div className="flex items-center gap-6 border-b pb-4">
          <img
            src={
              admin.profileImage ||
              `https://ui-avatars.com/api/?name=${admin.name}`
            }
            alt="Admin"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {admin.name}
            </h2>
            <p className="text-gray-500">{admin.email}</p>

            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
              {admin.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          <ProfileItem label="Phone" value={admin.phone} />
          <ProfileItem label="Email Verified" value={admin.emailVerified ? "Yes" : "No"} />
          <ProfileItem label="Account Status" value={admin.isActive ? "Active" : "Inactive"} />
          <ProfileItem
            label="Last Login"
            value={admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "N/A"}
          />
          <ProfileItem
            label="Created At"
            value={new Date(admin.createdAt).toLocaleDateString()}
          />

          <div>
            <p className="text-gray-500 text-sm mb-1">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {admin.permissions?.length ? (
                admin.permissions.map((perm, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">
                  No permissions assigned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

/* Reusable Field */
const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm mb-1">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default AdminProfile;
