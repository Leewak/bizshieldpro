import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getPostsByCategory, formatDate, getCategoryLabel, getCategoryColor } from "@/lib/posts";
import type { Metadata } from "next";
import { AdsterraInline, AdsterraNative } from "@/components/Adsterra";
import { TOOLS } from "@/lib/tools";

export async function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  return cat ? { title: cat.label, alternates: { canonical: `/category/${slug}` } } : {};
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
        {slug === "tools" && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>{TOOLS.length} free security tools</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {TOOLS.map((t) => (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="p-4 rounded-xl transition-all hover:scale-[1.01]" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
                  <span className="text-xl mr-2" aria-hidden>{t.icon}</span><strong style={{ color: "#EEF2FF" }}>{t.title}</strong>
                  <span className="block text-xs mt-1" style={{ color: "#5B6899" }}>{t.short}</span>
                </Link>
              ))}
            </div>
            <h2 className="text-xl font-bold mt-10" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Tool guides and reviews</h2>
          </section>
        )}
        <AdsterraInline className="mb-8" />
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
        <AdsterraNative className="mt-12" />
      </div>
    </div>
  );
}
