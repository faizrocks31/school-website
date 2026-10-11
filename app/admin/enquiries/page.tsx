"use client";
import { useEffect, useState } from "react";

type Row = { id:string; enquiryNumber:string; studentName:string; fatherName:string; studentAge:number; contactNumber:string; address:string; admissionClass:string; parentEmail:string|null; status:string; createdAt:string };

export default function AdminEnquiriesPage(){
  const [rows,setRows]=useState<Row[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{ fetch("/api/admin/enquiries").then(r=>r.json()).then(j=>{ if(Array.isArray(j)) setRows(j); setLoading(false);}).catch(()=>setLoading(false)); },[]);
  async function updateStatus(id:string, status:string){
    await fetch(`/api/admin/enquiries/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    setRows(rs=>rs.map(r=>r.id===id?{...r, status}:r));
  }
  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Admission Enquiries</h1>
      <p className="text-sm text-text-muted mt-1">View and manage enquiries. Update status as you contact families.</p>
      {rows.length===0 ? <p className="mt-6 text-sm text-text-muted bg-white border rounded-2xl p-6 text-center">No enquiries yet.</p> : (
        <div className="mt-4 space-y-3">
          {rows.map(r=>(
            <div key={r.id} className="bg-white rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-bold text-primary">{r.enquiryNumber}</p>
                  <p className="text-sm font-semibold">{r.studentName} — {r.admissionClass}, Age {r.studentAge}</p>
                  <p className="text-xs text-text-muted">Father: {r.fatherName} · {r.contactNumber} {r.parentEmail?`· ${r.parentEmail}`:""}</p>
                  <p className="text-xs text-text-muted mt-1">{r.address}</p>
                  <p className="text-xs text-text-muted">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <select value={r.status} onChange={e=>updateStatus(r.id, e.target.value)} className="rounded-xl border px-2 py-1.5 text-sm bg-white">
                  <option value="NEW">New</option><option value="CONTACTED">Contacted</option><option value="FOLLOW_UP">Follow-up</option><option value="CONVERTED">Converted</option><option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
