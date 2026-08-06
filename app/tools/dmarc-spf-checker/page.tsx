"use client";

import { useState } from "react";
import Link from "next/link";

const COMMON_SELECTORS = ["default", "google", "selector1", "selector2", "k1", "s1", "mx", "smtp", "dkim"];

async function queryTXT(name: string): Promise<string[]> {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=TXT`, {
    headers: { accept: "application/dns-json" },
  });
  if (!res.ok) throw new Error("DNS query failed");
  const json = await res.json();
  const answers = (json.Answer || []) as { data: string }[];
  return answers.map((a) => a.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""));
}

function analyzeSpf(records: string[]) {
  const spf = records.filter((r) => r.startsWith("v=spf1"));
  if (spf.length === 0) return { found: false, record: "", issues: ["No SPF record found — anyone can spoof your domain in the From: field."] };
  const issues: string[] = [];
  if (spf.length > 1) issues.push("Multiple SPF records found — this breaks SPF validation. RFC 7208 requires exactly one.");
  const record = spf[0];
  const lookups = (record.match(/include:|redirect=|\ba\b|\bmx\b|\bexists:/g) || []).length;
  if (lookups > 10) issues.push(`Approximately ${lookups} DNS lookup mechanisms — SPF fails validation above 10 lookups.`);
  if (record.includes("+all")) issues.push('Ends in "+all" — this allows ANY server to send as your domain. Should be "-all" or "~all".');
  else if (record.includes("?all")) issues.push('Ends in "?all" (neutral) — provides no real protection. Use "-all" (hard fail) or "~all" (soft fail).');
  return { found: true, record, issues };
}

function analyzeDmarc(records: string[]) {
  const dmarc = records.filter((r) => r.startsWith("v=DMARC1"));
  if (dmarc.length === 0) return { found: false, record: "", issues: ["No DMARC record found — SPF/DKIM failures aren't enforced or reported anywhere."] };
  const record = dmarc[0];
  const issues: string[] = [];
  const policyMatch = record.match(/p=(\w+)/);
  const policy = policyMatch ? policyMatch[1] : "none";
  if (policy === "none") issues.push('Policy is "p=none" — monitoring only, spoofed mail is NOT blocked. Move to quarantine or reject once reports look clean.');
  if (!record.includes("rua=")) issues.push("No aggregate report address (rua=) — you're not receiving visibility into who's sending mail as your domain.");
  return { found: true, record, policy, issues };
}

type DkimResult = { selector: string; found: boolean; record: string };

export default function DmarcSpfChecker() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [spfResult, setSpfResult] = useState<ReturnType<typeof analyzeSpf> | null>(null);
  const [dmarcResult, setDmarcResult] = useState<ReturnType<typeof analyzeDmarc> | null>(null);
  const [dkimResults, setDkimResults] = useState<DkimResult[]>([]);

  const check = async () => {
    const clean = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!clean) return;
    setLoading(true);
    setError("");
    setSpfResult(null);
    setDmarcResult(null);
    setDkimResults([]);
    try {
      const [spfTxt, dmarcTxt] = await Promise.all([
        queryTXT(clean),
        queryTXT(`_dmarc.${clean}`),
      ]);
      setSpfResult(analyzeSpf(spfTxt));
      setDmarcResult(analyzeDmarc(dmarcTxt));

      const selectorsToTry = selector.trim() ? [selector.trim(), ...COMMON_SELECTORS] : COMMON_SELECTORS;
      const dkimChecks = await Promise.all(
        selectorsToTry.slice(0, selector.trim() ? 6 : 5).map(async (s) => {
          try {
            const txt = await queryTXT(`${s}._domainkey.${clean}`);
            const rec = txt.find((r) => r.includes("v=DKIM1") || r.includes("p="));
            return { selector: s, found: !!rec, record: rec || "" };
          } catch {
            return { selector: s, found: false, record: "" };
          }
        })
      );
      setDkimResults(dkimChecks.filter((d) => d.found));
    } catch {
      setError("Couldn't look up that domain. Check the spelling and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-10 pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#5B6899" }}>
          <Link href="/" className="hover:text-bz-blue">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-bz-blue">Free Tools</Link>
          <span>/</span>
          <span style={{ color: "#3A4570" }}>SPF/DKIM/DMARC Checker</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF", letterSpacing: "-0.025em" }}>
          SPF, DKIM &amp; DMARC Checker
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "#8A94C0" }}>
          Check any domain&apos;s email authentication setup instantly — missing or misconfigured records are one of the most common reasons legitimate email lands in spam, and let attackers spoof your domain.
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs px-3 py-2 rounded-lg w-fit" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}>
          <span>🔒</span> Looks up public DNS records only — no login, no data stored
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="yourdomain.com"
            className="flex-1 px-5 py-4 rounded-xl text-base outline-none"
            style={{ background: "#0D1020", border: "2px solid #1D2340", color: "#EEF2FF" }}
            spellCheck={false}
          />
          <button onClick={check} disabled={!domain || loading} type="button"
            className="text-sm font-semibold px-5 rounded-lg transition-all disabled:opacity-40"
            style={{ background: "#2563EB", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>
            {loading ? "Checking…" : "Check"}
          </button>
        </div>
        <input
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="Optional: your DKIM selector (e.g. google, s1) — we'll also try common ones"
          className="w-full px-4 py-2.5 rounded-lg text-xs outline-none mb-8"
          style={{ background: "#0D1020", border: "1px solid #1D2340", color: "#8A94C0" }}
          spellCheck={false}
        />

        {error && (
          <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-sm" style={{ color: "#FCA5A5" }}>{error}</p>
          </div>
        )}

        {spfResult && (
          <div className="p-5 rounded-xl mb-4" style={{ background: "#0D1020", border: `1px solid ${spfResult.found && spfResult.issues.length === 0 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold" style={{ color: "#EEF2FF" }}>SPF</p>
              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: spfResult.found ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: spfResult.found ? "#10B981" : "#EF4444" }}>
                {spfResult.found ? "Found" : "Missing"}
              </span>
            </div>
            {spfResult.record && <p className="text-xs font-mono break-all mb-3" style={{ color: "#5B6899" }}>{spfResult.record}</p>}
            {spfResult.issues.map((issue, i) => (
              <p key={i} className="text-sm flex items-start gap-2 mb-1" style={{ color: "#8A94C0" }}><span style={{ color: "#F97316" }}>⚠</span> {issue}</p>
            ))}
          </div>
        )}

        {dmarcResult && (
          <div className="p-5 rounded-xl mb-4" style={{ background: "#0D1020", border: `1px solid ${dmarcResult.found && dmarcResult.issues.length === 0 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold" style={{ color: "#EEF2FF" }}>DMARC</p>
              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: dmarcResult.found ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: dmarcResult.found ? "#10B981" : "#EF4444" }}>
                {dmarcResult.found ? "Found" : "Missing"}
              </span>
            </div>
            {dmarcResult.record && <p className="text-xs font-mono break-all mb-3" style={{ color: "#5B6899" }}>{dmarcResult.record}</p>}
            {dmarcResult.issues.map((issue, i) => (
              <p key={i} className="text-sm flex items-start gap-2 mb-1" style={{ color: "#8A94C0" }}><span style={{ color: "#F97316" }}>⚠</span> {issue}</p>
            ))}
          </div>
        )}

        {spfResult && (
          <div className="p-5 rounded-xl mb-8" style={{ background: "#0D1020", border: `1px solid ${dkimResults.length ? "rgba(16,185,129,0.3)" : "#1D2340"}` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold" style={{ color: "#EEF2FF" }}>DKIM</p>
              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: dkimResults.length ? "rgba(16,185,129,0.15)" : "rgba(107,114,142,0.15)", color: dkimResults.length ? "#10B981" : "#8A94C0" }}>
                {dkimResults.length ? `${dkimResults.length} found` : "None found via common selectors"}
              </span>
            </div>
            {dkimResults.length > 0 ? (
              dkimResults.map((d) => (
                <div key={d.selector} className="mb-2">
                  <p className="text-xs font-semibold" style={{ color: "#5B6899" }}>Selector: {d.selector}</p>
                  <p className="text-xs font-mono break-all" style={{ color: "#5B6899" }}>{d.record}</p>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: "#8A94C0" }}>DKIM selectors aren&apos;t published in DNS the way SPF/DMARC are — enter your email provider&apos;s selector above if you know it, or check your email admin console (Google Workspace, Microsoft 365, etc.) for the exact record.</p>
            )}
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose-bz">
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Why Email Authentication Matters</h2>
          <p style={{ color: "#8A94C0" }}>
            SPF, DKIM, and DMARC together let receiving mail servers verify that an email claiming to be from your domain actually is. Without them, attackers can send phishing emails that appear to come from your company — a common tactic in business email compromise scams — and Gmail/Outlook increasingly send unauthenticated mail from your own domain straight to spam.
          </p>
          <p style={{ color: "#8A94C0" }}>
            As of 2024, Google and Yahoo require SPF, DKIM, and DMARC for any domain sending more than ~5,000 emails/day to their users, and apply stricter spam filtering to unauthenticated mail from smaller senders too.
          </p>

          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#EEF2FF" }}>Fixing What This Tool Finds</h2>
          <p style={{ color: "#8A94C0" }}>
            Add missing records through your DNS provider (the same place you manage your domain). Start DMARC at <code>p=none</code> to monitor without blocking anything, review the aggregate reports for a few weeks, then move to <code>p=quarantine</code> and eventually <code>p=reject</code> once you&apos;re confident all legitimate senders are covered.
          </p>
        </div>
      </div>
    </div>
  );
}
