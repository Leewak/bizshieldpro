import Link from "next/link";
import { getTool, relatedTools, type ToolFaq } from "@/lib/tools";
import { AdsterraInline, AdsterraNative } from "@/components/Adsterra";

const H2 = { fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" } as const;

/** Shared page frame for every free tool: breadcrumb, H1, privacy note, the tool, how-to, FAQ (+JSON-LD), related tools, ads. */
export default function ToolShell({ slug, intro, privacy = "Runs in your browser — nothing you enter is sent to our servers", children, howTo, faq }: {
  slug: string; intro: React.ReactNode; privacy?: string | null; children: React.ReactNode;
  howTo?: { h: string; p: React.ReactNode }[]; faq?: ToolFaq[];
}) {
  const t = getTool(slug);
  const ld = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: t.title, description: t.description, url: `https://bizshieldpro.co/tools/${slug}`, applicationCategory: "SecurityApplication", operatingSystem: "Any (web browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    ...(faq?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
  ];
  return (
    <div className="pt-10 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link><span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link><span>/</span>
          <span style={{ color: "#3A4570" }}>{t.title}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ ...H2, letterSpacing: "-0.025em" }}>
          <span aria-hidden className="mr-2">{t.icon}</span>{t.title}
        </h1>
        <div className="mb-6 leading-relaxed" style={{ color: "#8A94C0" }}>{intro}</div>
        {privacy && (
          <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
            <span>🔒</span> {privacy}
          </div>
        )}
        {children}
        <AdsterraInline className="my-10" />
        {howTo?.length ? (
          <div className="mt-12">
            {howTo.map((s) => (
              <section key={s.h} className="mb-8">
                <h2 className="text-2xl font-bold mb-3" style={H2}>{s.h}</h2>
                <div className="leading-relaxed space-y-3" style={{ color: "#8A94C0" }}>{s.p}</div>
              </section>
            ))}
          </div>
        ) : null}
        {faq?.length ? (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4" style={H2}>Frequently asked questions</h2>
            {faq.map((f) => (
              <details key={f.q} className="py-3" style={{ borderBottom: "1px solid #1D2340" }}>
                <summary className="cursor-pointer font-semibold" style={{ color: "#CBD5F0" }}>{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#8A94C0" }}>{f.a}</p>
              </details>
            ))}
          </section>
        ) : null}
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-4" style={H2}>More free security tools</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedTools(slug).map((r) => (
              <Link key={r.slug} href={`/tools/${r.slug}`} className="p-4 rounded-xl transition-all hover:scale-[1.01]" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
                <span className="text-xl mr-2" aria-hidden>{r.icon}</span>
                <strong style={{ color: "#EEF2FF" }}>{r.title}</strong>
                <span className="block text-xs mt-1" style={{ color: "#5B6899" }}>{r.short}</span>
              </Link>
            ))}
          </div>
          <Link href="/tools" className="inline-block mt-4 text-sm font-semibold" style={{ color: "#3B82F6" }}>All {""}free tools →</Link>
        </section>
        <AdsterraNative className="mt-12" />
      </div>
    </div>
  );
}

/* small shared UI bits */
export const box = { background: "#0D1020", border: "1px solid #1D2340" } as const;
export const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600";
export const inputStyle = { background: "#0D1020", border: "1px solid #1D2340", color: "#EEF2FF" } as const;
export const btnStyle = { background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" } as const;
export const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } as const;
