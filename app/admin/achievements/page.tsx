"use client";
import { useEffect, useState } from "react";
type Item = { id:string; title:string; description:string; category:string; dateLabel:string; imageUrl:string|null };
export default function AdminAchievementsPage(){
  const [items,setItems]=useState<Item[]>([]); const [loading,setLoading]=useState(true); const [msg,setMsg]=useState("");
  const [form,setForm]=useState({ title:"", description:"", category:"Academic Excellence", dateLabel:"", imageUrl:""}); const [editing,setEditing]=useState<string|null>(null);
  async function load(){ const r=await fetch("/api/admin/achievements"); const j=await r.json(); if(Array.isArray(j)) setItems(j); setLoading(false); }
  useEffect(()=>{ load(); },[]);
  async function upload(file: File){
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch("/api/admin/upload",{method:"POST",body:fd});
    const j=await res.json().catch(()=>({})); if(!res.ok){ setMsg(j.message||"Upload failed."); return; }
    setForm(f=>({...f,imageUrl:j.url})); setMsg("Image uploaded.");
  }
  async function submit(e:React.FormEvent){
    e.preventDefault(); setMsg("");
    const url = editing ? `/api/admin/achievements/${editing}` : "/api/admin/achievements";
    const res=await fetch(url,{method: editing?"PUT":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){ setMsg(j.message||"Failed."); return; }
    setForm({ title:"", description:"", category:"Academic Excellence", dateLabel:"", imageUrl:""}); setEditing(null); setMsg(editing?"Updated.":"Created."); load();
  }
  async function del(id:string){ if(!confirm("Delete this achievement?")) return; await fetch(`/api/admin/achievements/${id}`,{method:"DELETE"}); load(); }
  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Achievements</h1>
      <p className="text-sm text-text-muted mt-1">Add, edit or delete achievements shown on the Achievements page.</p>
      {msg && <div className="mt-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-3 py-2 text-sm">{msg}</div>}
      <form onSubmit={submit} className="mt-4 bg-white rounded-2xl border p-5 grid gap-3">
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="rounded-xl border px-3 py-2.5 text-sm" required />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" rows={3} className="rounded-xl border px-3 py-2.5 text-sm" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="rounded-xl border px-3 py-2.5 text-sm bg-white">
            {["Academic Excellence","Sports","Cultural Activities","Science and Technology","Art and Creativity","Competitions","Awards and Recognition"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <input value={form.dateLabel} onChange={e=>setForm({...form,dateLabel:e.target.value})} placeholder="Date / Session (e.g. 2024-25)" className="rounded-xl border px-3 py-2.5 text-sm" />
        </div>
        {form.imageUrl && <img src={form.imageUrl} alt="" className="h-28 rounded-xl object-cover border" />}
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) upload(f);}} className="text-sm" />
        <input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="Or paste image URL" className="rounded-xl border px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <button type="submit" className="bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold">{editing?"Update":"Add Achievement"}</button>
          {editing && <button type="button" onClick={()=>{setEditing(null); setForm({ title:"", description:"", category:"Academic Excellence", dateLabel:"", imageUrl:""});}} className="border rounded-xl px-5 py-2.5 text-sm">Cancel</button>}
        </div>
      </form>
      <div className="mt-6 grid gap-3">
        {items.length===0 && <p className="text-sm text-text-muted bg-white border rounded-2xl p-6 text-center">No achievements yet.</p>}
        {items.map(it=>(
          <div key={it.id} className="bg-white rounded-2xl border p-4 flex gap-4">
            {it.imageUrl && <img src={it.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover border flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{it.title} <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{it.category}</span></p>
              <p className="text-sm text-text-muted mt-1 line-clamp-2">{it.description}</p>
              {it.dateLabel && <p className="text-xs text-text-muted mt-1">{it.dateLabel}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={()=>{setEditing(it.id); setForm({ title:it.title, description:it.description, category:it.category, dateLabel:it.dateLabel||"", imageUrl:it.imageUrl||""}); window.scrollTo({top:0,behavior:"smooth"});}} className="text-sm text-secondary underline">Edit</button>
              <button onClick={()=>del(it.id)} className="text-sm text-error underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
