"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface WaitlistEntry {
  id: string;
  email: string;
  queue_pos: number;
  sleep_hours: number | null;
  stress_level: string | null;
  vector: string | null;
  skin_concern: string | null;
  bio_score: number | null;
  created_at: string;
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data } = await supabase
      .from("waitlist_entries")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries((data as WaitlistEntry[]) || []);
    setLoading(false);
  }

  const filtered = entries.filter((e) =>
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  function exportCSV() {
    const headers = ["email", "queue_pos", "sleep_hours", "stress_level", "vector", "skin_concern", "bio_score", "created_at"];
    const rows = filtered.map((e) => headers.map((h) => (e as unknown as Record<string, unknown>)[h] ?? "").join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist.csv";
    a.click();
  }

  return (
    <div className="animate-fade-in max-w-[1200px]">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
            Entries
          </p>
          <h1 className="text-display-lg text-black">Waitlist</h1>
        </div>
        <button
          onClick={exportCSV}
          className="bg-white border border-[#E5E5E5] text-black px-6 py-3 text-label-sm uppercase tracking-widest hover:border-black transition-all cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="SEARCH BY EMAIL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 bg-white border border-[#E5E5E5] p-3 text-label-sm uppercase tracking-widest focus:outline-none focus:border-black"
        />
      </div>

      {loading ? (
        <p className="text-sm text-[#757575]">Loading...</p>
      ) : (
        <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-label-sm uppercase tracking-widest text-[#757575]">
                <th className="p-4 text-left font-bold">#</th>
                <th className="p-4 text-left font-bold">Email</th>
                <th className="p-4 text-left font-bold">Sleep</th>
                <th className="p-4 text-left font-bold">Stress</th>
                <th className="p-4 text-left font-bold">Vector</th>
                <th className="p-4 text-left font-bold">Score</th>
                <th className="p-4 text-left font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F5F5F5]">
                  <td className="p-4 font-mono text-sm">{entry.queue_pos}</td>
                  <td className="p-4 text-sm font-semibold">{entry.email}</td>
                  <td className="p-4 text-sm text-[#757575]">{entry.sleep_hours || "-"}h</td>
                  <td className="p-4 text-sm text-[#757575]">{entry.stress_level || "-"}</td>
                  <td className="p-4 text-sm text-[#757575]">{entry.vector || "-"}</td>
                  <td className="p-4 font-mono text-sm font-bold">{entry.bio_score || "-"}%</td>
                  <td className="p-4 text-xs text-[#757575] font-mono">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
