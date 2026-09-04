"use client";

import { useRouter } from "next/navigation";

export default function StudentLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/student/logout", { method: "POST" });
    router.replace("/student/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-charcoal/55 hover:text-burgundy underline underline-offset-2"
    >
      Sign out
    </button>
  );
}