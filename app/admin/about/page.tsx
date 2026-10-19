"use client";
import { useEffect, useState } from "react";
import { imageSrc } from "@/lib/image-url";

const DEFAULTS = {
  introTitle: "About Our School",
  introText: "Learn about our school's history, mission, vision and values. Placeholder content — replace with real school information.",
  historyText: "Our school was founded with a vision to provide holistic education. Placeholder — add real history here.",
  mission: "Nurture curious, confident and compassionate learners.",
  vision: "Be a trusted centre of holistic education.",
  principalName: "",
  principalTitle: "Principal",
  principalMessage: "",
  principalImageUrl: "",
};

export default function AdminAboutPage(){
  const [form,setForm]=useState({ ...DEFAULTS, valuesText: "Discipline, Integrity, Respect, Creativity, Responsibility, Lifelong Learning"});
  const [msg,setMsg]=useState(""); const [details,setDetails]=useState(""); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false);

  useEffect(()=>{ fetch("/api/admin/about-content").then(r=>r.json()).then(j=>{
    if(j.introTitle){
      let valuesText = "Discipline, Integrity, Respect, Creativity, Responsibility, Lifelong Learning";
      try { const arr = JSON.parse(j.valuesJson ?? "[]"); if (Array.isArray(arr) && arr.length) valuesText = arr.join(", "); } catch {}
      setForm({
        introTitle: j.introTitle ?? DEFAULTS.introTitle,
        introText: j.introText ?? DEFAULTS.introText,
        historyText: j.historyText ?? DEFAULTS.historyText,
        mission: j.mission ?? DEFAULTS.mission,
        vision: j.vision ?? DEFAULTS.vision,
        principalName: j.principalName ?? "",
        principalTitle: j.principalTitle ?? "Principal",
        principalMessage: j.principalMessage ?? "",
        principalImageUrl: j.principalImageUrl ?? "",
        valuesText,
      });
    }
    setLoading(false);
  }).catch(()=>setLoading(false)); },[]);

  async function upload(file: File){
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch("/api/admin/upload",{method:"POST",body:fd});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){ setMsg(j.message||"Upload failed."); setDetails(""); return; }
    setForm(f=>({...f, principalImageUrl:j.url})); setMsg("Image uploaded — click Save to apply."); setDetails("");
  }

  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg(""); setDetails("");
    const raw = form.valuesText.trim();
    let valuesJson: string;
    if (!raw) valuesJson = JSON.stringify(["Discipline","Integrity","Respect","Creativity","Responsibility","Lifelong Learning"]);
    else if (raw.startsWith("[")) {
      try { const v=JSON.parse(raw); if(!Array.isArray(v)) throw new Error(); valuesJson = JSON.stringify(v); } catch{ setMsg("Core Values format error."); setDetails('Use comma-separated like: Discipline, Integrity, Respect — or JSON like ["Discipline","Integrity"]'); setSaving(false); return; }
    } else {
      const arr = raw.split(",").map(s=>s.trim()).filter(Boolean);
      valuesJson = JSON.stringify(arr);
    }

    const payload = {
      introTitle: form.introTitle,
      introText: form.introText,
      historyText: form.historyText,
      mission: form.mission,
      vision: form.vision,
      principalName: form.principalName,
      principalTitle: form.principalTitle,
      principalMessage: form.principalMessage,
      principalImageUrl: form.principalImageUrl,
      valuesJson,
    };

    const res=await fetch("/api/admin/about-content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){
      // Show which field failed — from API errors map
      if (j.errors) {
        const lines = Object.entries(j.errors as Record<string,string>).map(([k,v])=> `${k}: ${v}`).join(" | ");
        setMsg(j.message || "Validation failed.");
        setDetails(lines || JSON.stringify(j.errors));
      } else {
        setMsg(j.message||"Failed to save.");
        setDetails("");
      }
    } else {
      setMsg("Saved successfully.");
      setDetails("");
    }
    setSaving(false);
  }

  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-primary">About Page</h1>
      <p className="text-sm text-text-muted">Fields marked in the form are validated — leave principal fields empty to hide that section on the public site.</p>
      {msg && <div className={`mt-3 rounded-xl px-3 py-2 text-sm ${msg.includes("Saved")||msg.includes("uploaded")?"bg-green-50 border border-green-200 text-green-800":"bg-red-50 border border-red-200 text-error"}`}>{msg}{details ? <span className="block text-xs mt-1 opacity-90">{details}</span> : null}</div>}
      <form onSubmit={save} className="mt-4 bg-white rounded-2xl border p-5 grid gap-4">
        <div><label className="text-sm font-medium">Intro Title <span className="text-error">*</span></label><input value={form.introTitle} onChange={e=>setForm({...form,introTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required /></div>
        <div><label className="text-sm font-medium">Intro Text <span className="text-error">*</span></label><textarea value={form.introText} onChange={e=>setForm({...form,introText:e.target.value})} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required /></div>
        <div><label className="text-sm font-medium">History <span className="text-error">*</span></label><textarea value={form.historyText} onChange={e=>setForm({...form,historyText:e.target.value})} rows={4} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required /></div>
        <div><label className="text-sm font-medium">Mission <span className="text-error">*</span></label><textarea value={form.mission} onChange={e=>setForm({...form,mission:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required /></div>
        <div><label className="text-sm font-medium">Vision <span className="text-error">*</span></label><textarea value={form.vision} onChange={e=>setForm({...form,vision:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required /></div>
        <div><label className="text-sm font-medium">Principal Name <span className="text-text-muted font-normal">(optional)</span></label><input value={form.principalName} onChange={e=>setForm({...form,principalName:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Principal Title <span className="text-text-muted font-normal">(optional)</span></label><input value={form.principalTitle} onChange={e=>setForm({...form,principalTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div><label className="text-sm font-medium">Principal Message <span className="text-text-muted font-normal">(optional)</span></label><textarea value={form.principalMessage} onChange={e=>setForm({...form,principalMessage:e.target.value})} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></div>
        <div>
          <label className="text-sm font-medium">Principal Photo <span className="text-text-muted font-normal">(optional)</span></label>
          {form.principalImageUrl && <img src={imageSrc(form.principalImageUrl)} alt="Principal" className="mt-2 h-28 rounded-xl object-cover border" />}
          <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) upload(f);}} className="mt-2 w-full text-sm" />
          <input value={form.principalImageUrl} onChange={e=>setForm({...form,principalImageUrl:e.target.value})} placeholder="Or paste image URL" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Core Values <span className="text-text-muted font-normal">(comma-separated)</span></label>
          <textarea value={form.valuesText} onChange={e=>setForm({...form,valuesText:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder="Discipline, Integrity, Respect, Creativity, Responsibility, Lifelong Learning" />
          <p className="text-xs text-text-muted mt-1">Example: <code className="bg-slate-100 px-1 rounded">Discipline, Integrity, Respect</code></p>
        </div>
        <button type="submit" disabled={saving} className="bg-primary text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50">{saving?"Saving…":"Save Changes"}</button>
      </form>
    </div>
  );
}
