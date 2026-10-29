import React from "react";
import { Loader2, AlertCircle, RefreshCw, FolderSearch } from "lucide-react";

/**
 * Metric Card with brand Emerald/Gold accents
 */
export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "emerald" }) => {
  const isGold = color === "gold";
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E6E0D2] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#68736C]">{title}</p>
          <h3 className="text-2xl font-bold text-[#202824] mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-[#68736C] mt-1">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isGold ? "bg-[#D5B779]/15 text-[#A66B12]" : "bg-[#174C3C]/10 text-[#174C3C]"
          }`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-[#F0ECE1] flex items-center text-xs text-[#68736C]">
          {trend}
        </div>
      )}
    </div>
  );
};

/**
 * Status Badge for Orders, Vendors, Products, Payments
 */
export const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case "active":
      case "approved":
      case "delivered":
      case "completed":
        return "bg-emerald-50 text-[#26734D] border-emerald-200";
      case "placed":
      case "pending":
      case "draft":
        return "bg-amber-50 text-[#A66B12] border-amber-200";
      case "processing":
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
      case "rejected":
      case "suspended":
      case "failed":
        return "bg-red-50 text-[#C0392B] border-red-200";
      case "refunded":
      case "archived":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};

/**
 * Chart Container Card
 */
export const ChartCard = ({ title, subtitle, children, action }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E6E0D2] shadow-sm flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F0ECE1] gap-2">
        <div>
          <h4 className="font-serif-heading text-lg font-bold text-[#202824]">{title}</h4>
          {subtitle && <p className="text-xs text-[#68736C] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px] relative">{children}</div>
    </div>
  );
};

/**
 * Skeleton Loader
 */
export const LoadingSkeleton = ({ count = 3, height = "h-12" }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full bg-[#E8EFE8]/60 animate-pulse rounded-lg ${height}`}
        />
      ))}
    </div>
  );
};

/**
 * Empty State Container
 */
export const EmptyState = ({
  icon: Icon = FolderSearch,
  title = "No records found",
  message = "There are no matching entries in the database for the selected criteria.",
  action,
}) => {
  return (
    <div className="bg-white rounded-xl p-8 border border-[#E6E0D2] text-center my-4 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-[#174C3C]/10 text-[#174C3C] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[#202824]">{title}</h4>
      <p className="text-xs text-[#68736C] max-w-sm mt-1 mb-4">{message}</p>
      {action}
    </div>
  );
};

/**
 * Error Alert Box
 */
export const ErrorState = ({ message = "Failed to load data", onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4 flex items-center justify-between text-[#C0392B]">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#C0392B] text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

/**
 * Confirmation Dialog Modal
 */
export const ConfirmModal = ({ isOpen, title, message, confirmText = "Confirm", onConfirm, onCancel, isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6E0D2] animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-serif-heading text-lg font-bold text-[#202824]">{title}</h3>
        <p className="text-sm text-[#68736C] mt-2 mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-[#E6E0D2] rounded-lg text-sm font-medium text-[#202824] hover:bg-[#E8EFE8] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
              isDestructive ? "bg-[#C0392B] hover:bg-red-700" : "bg-[#174C3C] hover:bg-[#0f3429]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

