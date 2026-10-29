import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { login, authError, loading } = useAuth();
  const [email, setEmail] = useState("manpreetkaur5338@gmail.com");
  const [password, setPassword] = useState("MarketNest2026");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#174C3C] text-[#D5B779] flex items-center justify-center shadow-lg mb-4 border border-[#D5B779]">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="font-serif-heading text-3xl font-bold text-[#174C3C]">
            MarketNest
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A66B12] mt-1">
            Administrator Gateway
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 border border-[#E6E0D2] shadow-sm">
          <div className="mb-6">
            <h2 className="font-serif-heading text-xl font-bold text-[#202824]">
              Admin Sign In
            </h2>
            <p className="text-xs text-[#68736C] mt-1">
              Authenticate with your credentials to access marketplace governance.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-[#C0392B]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202824] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#68736C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@marketnest.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202824] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#68736C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8F5EC] border border-[#E6E0D2] rounded-lg text-sm text-[#202824] focus:outline-none focus:border-[#174C3C] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full mt-2 py-3 bg-[#174C3C] hover:bg-[#0f3429] text-white rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2 shadow-sm disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D5B779]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4 text-[#D5B779]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F0ECE1] text-center">
            <p className="text-[11px] text-[#68736C]">
              Access is restricted strictly to verified platform administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

