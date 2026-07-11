"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWaitlist } from "@/components/Providers";
import { supabase } from "@/lib/supabase";
import type { DbArticle } from "@/lib/queries/articles";
import { ArrowRight, Instagram, Linkedin } from "lucide-react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const { openWaitlist } = useWaitlist();
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroFeatureImage, setHeroFeatureImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: articlesData } = await supabase
        .from("journal_articles")
        .select("*")
        .order("id")
        .limit(4);
      if (articlesData) setArticles(articlesData);

      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["social_links", "hero_image", "hero_feature_image"]);
      if (settingsData) {
        for (const row of settingsData) {
          if (row.key === "social_links" && row.value && typeof row.value === "object") {
            setSocialLinks(row.value as Record<string, string>);
          }
          if (row.key === "hero_image") {
            const val = row.value;
            const url = val === null ? null : typeof val === "string" ? val : String(val);
            if (url && url !== "null" && url !== '""' && url !== "") {
              setHeroImage(url);
            }
          }
          if (row.key === "hero_feature_image") {
            const val = row.value;
            const url = val === null ? null : typeof val === "string" ? val : String(val);
            if (url && url !== "null" && url !== '""' && url !== "") {
              setHeroFeatureImage(url);
            }
          }
        }
      }
    }
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      openWaitlist(email.trim());
      setEmail("");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <header className="min-h-screen flex items-center pt-32 pb-24 px-6 md:px-16 bg-white overflow-hidden relative">
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-center">
          <div className={`${heroFeatureImage ? "md:col-span-6" : "md:col-span-8"} flex flex-col justify-center`}>
            <h1 className="text-display-lg leading-[1.05] tracking-tight mb-12 text-black">
              Become the best version of yourself — through{" "}
              <span className="block font-bold">science.</span>
            </h1>
            <div className="w-16 h-1 bg-black mb-12"></div>
            <p className="text-body-lg text-[#757575] max-w-xl leading-relaxed">
              Redefining human performance with clinical precision. We provide the data, you
              define the outcome. No noise, just absolute biological truth.
            </p>
          </div>

          {heroFeatureImage && (
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[520px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                <Image
                  src={heroFeatureImage}
                  alt="Qulva Feature"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 520px"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {heroImage ? (
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Qulva Hero"
              className="w-full h-full object-cover opacity-[0.06]"
            />
          </div>
        ) : (
          <div className="absolute right-[-10%] top-[20%] opacity-[0.03] select-none pointer-events-none md:block hidden">
            <img
              alt="Qulva Watermark"
              className="w-[800px] hover:scale-105 transition-transform duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn-TRAhUnCP49ltKLp4DBzEby5vxXSob1PXhDhzwq0SRR6tp4YYRdG1GHAimX5VvCplzvIfTTeK1JR4fDwKS5dddkN1tsrTn10nHp5A-rjjXA6jY-ZuBpm6XLqfD_aSqtL5i3thJUSdlKp_0JdqYttuUuvOw4VP9Faj6LoptlQlAlUeEJ-PqLNGhBoFNqK1ZSWVATciM2aw57WbIkN8WVhM1aCCcCw7epSiX6V_dGEg6b9iBKnp7_OWPn63MDnhMqR6-My5R3Rtg"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </header>

      {/* Manifesto Section */}
      <section className="py-32 px-6 md:px-16 bg-black text-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-start-4 md:col-span-6 text-center">
              <p className="text-label-sm uppercase tracking-[0.2em] mb-12 opacity-50 font-semibold">
                The Manifesto
              </p>
              <h2 className="text-headline-lg leading-tight mb-8">
                We are not a beauty brand. <br className="hidden md:block" />
                We are a science and education company.
              </h2>
              <div className="w-24 h-[1px] bg-white/20 mx-auto mb-12"></div>
              <p className="text-body-lg text-white/70 leading-relaxed font-light">
                Our mission is to democratize clinical-grade longevity protocols. We strip away
                the marketing jargon and deliver objective, verifiable results for human
                optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From the Journal Section */}
      <section className="py-40 px-6 md:px-16 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <p className="text-label-sm uppercase tracking-widest text-[#757575] mb-4">
                The Archive
              </p>
              <h3 className="text-headline-lg text-black">From the Journal</h3>
            </div>
            <Link
              href="/blog"
              className="group flex items-center gap-2 text-label-sm uppercase tracking-widest border-b border-black pb-1"
            >
              View All entries
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
            {articles.map((article) => (
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
                  <p className="text-body-md text-[#757575] line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-40 px-6 md:px-16 bg-[#F5F5F5]" id="waitlist-section">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-headline-lg mb-6 text-black">Be the first to experience Qulva AI</h2>
            <p className="text-body-lg text-[#757575] leading-relaxed">
              Personalized human optimization insights, calculated by clinical datasets and your
              unique biomarkers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-grow group">
              <input
                className="w-full bg-transparent border-b border-black py-4 text-label-sm uppercase tracking-widest focus:ring-0 focus:outline-none focus:border-b-2 transition-all placeholder:text-[#D4D4D4] rounded-none text-black font-semibold"
                placeholder="EMAIL ADDRESS"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="bg-black text-white px-10 py-4 text-label-sm uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 rounded-none cursor-pointer"
              type="submit"
            >
              Join Waitlist
            </button>
          </form>
          <p className="mt-8 text-label-sm text-[10px] uppercase text-[#757575]/70 tracking-widest">
            Early access release expected Q4 2026
          </p>
        </div>
      </section>

      {/* Social proof journey section */}
      <section className="py-24 border-t border-[#E5E5E5] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col items-center">
          <p className="text-label-sm uppercase tracking-[0.3em] text-[#757575]/70 mb-12">
            Follow the journey
          </p>
          <div className="flex gap-12">
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="group text-[#757575] hover:text-black transition-colors" aria-label="Instagram">
                <Instagram className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </a>
            )}
            {socialLinks.tiktok && (
              <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="group text-[#757575] hover:text-black transition-colors" aria-label="TikTok">
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="group text-[#757575] hover:text-black transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
