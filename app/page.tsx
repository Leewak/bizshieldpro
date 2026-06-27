import Link from "next/link";
import { posts, getFeaturedPosts, categories, formatDate, getCategoryLabel, getCategoryColor } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BizShield Pro — Cybersecurity Made Simple for Small Business",
  description: "Practical cybersecurity guides for small business owners. Protect your business without needing an IT team.",
};

export default function HomePage() {
  const featured = getFeaturedPosts();
  const latest = posts.filter((p) => !p.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5), transparent)" }} />
        <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-mono" style={{ border: "1px solid rgba(37,99,235,0.35)", background: "rgba(37,99,235,0.1)", color: "#3B82F6" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} />
              No IT department required
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-5" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
              Cybersecurity for small business.{" "}
              <span style={{ color: "#3B82F6" }}>Without the jargon.</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "#5B6899" }}>
              Practical guides, checklists, and tool reviews to protect your business from cyber threats — written for owners, not IT professionals.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/blog" className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
                All Guides
              </Link>
              <Link href="/category/checklists" className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ border: "1px solid #1D2340", color: "#A8B4D8", fontFamily: "var(--font-space-grotesk)" }}>
                Security Checklists
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Threat level bar */}
      <section style={{ background: "#0D1020", borderTop: "1px solid #1D2340", borderBottom: "1px solid #1D2340" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-wrap gap-6 items-center">
            {[["Phishing up 60% in 2025", "#EF4444"], ["Ransomware avg cost: $200K", "#EF4444"], ["89% of SMBs lack basic 2FA", "#F59E0B"]].map(([label, color]) => (
              <div key={label} className="flex items-center gap-2 text-xs" style={{ color: "#5B6899" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className="font-bold text-xl mb-8" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Start Here</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featured.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block rounded-xl p-6 transition-all duration-200 hover:border-blue-500/40"
                style={{ border: "1px solid #1D2340", background: "#111525" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="tag-pill">{getCategoryLabel(post.category)}</span>
                  {post.difficulty && (
                    <span className="tag-pill" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                      {post.difficulty}
                    </span>
                  )}
                </div>
                <h3 className="font-bold leading-snug mb-3 group-hover:text-bz-blue-light transition-colors" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", fontSize: "1.05rem" }}>{post.title}</h3>
                <p className="text-sm mb-4" style={{ color: "#5B6899" }}>{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#2A3060" }}>{formatDate(post.date)}</span>
                  <span className="text-xs font-semibold" style={{ color: "#3B82F6" }}>{post.readTime} min →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="py-10 pb-20" style={{ borderTop: "1px solid #0D1020" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className="font-bold text-xl mb-8" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Latest Guides</h2>
          <div className="space-y-3">
            {latest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-start gap-4 p-4 rounded-xl group transition-all duration-200 hover:border-bz-blue/30"
                style={{ border: "1px solid #1D2340", background: "#0D1020" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tag-pill" style={{ borderColor: `${getCategoryColor(post.category)}40`, background: `${getCategoryColor(post.category)}10`, color: getCategoryColor(post.category) }}>
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="text-xs" style={{ color: "#2A3060" }}>{post.readTime} min read</span>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-bz-blue-light transition-colors" style={{ color: "#CBD5F0" }}>{post.title}</h3>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D2340" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/blog" className="text-sm font-semibold" style={{ color: "#3B82F6" }}>View all guides →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
