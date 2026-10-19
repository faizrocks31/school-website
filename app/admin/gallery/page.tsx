"use client";
import { useEffect, useState } from "react";
import { imageSrc } from "@/lib/image-url";
type Img = { id:string; url:string; alt:string };
export default function AdminGalleryPage(){
  const [items,setItems]=useState<Img[]>([]); const [loading,setLoading]=useState(true); const [msg,setMsg]=useState(""); const [alt,setAlt]=useState("");
  async function load(){ const r=await fetch("/api/admin/gallery"); const j=await r.json(); if(Array.isArray(j)) setItems(j); setLoading(false); }
  useEffect(()=>{ load(); },[]);
  async function upload(file: File){
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch("/api/admin/upload",{method:"POST",body:fd});
    const j=await res.json().catch(()=>({})); if(!res.ok){ setMsg(j.message||"Upload failed."); return; }
    const res2=await fetch("/api/admin/gallery",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:j.url, alt})});
    const j2=await res2.json().catch(()=>({})); if(!res2.ok){ setMsg(j2.message||"Failed to save."); return; }
    setAlt(""); setMsg("Photo added."); load();
  }
  async function addByUrl(url:string){
    if(!url.trim()) return;
    const res=await fetch("/api/admin/gallery",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:url.trim(), alt})});
    const j=await res.json().catch(()=>({})); if(!res.ok){ setMsg(j.message||"Failed."); return; }
    setAlt(""); setMsg("Photo added."); (document.getElementById("galleryUrl") as HTMLInputElement|null)!.value=""; load();
  }
  async function del(id:string){ if(!confirm("Delete this photo?")) return; await fetch(`/api/admin/gallery/${id}`,{method:"DELETE"}); load(); }
  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Home Gallery — Photos</h1>
      <p className="text-sm text-text-muted mt-1">Upload photos shown on the Home page. JPG, PNG, WebP, GIF — max 5 MB each.</p>
      {msg && <div className="mt-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-3 py-2 text-sm">{msg}</div>}
      <div className="mt-4 bg-white rounded-2xl border p-5 grid gap-3">
        <input value={alt} onChange={e=>setAlt(e.target.value)} placeholder="Alt text / caption (optional)" className="rounded-xl border px-3 py-2.5 text-sm" />
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) upload(f);}} className="text-sm" />
        <div className="flex gap-2">
          <input id="galleryUrl" placeholder="Or paste image URL and click Add" className="flex-1 rounded-xl border px-3 py-2.5 text-sm" />
          <button onClick={()=>addByUrl((document.getElementById("galleryUrl") as HTMLInputElement).value)} className="bg-primary text-white rounded-xl px-4 py-2.5 text-sm font-semibold">Add URL</button>
        </div>
      </div>
      {items.length===0 ? <p className="mt-6 text-sm text-text-muted bg-white border rounded-2xl p-6 text-center">No photos yet.</p> : (
        <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {items.map(it=>(
            <div key={it.id} className="bg-white rounded-2xl border overflow-hidden">
              <img src={imageSrc(it.url)} alt={it.alt} className="w-full h-32 object-cover" />
              <div className="p-2 flex items-center justify-between gap-1">
                <p className="text-xs text-text-muted truncate">{it.alt || "Photo"}</p>
                <button onClick={()=>del(it.id)} className="text-xs text-error underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
