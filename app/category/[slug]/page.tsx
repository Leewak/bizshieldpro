import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getPostsByCategory, formatDate, getCategoryLabel, getCategoryColor } from "@/lib/posts";
import type { Metadata } from "next";

export async function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  return cat ? { title: `${cat.label} — BizShield Pro` } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const catPosts = getPostsByCategory(slug);

  return (
    <div className="pt-14 pb-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <Link href="/blog" className="text-xs mb-6 block" style={{ color: "#5B6899" }}>← All Guides</Link>
        <span className="tag-pill mb-3 inline-flex" style={{ borderColor: `${cat.color}40`, background: `${cat.color}10`, color: cat.color }}>{cat.label}</span>
        <h1 className="text-3xl font-bold mt-2 mb-1" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>{cat.label}</h1>
        <p className="text-sm mb-10" style={{ color: "#2A3060" }}>{catPosts.length} guides</p>
        <div className="space-y-3">
          {catPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="flex items-start gap-4 p-4 rounded-xl group"
              style={{ border: "1px solid #1D2340", background: "#0D1020" }}>
              <div className="flex-1">
                <h3 className="font-semibold text-sm leading-snug group-hover:text-bz-blue-light transition-colors mb-1" style={{ color: "#CBD5F0" }}>{post.title}</h3>
                <p className="text-xs" style={{ color: "#3A4570" }}>{post.readTime} min · {formatDate(post.date)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
