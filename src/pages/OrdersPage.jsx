import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  CreditCard,
  MapPin,
} from "lucide-react";
import { api } from "../services/api";
import {
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from "../components/common/UIComponents";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 15,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      };

      const res = await api.getOrders(params);
      if (res.success) {
        setOrders(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, paymentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            Marketplace Orders Governance
          </h2>
          <p className="text-xs text-[#68736C] mt-0.5">
            Real-time multi-vendor customer checkouts, shipping fulfillment, and escrow verification ({totalCount} total)
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
            placeholder="Search by order ID (MN-...), customer, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          >
            <option value="all">All Order Statuses</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSkeleton count={6} height="h-16" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No Orders Found"
          message="There are no marketplace orders matching your selected criteria."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202824]">
              <thead className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[#68736C] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#F8F5EC]/50 transition">
                    <td className="py-3 px-4 font-bold text-[#174C3C]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-[#202824]">
                          {ord.shippingAddress?.name || ord.user?.name || "Customer"}
                        </p>
                        <p className="text-[10px] text-[#68736C]">
                          {ord.shippingAddress?.city || "Direct City"}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">
                      {ord.items?.length || 0} product(s)
                    </td>
                    <td className="py-3 px-4 font-bold text-[#202824]">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-semibold text-[#68736C]">
                          {ord.paymentMethod}
                        </span>
                        <StatusBadge status={ord.paymentStatus} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-md font-semibold text-[#174C3C] hover:bg-[#E8EFE8] transition text-xs inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[#E6E0D2] bg-[#F8F5EC]/50 flex items-center justify-between text-xs text-[#68736C]">
            <span>
              Showing Page {currentPage} of {totalPages} ({totalCount} total orders)
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

      {/* Order Detail & Governance Drawer/Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[#E6E0D2] animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#F0ECE1]">
              <div>
                <span className="text-[11px] font-semibold text-[#A66B12] uppercase tracking-wider">
                  Order Details
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#174C3C]">
                  {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#68736C] mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#68736C] hover:text-[#202824] p-1"
              >
                ✕
              </button>
            </div>

            {/* Order Items */}
            <div className="my-4">
              <h4 className="text-xs font-bold text-[#202824] uppercase mb-2">
                Order Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="space-y-2 border border-[#E6E0D2] rounded-xl p-3 bg-[#F8F5EC]/40">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-[#F0ECE1] last:border-0 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg border border-[#E6E0D2]"
                      />
                      <div>
                        <p className="font-semibold text-[#202824]">{item.title}</p>
                        <p className="text-[10px] text-[#68736C]">
                          Qty: {item.quantity} × {formatPrice(item.price)} | Seller: {item.seller?.name || "Direct Vendor"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#174C3C]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <StatusBadge status={item.status || "placed"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
              <div className="bg-[#F8F5EC] p-3.5 rounded-xl border border-[#E6E0D2]">
                <h5 className="font-bold text-[#202824] uppercase mb-2 flex items-center">
                  <CreditCard className="w-3.5 h-3.5 mr-1 text-[#A66B12]" />
                  Financial Summary
                </h5>
                <div className="space-y-1 text-[#68736C]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-[#202824]">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discounts:</span>
                    <span className="text-[#C0392B]">- {formatPrice(selectedOrder.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span className="text-[#202824]">{formatPrice(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E6E0D2] font-bold text-sm text-[#174C3C]">
                    <span>Total Amount:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8F5EC] p-3.5 rounded-xl border border-[#E6E0D2]">
                <h5 className="font-bold text-[#202824] uppercase mb-2 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#174C3C]" />
                  Shipping Destination
                </h5>
                <p className="font-semibold text-[#202824]">{selectedOrder.shippingAddress?.name}</p>
                <p className="text-[#68736C]">{selectedOrder.shippingAddress?.line1}</p>
                <p className="text-[#68736C]">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
                <p className="text-[#68736C] mt-1 font-medium">
                  Phone: {selectedOrder.shippingAddress?.phone}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#F0ECE1]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#174C3C] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3429]"
              >
                Close Order Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

