"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }

      router.replace("/my-courses");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[70vh] bg-ivory flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="index-tab text-xs text-gold mb-2 text-center">
          RITUU BHATIA COURSES
        </p>
        <h1 className="font-display text-2xl text-charcoal text-center mb-3">
          Student sign in
        </h1>
        <p className="text-sm text-charcoal/60 text-center mb-8">
          Sign in to continue learning.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-line rounded-sm p-8 bg-white"
        >
          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 mt-1 focus-visible:outline-burgundy"
            />
          </div>

          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 mt-1 focus-visible:outline-burgundy"
            />
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-ivory rounded-sm py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}