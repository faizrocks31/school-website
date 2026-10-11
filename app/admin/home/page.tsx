"use client";
import { useEffect, useState } from "react";
export default function AdminHomePage(){
  const [form,setForm]=useState({ heroTitle:"", heroSubtitle:"", welcomeTitle:"", welcomeText:"", ctaTitle:"", ctaSubtitle:"", heroImageUrl:"", welcomeImageUrl:""});
  const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false);
  useEffect(()=>{ fetch("/api/admin/home-content").then(r=>r.json()).then(j=>{ if(j.heroTitle) setForm(f=>({...f, ...j})); setLoading(false);}).catch(()=>setLoading(false)); },[]);
  async function upload(file: File, key: "heroImageUrl"|"welcomeImageUrl"){
    const fd=new FormData(); fd.append("file", file);
    const res=await fetch("/api/admin/upload",{method:"POST", body: fd});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){ setMsg(j.message||"Upload failed."); return; }
    setForm(f=>({...f, [key]: j.url}));
    setMsg("Image uploaded — click Save to apply.");
  }
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    const res=await fetch("/api/admin/home-content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const j=await res.json().catch(()=>({}));
    if(!res.ok) setMsg(j.message||"Failed to save."); else setMsg("Saved successfully.");
    setSaving(false);
  }
  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-primary">Home Page Content</h1>
      <p className="text-sm text-text-muted mt-1">Edit hero, welcome, and CTA sections. Upload images for hero and welcome.</p>
      {msg && <div className={`mt-3 rounded-xl px-3 py-2 text-sm ${msg.includes("Saved")||msg.includes("uploaded")?"bg-green-50 border border-green-200 text-green-800":"bg-red-50 border border-red-200 text-error"}`}>{msg}</div>}
      <form onSubmit={save} className="mt-4 bg-white rounded-2xl border p-5 grid gap-4">
        <div><label className="text-sm font-medium">Hero Title</label><input value={form.heroTitle} onChange={e=>setForm({...form,heroTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Hero Subtitle</label><textarea value={form.heroSubtitle} onChange={e=>setForm({...form,heroSubtitle:e.target.value})} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div>
          <label className="text-sm font-medium">Hero Image</label>
          {form.heroImageUrl && <img src={form.heroImageUrl} alt="Hero" className="mt-2 h-32 rounded-xl object-cover border" />}
          <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(f) upload(f,"heroImageUrl"); }} className="mt-2 w-full text-sm" />
          <input value={form.heroImageUrl} onChange={e=>setForm({...form,heroImageUrl:e.target.value})} placeholder="Or paste image URL" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div><label className="text-sm font-medium">Welcome Title</label><input value={form.welcomeTitle} onChange={e=>setForm({...form,welcomeTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Welcome Text</label><textarea value={form.welcomeText} onChange={e=>setForm({...form,welcomeText:e.target.value})} rows={4} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div>
          <label className="text-sm font-medium">Welcome Image</label>
          {form.welcomeImageUrl && <img src={form.welcomeImageUrl} alt="Welcome" className="mt-2 h-32 rounded-xl object-cover border" />}
          <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(f) upload(f,"welcomeImageUrl"); }} className="mt-2 w-full text-sm" />
          <input value={form.welcomeImageUrl} onChange={e=>setForm({...form,welcomeImageUrl:e.target.value})} placeholder="Or paste image URL" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div><label className="text-sm font-medium">CTA Title</label><input value={form.ctaTitle} onChange={e=>setForm({...form,ctaTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">CTA Subtitle</label><input value={form.ctaSubtitle} onChange={e=>setForm({...form,ctaSubtitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <button type="submit" disabled={saving} className="bg-primary text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50">{saving?"Saving…":"Save Changes"}</button>
      </form>
    </div>
  );
}
