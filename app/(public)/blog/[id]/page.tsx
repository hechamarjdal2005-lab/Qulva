import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { ChevronLeft, Clock, Calendar } from "lucide-react";

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("journal_articles")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!article) {
    notFound();
  }

  const { data: steps } = await supabase
    .from("protocol_steps")
    .select("*")
    .eq("article_id", article.id)
    .order("sort_order");

  return (
    <div className="animate-fade-in pt-32 pb-24 px-6 md:px-16 min-h-screen bg-white">
      <div className="max-w-[1000px] mx-auto">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-label-sm uppercase tracking-widest text-black hover:opacity-60 mb-12"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Journal
        </Link>

        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <span className="text-label-sm uppercase text-black font-semibold border-b-2 border-black pb-1">
              {article.category_label}
            </span>
            <span className="text-label-sm text-[#757575] font-mono">
              PROTOCOL {article.number_str}
            </span>
          </div>

          <h1 className="text-display-lg text-black mb-8 leading-tight">{article.title}</h1>

          {article.image_url && (
            <div className="aspect-[16/9] bg-[#F5F5F5] overflow-hidden border border-[#E5E5E5] my-8">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-8 text-label-sm text-[#757575] uppercase tracking-wider pb-6 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.read_time}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {article.date}
            </div>
          </div>
        </div>

        <div className="py-12 space-y-12">
          <p className="text-body-lg text-[#111111] leading-relaxed font-normal">
            {article.content}
          </p>

          {steps && steps.length > 0 && (
            <div className="space-y-8 bg-[#F5F5F5] p-8 md:p-12 border border-[#E5E5E5]">
              <div className="border-b-2 border-black pb-4">
                <span className="text-label-sm uppercase tracking-[0.2em] text-[#757575] block mb-2">
                  Action Plan
                </span>
                <h3 className="text-headline-md text-black font-bold uppercase">
                  Clinical Directives
                </h3>
              </div>

              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-1 text-headline-md text-black font-mono font-bold">
                      0{index + 1}/
                    </div>
                    <div className="md:col-span-11 space-y-2">
                      <h4 className="text-label-sm uppercase text-black font-bold tracking-wider">
                        {step.title}
                      </h4>
                      <p className="text-body-md text-[#5D5F5F] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {article.sources && article.sources.length > 0 && (
            <div className="space-y-6 bg-[#F5F5F5] p-8 md:p-12 border border-[#E5E5E5]">
              <div className="border-b-2 border-black pb-4">
                <span className="text-label-sm uppercase tracking-[0.2em] text-[#757575] block mb-2">
                  References
                </span>
                <h3 className="text-headline-md text-black font-bold uppercase">
                  Sources
                </h3>
              </div>

              <div className="space-y-4">
                {article.sources.map((source, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-1 text-headline-md text-black font-mono font-bold">
                      0{index + 1}/
                    </div>
                    <div className="md:col-span-11">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-md text-[#5D5F5F] underline underline-offset-4 decoration-[#E5E5E5] hover:decoration-black hover:text-black transition-all"
                      >
                        {source.title}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
