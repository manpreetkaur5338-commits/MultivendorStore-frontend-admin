import React, { useState } from "react";
import { Settings, Shield, Bell, Lock, Globe, Percent, CheckCircle, Save } from "lucide-react";

export const SettingsPage = () => {
  const [platformSettings, setPlatformSettings] = useState({
    commissionRate: "10",
    freeShippingThreshold: "999",
    standardShippingFee: "99",
    autoApproveProducts: false,
    autoApproveVendors: false,
    maintenanceMode: false,
    currencyCode: "INR (₹)",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#202824]">
          Marketplace Global Settings
        </h2>
        <p className="text-xs text-[#68736C] mt-0.5">
          Platform-wide commission fees, logistics thresholds, and vendor onboarding governance.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#26734D] rounded-xl text-xs font-semibold flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>Platform policies and financial rules updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Economics */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6E0D2] shadow-xs">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] mb-1 flex items-center">
            <Percent className="w-4 h-4 mr-2 text-[#A66B12]" />
            Fee Structure & Platform Commission
          </h3>
          <p className="text-xs text-[#68736C] mb-4">
            Applied automatically during customer order checkout settlements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#202824] mb-1">
                Platform Take-Rate (%)
              </label>
              <input
                type="number"
                value={platformSettings.commissionRate}
                onChange={(e) =>
                  setPlatformSettings({ ...platformSettings, commissionRate: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824] font-bold"
              />
              <span className="text-[10px] text-[#68736C] mt-1 block">Default fee per seller item</span>
            </div>

            <div>
              <label className="block font-semibold text-[#202824] mb-1">
                Free Shipping Minimum (₹)
              </label>
              <input
                type="number"
                value={platformSettings.freeShippingThreshold}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    freeShippingThreshold: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824]"
              />
              <span className="text-[10px] text-[#68736C] mt-1 block">Cart threshold for free freight</span>
            </div>

            <div>
              <label className="block font-semibold text-[#202824] mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={platformSettings.standardShippingFee}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    standardShippingFee: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-[#202824]"
              />
              <span className="text-[10px] text-[#68736C] mt-1 block">Orders under minimum</span>
            </div>
          </div>
        </div>

        {/* Vendor & Catalog Governance */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6E0D2] shadow-xs">
          <h3 className="font-serif-heading text-lg font-bold text-[#202824] mb-1 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-[#174C3C]" />
            Onboarding & Moderation Policy
          </h3>
          <p className="text-xs text-[#68736C] mb-4">
            Control automated vs manual administration verification steps.
          </p>

          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-3 p-3 bg-[#F8F5EC] rounded-xl border border-[#E6E0D2] cursor-pointer">
              <input
                type="checkbox"
                checked={platformSettings.autoApproveProducts}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    autoApproveProducts: e.target.checked,
                  })
                }
                className="rounded text-[#174C3C] focus:ring-[#174C3C] w-4 h-4"
              />
              <div>
                <span className="font-semibold text-[#202824] block">
                  Automatic Product Catalog Publishing
                </span>
                <span className="text-[#68736C] text-[11px]">
                  When disabled, all vendor-created listings remain in "Pending Moderation" until an admin reviews them.
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-[#F8F5EC] rounded-xl border border-[#E6E0D2] cursor-pointer">
              <input
                type="checkbox"
                checked={platformSettings.autoApproveVendors}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    autoApproveVendors: e.target.checked,
                  })
                }
                className="rounded text-[#174C3C] focus:ring-[#174C3C] w-4 h-4"
              />
              <div>
                <span className="font-semibold text-[#202824] block">
                  Instant Vendor Merchant Approval
                </span>
                <span className="text-[#68736C] text-[11px]">
                  When disabled, registered vendors cannot add inventory until approved in Vendor Applications.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#174C3C] text-white rounded-lg text-xs font-semibold hover:bg-[#0f3429] transition flex items-center space-x-1.5 shadow-xs"
          >
            <Save className="w-4 h-4 text-[#D5B779]" />
            <span>Save Governance Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

