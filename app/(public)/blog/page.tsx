"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { DbArticle } from "@/lib/queries/articles";
import type { DbBlogCategory } from "@/lib/queries/categories";
import { Search, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [categories, setCategories] = useState<DbBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const [{ data: articles }, { data: categories }] = await Promise.all([
        supabase.from("journal_articles").select("*").order("id"),
        supabase.from("blog_categories").select("*").order("sort_order"),
      ]);
      setArticles((articles as DbArticle[]) || []);
      setCategories((categories as DbBlogCategory[]) || []);
      setLoading(false);
    }
    fetch();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategories = [
    { id: "all", label: "All Disciplines" },
    ...categories.filter((c) => c.id !== "all").map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <div className="animate-fade-in pt-32 pb-24 px-6 md:px-16 min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-8">
            <p className="text-label-sm uppercase tracking-[0.2em] text-[#757575] mb-4">
              THE RESEARCH ARCHIVE
            </p>
            <h1 className="text-display-lg text-black leading-tight mb-8">Clinical Journal</h1>
            <p className="text-body-lg text-[#757575] max-w-2xl leading-relaxed">
              Explore Peer-reviewed protocol frameworks and biological assessments developed in
              the Qulva bio-optimization labs.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-[#E5E5E5] mb-16">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-label-sm uppercase tracking-widest pb-1 cursor-pointer transition-colors ${
                  selectedCategory === cat.id
                    ? "text-black border-b-2 border-black font-bold"
                    : "text-[#757575] hover:text-black"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="SEARCH PROTOCOLS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-black py-2 pl-8 text-label-sm uppercase focus:ring-0 focus:outline-none focus:border-b-2 transition-all placeholder:text-[#D4D4D4] rounded-none text-black font-semibold"
            />
            <Search className="w-4 h-4 text-[#757575] absolute left-1 top-2.5" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <p className="text-label-sm uppercase tracking-widest text-[#757575]">Loading...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="flex flex-col gap-6 group"
              >
                {article.image_url && (
                  <div className="aspect-[16/9] bg-[#F5F5F5] overflow-hidden border border-[#E5E5E5]">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="thin-hairline transition-opacity group-hover:opacity-100"></div>
                <div className="flex justify-between items-start">
                  <span className="text-label-sm uppercase tracking-widest text-[#757575]">
                    {article.category_label}
                  </span>
                  <span className="text-label-sm text-[#757575]/70 font-mono">
                    {article.number_str}
                  </span>
                </div>
                <div>
                  <h4 className="text-headline-md text-black mb-4 group-hover:underline underline-offset-8 decoration-1 transition-all">
                    {article.title}
                  </h4>
                  <p className="text-body-md text-[#757575] line-clamp-3 leading-relaxed mb-6">
                    {article.summary}
                  </p>
                  <div className="flex gap-2 items-center text-label-sm uppercase tracking-widest text-[#757575] group-hover:text-black transition-colors font-semibold">
                    Read Protocol
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#F5F5F5] border border-[#E5E5E5]">
            <p className="text-label-sm uppercase tracking-widest text-[#757575]">
              No scientific matching entries found.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 text-label-sm uppercase tracking-widest underline text-black cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
