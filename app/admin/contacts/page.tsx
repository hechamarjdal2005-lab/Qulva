"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ContactEntry {
  id: string;
  name: string;
  email: string;
  vector: string;
  message: string;
  protocol_seq: string | null;
  created_at: string;
}

export default function ContactsPage() {
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries((data as ContactEntry[]) || []);
    setLoading(false);
  }

  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in max-w-[1200px]">
      <div className="mb-12">
        <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
          Submissions
        </p>
        <h1 className="text-display-lg text-black">Contacts</h1>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="SEARCH BY NAME OR EMAIL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 bg-white border border-[#E5E5E5] p-3 text-label-sm uppercase tracking-widest focus:outline-none focus:border-black"
        />
      </div>

      {loading ? (
        <p className="text-sm text-[#757575]">Loading...</p>
      ) : (
        <div className="bg-white border border-[#E5E5E5]">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#E5E5E5] text-label-sm uppercase tracking-widest text-[#757575] font-bold">
            <div className="col-span-2">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Vector</div>
            <div className="col-span-3">Message</div>
            <div className="col-span-2">Date</div>
          </div>
          {filtered.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelected(entry)}
              className="grid grid-cols-12 gap-4 p-4 border-b border-[#E5E5E5] last:border-0 hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <div className="col-span-2 text-sm font-semibold">{entry.name}</div>
              <div className="col-span-3 text-sm text-[#757575]">{entry.email}</div>
              <div className="col-span-2">
                <span className="text-xs uppercase tracking-widest bg-[#F5F5F5] border border-[#E5E5E5] px-2 py-1">
                  {entry.vector}
                </span>
              </div>
              <div className="col-span-3 text-sm text-[#757575] line-clamp-1">
                {entry.message}
              </div>
              <div className="col-span-2 text-xs text-[#757575] font-mono">
                {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-black p-8 md:p-12">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 text-black hover:opacity-70 cursor-pointer text-lg"
            >
              X
            </button>
            <div className="space-y-6">
              <div>
                <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
                  Contact Submission
                </p>
                <h3 className="text-headline-md text-black font-bold">{selected.name}</h3>
              </div>
              <div className="thin-hairline"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-label-sm uppercase text-[#757575] mb-1">Email</p>
                  <p className="text-sm text-black">{selected.email}</p>
                </div>
                <div>
                  <p className="text-label-sm uppercase text-[#757575] mb-1">Vector</p>
                  <p className="text-sm text-black uppercase">{selected.vector}</p>
                </div>
              </div>
              <div>
                <p className="text-label-sm uppercase text-[#757575] mb-1">Message</p>
                <p className="text-sm text-black leading-relaxed">{selected.message}</p>
              </div>
              {selected.protocol_seq && (
                <div>
                  <p className="text-label-sm uppercase text-[#757575] mb-1">Protocol</p>
                  <p className="text-sm text-black font-mono">{selected.protocol_seq}</p>
                </div>
              )}
              <p className="text-xs text-[#757575] font-mono">
                {new Date(selected.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
