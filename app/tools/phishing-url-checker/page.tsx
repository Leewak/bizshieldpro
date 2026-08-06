"use client";

import { useState } from "react";
import Link from "next/link";

const SUSPICIOUS_TLDS = ["zip", "mov", "top", "xyz", "gq", "ml", "tk", "cf", "country", "support", "click", "link", "work", "rest", "loan", "win"];
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly", "rebrand.ly", "shorturl.at"];
const BRANDS = ["paypal", "microsoft", "apple", "amazon", "google", "netflix", "bankofamerica", "wellsfargo", "chase", "facebook", "instagram", "dhl", "usps", "fedex", "irs", "docusign"];

type Flag = { severity: "high" | "medium" | "low"; text: string };

function analyzeUrl(input: string) {
  const flags: Flag[] = [];
  let parsed: URL | null = null;
  try {
    parsed = new URL(/^[a-z]+:\/\//i.test(input) ? input : `http://${input}`);
  } catch {
    return { flags: [{ severity: "high" as const, text: "This isn't a valid URL." }], parsed: null };
  }

  const host = parsed.hostname.toLowerCase();
  const full = input.toLowerCase();

  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    flags.push({ severity: "high", text: "The domain is a raw IP address — legitimate businesses virtually never link directly to an IP." });
  }
  if (host.includes("xn--")) {
    flags.push({ severity: "high", text: "Punycode encoding detected — often used to create lookalike domains with foreign characters that visually mimic a trusted brand." });
  }
  if (input.includes("@") && parsed.username) {
    flags.push({ severity: "high", text: `Contains an "@" before the real domain — everything before "@" is decoration; the browser actually navigates to "${host}".` });
  }
  const subdomainCount = host.split(".").length - 2;
  if (subdomainCount >= 3) {
    flags.push({ severity: "medium", text: `Unusually many subdomains (${host}) — a common trick to bury a suspicious base domain.` });
  }
  const tld = host.split(".").pop() || "";
  if (SUSPICIOUS_TLDS.includes(tld)) {
    flags.push({ severity: "medium", text: `Uses the .${tld} TLD, which is disproportionately used for spam and phishing (not proof alone, but worth extra caution).` });
  }
  if (SHORTENERS.some((s) => host === s || host.endsWith("." + s))) {
    flags.push({ severity: "medium", text: "This is a link-shortener URL — the real destination is hidden. Expand it with the shortener's preview feature before clicking." });
  }
  const hyphenCount = (host.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    flags.push({ severity: "low", text: `Domain contains ${hyphenCount} hyphens — legitimate brand domains rarely use this many.` });
  }
  const brandInPath = BRANDS.filter((b) => full.includes(b));
  const brandInDomain = BRANDS.filter((b) => host.replace(/[.-]/g, "").includes(b));
  const registrable = host.split(".").slice(-2).join(".");
  brandInPath.forEach((b) => {
    const brandOwnsIt = registrable.replace(/[.-]/g, "").startsWith(b);
    if (!brandOwnsIt && brandInDomain.includes(b) === false) {
      flags.push({ severity: "high", text: `Mentions "${b}" but the actual domain is "${registrable}" — not an official ${b} domain. This is a classic brand-impersonation pattern.` });
    }
  });
  if (parsed.port && !["80", "443", ""].includes(parsed.port)) {
    flags.push({ severity: "low", text: `Uses a non-standard port (${parsed.port}) — unusual for a normal business page.` });
  }
  if (parsed.protocol !== "https:") {
    flags.push({ severity: "medium", text: "Not using HTTPS — any data entered on this page could be intercepted, and browsers will flag it as insecure." });
  }

  return { flags, parsed };
}

export default function PhishingUrlChecker() {
  const [input, setInput] = useState("");
  const [analyzed, setAnalyzed] = useState<ReturnType<typeof analyzeUrl> | null>(null);

  const check = () => {
    if (!input.trim()) return;
    setAnalyzed(analyzeUrl(input.trim()));
  };

  const high = analyzed?.flags.filter((f) => f.severity === "high").length || 0;
  const medium = analyzed?.flags.filter((f) => f.severity === "medium").length || 0;
  const verdict = !analyzed ? null :
    high > 0 ? { l: "High Risk", c: "#EF4444" } :
    medium > 0 ? { l: "Use Caution", c: "#F97316" } :
    analyzed.flags.length > 0 ? { l: "Minor Flags", c: "#EAB308" } :
    { l: "No Red Flags Found", c: "#10B981" };

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Phishing URL Checker</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Phishing URL Checker
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Paste any link before you click it. Scans for IP-literal hosts, punycode lookalikes, brand impersonation, link shorteners, and other common phishing patterns.
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Parsed entirely in your browser — the URL is never sent anywhere
        </div>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Paste a suspicious link here..."
            className="flex-1 px-5 py-4 rounded-xl text-sm outline-none"
            style={{ background: "#0D1020", border: "2px solid #1D2340", color: "#EEF2FF", fontFamily: "monospace" }}
            spellCheck={false}
          />
          <button onClick={check} disabled={!input.trim()} type="button"
            className="text-sm font-semibold px-5 rounded-lg transition-all disabled:opacity-40"
            style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
            Check
          </button>
        </div>

        {analyzed && verdict && (
          <>
            <div className="p-5 rounded-xl mb-6 flex items-center justify-between" style={{ background: verdict.c + "12", border: `1px solid ${verdict.c}40` }}>
              <span className="font-bold" style={{ color: verdict.c, fontFamily: "var(--font-space-grotesk)" }}>{verdict.l}</span>
              <span className="text-xs" style={{ color: "#5B6899" }}>{analyzed.flags.length} flag{analyzed.flags.length === 1 ? "" : "s"}</span>
            </div>

            {analyzed.flags.length > 0 ? (
              <div className="space-y-3 mb-6">
                {analyzed.flags.map((f, i) => (
                  <div key={i} className="p-4 rounded-xl flex items-start gap-3" style={{
                    background: f.severity === "high" ? "rgba(239,68,68,0.08)" : f.severity === "medium" ? "rgba(249,115,22,0.08)" : "rgba(234,179,8,0.08)",
                    border: `1px solid ${f.severity === "high" ? "rgba(239,68,68,0.3)" : f.severity === "medium" ? "rgba(249,115,22,0.3)" : "rgba(234,179,8,0.3)"}`,
                  }}>
                    <span>{f.severity === "high" ? "🚫" : f.severity === "medium" ? "⚠️" : "ℹ️"}</span>
                    <p className="text-sm" style={{ color: "#CBD5F0" }}>{f.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl mb-6" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <p className="text-sm" style={{ color: "#6EE7B7" }}>✓ No common phishing patterns detected. That doesn&apos;t guarantee it&apos;s safe — heuristics can&apos;t see the actual page content. Still verify the sender before entering any credentials.</p>
              </div>
            )}

            <div className="p-4 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1D2340", color: "#5B6899" }}>
              This is pattern-based detection, not a real-time threat feed. A clean result doesn&apos;t guarantee safety, and a flagged result doesn&apos;t guarantee malice — always verify unexpected links independently.
            </div>
          </>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>How to Spot a Phishing Link Yourself</h2>
          <p style={{ color: "#8A94C0" }}>
            The single most reliable check: hover over (don&apos;t click) any link and look at the actual destination shown in your browser or email client&apos;s status bar. Phishing links almost always reveal themselves here — a domain that doesn&apos;t match the company it claims to be from, an IP address, or a string of random characters before the real domain.
          </p>
          <p style={{ color: "#8A94C0" }}>
            Attackers exploit the fact that most people read a URL left to right and stop at the first familiar word. <code>paypal.com.security-verify.xyz</code> is not a PayPal domain — the part that matters is the last two segments before the path (<code>security-verify.xyz</code>), not whatever comes before it.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>If You Already Clicked</h2>
          <p style={{ color: "#8A94C0" }}>
            Don&apos;t enter any credentials on the page. If you already did, change that password immediately (use our{" "}
            <Link href="/tools/password-generator" style={{ color: "#3B82F6" }}>Password Generator</Link>{" "}
            for the replacement) and check whether it&apos;s appeared in a breach with our{" "}
            <Link href="/tools/leaked-password-checker" style={{ color: "#3B82F6" }}>Leaked Password Checker</Link>. If it was a work account, report it to your IT/security contact right away — early reporting is what limits the damage.
          </p>
        </div>
      </div>
    </div>
  );
}
