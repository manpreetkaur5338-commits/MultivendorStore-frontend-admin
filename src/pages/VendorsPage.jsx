import React, { useState, useEffect } from "react";
import {
  Store,
  Search,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { api } from "../services/api";
import {
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  ConfirmModal,
} from "../components/common/UIComponents";

export const VendorsPage = ({ onlyPending = false }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [approvalFilter, setApprovalFilter] = useState(onlyPending ? "false" : "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Actions
  const [vendorToApprove, setVendorToApprove] = useState(null);
  const [vendorToSuspend, setVendorToSuspend] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        role: "vendor",
        page: currentPage,
        limit: 15,
        ...(approvalFilter !== "all" && { isApproved: approvalFilter }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      };

      const res = await api.getUsers(params);
      if (res.success) {
        setVendors(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError(err.message || "Failed to load vendor records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [currentPage, approvalFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVendors();
  };

  const handleApprove = async () => {
    if (!vendorToApprove) return;
    try {
      const res = await api.approveVendor(vendorToApprove._id);
      if (res.success) {
        setActionSuccess(`Vendor ${vendorToApprove.name} has been approved successfully`);
        setTimeout(() => setActionSuccess(null), 3000);
        setVendorToApprove(null);
        fetchVendors();
      }
    } catch (err) {
      alert("Failed to approve vendor: " + err.message);
    }
  };

  const handleSuspend = async () => {
    if (!vendorToSuspend) return;
    try {
      const res = await api.updateUserStatus(vendorToSuspend._id, { isApproved: false });
      if (res.success) {
        setActionSuccess(`Vendor ${vendorToSuspend.name} has been suspended from seller privileges`);
        setTimeout(() => setActionSuccess(null), 3000);
        setVendorToSuspend(null);
        fetchVendors();
      }
    } catch (err) {
      alert("Failed to update vendor: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            {onlyPending ? "Vendor Applications & Approvals" : "Verified Vendors Directory"}
          </h2>
          <p className="text-xs text-[#68736C] mt-0.5">
            {onlyPending
              ? "Review prospective merchant credentials and grant catalog publishing privileges."
              : `Govern authorized seller accounts, catalogs, and merchant statuses (${totalCount} sellers).`}
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#26734D] rounded-xl text-xs font-semibold flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-[#68736C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          />
        </form>

        {!onlyPending && (
          <div className="flex items-center gap-2">
            <select
              value={approvalFilter}
              onChange={(e) => {
                setApprovalFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
            >
              <option value="all">All Vendor Statuses</option>
              <option value="true">Approved</option>
              <option value="false">Pending Approval</option>
            </select>
          </div>
        )}
      </div>

      {/* Vendors Table */}
      {loading ? (
        <LoadingSkeleton count={5} height="h-16" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchVendors} />
      ) : vendors.length === 0 ? (
        <EmptyState
          icon={Store}
          title={onlyPending ? "No Pending Vendor Applications" : "No Vendors Found"}
          message="All vendor accounts have been verified or no registrations match criteria."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202824]">
              <thead className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[#68736C] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Merchant / Store</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Catalog Listed</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-[#F8F5EC]/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center font-bold text-xs">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#202824]">{v.name}</p>
                          <p className="text-[10px] text-[#68736C]">{v.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">
                      {v.phone || "No phone registered"}
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">
                      {v.city ? `${v.city}, ${v.country || "India"}` : "Unspecified"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#202824]">
                      {v.productCount ?? 0} products
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={v.isApproved ? "Approved" : "Pending"} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {v.isApproved ? (
                        <button
                          onClick={() => setVendorToSuspend(v)}
                          className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-semibold transition"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => setVendorToApprove(v)}
                          className="px-3 py-1.5 bg-[#174C3C] text-white hover:bg-[#0f3429] rounded-md text-xs font-semibold transition shadow-xs"
                        >
                          Approve Vendor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[#E6E0D2] bg-[#F8F5EC]/50 flex items-center justify-between text-xs text-[#68736C]">
            <span>
              Showing Page {currentPage} of {totalPages} ({totalCount} vendors)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-[#E6E0D2] rounded bg-white font-medium hover:bg-[#E8EFE8] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border border-[#E6E0D2] rounded bg-white font-medium hover:bg-[#E8EFE8] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={!!vendorToApprove}
        title="Approve Vendor Application"
        message={`Are you sure you want to approve "${vendorToApprove?.name}" (${vendorToApprove?.email})? This allows them to immediately publish live products and receive orders.`}
        confirmText="Approve Merchant"
        isDestructive={false}
        onCancel={() => setVendorToApprove(null)}
        onConfirm={handleApprove}
      />

      {/* Suspend Confirmation Modal */}
      <ConfirmModal
        isOpen={!!vendorToSuspend}
        title="Suspend Vendor Privileges"
        message={`Are you sure you want to suspend "${vendorToSuspend?.name}"? Their seller portal and product listings will be paused pending review.`}
        confirmText="Suspend Vendor"
        isDestructive={true}
        onCancel={() => setVendorToSuspend(null)}
        onConfirm={handleSuspend}
      />
    </div>
  );
};

