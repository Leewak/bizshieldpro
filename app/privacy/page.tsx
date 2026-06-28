import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy | BizShieldPro", description: "How BizShieldPro collects, uses, and protects your personal information." };
const sections = [
  { h: "1. Information We Collect", body: "We collect information you provide (email for newsletter) and information collected automatically: IP address, browser type, pages viewed, time on site, and referral source. This is collected via Google Analytics and standard server logs." },
  { h: "2. How We Use Your Information", body: "We use collected data to operate and improve the website, send newsletters to subscribers, analyze traffic, and comply with legal obligations. We do not sell your personal information." },
  { h: "3. Google AdSense and Advertising", body: "We use Google AdSense which uses cookies to serve personalized ads. You can opt out at google.com/settings/ads. We do not control the data Google collects for advertising. Third-party vendors including Google may use cookies to serve ads based on your prior visits to our website." },
  { h: "4. Affiliate Links", body: "Some links are affiliate links. When you click and purchase, we may earn a commission. Affiliate partners may use tracking cookies. We do not receive your personal payment information through affiliate programs." },
  { h: "5. Cookies", body: "We use cookies for analytics (Google Analytics), advertising (Google AdSense), and remembering preferences. You can control cookies through your browser settings. See our Cookie Policy for full details." },
  { h: "6. Data Retention", body: "Newsletter data is retained until you unsubscribe. Analytics data follows Google Analytics 26-month default. We periodically review and delete unnecessary personal data." },
  { h: "7. Your Rights", body: "Depending on your location, you may have rights to access, correct, delete, or restrict your data. EU/UK residents have rights under GDPR. California residents have rights under CCPA. Contact us to exercise your rights." },
  { h: "8. Children's Privacy", body: "Our site is not directed at children under 13. We do not knowingly collect information from children. Contact us immediately if you believe we have." },
  { h: "9. Changes", body: "We may update this policy periodically. Changes are posted on this page with a revised date." },
  { h: "10. Contact", body: "Questions? Email us: hello@bizshieldpro.co" },
];
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#F0F4FF", fontFamily: "var(--font-space-grotesk)" }}>Privacy Policy</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>This Privacy Policy explains how BizShieldPro collects, uses, and shares information when you visit bizshieldpro.co.</p>
      {sections.map(({ h, body }) => (
        <div key={h} className="mb-8">
          <h2 className="text-base font-bold mb-2" style={{ color: "#CBD5E1" }}>{h}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
