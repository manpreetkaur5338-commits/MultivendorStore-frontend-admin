import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminLayout } from "./components/layout/AdminLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { OrdersPage } from "./pages/OrdersPage";
import { VendorsPage } from "./pages/VendorsPage";
import { CustomersPage } from "./pages/CustomersPage";
import { ReportsPage } from "./pages/ReportsPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { Loader2 } from "lucide-react";

const AdminApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EC] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#174C3C]" />
        <p className="font-serif-heading text-lg font-bold text-[#174C3C] mt-3">
          MarketNest Admin Console
        </p>
        <p className="text-xs text-[#68736C]">Authenticating platform credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardPage setCurrentTab={setCurrentTab} />;
      case "products":
        return <ProductsPage />;
      case "categories":
        return <CategoriesPage />;
      case "orders":
        return <OrdersPage />;
      case "vendors":
        return <VendorsPage onlyPending={false} />;
      case "vendor-applications":
        return <VendorsPage onlyPending={true} />;
      case "customers":
        return <CustomersPage />;
      case "reports":
        return <ReportsPage />;
      case "payments":
        return <PaymentsPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage setCurrentTab={setCurrentTab} />;
    }
  };

  const handleGlobalSearch = (query) => {
    if (!query) return;
    // Route intelligently depending on query format
    if (query.toUpperCase().startsWith("MN-")) {
      setCurrentTab("orders");
    } else {
      setCurrentTab("products");
    }
  };

  return (
    <AdminLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onSearch={handleGlobalSearch}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  );
}
