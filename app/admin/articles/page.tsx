"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";

interface Article {
  id: number;
  number_str: string;
  category: string;
  category_label: string;
  title: string;
  summary: string;
  read_time: string;
  date: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const { data } = await supabase
      .from("journal_articles")
      .select("*")
      .order("id");
    setArticles((data as Article[]) || []);
    setLoading(false);
  }

  async function deleteArticle(id: number) {
    if (!confirm("Delete this article?")) return;
    await supabase.from("journal_articles").delete().eq("id", id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="animate-fade-in max-w-[1200px]">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-2">
            Manage
          </p>
          <h1 className="text-display-lg text-black">Articles</h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-black text-white px-6 py-3 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[#757575]">Loading...</p>
      ) : (
        <div className="bg-white border border-[#E5E5E5]">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#E5E5E5] text-label-sm uppercase tracking-widest text-[#757575] font-bold">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Read Time</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {articles.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-[#E5E5E5] last:border-0 items-center hover:bg-[#F5F5F5] transition-colors"
            >
              <div className="col-span-1 font-mono text-sm">{article.number_str}</div>
              <div className="col-span-3">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="text-body-md text-black font-semibold hover:underline"
                >
                  {article.title}
                </Link>
              </div>
              <div className="col-span-2">
                <span className="text-xs uppercase tracking-widest bg-[#F5F5F5] border border-[#E5E5E5] px-2 py-1">
                  {article.category}
                </span>
              </div>
              <div className="col-span-2 text-sm text-[#757575]">{article.date}</div>
              <div className="col-span-2 text-sm text-[#757575]">{article.read_time}</div>
              <div className="col-span-2 flex justify-end gap-2">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="text-xs uppercase tracking-widest text-[#757575] hover:text-black px-3 py-1 border border-[#E5E5E5] hover:border-black transition-all"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 px-3 py-1 border border-[#E5E5E5] hover:border-red-500 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
