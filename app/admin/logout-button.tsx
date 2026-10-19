"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/**
 * Logout button.
 *
 * Styled as a real button rather than an underlined text link, so it reads as
 * an action — and it carries an icon and a pressed/disabled state so a click
 * gives immediate feedback while the session cookie is being cleared.
 */
export function AdminLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      aria-label={busy ? "Signing out" : "Logout"}
      title={busy ? "Signing out…" : "Logout"}
      className="inline-flex items-center gap-2 rounded-xl bg-error px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60 transition motion-reduce:transition-none"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline whitespace-nowrap">{busy ? "Signing out…" : "Logout"}</span>
    </button>
  );
}
