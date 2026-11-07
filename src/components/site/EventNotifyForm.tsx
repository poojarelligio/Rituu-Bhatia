"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function EventNotifyForm() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "workshop_notify" }),
      });
      if (!res.ok) { setStatus("error"); return; }
      setStatus("sent");
      setForm({ name: "", email: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto">
      <input
        required
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy"
      />
      <Button
        type="submit"
        variant="primary"
        disabled={status === "submitting"}
        className="w-full sm:w-auto whitespace-nowrap"
      >
        {status === "submitting" ? "Submitting…" : "Notify Me"}
      </Button>

      {status === "sent" && (
        <p className="text-sm text-burgundy mt-4 sm:absolute sm:-bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:whitespace-nowrap">
          ✅ You're on the list! We'll notify you about upcoming events.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-burgundy mt-4 sm:absolute sm:-bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:whitespace-nowrap">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}