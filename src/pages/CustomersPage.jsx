import React, { useState, useEffect } from "react";
import { Users, Search, ShoppingBag, DollarSign, Calendar, Mail, MapPin } from "lucide-react";
import { api } from "../services/api";
import {
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from "../components/common/UIComponents";

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        role: "customer",
        page: currentPage,
        limit: 15,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      };

      const res = await api.getUsers(params);
      if (res.success) {
        setCustomers(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            Customer Accounts
          </h2>
          <p className="text-xs text-[#68736C] mt-0.5">
            Registered customer records, purchase frequency, and lifetime expenditures ({totalCount} buyers)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#68736C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          />
        </form>
      </div>

      {/* Customer List */}
      {loading ? (
        <LoadingSkeleton count={5} height="h-16" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCustomers} />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Found"
          message="No customer accounts match your search query."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202824]">
              <thead className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[#68736C] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spending</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#F8F5EC]/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center font-bold text-xs">
                          {c.name ? c.name[0].toUpperCase() : "U"}
                        </div>
                        <span className="font-semibold text-[#202824]">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">{c.email}</td>
                    <td className="py-3 px-4 text-[#68736C]">{c.phone || "Not recorded"}</td>
                    <td className="py-3 px-4 text-[#68736C]">
                      {c.city ? `${c.city}, ${c.country || "India"}` : "Unspecified"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#202824]">
                      {c.orderCount ?? 0} orders
                    </td>
                    <td className="py-3 px-4 font-bold text-[#174C3C]">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-[#E6E0D2] bg-[#F8F5EC]/50 flex items-center justify-between text-xs text-[#68736C]">
            <span>
              Showing Page {currentPage} of {totalPages} ({totalCount} total customers)
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
    </div>
  );
};

