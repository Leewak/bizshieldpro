import type { Metadata } from "next";
export const metadata: Metadata = { title: "Affiliate Disclosure | BizShieldPro", description: "Our affiliate disclosure policy." };
export default function AffiliatePage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#F0F4FF", fontFamily: "var(--font-space-grotesk)" }}>Affiliate Disclosure</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>BizShieldPro discloses affiliate relationships in accordance with FTC guidelines.</p>
      {[
        { h: "FTC Disclosure", body: "Some links on this site are affiliate links. If you click a link and make a purchase, we may receive a commission at no additional cost to you." },
        { h: "What This Means for You", body: "You pay the same price whether or not you use our affiliate link. The commission comes from the vendor's marketing budget, not from you." },
        { h: "Our Review Standards", body: "We only recommend cybersecurity tools and services we have researched thoroughly. Affiliate relationships do not influence our ratings, rankings, or editorial opinions. We would rather lose a commission than recommend an inferior product." },
        { h: "Advertising", body: "This site also displays ads via Google AdSense. These ads are served automatically and are not individual endorsements." },
        { h: "Contact", body: "Questions about our affiliate relationships? Email hello@bizshieldpro.co" },
      ].map(({ h, body }) => (
        <div key={h} className="mb-8">
          <h2 className="text-base font-bold mb-2" style={{ color: "#CBD5E1" }}>{h}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
