"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Section {
  id: number;
  page: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  label: string | null;
  image_url: string | null;
  meta: Record<string, unknown>;
  sort_order: number;
}

const pages = ["home", "about", "blog", "contact", "waitlist", "footer", "metadata"];

export default function ContentPage() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchSections();
  }, [selectedPage]);

  async function fetchSections() {
    setLoading(true);
    const { data } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page", selectedPage)
      .order("sort_order");
    setSections((data as Section[]) || []);
    setLoading(false);
  }

  async function updateSection(section: Section) {
    setSaving(section.id);
    await supabase
      .from("page_sections")
      .update({
        title: section.title,
        subtitle: section.subtitle,
        body: section.body,
        label: section.label,
        image_url: section.image_url,
        meta: section.meta,
        sort_order: section.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id);
    setSaving(null);
  }

  function updateField(id: number, field: keyof Section, value: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  return (
    <div className="animate-fade-in max-w-[1200px]">
      <div className="mb-12">
        <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
          CMS
        </p>
        <h1 className="text-display-lg text-black">Content</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPage(p)}
            className={`px-4 py-2 text-label-sm uppercase tracking-widest transition-all cursor-pointer ${
              selectedPage === p
                ? "bg-black text-white"
                : "bg-white border border-[#E5E5E5] text-[#757575] hover:border-black hover:text-black"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[#757575]">Loading...</p>
      ) : sections.length === 0 ? (
        <p className="text-sm text-[#757575]">No sections for this page.</p>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white border border-[#E5E5E5] p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-headline-md text-black font-bold">
                  {section.section_key}
                </h3>
                <button
                  onClick={() => updateSection(section)}
                  disabled={saving === section.id}
                  className="bg-black text-white px-6 py-2 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving === section.id ? "Saving..." : "Save"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-label-sm uppercase text-[#757575] block mb-1">
                      Label
                    </label>
                    <input
                      value={section.label || ""}
                      onChange={(e) => updateField(section.id, "label", e.target.value)}
                      className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-label-sm uppercase text-[#757575] block mb-1">
                      Title
                    </label>
                    <input
                      value={section.title || ""}
                      onChange={(e) => updateField(section.id, "title", e.target.value)}
                      className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-label-sm uppercase text-[#757575] block mb-1">
                      Image URL
                    </label>
                    <input
                      value={section.image_url || ""}
                      onChange={(e) => updateField(section.id, "image_url", e.target.value)}
                      className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-label-sm uppercase text-[#757575] block mb-1">
                    Body
                  </label>
                  <textarea
                    value={section.body || ""}
                    onChange={(e) => updateField(section.id, "body", e.target.value)}
                    rows={6}
                    className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black resize-none font-mono"
                  />
                  <p className="text-xs text-[#757575] mt-1">
                    Use | to separate parts (Title|Description)
                  </p>
                </div>
              </div>

              {section.meta && Object.keys(section.meta).length > 0 && (
                <div className="mt-6">
                  <label className="text-label-sm uppercase text-[#757575] block mb-1">
                    Meta (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(section.meta, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id ? { ...s, meta: parsed } : s
                          )
                        );
                      } catch {}
                    }}
                    rows={10}
                    className="w-full border border-[#E5E5E5] p-3 text-xs font-mono focus:outline-none focus:border-black resize-y"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
