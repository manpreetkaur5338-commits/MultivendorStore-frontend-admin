import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Shield, CheckCircle, Save, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const { admin, updateAdminProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    phone: admin?.phone || "",
    address: admin?.address || "",
    city: admin?.city || "",
    state: admin?.state || "",
    zip: admin?.zip || "",
    country: admin?.country || "India",
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const res = await updateAdminProfile(formData);
    if (res.success) {
      setStatusMessage({ type: "success", text: "Administrator profile updated successfully" });
    } else {
      setStatusMessage({ type: "error", text: res.message || "Failed to update profile" });
    }
    setSubmitting(false);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
          Administrator Profile
        </h2>
        <p className="text-xs text-[#68736C] mt-0.5">
          Manage your governance credentials and platform contact details.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-[#26734D]"
              : "bg-red-50 border-red-200 text-[#C0392B]"
          }`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6E0D2] shadow-xs">
        {/* Profile Card Header */}
        <div className="flex items-center space-x-4 pb-6 mb-6 border-b border-[#F0ECE1]">
          <div className="w-16 h-16 rounded-2xl bg-[#174C3C] text-[#D5B779] flex items-center justify-center font-bold text-xl border border-[#D5B779]">
            {admin?.name ? admin.name[0].toUpperCase() : "A"}
          </div>
          <div>
            <h3 className="font-serif-heading text-xl font-bold text-[#202824]">
              {admin?.name}
            </h3>
            <p className="text-xs text-[#68736C]">{admin?.email}</p>
            <div className="flex items-center space-x-2 mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#174C3C] text-white uppercase tracking-wider">
                <Shield className="w-2.5 h-2.5 mr-1 text-[#D5B779]" />
                {admin?.role}
              </span>
              <span className="text-[11px] text-[#26734D] font-medium">
                Verified Super Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">
                Admin Email (System Fixed)
              </label>
              <input
                type="email"
                disabled
                value={admin?.email || ""}
                className="w-full px-3 py-2 bg-[#E6E0D2]/40 border border-[#E6E0D2] rounded-lg text-[#68736C] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">
                Office / Headquarters
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">State / Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">PIN / Postal Code</label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202824] uppercase mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
              />
            </div>
          </div>

          <div className="pt-5 border-t border-[#F0ECE1] flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-[#174C3C] text-white rounded-lg font-semibold hover:bg-[#0f3429] transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#D5B779]" />
              <span>{submitting ? "Saving Changes..." : "Save Profile Updates"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

