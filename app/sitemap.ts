import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase-server";

const BASE_URL = "https://qulva.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("journal_articles")
    .select("id, updated_at, created_at")
    .order("id");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
    url: `${BASE_URL}/blog/${article.id}`,
    lastModified: new Date(article.updated_at ?? article.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
