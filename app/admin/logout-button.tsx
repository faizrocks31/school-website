"use client";
import { useRouter } from "next/navigation";
export function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }
  return <button onClick={logout} className="text-sm text-error hover:underline">Logout</button>;
}
