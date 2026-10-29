import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  AlertTriangle,
  Star,
  ExternalLink,
} from "lucide-react";
import { api } from "../services/api";
import {
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  ConfirmModal,
} from "../components/common/UIComponents";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(approvalFilter !== "all" && { isApproved: approvalFilter }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      };

      const [prodRes, catRes] = await Promise.all([
        api.getProducts(params),
        api.getCategories(),
      ]);

      if (prodRes.success) {
        setProducts(prodRes.data || []);
        setTotalPages(prodRes.totalPages || 1);
        setTotalCount(prodRes.totalCount || 0);
      }
      if (catRes.success) {
        setCategories(catRes.data || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryFilter, approvalFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleModerate = async (productId, isApproved) => {
    try {
      const res = await api.moderateProduct(productId, { isApproved });
      if (res.success) {
        setActionSuccess(`Product status changed to ${isApproved ? "Approved" : "Unapproved"}`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchProducts();
        if (selectedProduct?._id === productId) {
          setSelectedProduct(res.data);
        }
      }
    } catch (err) {
      alert("Failed to moderate product: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await api.deleteProduct(productToDelete._id);
      if (res.success) {
        setActionSuccess("Product removed from catalog successfully");
        setTimeout(() => setActionSuccess(null), 3000);
        setProductToDelete(null);
        setSelectedProduct(null);
        fetchProducts();
      }
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            Product Catalog Moderation
          </h2>
          <p className="text-xs text-[#68736C] mt-0.5">
            Audit, verify, and moderate vendor product listings across all categories ({totalCount} total)
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#26734D] rounded-xl text-xs font-semibold flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-[#68736C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, brand, or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={approvalFilter}
            onChange={(e) => {
              setApprovalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs text-[#202824] focus:outline-none focus:border-[#174C3C]"
          >
            <option value="all">All Statuses</option>
            <option value="true">Approved</option>
            <option value="false">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingSkeleton count={6} height="h-16" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products matched criteria"
          message="Try resetting your filters or search terms."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E6E0D2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#202824]">
              <thead className="bg-[#F8F5EC] border-b border-[#E6E0D2] text-[#68736C] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F8F5EC]/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-[#E6E0D2] flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                        <div className="max-w-[200px] truncate">
                          <p className="font-semibold text-[#202824] truncate">{p.name}</p>
                          <p className="text-[10px] text-[#68736C] truncate">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#68736C]">{p.category}</td>
                    <td className="py-3 px-4 text-[#202824] font-medium">
                      {p.vendor_id?.name || p.seller?.name || "Direct Marketplace"}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#174C3C]">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock <= 5 ? "text-[#C0392B]" : "text-[#202824]"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.isApproved ? "Approved" : "Pending"} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="p-1.5 text-[#68736C] hover:text-[#174C3C] hover:bg-[#E8EFE8] rounded-md transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {p.isApproved ? (
                          <button
                            onClick={() => handleModerate(p._id, false)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition"
                            title="Revoke Approval"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerate(p._id, true)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition"
                            title="Approve Product"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[#E6E0D2] bg-[#F8F5EC]/50 flex items-center justify-between text-xs text-[#68736C]">
            <span>
              Showing Page {currentPage} of {totalPages} ({totalCount} products)
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-[#E6E0D2] animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#F0ECE1]">
              <div>
                <span className="text-[11px] font-semibold text-[#A66B12] uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#202824]">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-[#68736C] hover:text-[#202824] p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4">
              <div className="flex gap-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-32 h-32 object-cover rounded-xl border border-[#E6E0D2]"
                />
                <div className="space-y-1.5 text-xs text-[#68736C] flex-1">
                  <p>
                    <strong className="text-[#202824]">Price:</strong>{" "}
                    {formatPrice(selectedProduct.price)}
                  </p>
                  <p>
                    <strong className="text-[#202824]">Inventory Stock:</strong>{" "}
                    {selectedProduct.stock} units
                  </p>
                  <p>
                    <strong className="text-[#202824]">Brand / Label:</strong>{" "}
                    {selectedProduct.brand}
                  </p>
                  <p>
                    <strong className="text-[#202824]">Seller:</strong>{" "}
                    {selectedProduct.vendor_id?.name || selectedProduct.seller?.name || "MarketNest Curated"}
                  </p>
                  <p>
                    <strong className="text-[#202824]">Status:</strong>{" "}
                    <StatusBadge status={selectedProduct.isApproved ? "Approved" : "Pending"} />
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#202824] uppercase mb-1">
                  Description
                </h4>
                <p className="text-xs text-[#68736C] leading-relaxed bg-[#F8F5EC] p-3 rounded-lg border border-[#E6E0D2]">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F0ECE1]">
              <button
                onClick={() => {
                  setProductToDelete(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-3 py-1.5 text-xs text-[#C0392B] hover:bg-red-50 rounded-lg transition"
              >
                Delete from Marketplace
              </button>

              <div className="space-x-2">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-1.5 border border-[#E6E0D2] rounded-lg text-xs font-semibold text-[#202824] hover:bg-[#E8EFE8]"
                >
                  Close
                </button>
                {selectedProduct.isApproved ? (
                  <button
                    onClick={() => handleModerate(selectedProduct._id, false)}
                    className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700"
                  >
                    Unapprove
                  </button>
                ) : (
                  <button
                    onClick={() => handleModerate(selectedProduct._id, true)}
                    className="px-4 py-1.5 bg-[#174C3C] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3429]"
                  >
                    Approve Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!productToDelete}
        title="Delete Marketplace Product"
        message={`Are you sure you want to permanently remove "${productToDelete?.name}"? Historical orders referencing this product will be retained for auditing.`}
        confirmText="Remove Product"
        isDestructive={true}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

