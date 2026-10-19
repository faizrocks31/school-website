"use client";
import { useEffect, useState } from "react";
import {
  MESSAGE_STATUSES,
  messageStatusStyles,
  compareMessages,
  type MessageStatus,
} from "@/lib/status";

type Row = { id:string; name:string; contactNumber:string; message:string; status:string; createdAt:string };

export default function AdminMessagesPage(){
  const [rows,setRows]=useState<Row[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    fetch("/api/admin/messages").then(r=>r.json()).then(j=>{
      // Ordered once, when the data arrives: New first, Closed last. Not
      // re-sorted when a status is changed, so the row stays under the cursor
      // instead of jumping away mid-edit.
      if(Array.isArray(j)) setRows([...j].sort(compareMessages));
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);
  async function updateStatus(id:string, status:string){
    await fetch(`/api/admin/messages/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    setRows(rs=>rs.map(r=>r.id===id?{...r, status}:r));
  }
  async function remove(id:string){
    if(!confirm("Delete this message permanently?")) return;
    await fetch(`/api/admin/messages/${id}`,{method:"DELETE"});
    setRows(rs=>rs.filter(r=>r.id!==id));
  }

  // Count per status, so the office can see what still needs an answer.
  const counts = MESSAGE_STATUSES.reduce<Record<string,number>>((acc,s)=>{
    acc[s.value] = rows.filter(r=>r.status===s.value).length; return acc;
  },{});

  if(loading) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Contact Messages</h1>
      <p className="text-sm text-text-muted mt-1">Messages submitted through the Contact Us page form.</p>

      {rows.length>0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {MESSAGE_STATUSES.map(s=>{
            const st = messageStatusStyles(s.value);
            return (
              <span key={s.value} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${st.pill}`}>
                {s.label}
                <span className="tabular-nums opacity-70">{counts[s.value] ?? 0}</span>
              </span>
            );
          })}
        </div>
      )}

      {rows.length===0 ? <p className="mt-6 text-sm text-text-muted bg-white border rounded-2xl p-6 text-center">No messages yet.</p> : (
        <div className="mt-4 space-y-3">
          {rows.map(r=>{
            const st = messageStatusStyles(r.status);
            return (
            <div key={r.id} className="bg-white rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    <a href={`tel:${r.contactNumber.replace(/[^\d+]/g,"")}`} className="hover:text-primary">{r.contactNumber}</a>
                  </p>
                  <p className="text-sm text-text-muted mt-2 whitespace-pre-wrap">{r.message}</p>
                  <p className="text-xs text-text-muted mt-2">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  {/* The select is the only place a status is shown — it is
                      already tinted to match the status, so a separate chip
                      next to it just repeated the same word twice. */}
                  <select
                    value={r.status}
                    onChange={e=>updateStatus(r.id, e.target.value)}
                    aria-label={`Status for message from ${r.name}`}
                    className={`rounded-xl border px-2 py-1.5 text-sm font-medium ${st.select}`}
                  >
                    {MESSAGE_STATUSES.map(s=>(
                      <option key={s.value} value={s.value as MessageStatus}>{s.label}</option>
                    ))}
                  </select>
                  <button onClick={()=>remove(r.id)} className="text-xs text-error underline">Delete</button>
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
