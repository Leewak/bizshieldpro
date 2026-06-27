import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, posts, formatDate, getCategoryLabel, getCategoryColor } from "@/lib/posts";
import type { Metadata } from "next";

export async function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const catColor = getCategoryColor(post.category);

  return (
    <div className="pt-12 pb-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#2A3060" }}>
          <Link href="/" className="hover:text-bz-blue-light transition-colors" style={{ color: "#5B6899" }}>Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-bz-blue-light transition-colors" style={{ color: "#5B6899" }}>Guides</Link>
          <span>/</span>
          <span>{getCategoryLabel(post.category)}</span>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <span className="tag-pill" style={{ borderColor: `${catColor}40`, background: `${catColor}10`, color: catColor }}>{getCategoryLabel(post.category)}</span>
          {post.difficulty && <span className="tag-pill" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#10B981" }}>{post.difficulty}</span>}
          <span className="text-xs" style={{ color: "#2A3060" }}>{post.readTime} min · {formatDate(post.date)}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-[1.2] mb-5" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>{post.title}</h1>
        <div className="p-4 rounded-xl mb-8" style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>
          <p className="text-sm" style={{ color: "#3B82F6" }}>Affiliate disclosure: Some links may be affiliate links. We earn a small commission at no extra cost to you.</p>
        </div>
        <p className="text-lg mb-8 pb-8" style={{ color: "#5B6899", borderBottom: "1px solid #1D2340" }}>{post.excerpt}</p>
        <div className="prose-bz">
          <p>This guide is coming soon. We&apos;re testing and verifying everything before publishing. Subscribe to be notified when it goes live.</p>
          <h2>What you&apos;ll learn</h2>
          <p>We focus on practical, actionable steps you can take without a technical background — protecting your business from the most common threats.</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: "1px solid #1D2340" }}>
          {post.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
        </div>
      </div>
    </div>
  );
}
