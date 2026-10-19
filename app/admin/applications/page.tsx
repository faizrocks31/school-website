"use client";
import { useEffect, useState } from "react";
import {
  ENQUIRY_STATUSES,
  enquiryStatusStyles,
  compareEnquiries,
  type EnquiryStatus,
} from "@/lib/status";

type Row = { id:string; enquiryNumber:string; studentName:string; fatherName:string; studentAge:number; contactNumber:string; address:string; admissionClass:string; parentEmail:string|null; status:string; createdAt:string };

export default function AdminApplicationsPage(){
  const [rows,setRows]=useState<Row[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    fetch("/api/admin/applications").then(r=>r.json()).then(j=>{
      // Ordered once, when the data arrives: New first, Closed last. It is
      // deliberately NOT re-sorted when a status is changed below, so a row
      // stays put while the office edits it instead of jumping to the bottom
      // mid-click. The order is restored on the next load.
      if(Array.isArray(j)) setRows([...j].sort(compareEnquiries));
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);
  async function updateStatus(id:string, status:string){
    await fetch(`/api/admin/applications/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    setRows(rs=>rs.map(r=>r.id===id?{...r, status}:r));
  }

  // Count per status, so the office can see the pipeline at a glance.
  const counts = ENQUIRY_STATUSES.reduce<Record<string,number>>((acc,s)=>{
    acc[s.value] = rows.filter(r=>r.status===s.value).length; return acc;
  },{});

  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Admission Applications</h1>
      <p className="text-sm text-text-muted mt-1">Applications submitted through the Apply for Admission page. Update status as you contact families.</p>

      {rows.length>0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {ENQUIRY_STATUSES.map(s=>{
            const st = enquiryStatusStyles(s.value);
            return (
              <span key={s.value} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${st.pill}`}>
                {s.label}
                <span className="tabular-nums opacity-70">{counts[s.value] ?? 0}</span>
              </span>
            );
          })}
        </div>
      )}

      {rows.length===0 ? <p className="mt-6 text-sm text-text-muted bg-white border rounded-2xl p-6 text-center">No applications yet.</p> : (
        <div className="mt-4 space-y-3">
          {rows.map(r=>{
            const st = enquiryStatusStyles(r.status);
            return (
            <div key={r.id} className="bg-white rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-bold text-primary">{r.enquiryNumber}</p>
                  <p className="text-sm font-semibold">{r.studentName} — {r.admissionClass}, Age {r.studentAge}</p>
                  <p className="text-xs text-text-muted">Father: {r.fatherName} · {r.contactNumber} {r.parentEmail?`· ${r.parentEmail}`:""}</p>
                  <p className="text-xs text-text-muted mt-1">{r.address}</p>
                  <p className="text-xs text-text-muted">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* The select is the only place a status is shown — it is
                      already tinted to match the status, so a separate chip
                      above it just repeated the same word twice. */}
                  <select
                    value={r.status}
                    onChange={e=>updateStatus(r.id, e.target.value)}
                    aria-label={`Status for ${r.enquiryNumber}`}
                    className={`rounded-xl border px-2 py-1.5 text-sm font-medium ${st.select}`}
                  >
                    {ENQUIRY_STATUSES.map(s=>(
                      <option key={s.value} value={s.value as EnquiryStatus}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
