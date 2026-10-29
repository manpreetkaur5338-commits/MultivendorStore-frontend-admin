import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "../../context/AuthContext";

export const AdminLayout = ({ children, currentTab, setCurrentTab, onSearch }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  const getPageTitle = (tab) => {
    switch (tab) {
      case "dashboard":
        return "Marketplace Overview";
      case "products":
        return "Product Moderation & Catalog";
      case "categories":
        return "Category Management";
      case "orders":
        return "Order Lifecycle & Fulfilment";
      case "vendors":
        return "Verified Vendors Directory";
      case "vendor-applications":
        return "Vendor Applications & Approvals";
      case "customers":
        return "Customer Accounts";
      case "reports":
        return "Business Intelligence & Analytics";
      case "payments":
        return "Payments, Fees & Settlements";
      case "profile":
        return "Administrator Profile";
      case "settings":
        return "Marketplace Settings";
      default:
        return "Admin Console";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EC] flex flex-col font-sans-body">
      {/* Left Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
      />

      {/* Main Container - offset by 260px on desktop */}
      <div className="lg:pl-[260px] flex flex-col flex-1 min-w-0">
        <AdminHeader
          title={getPageTitle(currentTab)}
          onMenuToggle={() => setMobileOpen(true)}
          onSearch={onSearch}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

