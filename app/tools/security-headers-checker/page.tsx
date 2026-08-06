"use client";

import { useState } from "react";
import Link from "next/link";

const CHECKS = [
  { key: "strict-transport-security", label: "Strict-Transport-Security", weight: 20, fix: "Add HSTS to force HTTPS on every visit: Strict-Transport-Security: max-age=31536000; includeSubDomains" },
  { key: "content-security-policy", label: "Content-Security-Policy", weight: 25, fix: "Add a CSP to block unauthorized scripts/styles (mitigates XSS): start with a report-only policy and tighten it over time." },
  { key: "x-content-type-options", label: "X-Content-Type-Options", weight: 15, fix: "Add X-Content-Type-Options: nosniff to stop browsers from MIME-sniffing responses." },
  { key: "x-frame-options", label: "X-Frame-Options", weight: 15, fix: "Add X-Frame-Options: DENY (or use CSP frame-ancestors) to prevent clickjacking." },
  { key: "referrer-policy", label: "Referrer-Policy", weight: 10, fix: "Add Referrer-Policy: strict-origin-when-cross-origin to limit what's leaked to other sites." },
  { key: "permissions-policy", label: "Permissions-Policy", weight: 15, fix: "Add a Permissions-Policy to restrict access to camera, mic, geolocation, etc. by default." },
];

type Result = { status: number; finalUrl: string; headers: Record<string, string> };

export default function SecurityHeadersChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const check = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/security-headers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  };

  const headersLower = result ? Object.fromEntries(Object.entries(result.headers).map(([k, v]) => [k.toLowerCase(), v])) : {};
  const score = result ? CHECKS.reduce((sum, c) => sum + (headersLower[c.key] ? c.weight : 0), 0) : 0;
  const grade = score >= 90 ? { l: "A", c: "#10B981" } : score >= 70 ? { l: "B", c: "#3B82F6" } : score >= 50 ? { l: "C", c: "#EAB308" } : score >= 30 ? { l: "D", c: "#F97316" } : { l: "F", c: "#EF4444" };

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>Security Headers Checker</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          Security Headers Checker
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Check whether a website is sending the HTTP security headers that protect against clickjacking, XSS, and downgrade attacks — and get a letter grade.
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> We only fetch the URL you provide — nothing about you is stored or logged
        </div>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="yourdomain.com"
            className="flex-1 px-5 py-4 rounded-xl text-base outline-none"
            style={{ background: "#0D1020", border: "2px solid #1D2340", color: "#EEF2FF" }}
            spellCheck={false}
          />
          <button onClick={check} disabled={!url || loading} type="button"
            className="text-sm font-semibold px-5 rounded-lg transition-all disabled:opacity-40"
            style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
            {loading ? "Checking…" : "Check"}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-sm" style={{ color: "#FCA5A5" }}>{error}</p>
          </div>
        )}

        {result && (
          <>
            <div className="p-6 rounded-xl text-center mb-6" style={{ background: "#0D1020", border: `2px solid ${grade.c}60` }}>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#5B6899" }}>Grade</p>
              <p className="text-5xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: grade.c }}>{grade.l}</p>
              <p className="text-sm mt-2" style={{ color: "#8A94C0" }}>{score}/100 · HTTP {result.status}</p>
            </div>

            <div className="space-y-3 mb-8">
              {CHECKS.map((c) => {
                const present = !!headersLower[c.key];
                return (
                  <div key={c.key} className="p-4 rounded-xl" style={{ background: "#0D1020", border: `1px solid ${present ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: "#EEF2FF" }}>{c.label}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: present ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: present ? "#10B981" : "#EF4444" }}>
                        {present ? "Present" : "Missing"}
                      </span>
                    </div>
                    {present ? (
                      <p className="text-xs font-mono break-all" style={{ color: "#5B6899" }}>{headersLower[c.key]}</p>
                    ) : (
                      <p className="text-xs" style={{ color: "#8A94C0" }}>{c.fix}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Why Security Headers Matter</h2>
          <p style={{ color: "#8A94C0" }}>
            HTTP security headers are one-line instructions your server sends telling browsers how to treat your site — whether to allow it inside a frame, whether to run only HTTPS, and which sources of scripts and styles are trusted. Most are entirely free to add (a few lines in your server or CDN config) and close off classes of attacks like clickjacking and cross-site scripting without changing how your site looks or works.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Where to Add These Headers</h2>
          <p style={{ color: "#8A94C0" }}>
            If you&apos;re on Vercel, Netlify, or Cloudflare, these headers can be set in a config file or dashboard rule without touching application code. On a traditional server (Apache/Nginx), they go in your virtual host config. Start with Content-Security-Policy in report-only mode so you can see what it would block before enforcing it.
          </p>
        </div>
      </div>
    </div>
  );
}
