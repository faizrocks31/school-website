"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { imageSrc } from "@/lib/image-url";

type Slide = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  sortOrder: number;
  isActive: boolean;
};

const EMPTY = { imageUrl: "", title: "", subtitle: "", ctaLabel: "", ctaHref: "" };

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/admin/hero-slides");
    const j = await r.json().catch(() => []);
    if (Array.isArray(j)) setSlides(j);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function flash(m: string, isError = false) {
    if (isError) { setErr(m); setMsg(""); } else { setMsg(m); setErr(""); }
  }

  async function uploadImage(file: File) {
    setUploading(true); setErr(""); setMsg("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { flash(j.message || "Upload failed.", true); }
      else { setForm((f) => ({ ...f, imageUrl: j.url })); flash("Image uploaded — click Add slide to save it."); }
    } catch { flash("Upload failed. Please try again.", true); }
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(""); setMsg("");
    const url = editingId ? `/api/admin/hero-slides/${editingId}` : "/api/admin/hero-slides";
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      const lines = j.errors ? Object.entries(j.errors as Record<string, string>).map(([k, v]) => `${k}: ${v}`).join(" | ") : "";
      flash(lines ? `${j.message || "Validation failed."} — ${lines}` : (j.message || "Failed to save."), true);
    } else {
      flash(editingId ? "Slide updated." : "Slide added.");
      setForm(EMPTY); setEditingId(null); load();
    }
    setSaving(false);
  }

  async function toggleActive(s: Slide) {
    const res = await fetch(`/api/admin/hero-slides/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    if (res.ok) { flash(s.isActive ? "Slide hidden." : "Slide shown."); load(); }
    else flash("Could not update the slide.", true);
  }

  async function remove(s: Slide) {
    if (!confirm("Delete this slide? The image file itself is not deleted.")) return;
    const res = await fetch(`/api/admin/hero-slides/${s.id}`, { method: "DELETE" });
    if (res.ok) {
      flash("Slide deleted.");
      if (editingId === s.id) { setEditingId(null); setForm(EMPTY); }
      load();
    } else flash("Could not delete the slide.", true);
  }

  async function move(i: number, dir: -1 | 1) {
    const next = [...slides];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setSlides(next); // optimistic, so the list does not jump back while saving
    const res = await fetch("/api/admin/hero-slides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((s) => s.id) }),
    });
    if (!res.ok) flash("Could not save the new order.", true);
    load();
  }

  if (loading) return <p className="text-sm text-text-muted">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-primary">Home Hero Slideshow</h1>
      <p className="text-sm text-text-muted mt-1">
        Add photos for the rotating banner at the top of the Home page. With no slides, the Home page shows its normal
        static hero. Each slide is optional to fill in — an image alone works.
      </p>

      {msg ? <div className="mt-3 rounded-xl px-3 py-2 text-sm bg-green-50 border border-green-200 text-green-800">{msg}</div> : null}
      {err ? <div className="mt-3 rounded-xl px-3 py-2 text-sm bg-red-50 border border-red-200 text-error">{err}</div> : null}

      <form onSubmit={save} className="mt-4 bg-white rounded-2xl border p-5 grid gap-4">
        <p className="font-semibold text-sm">{editingId ? "Edit slide" : "Add a slide"}</p>

        <div>
          <label className="text-sm font-medium">Slide Image <span className="text-error">*</span></label>
          {form.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc(form.imageUrl)} alt="Slide preview" className="mt-2 h-32 w-full object-cover rounded-xl border" />
          ) : null}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={uploading}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }}
            className="mt-2 w-full text-sm"
          />
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="Or paste an image URL"
            className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
            required
          />
          <p className="text-xs text-text-muted mt-1">Wide photos work best (about 1600×800). Max 5 MB. {uploading ? "Uploading…" : ""}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Heading <span className="text-text-muted font-normal">(optional)</span></label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Admissions Open for 2026–27" className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium">Subheading <span className="text-text-muted font-normal">(optional)</span></label>
          <textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} rows={2} placeholder="A short line of supporting text." className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Button Label <span className="text-text-muted font-normal">(optional)</span></label>
            <input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="e.g. Apply Now" className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Button Link <span className="text-text-muted font-normal">(optional)</span></label>
            <input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} placeholder="e.g. /apply" className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving || uploading} className="bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add Slide"}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); setErr(""); setMsg(""); }} className="rounded-xl border px-5 py-2.5 text-sm font-medium">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {slides.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted bg-white border rounded-2xl p-6 text-center">No slides yet — the Home page is showing its static hero.</p>
      ) : (
        <div className="mt-6 grid gap-3">
          <p className="text-sm font-semibold text-text-main">Slides ({slides.length}) — shown in this order</p>
          {slides.map((s, i) => (
            <div key={s.id} className={`bg-white rounded-2xl border p-3 flex items-center gap-3 ${s.isActive ? "" : "opacity-60"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc(s.imageUrl)} alt="" className="h-16 w-24 object-cover rounded-lg border flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{s.title || <span className="text-text-muted italic">No heading</span>}</p>
                <p className="text-xs text-text-muted truncate">{s.subtitle || "—"}</p>
                {s.ctaLabel && s.ctaHref ? <p className="text-xs text-secondary truncate mt-0.5">{s.ctaLabel} → {s.ctaHref}</p> : null}
                {!s.isActive ? <p className="text-xs text-error mt-0.5">Hidden from the site</p> : null}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move slide earlier" className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === slides.length - 1} aria-label="Move slide later" className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => toggleActive(s)} aria-label={s.isActive ? "Hide slide" : "Show slide"} className="p-1.5 rounded-lg hover:bg-slate-100">{s.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                <button type="button" onClick={() => { setEditingId(s.id); setForm({ imageUrl: s.imageUrl, title: s.title, subtitle: s.subtitle, ctaLabel: s.ctaLabel, ctaHref: s.ctaHref }); setErr(""); setMsg(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-xs font-medium px-2">Edit</button>
                <button type="button" onClick={() => remove(s)} aria-label="Delete slide" className="p-1.5 rounded-lg hover:bg-red-50 text-error"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
