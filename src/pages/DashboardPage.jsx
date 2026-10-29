import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Percent,
} from "lucide-react";
import { api } from "../services/api";
import {
  StatCard,
  ChartCard,
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from "../components/common/UIComponents";
import { CHART_COLORS, defaultChartOptions } from "../utils/chartConfig";

export const DashboardPage = ({ setCurrentTab }) => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, analyticsRes, ordersRes, vendorsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getAnalytics(30),
        api.getOrders({ limit: 5 }),
        api.getUsers({ role: "vendor", isApproved: "false", limit: 5 }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (ordersRes.success) setRecentOrders(ordersRes.data || []);
      if (vendorsRes.success) setPendingVendors(vendorsRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={4} height="h-28" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton count={1} height="h-80" />
          <LoadingSkeleton count={1} height="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  // Format currency in INR
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Prepare Revenue Trend Line Chart Data
  const dailyData = analytics?.dailyTrend || [];
  const revenueChartData = {
    labels: dailyData.map((d) => d._id),
    datasets: [
      {
        label: "Gross Sales (₹)",
        data: dailyData.map((d) => d.revenue),
        borderColor: CHART_COLORS.emerald,
        backgroundColor: CHART_COLORS.emeraldLight,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: CHART_COLORS.emerald,
      },
      {
        label: "Captured Payments (₹)",
        data: dailyData.map((d) => d.capturedRevenue),
        borderColor: CHART_COLORS.gold,
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.3,
        pointBackgroundColor: CHART_COLORS.gold,
      },
    ],
  };

  // Prepare Order Status Doughnut Chart
  const statusDist = analytics?.orderStatusDist || [];
  const statusDoughnutData = {
    labels: statusDist.map((s) => s._id),
    datasets: [
      {
        data: statusDist.map((s) => s.count),
        backgroundColor: statusDist.map(
          (s) => CHART_COLORS.status[s._id] || CHART_COLORS.muted
        ),
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  // Prepare Category Distribution Bar Chart
  const categoryDist = analytics?.categoryDist || [];
  const categoryBarData = {
    labels: categoryDist.map((c) => c._id),
    datasets: [
      {
        label: "Products Listed",
        data: categoryDist.map((c) => c.count),
        backgroundColor: CHART_COLORS.emerald,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6E0D2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A66B12]">
            Governance Center
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#174C3C] mt-1">
            Welcome to MarketNest Admin
          </h2>
          <p className="text-sm text-[#68736C] mt-1 max-w-2xl">
            Monitor marketplace activity, oversee vendor operations, verify catalogs, and track real-time financials from one central console.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab("vendor-applications")}
            className="px-4 py-2 bg-[#174C3C] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3429] transition flex items-center space-x-1.5 shadow-xs"
          >
            <span>Review Vendors ({stats?.pendingVendors || 0})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D5B779]" />
          </button>
          <button
            onClick={() => setCurrentTab("products")}
            className="px-4 py-2 border border-[#E6E0D2] text-[#202824] rounded-lg text-xs font-semibold hover:bg-[#E8EFE8] transition"
          >
            Catalog Moderation
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Order Sales"
          value={formatCurrency(stats?.grossSales)}
          subtitle={`Across ${stats?.totalOrders || 0} customer orders`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Marketplace Fees"
          value={formatCurrency(stats?.marketplaceCommission)}
          subtitle="Estimated platform take-rate (10%)"
          icon={Percent}
          color="gold"
        />
        <StatCard
          title="Active Products"
          value={stats?.totalProducts || 0}
          subtitle={`${stats?.pendingProducts || 0} pending admin review`}
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Verified Vendors"
          value={stats?.totalVendors || 0}
          subtitle={`${stats?.pendingVendors || 0} approval applications`}
          icon={Store}
          color="gold"
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-[#26734D]">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-[#68736C]">Delivered Orders</p>
            <p className="text-lg font-bold text-[#202824]">{stats?.deliveredOrders || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-[#A66B12]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-[#68736C]">Pending Orders</p>
            <p className="text-lg font-bold text-[#202824]">{stats?.pendingOrders || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-red-50 text-[#C0392B]">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-[#68736C]">Cancelled Orders</p>
            <p className="text-lg font-bold text-[#202824]">{stats?.cancelledOrders || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E6E0D2] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-[#68736C]">Registered Customers</p>
            <p className="text-lg font-bold text-[#202824]">{stats?.totalCustomers || 0}</p>
          </div>
        </div>
      </div>

      {/* Chart.js Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue & Settlement Velocity"
            subtitle="Actual daily gross order values and captured transactions"
            action={
              <button
                onClick={() => setCurrentTab("reports")}
                className="text-xs font-semibold text-[#174C3C] hover:text-[#0f3429] flex items-center"
              >
                <span>Full Report</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            }
          >
            {dailyData.length > 0 ? (
              <Line
                data={revenueChartData}
                options={{
                  ...defaultChartOptions,
                  scales: {
                    ...defaultChartOptions.scales,
                    y: {
                      ...defaultChartOptions.scales.y,
                      ticks: {
                        callback: (v) => `₹${v}`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <EmptyState
                title="No sales in selected window"
                message="Orders will populate the trend chart automatically upon checkout."
              />
            )}
          </ChartCard>
        </div>

        {/* Order Status Distribution Doughnut Chart */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Order Status Breakdown"
            subtitle="Current distribution across fulfillment stages"
          >
            {statusDist.length > 0 ? (
              <Doughnut
                data={statusDoughnutData}
                options={{
                  ...defaultChartOptions,
                  plugins: {
                    ...defaultChartOptions.plugins,
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            ) : (
              <EmptyState title="No orders to display" />
            )}
          </ChartCard>
        </div>
      </div>

      {/* Category Distribution Bar Chart */}
      <ChartCard
        title="Inventory Category Spread"
        subtitle="Active marketplace catalog volume by verified category"
      >
        {categoryDist.length > 0 ? (
          <Bar
            data={categoryBarData}
            options={{
              ...defaultChartOptions,
              plugins: {
                ...defaultChartOptions.plugins,
                legend: { display: false },
              },
            }}
          />
        ) : (
          <EmptyState title="No categories found" />
        )}
      </ChartCard>

      {/* Recent Orders & Pending Applications Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E0D2] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#202824]">
                Recent Marketplace Orders
              </h3>
              <p className="text-xs text-[#68736C]">Live order throughput</p>
            </div>
            <button
              onClick={() => setCurrentTab("orders")}
              className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0ECE1] text-[#68736C] font-semibold">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {recentOrders.length > 0 ? (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#F8F5EC]/60 transition">
                      <td className="py-2.5 font-semibold text-[#202824]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-2.5 text-[#202824]">
                        {ord.shippingAddress?.name || "Customer"}
                      </td>
                      <td className="py-2.5 font-bold text-[#174C3C]">
                        {formatCurrency(ord.total)}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={ord.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-[#68736C]">
                      No recent orders recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Vendor Approvals */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E0D2] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#202824]">
                Pending Vendor Applications
              </h3>
              <p className="text-xs text-[#68736C]">Awaiting governance review</p>
            </div>
            <button
              onClick={() => setCurrentTab("vendor-applications")}
              className="text-xs font-semibold text-[#174C3C] hover:underline flex items-center"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0ECE1] text-[#68736C] font-semibold">
                  <th className="pb-2">Store / Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Applied Date</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {pendingVendors.length > 0 ? (
                  pendingVendors.map((ven) => (
                    <tr key={ven._id} className="hover:bg-[#F8F5EC]/60 transition">
                      <td className="py-2.5 font-semibold text-[#202824]">
                        {ven.name}
                      </td>
                      <td className="py-2.5 text-[#68736C]">{ven.email}</td>
                      <td className="py-2.5 text-[#68736C]">
                        {new Date(ven.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setCurrentTab("vendor-applications")}
                          className="px-2.5 py-1 bg-[#174C3C] text-white rounded text-[11px] font-semibold hover:bg-[#0f3429] transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#68736C]">
                      All vendor applications have been verified.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

