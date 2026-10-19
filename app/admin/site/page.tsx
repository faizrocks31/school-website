"use client";
import { useEffect, useState } from "react";
import { normalizeMapEmbed } from "@/lib/map";
import { imageSrc } from "@/lib/image-url";

export default function AdminSitePage(){
  const [form,setForm]=useState({ schoolName:"", tagline:"", logoUrl:"", address:"", mapEmbedUrl:"", phone:"", email:"", hours:"", facebook:"", instagram:"", youtube:""});
  const [msg,setMsg]=useState(""); const [details,setDetails]=useState(""); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [uploading,setUploading]=useState(false);
  const [logoBroken,setLogoBroken]=useState(false);

  useEffect(()=>{ fetch("/api/admin/site-settings").then(r=>r.json()).then(j=>{ if(j.schoolName) setForm(f=>({...f, ...j, logoUrl: j.logoUrl ?? "", mapEmbedUrl: j.mapEmbedUrl ?? ""})); setLoading(false);}).catch(()=>setLoading(false)); },[]);

  async function uploadLogo(file: File){
    setUploading(true); setMsg(""); setDetails("");
    const fd=new FormData(); fd.append("file", file);
    try {
      const res=await fetch("/api/admin/upload",{method:"POST", body: fd});
      const j=await res.json().catch(()=>({}));
      if(!res.ok){ setMsg(j.message||"Upload failed."); }
      else { setForm(f=>({...f, logoUrl:j.url})); setLogoBroken(false); setMsg("Logo uploaded — click Save Changes to apply it."); }
    } catch { setMsg("Upload failed. Please try again."); }
    setUploading(false);
  }

  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg(""); setDetails("");
    const res=await fetch("/api/admin/site-settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){
      if(j.errors){
        const lines=Object.entries(j.errors as Record<string,string>).map(([k,v])=>`${k}: ${v}`).join(" | ");
        setMsg(j.message||"Validation failed."); setDetails(lines);
      } else setMsg(j.message || "Failed to save.");
    } else setMsg("Saved successfully.");
    setSaving(false);
  }

  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;

  const previewMap = normalizeMapEmbed(form.mapEmbedUrl);

  const field = (label:string, key: keyof typeof form, type="text")=>(
    <div key={key}>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-primary">Site Settings</h1>
      <p className="text-sm text-text-muted mt-1">School name, logo, contact info and social links — used in the header, footer, contact page and browser tab title.</p>
      {msg && <div className={`mt-3 rounded-xl px-3 py-2 text-sm ${msg.includes("Saved")||msg.includes("uploaded")?"bg-green-50 border border-green-200 text-green-800":"bg-red-50 border border-red-200 text-error"}`}>{msg}{details ? <span className="block text-xs mt-1 opacity-80 break-words">{details}</span> : null}</div>}
      <form onSubmit={save} className="mt-4 bg-white rounded-2xl border p-5 grid gap-4">
        <div>
          <label className="text-sm font-medium">School Logo <span className="text-text-muted font-normal">(optional)</span></label>
          <div className="mt-2 flex items-center gap-4">
            {form.logoUrl && !logoBroken ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc(form.logoUrl)} alt="Logo preview" onError={()=>setLogoBroken(true)} className="h-20 w-20 rounded-2xl object-contain border border-slate-200 p-1 bg-white flex-shrink-0" />
            ) : (
              <div className="h-20 w-20 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-text-muted text-center flex-shrink-0 px-1">No logo</div>
            )}
            <div className="flex-1">
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading}
                onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadLogo(f); }}
                className="w-full text-sm" />
              <input value={form.logoUrl} onChange={e=>{ setLogoBroken(false); setForm({...form,logoUrl:e.target.value}); }} placeholder="Or paste a logo URL" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <p className="text-xs text-text-muted mt-1">Square PNG or JPG works best (max 5 MB). {uploading ? "Uploading…" : "Uploads are saved when you click Save Changes."}</p>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">School Name</label>
          <input value={form.schoolName} onChange={e=>setForm({...form,schoolName:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
          <p className="text-xs text-text-muted mt-1">Shown large in the site header.</p>
        </div>
        {field("Tagline","tagline")}
        {field("Address","address")}
        <div>
          <label className="text-sm font-medium">Location Map <span className="text-text-muted font-normal">(optional)</span></label>
          <textarea
            value={form.mapEmbedUrl}
            onChange={e=>setForm({...form,mapEmbedUrl:e.target.value})}
            rows={3}
            placeholder='Paste the Google Maps embed URL, or the whole <iframe ...> snippet'
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-secondary/30"
          />
          <p className="text-xs text-text-muted mt-1">
            Google Maps → search your school → <strong>Share</strong> → <strong>Embed a map</strong> → copy. Shown on the Contact Us page.
          </p>
          {previewMap ? (
            <div className="mt-2 rounded-xl overflow-hidden border border-slate-200">
              <iframe src={previewMap} title="Location map preview" width="100%" height="200" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          ) : form.mapEmbedUrl.trim() ? (
            <p className="text-xs text-error mt-2">That doesn&apos;t look like a Google Maps embed link — the map won&apos;t show. Use Share → Embed a map.</p>
          ) : null}
        </div>
        {field("Phone","phone","tel")}
        {field("Email","email","email")}
        {field("Office Hours","hours")}

        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-semibold text-text-main">Social Media</p>
          <p className="text-xs text-text-muted mt-0.5">
            Shown as a <strong>Follow us</strong> row of icons in the website footer. Paste the full
            link to your page, e.g. <span className="font-mono">https://facebook.com/yourschool</span>.
            Leave a box empty to hide that icon.
          </p>
          <div className="mt-3 grid gap-4">
            {field("Facebook URL","facebook","url")}
            {field("Instagram URL","instagram","url")}
            {field("YouTube URL","youtube","url")}
          </div>
        </div>

        <button type="submit" disabled={saving||uploading} className="bg-primary text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50">{saving?"Saving…":"Save Changes"}</button>
      </form>
    </div>
  );
}
