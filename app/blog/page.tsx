import Link from "next/link";
import { posts, categories, formatDate, getCategoryLabel, getCategoryColor } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "All Guides — Small Business Cybersecurity", description: "Browse all cybersecurity guides for small business." };

export default function BlogPage() {
  return (
    <div className="pt-14 pb-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="mb-10">
          <div className="tag-pill mb-3 inline-flex">All Guides</div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Cybersecurity Guides</h1>
          <p className="mt-2 text-sm" style={{ color: "#2A3060" }}>{posts.length} guides · beginner-friendly</p>
        </div>
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="tag-pill"
              style={{ borderColor: `${cat.color}40`, background: `${cat.color}10`, color: cat.color }}>
              {cat.label}
            </Link>
          ))}
        </div>
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="flex items-start gap-4 p-4 rounded-xl group"
              style={{ border: "1px solid #1D2340", background: "#0D1020" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="tag-pill" style={{ borderColor: `${getCategoryColor(post.category)}40`, background: `${getCategoryColor(post.category)}10`, color: getCategoryColor(post.category) }}>
                    {getCategoryLabel(post.category)}
                  </span>
                  <span className="text-xs" style={{ color: "#2A3060" }}>{post.readTime} min</span>
                </div>
                <h3 className="font-semibold text-sm leading-snug group-hover:text-bz-blue-light transition-colors" style={{ color: "#CBD5F0" }}>{post.title}</h3>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "#3A4570" }}>{post.excerpt}</p>
              </div>
              <span className="text-xs shrink-0 mt-1" style={{ color: "#2A3060" }}>{formatDate(post.date)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
