import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register all required Chart.js elements, scales, and plugins centrally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global MarketNest Brand Chart Colors
export const CHART_COLORS = {
  emerald: "#174C3C",
  emeraldLight: "rgba(23, 76, 60, 0.15)",
  gold: "#D5B779",
  goldLight: "rgba(213, 183, 121, 0.2)",
  cream: "#F8F5EC",
  text: "#202824",
  muted: "#68736C",
  border: "#E6E0D2",
  status: {
    placed: "#D5B779",
    processing: "#3B82F6",
    shipped: "#8B5CF6",
    delivered: "#26734D",
    cancelled: "#C0392B",
    refunded: "#9CA3AF",
  },
};

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
          weight: 500,
        },
        color: CHART_COLORS.text,
        usePointStyle: true,
        pointStyle: "circle",
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: "#174C3C",
      titleColor: "#FFFFFF",
      bodyColor: "#F8F5EC",
      borderColor: "#D5B779",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      titleFont: {
        family: "'Inter', sans-serif",
        size: 13,
        weight: "600",
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        size: 12,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 11,
        },
        color: CHART_COLORS.muted,
      },
    },
    y: {
      grid: {
        color: "#F0ECE1",
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 11,
        },
        color: CHART_COLORS.muted,
      },
    },
  },
};

