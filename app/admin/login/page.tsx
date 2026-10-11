"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminLoginPage(){
  const [pw,setPw]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const router=useRouter();
  async function submit(e: React.FormEvent){
    e.preventDefault(); setErr(""); setLoading(true);
    const res=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){ setErr(j.message||"Login failed."); setLoading(false); return; }
    router.push("/admin"); router.refresh();
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl border shadow-sm p-6">
        <h1 className="text-xl font-bold text-primary">Admin Login</h1>
        <p className="text-sm text-text-muted mt-1">Enter the admin password to continue.</p>
        {err && <div className="mt-3 bg-red-50 border border-red-200 text-error text-sm rounded-xl px-3 py-2">{err}</div>}
        <label className="block text-sm font-medium mt-4">Password</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Admin password" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
        <p className="text-xs text-text-muted mt-1">Default: <code className="bg-slate-100 px-1 rounded">admin123</code> — set <code className="bg-slate-100 px-1 rounded">ADMIN_TOKEN</code> in <code className="bg-slate-100 px-1 rounded">.env</code> to change.</p>
        <button type="submit" disabled={loading} className="mt-4 w-full bg-primary text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50">{loading?"Signing in…":"Sign in"}</button>
        <a href="/" className="block text-center text-sm text-secondary mt-3 underline">Back to website</a>
      </form>
    </div>
  );
}
