"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface ProtocolStep {
  id?: number;
  title: string;
  description: string;
  sort_order: number;
}

interface ArticleSource {
  title: string;
  url: string;
}

interface Article {
  id: number;
  number_str: string;
  category: string;
  category_label: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  read_time: string;
  date: string;
  sources: ArticleSource[];
}

export default function ArticleEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [article, setArticle] = useState<Article>({
    id: 0,
    number_str: "01",
    category: "skin",
    category_label: "Skin Science",
    title: "",
    summary: "",
    content: "",
    image_url: null,
    read_time: "5 min read",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }),
    sources: [],
  });
  const [steps, setSteps] = useState<ProtocolStep[]>([]);
  const [sources, setSources] = useState<ArticleSource[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isNew) fetchArticle();
  }, [id]);

  async function fetchArticle() {
    const { data } = await supabase
      .from("journal_articles")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setArticle(data as Article);
    if (data?.sources) setSources(data.sources as ArticleSource[]);

    const { data: stepsData } = await supabase
      .from("protocol_steps")
      .select("*")
      .eq("article_id", id)
      .order("sort_order");
    if (stepsData) setSteps(stepsData as ProtocolStep[]);
  }

  async function handleSave() {
    setSaving(true);

    const articleData = {
      number_str: article.number_str,
      category: article.category,
      category_label: article.category_label,
      title: article.title,
      summary: article.summary,
      content: article.content,
      image_url: article.image_url,
      read_time: article.read_time,
      date: article.date,
      sources: sources,
      updated_at: new Date().toISOString(),
    };

    let articleId = article.id;

    if (isNew) {
      const { data } = await supabase
        .from("journal_articles")
        .insert(articleData)
        .select()
        .single();
      if (data) articleId = data.id;
    } else {
      await supabase.from("journal_articles").update(articleData).eq("id", id);
    }

    // Delete existing steps and re-insert
    await supabase.from("protocol_steps").delete().eq("article_id", articleId);

    if (steps.length > 0) {
      await supabase.from("protocol_steps").insert(
        steps.map((s, i) => ({
          article_id: articleId,
          title: s.title,
          description: s.description,
          sort_order: i + 1,
        }))
      );
    }

    setSaving(false);
    router.push("/admin/articles");
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { title: "", description: "", sort_order: prev.length + 1 },
    ]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, field: keyof ProtocolStep, value: string) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addSource() {
    setSources((prev) => [...prev, { title: "", url: "" }]);
  }

  function removeSource(index: number) {
    setSources((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSource(index: number, field: keyof ArticleSource, value: string) {
    setSources((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  async function uploadArticleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fileName = `article-${Date.now()}-${file.name}`;
    const { data } = await supabase.storage
      .from("article-images")
      .upload(fileName, file);

    if (data) {
      const { data: urlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(data.path);
      setArticle((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    }
    setUploadingImage(false);
  }

  function removeArticleImage() {
    setArticle((prev) => ({ ...prev, image_url: null }));
  }

  return (
    <div className="animate-fade-in max-w-[900px]">
      <Link
        href="/admin/articles"
        className="flex items-center gap-2 text-label-sm uppercase tracking-widest text-[#757575] hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Articles
      </Link>

      <div className="mb-12">
        <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
          {isNew ? "Create" : "Edit"}
        </p>
        <h1 className="text-headline-lg text-black">
          {isNew ? "New Article" : article.title || "Edit Article"}
        </h1>
      </div>

      <div className="bg-white border border-[#E5E5E5] p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-label-sm uppercase text-[#757575] block mb-1">Number</label>
            <input
              value={article.number_str}
              onChange={(e) => setArticle({ ...article, number_str: e.target.value })}
              className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-label-sm uppercase text-[#757575] block mb-1">Category</label>
            <select
              value={article.category}
              onChange={(e) => setArticle({ ...article, category: e.target.value })}
              className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
            >
              <option value="skin">Skin</option>
              <option value="sleep">Sleep</option>
              <option value="posture">Posture</option>
              <option value="longevity">Longevity</option>
            </select>
          </div>
          <div>
            <label className="text-label-sm uppercase text-[#757575] block mb-1">Category Label</label>
            <input
              value={article.category_label}
              onChange={(e) => setArticle({ ...article, category_label: e.target.value })}
              className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="text-label-sm uppercase text-[#757575] block mb-1">Title</label>
          <input
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-label-sm uppercase text-[#757575] block mb-2">Cover Image</label>
          {article.image_url ? (
            <div className="relative border border-[#E5E5E5] overflow-hidden">
              <img
                src={article.image_url}
                alt="Article cover"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={removeArticleImage}
                className="absolute top-2 right-2 bg-black/70 text-white p-2 hover:bg-black cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-3 bg-[#F5F5F5] border-2 border-dashed border-[#E5E5E5] hover:border-black p-8 cursor-pointer transition-all group">
              <Upload className="w-5 h-5 text-[#757575] group-hover:text-black transition-colors" />
              <span className="text-label-sm uppercase tracking-widest text-[#757575] group-hover:text-black transition-colors">
                {uploadingImage ? "Uploading..." : "Click to upload cover image"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={uploadArticleImage}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
          )}
        </div>

        <div>
          <label className="text-label-sm uppercase text-[#757575] block mb-1">Summary</label>
          <textarea
            value={article.summary}
            onChange={(e) => setArticle({ ...article, summary: e.target.value })}
            rows={3}
            className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black resize-none"
          />
        </div>

        <div>
          <label className="text-label-sm uppercase text-[#757575] block mb-1">Content</label>
          <textarea
            value={article.content}
            onChange={(e) => setArticle({ ...article, content: e.target.value })}
            rows={8}
            className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-label-sm uppercase text-[#757575] block mb-1">Read Time</label>
            <input
              value={article.read_time}
              onChange={(e) => setArticle({ ...article, read_time: e.target.value })}
              className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-label-sm uppercase text-[#757575] block mb-1">Date</label>
            <input
              value={article.date}
              onChange={(e) => setArticle({ ...article, date: e.target.value })}
              className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline-md text-black font-bold">Protocol Steps</h2>
          <button
            onClick={addStep}
            className="bg-white border border-[#E5E5E5] text-black px-4 py-2 text-label-sm uppercase tracking-widest hover:border-black transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white border border-[#E5E5E5] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-headline-md text-black font-mono font-bold">
                  0{index + 1}/
                </span>
                <button
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  value={step.title}
                  onChange={(e) => updateStep(index, "title", e.target.value)}
                  placeholder="Step title"
                  className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
                />
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(index, "description", e.target.value)}
                  placeholder="Step description"
                  rows={3}
                  className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline-md text-black font-bold">Sources</h2>
          <button
            onClick={addSource}
            className="bg-white border border-[#E5E5E5] text-black px-4 py-2 text-label-sm uppercase tracking-widest hover:border-black transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </button>
        </div>

        <div className="space-y-4">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-white border border-[#E5E5E5] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-headline-md text-black font-mono font-bold">
                  0{index + 1}/
                </span>
                <button
                  onClick={() => removeSource(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={source.title}
                  onChange={(e) => updateSource(index, "title", e.target.value)}
                  placeholder="Source title (e.g. Journal of Dermatology, 2023)"
                  className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
                />
                <input
                  value={source.url}
                  onChange={(e) => updateSource(index, "url", e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-[#E5E5E5] p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-10 py-4 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : isNew ? "Create Article" : "Save Changes"}
        </button>
        <Link
          href="/admin/articles"
          className="bg-white border border-[#E5E5E5] text-black px-10 py-4 text-label-sm uppercase tracking-widest hover:border-black transition-all"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
