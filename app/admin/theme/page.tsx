"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Theme } from "@/lib/theme";

/**
 * Admin → Theme.
 *
 * With this many palettes, a full preview on every card would be a very long
 * scroll, so the list is a compact grid of swatch tiles and the detailed
 * preview lives once, below, for whichever theme is selected.
 */
export default function AdminThemePage() {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [current, setCurrent] = useState("classic");
  const [selected, setSelected] = useState("classic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((r) => r.json())
      .then((j) => {
        if (Array.isArray(j?.themes)) setThemes(j.themes);
        if (j?.current) { setCurrent(j.current); setSelected(j.current); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true); setMsg(""); setErr("");
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selected }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(j.message || "Could not save the theme."); setSaving(false); return; }
      setCurrent(j.theme ?? selected);
      setMsg("Theme applied across the website.");
      // The colours are injected by the root layout on the server, so the RSC
      // tree has to be refetched for the change to show without a hard reload.
      router.refresh();
    } catch {
      setErr("Could not save the theme. Please try again.");
    }
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-text-muted">Loading…</p>;

  const dirty = selected !== current;
  const active = themes.find((t) => t.id === selected) ?? themes[0];

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold text-primary">Theme</h1>
      <p className="text-sm text-text-muted mt-1">
        Pick from {themes.length} colour schemes for the whole website — header, buttons, links and
        headings. The change applies to every public page and the admin panel.
      </p>

      {msg && <div className="mt-3 rounded-xl px-3 py-2 text-sm bg-green-50 border border-green-200 text-green-800">{msg}</div>}
      {err && <div role="alert" className="mt-3 rounded-xl px-3 py-2 text-sm bg-red-50 border border-red-200 text-error">{err}</div>}

      {/* Compact swatch grid. Each tile shows that theme's own three colours. */}
      <div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {themes.map((t) => {
          const isSelected = t.id === selected;
          const isCurrent = t.id === current;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => { setSelected(t.id); setMsg(""); setErr(""); }}
              aria-pressed={isSelected}
              title={t.note}
              className={`text-left rounded-xl border p-2.5 transition bg-white hover:border-slate-300 ${
                isSelected ? "border-primary ring-2 ring-primary/30" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-6 flex-1 rounded-md border border-black/5" style={{ background: t.primary }} />
                <span className="h-6 flex-1 rounded-md border border-black/5" style={{ background: t.secondary }} />
                <span className="h-6 flex-1 rounded-md border border-black/5" style={{ background: t.accent }} />
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-text-main truncate">{t.label}</span>
                {isCurrent && (
                  <span className="text-[9px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 rounded-full px-1.5 py-0.5 flex-shrink-0">
                    Live
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* One detailed preview for the selected theme, rather than 25 of them. */}
      {active && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-text-main">
              Preview — {active.label}
              {active.id === current && <span className="ml-2 text-xs font-normal text-text-muted">(currently live)</span>}
            </h2>
            <span className="text-[11px] font-mono text-text-muted">
              {active.primary} · {active.secondary} · {active.accent}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">{active.note}</p>

          {/* The real surfaces that carry the brand, using the theme's values. */}
          <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-3 py-2" style={{ background: active.primary }}>
              <span className="text-xs font-bold text-white">School Name</span>
              <span className="text-[10px] font-semibold rounded px-2 py-1" style={{ background: active.accent, color: active.primary }}>
                Apply for Admission
              </span>
            </div>
            <div className="px-3 py-3 bg-white">
              <p className="text-sm font-bold" style={{ color: active.primary }}>Heading text</p>
              <p className="text-xs text-slate-600 mt-1">
                Body copy stays neutral, so it reads the same in every theme.{" "}
                <span className="font-semibold underline" style={{ color: active.secondary }}>Links look like this</span>.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-white rounded-lg px-3 py-1.5" style={{ background: active.primary }}>
                  Primary button
                </span>
                <span className="text-[11px] font-semibold rounded-lg px-3 py-1.5" style={{ background: active.accent, color: active.primary }}>
                  Call to action
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {saving ? "Applying…" : dirty ? "Apply Theme" : "Saved"}
        </button>
        {dirty && (
          <button type="button" onClick={() => setSelected(current)} className="text-sm text-text-muted underline">
            Cancel
          </button>
        )}
        {!dirty && active && <span className="text-xs text-text-muted">“{active.label}” is live on the site.</span>}
      </div>
    </div>
  );
}
