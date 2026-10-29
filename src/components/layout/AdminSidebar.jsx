import React from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Store,
  UserCheck,
  TrendingUp,
  CreditCard,
  UserCog,
  Settings,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";

export const AdminSidebar = ({ currentTab, setCurrentTab, mobileOpen, setMobileOpen, onLogout }) => {
  const menuGroups = [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Marketplace",
      items: [
        { id: "products", label: "Products Moderation", icon: Package },
        { id: "categories", label: "Categories", icon: Layers },
        { id: "orders", label: "Orders Management", icon: ShoppingBag },
        { id: "vendors", label: "Vendors", icon: Store },
        { id: "vendor-applications", label: "Vendor Approvals", icon: UserCheck },
        { id: "customers", label: "Customers", icon: Users },
      ],
    },
    {
      label: "Business Analytics",
      items: [
        { id: "reports", label: "Analytics & Reports", icon: TrendingUp },
        { id: "payments", label: "Payments & Financials", icon: CreditCard },
      ],
    },
    {
      label: "Administration",
      items: [
        { id: "profile", label: "Admin Profile", icon: UserCog },
        { id: "settings", label: "Marketplace Settings", icon: Settings },
      ],
    },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#174C3C] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-[#174C3C]/40 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Section */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D5B779] text-[#174C3C] flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-heading text-lg font-bold tracking-tight text-white block leading-none">
                MarketNest
              </span>
              <span className="text-[10px] tracking-widest text-[#D5B779] uppercase font-semibold">
                Admin Console
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-white/70 hover:text-white rounded-lg focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                {group.label}
              </p>
              <div className="mt-1.5 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#D5B779] text-[#174C3C] shadow-sm font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#174C3C]" : "text-[#D5B779]"}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-200 hover:bg-red-500/20 hover:text-white transition"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

