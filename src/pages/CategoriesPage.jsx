import React, { useState, useEffect } from "react";
import { Layers, Plus, Edit2, Trash2, CheckCircle, FolderPlus } from "lucide-react";
import { api } from "../services/api";
import {
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  ConfirmModal,
} from "../components/common/UIComponents";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", image: "" });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", image: "" });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || cat.id || "",
      description: cat.description || "",
      image: cat.image || "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug : autoSlug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (editingCategory) {
        const res = await api.updateCategory(editingCategory._id || editingCategory.id, formData);
        if (res.success) {
          setSuccessMessage("Category updated successfully");
          setModalOpen(false);
          fetchCategories();
        } else {
          setFormError(res.message);
        }
      } else {
        const res = await api.createCategory(formData);
        if (res.success) {
          setSuccessMessage("Category created successfully");
          setModalOpen(false);
          fetchCategories();
        } else {
          setFormError(res.message);
        }
      }
    } catch (err) {
      setFormError(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await api.deleteCategory(categoryToDelete._id || categoryToDelete.id);
      if (res.success) {
        setSuccessMessage("Category deleted successfully");
        setCategoryToDelete(null);
        fetchCategories();
      } else {
        alert(res.message || "Could not delete category");
      }
    } catch (err) {
      alert("Error deleting category: " + err.message);
    } finally {
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            Category Management
          </h2>
          <p className="text-xs text-[#68736C] mt-0.5">
            Organize catalog classifications, banners, and browse paths for customer discovery.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#174C3C] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3429] transition flex items-center space-x-1.5 shadow-xs w-fit"
        >
          <Plus className="w-4 h-4 text-[#D5B779]" />
          <span>Add New Category</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#26734D] rounded-xl text-xs font-semibold flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid of Categories */}
      {loading ? (
        <LoadingSkeleton count={4} height="h-32" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCategories} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No Categories Available"
          message="Create your first marketplace product classification."
          action={
            <button
              onClick={openCreateModal}
              className="mt-2 px-4 py-2 bg-[#174C3C] text-white rounded-lg text-xs font-semibold"
            >
              Add Category
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id || cat.id}
              className="bg-white rounded-xl border border-[#E6E0D2] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="h-28 bg-[#F8F5EC] relative overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#68736C]/40">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs font-medium">
                  {cat.slug || cat.id}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif-heading text-base font-bold text-[#202824]">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-[#68736C] line-clamp-2 mt-1">
                    {cat.description || "Active department classification in MarketNest."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#A66B12] font-semibold">
                    {cat.count || "Verified"}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-[#68736C] hover:text-[#174C3C] hover:bg-[#E8EFE8] rounded-md transition"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6E0D2] animate-in fade-in zoom-in-95">
            <h3 className="font-serif-heading text-xl font-bold text-[#202824] mb-1">
              {editingCategory ? "Edit Category" : "New Category"}
            </h3>
            <p className="text-xs text-[#68736C] mb-4">
              Configure category details for product catalog tagging.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#C0392B] rounded-lg text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#202824] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Artisanal Coffee"
                  className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202824] mb-1">Slug Identifier *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="artisanal-coffee"
                  className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202824] mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202824] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of products in this category..."
                  className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] focus:outline-none focus:border-[#174C3C]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-[#F0ECE1]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E6E0D2] rounded-lg font-semibold text-[#202824] hover:bg-[#E8EFE8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#174C3C] text-white rounded-lg font-semibold hover:bg-[#0f3429] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? You can only delete categories that currently have zero assigned active products.`}
        confirmText="Confirm Delete"
        isDestructive={true}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

