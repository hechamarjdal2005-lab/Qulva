"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2, Copy, Check } from "lucide-react";

interface ImageFile {
  id: string;
  name: string;
  url: string;
  created_at: string;
  size: number;
}

export default function MediaPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data } = await supabase.storage.from("site-images").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (data) {
      const imagesWithUrls = await Promise.all(
        data
          .filter((f) => f.name !== ".emptyFolderPlaceholder")
          .map(async (file) => {
            const { data: urlData } = supabase.storage
              .from("site-images")
              .getPublicUrl(file.name);
            return {
              id: file.id || file.name,
              name: file.name,
              url: urlData.publicUrl,
              created_at: file.created_at || "",
              size: file.metadata?.size || 0,
            };
          })
      );
      setImages(imagesWithUrls);
    }
    setLoading(false);
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from("site-images").upload(fileName, file);
    await fetchImages();
    setUploading(false);
  }

  async function deleteImage(name: string) {
    if (!confirm("Delete this image?")) return;
    await supabase.storage.from("site-images").remove([name]);
    setImages((prev) => prev.filter((i) => i.name !== name));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="animate-fade-in max-w-[1200px]">
      <div className="mb-12">
        <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
          Storage
        </p>
        <h1 className="text-display-lg text-black">Media</h1>
      </div>

      <div className="mb-8">
        <label className="flex items-center justify-center gap-3 bg-white border-2 border-dashed border-[#E5E5E5] hover:border-black p-12 cursor-pointer transition-all group">
          <Upload className="w-6 h-6 text-[#757575] group-hover:text-black transition-colors" />
          <span className="text-label-sm uppercase tracking-widest text-[#757575] group-hover:text-black transition-colors">
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-[#757575]">Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-[#757575]">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white border border-[#E5E5E5] group">
              <div className="aspect-video bg-[#F5F5F5] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#757575] truncate mb-2 font-mono">
                  {img.name}
                </p>
                <p className="text-xs text-[#757575] mb-3">
                  {formatSize(img.size)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(img.url)}
                    className="flex items-center gap-1 text-xs uppercase tracking-widest text-[#757575] hover:text-black px-3 py-1 border border-[#E5E5E5] hover:border-black transition-all cursor-pointer"
                  >
                    {copied === img.url ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copied === img.url ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => deleteImage(img.name)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 border border-[#E5E5E5] hover:border-red-500 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
