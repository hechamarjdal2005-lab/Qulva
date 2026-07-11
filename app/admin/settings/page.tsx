"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2 } from "lucide-react";

interface ImageField {
  key: string;
  label: string;
  bucket: string;
}

const IMAGE_FIELDS: ImageField[] = [
  { key: "logo_url", label: "Logo", bucket: "site-images" },
  { key: "hero_image", label: "Hero — Background Image", bucket: "site-images" },
  { key: "hero_feature_image", label: "Hero — Feature Image", bucket: "site-images" },
];

const TEXT_FIELDS = [
  { key: "brand_name", label: "Brand Name", type: "text" as const },
  { key: "tagline", label: "Tagline", type: "text" as const },
  { key: "copyright_text", label: "Copyright Text", type: "text" as const },
  { key: "footer_tagline", label: "Footer Tagline", type: "text" as const },
  { key: "social_links", label: "Social Links (JSON)", type: "json" as const },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from("site_settings").select("*");
    if (data) {
      const mapped: Record<string, string> = {};
      for (const row of data) {
        const val = row.value;
        mapped[row.key] =
          val === null ? "" : typeof val === "string" ? val : JSON.stringify(val);
      }
      setSettings(mapped);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      let parsedValue: unknown;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }
      await supabase
        .from("site_settings")
        .upsert({ key, value: parsedValue, updated_at: new Date().toISOString() });
    }
    setSaving(false);
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadImage(field: ImageField, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field.key);
    const fileName = `${field.key}-${Date.now()}-${file.name}`;
    const { data } = await supabase.storage.from(field.bucket).upload(fileName, file);

    if (data) {
      const { data: urlData } = supabase.storage
        .from(field.bucket)
        .getPublicUrl(data.path);
      updateSetting(field.key, urlData.publicUrl);
    }
    setUploading(null);
  }

  function removeImage(field: ImageField) {
    updateSetting(field.key, "");
  }

  function getImageUrl(key: string): string {
    const val = settings[key] || "";
    if (!val || val === "null" || val === '""') return "";
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === "string" ? parsed : "";
    } catch {
      return val;
    }
  }

  return (
    <div className="animate-fade-in max-w-[900px]">
      <div className="mb-12">
        <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
          Configuration
        </p>
        <h1 className="text-display-lg text-black">Settings</h1>
      </div>

      {loading ? (
        <p className="text-sm text-[#757575]">Loading...</p>
      ) : (
        <div className="space-y-8">
          {/* Image upload fields */}
          {IMAGE_FIELDS.map((field) => {
            const imageUrl = getImageUrl(field.key);
            return (
              <div key={field.key} className="bg-white border border-[#E5E5E5] p-6 md:p-8">
                <label className="text-label-sm uppercase text-[#757575] block mb-3">
                  {field.label}
                </label>
                {imageUrl ? (
                  <div className="relative border border-[#E5E5E5] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={field.label}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeImage(field)}
                      className="absolute top-2 right-2 bg-black/70 text-white p-2 hover:bg-black cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-3 bg-[#F5F5F5] border-2 border-dashed border-[#E5E5E5] hover:border-black p-8 cursor-pointer transition-all group">
                    <Upload className="w-5 h-5 text-[#757575] group-hover:text-black transition-colors" />
                    <span className="text-label-sm uppercase tracking-widest text-[#757575] group-hover:text-black transition-colors">
                      {uploading === field.key
                        ? "Uploading..."
                        : "Click to upload image"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => uploadImage(field, e)}
                      className="hidden"
                      disabled={uploading === field.key}
                    />
                  </label>
                )}
              </div>
            );
          })}

          {/* Text / JSON fields */}
          <div className="bg-white border border-[#E5E5E5] p-6 md:p-8 space-y-8">
            {TEXT_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="text-label-sm uppercase text-[#757575] block mb-1">
                  {field.label}
                </label>
                {field.type === "json" ? (
                  <textarea
                    value={settings[field.key] || "{}"}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    rows={5}
                    className="w-full border border-[#E5E5E5] p-3 text-xs font-mono focus:outline-none focus:border-black resize-y"
                  />
                ) : (
                  <input
                    value={settings[field.key] || ""}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white px-10 py-4 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
