import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookie Policy | BizShieldPro", description: "How BizShieldPro uses cookies." };
export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#F0F4FF", fontFamily: "var(--font-space-grotesk)" }}>Cookie Policy</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>This policy explains how BizShieldPro uses cookies on bizshieldpro.co.</p>
      {[
        { h: "What Are Cookies?", body: "Cookies are small text files placed on your device when you visit a website. They help the site remember your actions and preferences." },
        { h: "Cookies We Use", body: "Essential cookies (site functionality), Analytics cookies (Google Analytics — anonymized traffic data), Advertising cookies (Google AdSense — personalized ads), and Affiliate tracking cookies (set by third-party affiliate programs when you click our links)." },
        { h: "Google Analytics", body: "Sets _ga (2-year), _gid (24-hour), _gat (1-minute) cookies for traffic analysis. Opt out at tools.google.com/dlpage/gaoptout." },
        { h: "Google AdSense", body: "Places advertising cookies to show relevant ads. Opt out of personalized ads at google.com/settings/ads." },
        { h: "How to Control Cookies", body: "Control cookies through your browser settings: Chrome — Settings > Privacy > Cookies. Firefox — Options > Privacy & Security. Safari — Preferences > Privacy." },
      ].map(({ h, body }) => (
        <div key={h} className="mb-8">
          <h2 className="text-base font-bold mb-2" style={{ color: "#CBD5E1" }}>{h}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
