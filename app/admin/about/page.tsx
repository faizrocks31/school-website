"use client";
import { useEffect, useState } from "react";
export default function AdminAboutPage(){
  const [form,setForm]=useState({ introTitle:"", introText:"", historyText:"", mission:"", vision:"", principalName:"", principalTitle:"Principal", principalMessage:"", principalImageUrl:"", valuesJson:""});
  const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false);
  useEffect(()=>{ fetch("/api/admin/about-content").then(r=>r.json()).then(j=>{ if(j.introTitle) setForm(f=>({...f, ...j})); setLoading(false);}).catch(()=>setLoading(false)); },[]);
  async function upload(file: File){
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch("/api/admin/upload",{method:"POST",body:fd});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){ setMsg(j.message||"Upload failed."); return; }
    setForm(f=>({...f, principalImageUrl:j.url})); setMsg("Image uploaded — click Save.");
  }
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    try{ const v=JSON.parse(form.valuesJson); if(!Array.isArray(v)) throw new Error(); } catch{ setMsg("Core Values must be a JSON array, e.g. [\"Discipline\",\"Integrity\"]"); setSaving(false); return; }
    const res=await fetch("/api/admin/about-content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const j=await res.json().catch(()=>({}));
    if(!res.ok) setMsg(j.message||"Failed."); else setMsg("Saved successfully.");
    setSaving(false);
  }
  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-primary">About Page</h1>
      {msg && <div className={`mt-3 rounded-xl px-3 py-2 text-sm ${msg.includes("Saved")||msg.includes("uploaded")?"bg-green-50 border border-green-200 text-green-800":"bg-red-50 border border-red-200 text-error"}`}>{msg}</div>}
      <form onSubmit={save} className="mt-4 bg-white rounded-2xl border p-5 grid gap-4">
        <div><label className="text-sm font-medium">Intro Title</label><input value={form.introTitle} onChange={e=>setForm({...form,introTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Intro Text</label><textarea value={form.introText} onChange={e=>setForm({...form,introText:e.target.value})} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">History</label><textarea value={form.historyText} onChange={e=>setForm({...form,historyText:e.target.value})} rows={4} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Mission</label><textarea value={form.mission} onChange={e=>setForm({...form,mission:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Vision</label><textarea value={form.vision} onChange={e=>setForm({...form,vision:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Principal Name</label><input value={form.principalName} onChange={e=>setForm({...form,principalName:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Principal Title</label><input value={form.principalTitle} onChange={e=>setForm({...form,principalTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Principal Message</label><textarea value={form.principalMessage} onChange={e=>setForm({...form,principalMessage:e.target.value})} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div>
          <label className="text-sm font-medium">Principal Photo</label>
          {form.principalImageUrl && <img src={form.principalImageUrl} alt="Principal" className="mt-2 h-28 rounded-xl object-cover border" />}
          <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) upload(f);}} className="mt-2 w-full text-sm" />
          <input value={form.principalImageUrl} onChange={e=>setForm({...form,principalImageUrl:e.target.value})} placeholder="Or paste image URL" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div><label className="text-sm font-medium">Core Values (JSON array)</label><textarea value={form.valuesJson} onChange={e=>setForm({...form,valuesJson:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono" placeholder='["Discipline","Integrity","Respect"]' /></div>
        <button type="submit" disabled={saving} className="bg-primary text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50">{saving?"Saving…":"Save Changes"}</button>
      </form>
    </div>
  );
}
