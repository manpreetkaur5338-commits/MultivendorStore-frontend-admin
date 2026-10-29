const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("marketnest_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return res.json();
  },

  // Dashboard Stats & Real-time Analytics
  async getDashboardStats() {
    const res = await fetch(`${API_URL}/admin/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAnalytics(days = 30) {
    const res = await fetch(`${API_URL}/admin/analytics?days=${days}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Orders Management
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/orders?${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateOrderStatus(orderId, data) {
    const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Users (Customers & Vendors)
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/users?${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateUserStatus(userId, data) {
    const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async approveVendor(vendorId) {
    const res = await fetch(`${API_URL}/auth/approve-vendor/${vendorId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Products Moderation
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/products?${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async moderateProduct(productId, data) {
    const res = await fetch(`${API_URL}/admin/products/${productId}/moderate`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteProduct(productId) {
    const res = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createCategory(data) {
    const res = await fetch(`${API_URL}/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateCategory(id, data) {
    const res = await fetch(`${API_URL}/admin/categories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_URL}/admin/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Payments
  async getPayments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/payments?${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};

