import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Users,
} from "lucide-react";
import { api } from "../services/api";
import {
  ChartCard,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from "../components/common/UIComponents";
import { CHART_COLORS, defaultChartOptions } from "../utils/chartConfig";

export const ReportsPage = () => {
  const [daysWindow, setDaysWindow] = useState("30");
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, statsRes] = await Promise.all([
        api.getAnalytics(daysWindow),
        api.getDashboardStats(),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [daysWindow]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Revenue & Order Velocity
  const dailyData = analytics?.dailyTrend || [];
  const revenueChartData = {
    labels: dailyData.map((d) => d._id),
    datasets: [
      {
        label: "Gross Order Sales (₹)",
        data: dailyData.map((d) => d.revenue),
        borderColor: CHART_COLORS.emerald,
        backgroundColor: CHART_COLORS.emeraldLight,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const ordersCountChartData = {
    labels: dailyData.map((d) => d._id),
    datasets: [
      {
        label: "Orders Count",
        data: dailyData.map((d) => d.ordersCount),
        backgroundColor: CHART_COLORS.gold,
        borderRadius: 4,
      },
    ],
  };

  // Payment Status Distribution
  const paymentDist = analytics?.paymentStatusDist || [];
  const paymentDoughnutData = {
    labels: paymentDist.map((p) => p._id),
    datasets: [
      {
        data: paymentDist.map((p) => p.count),
        backgroundColor: [
          "#D5B779", // pending
          "#26734D", // completed
          "#C0392B", // failed
          "#68736C", // refunded
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  // Categories Distribution
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

  // Export reports to CSV
  const exportToCSV = () => {
    if (!dailyData.length) return;
    const headers = "Date,Gross_Sales_INR,Orders_Count,Captured_Sales_INR\n";
    const rows = dailyData
      .map(
        (d) => `${d._id},${d.revenue},${d.ordersCount},${d.capturedRevenue || 0}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `marketnest-analytics-${daysWindow}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
            Business Intelligence & Reports
          </h2>
          <p className="text-xs text-[#68736C] mt-0.5">
            Aggregated marketplace metrics, transaction volume, and seller catalog growth.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#E6E0D2] rounded-lg px-3 py-1.5 shadow-xs text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#68736C] mr-2" />
            <select
              value={daysWindow}
              onChange={(e) => setDaysWindow(e.target.value)}
              className="bg-transparent text-[#202824] font-medium focus:outline-none"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last 1 Year</option>
            </select>
          </div>

          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-[#174C3C] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3429] transition flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#D5B779]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Settlement Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E6E0D2]">
          <p className="text-[11px] uppercase tracking-wider text-[#68736C] font-semibold">
            Gross Order Volume
          </p>
          <h3 className="text-2xl font-bold text-[#202824] mt-1">
            {formatCurrency(stats?.grossSales)}
          </h3>
          <p className="text-[11px] text-[#68736C] mt-1">All processed checkouts</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D2]">
          <p className="text-[11px] uppercase tracking-wider text-[#68736C] font-semibold">
            Net Revenue
          </p>
          <h3 className="text-2xl font-bold text-[#174C3C] mt-1">
            {formatCurrency(stats?.netSales)}
          </h3>
          <p className="text-[11px] text-[#68736C] mt-1">Less refunded payments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D2]">
          <p className="text-[11px] uppercase tracking-wider text-[#68736C] font-semibold">
            Discounts & Vouchers
          </p>
          <h3 className="text-2xl font-bold text-[#A66B12] mt-1">
            {formatCurrency(stats?.discount)}
          </h3>
          <p className="text-[11px] text-[#68736C] mt-1">Promotional coupon subsidies</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D2]">
          <p className="text-[11px] uppercase tracking-wider text-[#68736C] font-semibold">
            Platform Take-Rate
          </p>
          <h3 className="text-2xl font-bold text-[#26734D] mt-1">
            {formatCurrency(stats?.marketplaceCommission)}
          </h3>
          <p className="text-[11px] text-[#68736C] mt-1">Platform commission (10%)</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-64" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReports} />
      ) : (
        <>
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Gross Sales Trend"
              subtitle={`Daily order checkout values over the past ${daysWindow} days`}
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
                        ticks: { callback: (v) => `₹${v}` },
                      },
                    },
                  }}
                />
              ) : (
                <EmptyState title="No orders in this timeframe" />
              )}
            </ChartCard>

            <ChartCard
              title="Daily Order Volume"
              subtitle="Number of orders placed per day"
            >
              {dailyData.length > 0 ? (
                <Bar data={ordersCountChartData} options={defaultChartOptions} />
              ) : (
                <EmptyState title="No orders recorded" />
              )}
            </ChartCard>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Payment Status Distribution"
              subtitle="Proportion of pending COD, completed, and refunded orders"
            >
              {paymentDist.length > 0 ? (
                <Doughnut
                  data={paymentDoughnutData}
                  options={{
                    ...defaultChartOptions,
                    plugins: {
                      ...defaultChartOptions.plugins,
                      legend: { position: "bottom" },
                    },
                  }}
                />
              ) : (
                <EmptyState title="No payment records" />
              )}
            </ChartCard>

            <ChartCard
              title="Product Catalog Category Penetration"
              subtitle="Distribution of live products by category"
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
                <EmptyState title="No category distributions" />
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

