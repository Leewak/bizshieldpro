import type { Metadata } from "next";
export const metadata: Metadata = { title: "Disclaimer | BizShieldPro", description: "Important disclaimers for BizShieldPro." };
export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#F0F4FF", fontFamily: "var(--font-space-grotesk)" }}>Disclaimer</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>Please read this disclaimer carefully before using BizShieldPro.</p>
      {[
        { h: "General Information Only", body: "All content on BizShieldPro is for general informational purposes only. Nothing on this site constitutes professional cybersecurity, legal, or compliance advice. Always consult a qualified cybersecurity professional for your specific situation." },
        { h: "No Guarantee of Security", body: "Using the tools and practices described on this site improves your security posture but cannot guarantee you will never experience a security incident. Cybersecurity is a continuous process, not a one-time fix." },
        { h: "Third-Party Tools", body: "We review third-party security tools. Prices, features, and capabilities change frequently. Verify current information directly with vendors before purchasing. We are not liable for changes made by third parties after our review is published." },
        { h: "Limitation of Liability", body: "To the fullest extent permitted by law, BizShieldPro shall not be liable for any damages arising from your use of this website or from security incidents that occur despite following our recommendations." },
        { h: "External Links", body: "We link to external sites for reference. We do not control external content and are not responsible for their accuracy or security practices." },
      ].map(({ h, body }) => (
        <div key={h} className="mb-8">
          <h2 className="text-base font-bold mb-2" style={{ color: "#CBD5E1" }}>{h}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
