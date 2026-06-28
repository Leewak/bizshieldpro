import { MetadataRoute } from "next";
import { posts, categories } from "@/lib/posts";

const BASE = "https://bizshieldpro.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const postUrls = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: p.featured ? 0.9 : 0.8,
  }));
  const catUrls = categories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...postUrls,
    ...catUrls,
  ];
}
