"use client";
import { useEffect, useState } from "react";
export default function AdminSitePage(){
  const [form,setForm]=useState({ schoolName:"", tagline:"", address:"", phone:"", email:"", hours:"", facebook:"", instagram:"", youtube:""});
  const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false);
  useEffect(()=>{ fetch("/api/admin/site-settings").then(r=>r.json()).then(j=>{ if(j.schoolName) setForm(f=>({...f, ...j})); setLoading(false);}).catch(()=>setLoading(false)); },[]);
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    const res=await fetch("/api/admin/site-settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const j=await res.json().catch(()=>({}));
    if(!res.ok) setMsg(j.message || "Failed to save.");
    else setMsg("Saved successfully.");
    setSaving(false);
  }
  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  const field = (label:string, key: keyof typeof form, type="text")=>(
    <div key={key}>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
    </div>
  );
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-primary">Site Settings</h1>
      <p className="text-sm text-text-muted mt-1">School name, contact info and social links — used in header, footer, and contact page.</p>
      {msg && <div className={`mt-3 rounded-xl px-3 py-2 text-sm ${msg.includes("Saved")?"bg-green-50 border border-green-200 text-green-800":"bg-red-50 border border-red-200 text-error"}`}>{msg}</div>}
      <form onSubmit={save} className="mt-4 bg-white rounded-2xl border p-5 grid gap-4">
        {field("School Name","schoolName")}
        {field("Tagline","tagline")}
        {field("Address","address")}
        {field("Phone","phone","tel")}
        {field("Email","email","email")}
        {field("Office Hours","hours")}
        {field("Facebook URL","facebook","url")}
        {field("Instagram URL","instagram","url")}
        {field("YouTube URL","youtube","url")}
        <button type="submit" disabled={saving} className="bg-primary text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50">{saving?"Saving…":"Save Changes"}</button>
      </form>
    </div>
  );
}
