import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Use | BizShieldPro", description: "Terms and conditions for using BizShieldPro." };
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <p className="text-xs mb-4" style={{ color: "#4A5580" }}>Last updated: June 2026</p>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#F0F4FF", fontFamily: "var(--font-space-grotesk)" }}>Terms of Use</h1>
      <p className="mb-10 text-sm" style={{ color: "#6B7DB8" }}>By using bizshieldpro.co, you agree to these terms.</p>
      {[
        { h: "1. Acceptance", body: "By accessing this website you agree to these terms. If you do not agree, do not use this site." },
        { h: "2. Intellectual Property", body: "All content is the property of BizShieldPro unless otherwise noted. You may not reproduce or distribute our content without written permission. Excerpts with attribution and link-back are permitted." },
        { h: "3. Permitted Use", body: "This site is for personal, non-commercial informational use. You may not scrape content in bulk, republish without permission, or interfere with site operations." },
        { h: "4. Disclaimer of Warranties", body: "This website is provided 'as is'. We disclaim all warranties to the fullest extent permitted by law." },
        { h: "5. Limitation of Liability", body: "We shall not be liable for any damages arising from your use of this website." },
        { h: "6. Changes", body: "We may modify these Terms at any time. Continued use constitutes acceptance." },
        { h: "7. Contact", body: "Questions? Email guifrhi.khalid@gmail.com" },
      ].map(({ h, body }) => (
        <div key={h} className="mb-8">
          <h2 className="text-base font-bold mb-2" style={{ color: "#CBD5E1" }}>{h}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#6B7DB8" }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
