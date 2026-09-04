"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This password setup link is invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/student/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not set your password.");
        return;
      }

      router.replace("/my-courses");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border border-line rounded-sm p-8 bg-white"
    >
      <div>
        <label className="text-xs text-charcoal/60 uppercase tracking-wide">
          Create password
        </label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full border border-line rounded-sm px-3 py-2 mt-1 focus-visible:outline-burgundy"
        />
      </div>

      <div>
        <label className="text-xs text-charcoal/60 uppercase tracking-wide">
          Confirm password
        </label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full border border-line rounded-sm px-3 py-2 mt-1 focus-visible:outline-burgundy"
        />
      </div>

      {error && <p className="text-sm text-burgundy">{error}</p>}

      <button
        type="submit"
        disabled={saving || !token}
        className="w-full bg-burgundy text-ivory rounded-sm py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60"
      >
        {saving ? "Saving…" : "Set password & continue"}
      </button>
    </form>
  );
}