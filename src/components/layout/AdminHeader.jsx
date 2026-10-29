import React, { useState } from "react";
import { Menu, Search, User, LogOut, ChevronDown, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminHeader = ({ title, onMenuToggle, onSearch, currentTab, setCurrentTab }) => {
  const { admin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E6E0D2] px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-[#202824] hover:bg-[#E8EFE8] rounded-lg transition"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-serif-heading text-lg sm:text-xl font-bold text-[#202824] capitalize">
            {title || "MarketNest Management"}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#68736C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, products, or users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-xs sm:text-sm text-[#202824] placeholder-[#68736C] focus:outline-none focus:border-[#174C3C] transition"
          />
        </div>
      </form>

      {/* Right: Admin Profile & Actions */}
      <div className="flex items-center space-x-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-[#E8EFE8] transition text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#174C3C] text-[#D5B779] flex items-center justify-center font-bold text-xs border border-[#D5B779]">
              {getInitials(admin?.name)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-[#202824] block leading-tight">
                {admin?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-[#A66B12] font-medium flex items-center">
                <Shield className="w-2.5 h-2.5 mr-0.5" />
                Super Admin
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#68736C] hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E6E0D2] py-2 z-50 animate-in fade-in zoom-in-95"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-[#F0ECE1]">
                <p className="text-xs font-bold text-[#202824]">{admin?.name}</p>
                <p className="text-[11px] text-[#68736C] truncate">{admin?.email}</p>
              </div>

              <button
                onClick={() => setCurrentTab("profile")}
                className="w-full text-left px-4 py-2 text-xs font-medium text-[#202824] hover:bg-[#E8EFE8] flex items-center space-x-2"
              >
                <User className="w-3.5 h-3.5 text-[#174C3C]" />
                <span>Admin Profile</span>
              </button>

              <button
                onClick={() => setCurrentTab("settings")}
                className="w-full text-left px-4 py-2 text-xs font-medium text-[#202824] hover:bg-[#E8EFE8] flex items-center space-x-2"
              >
                <Shield className="w-3.5 h-3.5 text-[#174C3C]" />
                <span>Platform Settings</span>
              </button>

              <div className="border-t border-[#F0ECE1] my-1" />

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs font-medium text-[#C0392B] hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

