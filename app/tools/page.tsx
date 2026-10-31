import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Cybersecurity Tools for Small Business",
  description: "21 free cybersecurity tools for small businesses: password and passphrase generators, breach and phishing checks, DNS, SPF/DMARC, email headers, CSP, JWT, hashing and encryption.",
  alternates: { canonical: "https://bizshieldpro.co/tools" },
};

import { TOOLS, GROUPS } from "@/lib/tools";


export default function ToolsPage() {
  return (
    <div className="pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <p className="text-sm font-semibold mb-3" style={{ color: "#3B82F6", letterSpacing: "0.08em", textTransform: "uppercase" }}>Free Tools</p>
        <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Free Cybersecurity Tools for Small Business
        </h1>
        <p className="text-lg mb-10" style={{ color: "#8A94C0" }}>
          {TOOLS.length} free tools. No account required. Most run entirely in your browser.
        </p>

        {GROUPS.map((g) => (
          <section key={g} className="mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-space-grotesk)", color: "#8A94C0", letterSpacing: "0.04em", textTransform: "uppercase" }}>{g}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {TOOLS.filter((t) => t.group === g).map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block p-5 rounded-2xl transition-all hover:scale-[1.01]" style={{ background: "#0D1020", border: "1px solid #1D2340" }}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0">{tool.icon}</div>
                    <div>
                      <h3 className="text-base font-bold mb-1" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>{tool.title}{tool.isNew && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#10B98122", color: "#10B981" }}>NEW</span>}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#8A94C0" }}>{tool.description}</p>
                      <span className="inline-block mt-2 text-sm font-semibold" style={{ color: tool.color }}>Launch tool →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 p-5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1D2340", color: "#5B6899" }}>
          <strong style={{ color: "#8A94C0" }}>Privacy note:</strong> Most tools run entirely in your browser. The few that look things up online (DNS, IP, breach and header checks) say so on the page and send only what the lookup needs. Nothing is stored or logged by us. These tools are designed for small business owners who need quick security checks without the risk of exposing sensitive information.
        </div>
      </div>
    </div>
  );
}
