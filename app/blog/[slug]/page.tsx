import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, posts, formatDate, getCategoryLabel, getCategoryColor } from "@/lib/posts";
import type { Metadata } from "next";

const SITE_URL = "https://bizshieldpro.co";
const SITE_NAME = "BizShield Pro";
const AUTHOR = "BizShield Editorial Team";

export async function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author ?? AUTHOR }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.date,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const catColor = getCategoryColor(post.category);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author ?? AUTHOR },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` } },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags.join(", "),
    articleSection: getCategoryLabel(post.category),
    wordCount: post.wordCount ?? 1500,
  };

  const faqSchema = post.faq?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="pt-10 pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
            <Link href="/" className="hover:text-bz-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-bz-blue transition-colors">Guides</Link>
            <span>/</span>
            <span style={{ color: "#3A4570" }}>{getCategoryLabel(post.category)}</span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="tag-pill text-xs" style={{ borderColor: `${catColor}40`, background: `${catColor}10`, color: catColor }}>
              {getCategoryLabel(post.category)}
            </span>
            {post.difficulty && (
              <span className="tag-pill text-xs" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                {post.difficulty}
              </span>
            )}
            <span className="text-xs" style={{ color: "#3A4570" }}>{post.readTime} min read · {formatDate(post.date)}</span>
            {post.wordCount && <span className="text-xs" style={{ color: "#3A4570" }}>{post.wordCount.toLocaleString()} words</span>}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-[1.2] mb-6" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
            {post.title}
          </h1>

          {/* Author + date */}
          <div className="flex items-center gap-3 mb-8 pb-8" style={{ borderBottom: "1px solid #1D2340" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#2563EB", color: "#fff" }}>B</div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#CBD5F0" }}>{post.author ?? AUTHOR}</p>
              <p className="text-xs" style={{ color: "#3A4570" }}>Updated {formatDate(post.date)}</p>
            </div>
          </div>

          {/* AEO Quick Answer Box */}
          {post.quickAnswer && (
            <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(37,99,235,0.07)", border: "2px solid rgba(37,99,235,0.25)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#3B82F6" }}>Quick Answer</p>
              <p className="text-sm leading-relaxed" style={{ color: "#CBD5F0" }}>{post.quickAnswer}</p>
            </div>
          )}

          {/* Affiliate disclosure */}
          <div className="mb-8 p-3 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1D2340", color: "#3A4570" }}>
            <strong style={{ color: "#5B6899" }}>Affiliate disclosure:</strong> Some links below may earn us a commission at no extra cost to you. We only recommend tools we&apos;ve tested and trust.
          </div>

          {/* Lead affiliate CTA (top) */}
          {post.affiliates && post.affiliates[0] && (
            <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#3B82F6" }}>
                {post.affiliates[0].badge ?? "Recommended"}
              </p>
              <p className="font-bold mb-3" style={{ color: "#EEF2FF" }}>{post.affiliates[0].name}</p>
              <a href={post.affiliates[0].url} target="_blank" rel="noopener sponsored" className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90" style={{ background: "#2563EB", color: "#fff" }}>
                {post.affiliates[0].cta}
              </a>
            </div>
          )}

          {/* Hero image */}
          <div className="my-6 rounded-xl overflow-hidden" style={{ border: "1px solid #1D2340" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.heroImage?.src ?? `https://picsum.photos/seed/${post.slug}/900/380`}
              alt={post.title}
              className="w-full object-cover"
              style={{ maxHeight: 380 }}
            />
          </div>

          {/* Article body with sections */}
          <div className="prose-bz">
            <p className="text-lg" style={{ color: "#8A94C0" }}>{post.excerpt}</p>
            {post.sections?.map((section, i) => (
              <div key={i}>
                <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>{section.h2}</h2>
                {i % 2 !== 0 && (
                  <div className="my-5 rounded-xl overflow-hidden" style={{ border: "1px solid #1D2340" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.image?.src ?? `https://picsum.photos/seed/${post.slug}-${i}/900/360`}
                      alt={section.image?.alt ?? section.h2}
                      className="w-full object-cover"
                      style={{ maxHeight: 360 }}
                    />
                  </div>
                )}
                {section.paras.map((para, j) => <p key={j}>{para}</p>)}
                {section.list && (
                  <ul>
                    {section.list.map((item, k) => <li key={k}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
            {!post.sections && (
              <>
                <h2>Why Small Business Cybersecurity Matters More Than Ever</h2>
                <p>Cyberattacks on small businesses have increased by 300% since 2020. The average cost of a data breach for a business with fewer than 500 employees is $120,000 — enough to close most small companies.</p>
                <p>The good news: most attacks are preventable. The bad news: most small businesses skip the basics because they don&apos;t know where to start.</p>
              </>
            )}
          </div>

          {/* Mid affiliate CTA */}
          {post.affiliates && post.affiliates.length > 1 && (
            <div className="my-10 p-5 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#10B981" }}>
                {post.affiliates[1].badge ?? "Also Recommended"}
              </p>
              <p className="font-bold mb-1" style={{ color: "#EEF2FF" }}>{post.affiliates[1].name}</p>
              <a href={post.affiliates[1].url} target="_blank" rel="noopener sponsored" className="inline-block text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90 mt-2" style={{ background: "#10B981", color: "#fff" }}>
                {post.affiliates[1].cta}
              </a>
            </div>
          )}

          {/* FAQ Section */}
          {post.faq && post.faq.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Frequently Asked Questions</h2>
              <div className="space-y-4">
                {post.faq.map((item, i) => (
                  <div key={i} className="p-5 rounded-xl" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: "#CBD5F0" }}>{item.q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#5B6899" }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All affiliate CTAs (bottom) */}
          {post.affiliates && post.affiliates.length > 0 && (
            <div className="mt-12 pt-8" style={{ borderTop: "1px solid #1D2340" }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: "#5B6899", textTransform: "uppercase", letterSpacing: "0.1em" }}>Tools We Recommend</h3>
              <div className="space-y-3">
                {post.affiliates.map((aff, i) => (
                  <a key={i} href={aff.url} target="_blank" rel="noopener sponsored"
                    className="flex items-center justify-between p-4 rounded-xl group transition-all"
                    style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
                    <div>
                      {aff.badge && <span className="text-xs mb-0.5 block" style={{ color: "#3B82F6" }}>{aff.badge}</span>}
                      <span className="font-semibold text-sm group-hover:text-white transition-colors" style={{ color: "#CBD5F0" }}>{aff.name}</span>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-lg font-medium shrink-0 ml-4" style={{ background: "#2563EB", color: "#fff" }}>
                      {aff.cta.replace(" →", "")}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: "1px solid #1D2340" }}>
            {post.tags.map((tag) => <span key={tag} className="tag-pill text-xs">{tag}</span>)}
          </div>

          {/* Back link */}
          <div className="mt-10">
            <Link href="/blog" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "#3B82F6" }}>
              ← Back to All Guides
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
