import React, { useState, useEffect } from "react";
import { CreditCard, Search, CheckCircle, RefreshCcw, DollarSign, ShieldAlert } from "lucide-react";
import { api } from "../services/api";
import {
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from "../components/common/UIComponents";

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 15,
        ...(paymentStatusFilter !== "all" && { paymentStatus: paymentStatusFilter }),
        ...(paymentMethodFilter !== "all" && { paymentMethod: paymentMethodFilter }),
      };

      const res = await api.getPayments(params);
      if (res.success) {
        setPayments(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      }
    } catch (err) {
      console.error("Error loading payments:", err);
      setError(err.message || "Failed to load payment transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, paymentStatusFilter, paymentMethodFilter]);

  const formatPrice = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            Payments, Escrow & Settlements
          </h2>
          <p className="text-xs text-[#68736C] mt-0.5">
            Audit customer payment captures, gateway transaction references, and escrow releases.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => {
              setPaymentMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          >
            <option value="all">All Payment Methods</option>
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="Online">Online Gateway</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <button
          onClick={fetchPayments}
          className="px-3 py-2 border border-[#E6E0D2] rounded-lg text-xs font-semibold text-[#174C3C] hover:bg-[#E8EFE8] flex items-center space-x-1.5"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Payments Table */}
      {loading ? (
        <LoadingSkeleton count={5} height="h-16" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPayments} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Transactions Recorded"
          message="There are no payment records matching your filter."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202824]">
              <thead className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[#68736C] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Payer / Customer</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4">Platform Fee (10%)</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {payments.map((p) => {
                  const estFee = Math.round(p.total * 0.1);
                  return (
                    <tr key={p._id} className="hover:bg-[#F8F5EC]/50 transition">
                      <td className="py-3 px-4 font-bold text-[#174C3C]">
                        {p.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#202824]">{p.user?.name || "Customer"}</p>
                        <p className="text-[10px] text-[#68736C]">{p.user?.email || "Direct purchase"}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#202824]">
                        {p.paymentMethod}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#202824]">
                        {formatPrice(p.total)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#26734D]">
                        {formatPrice(estFee)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={p.paymentStatus} />
                      </td>
                      <td className="py-3 px-4 text-[#68736C]">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-[#E6E0D2] bg-[#F8F5EC]/50 flex items-center justify-between text-xs text-[#68736C]">
            <span>
              Showing Page {currentPage} of {totalPages} ({totalCount} total payment logs)
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

