"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Full page reload so the middleware picks up the new cookie.
    // router.push is client-side only and won't trigger middleware.
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-headline-lg text-black mb-2">QULVA</h1>
          <p className="text-label-sm uppercase tracking-widest text-[#757575]">
            Admin Access
          </p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-8 md:p-12">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-label-sm uppercase text-black font-bold block">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ADMIN@QULVA.COM"
                className="w-full bg-transparent border-b border-black py-4 text-label-sm uppercase tracking-widest focus:ring-0 focus:outline-none focus:border-b-2 transition-all placeholder:text-[#D4D4D4] rounded-none text-black font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-label-sm uppercase text-black font-bold block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER PASSWORD"
                className="w-full bg-transparent border-b border-black py-4 text-label-sm uppercase tracking-widest focus:ring-0 focus:outline-none focus:border-b-2 transition-all placeholder:text-[#D4D4D4] rounded-none text-black font-semibold"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 uppercase tracking-wider">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-8 py-4 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 rounded-none cursor-pointer disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
