"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      const param = new URLSearchParams(window.location.search).get("next");
      // Only allow same-site relative paths to avoid open redirects.
      const next =
        param && param.startsWith("/") && !param.startsWith("//") ? param : "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="index-tab text-xs text-gold mb-2 text-center">RITUU BHATIA</p>
        <h1 className="font-display text-2xl text-charcoal text-center mb-8">Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className="space-y-4 border border-line rounded-sm p-8 bg-white">
          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 mt-1 focus-visible:outline-burgundy"
            />
          </div>
          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 mt-1 focus-visible:outline-burgundy"
            />
          </div>
          {error && <p className="text-sm text-burgundy">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-ivory rounded-sm py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
