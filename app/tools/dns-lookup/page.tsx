"use client";

import { useState } from "react";
import Link from "next/link";
import ToolShell, { box, inputCls, inputStyle, mono } from "@/components/ToolShell";

const TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "CAA"] as const;
type Ans = { name: string; type: number; TTL: number; data: string };

export default function Page() {
  const [domain, setDomain] = useState("");
  const [res, setRes] = useState<Record<string, Ans[] | string>>({});
  const [busy, setBusy] = useState(false);
  const run = async () => {
    const d = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) { setRes({ error: "Enter a domain like example.com" }); return; }
    setBusy(true);
    const out: Record<string, Ans[] | string> = {};
    await Promise.all(TYPES.map(async (t) => {
      try {
        const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(d)}&type=${t}`, { headers: { accept: "application/dns-json" } });
        const j = await r.json();
        out[t] = j.Answer?.filter((a: Ans) => a.data) ?? [];
      } catch { out[t] = "lookup failed"; }
    }));
    setRes(out); setBusy(false);
  };
  return (
    <ToolShell slug="dns-lookup" privacy="Queries go to Cloudflare's public DNS-over-HTTPS resolver, encrypted"
      intro={<p>See the DNS records for any domain: where its website points (A/AAAA), which servers receive its email (MX), its verification and email-security records (TXT), name servers (NS), aliases (CNAME) and which certificate authorities may issue certificates for it (CAA).</p>}
      howTo={[
        { h: "What to check for security", p: <><p><strong>TXT:</strong> look for an SPF record (<code>v=spf1</code>) and a DMARC record on <code>_dmarc.yourdomain</code> — together they stop attackers sending email as you. Our <Link href="/tools/dmarc-spf-checker" style={{ color: "#3B82F6" }}>SPF/DKIM/DMARC checker</Link> grades them for you.</p><p><strong>CAA:</strong> limits which certificate authorities can issue HTTPS certificates for your domain. <strong>NS:</strong> unexpected name servers can be a sign of a hijacked domain.</p></> },
      ]}
      faq={[
        { q: "Why are my DNS changes not showing?", a: "Resolvers cache records for the TTL shown (in seconds). After a change, old answers can persist until the TTL expires." },
        { q: "What is DNS-over-HTTPS?", a: "A way of sending DNS lookups inside encrypted HTTPS, so networks between you and the resolver cannot read or tamper with them." },
        { q: "Can I look up subdomains?", a: "Yes — enter the full name, for example mail.example.com or _dmarc.example.com." },
      ]}>
      <div className="flex gap-2">
        <input value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="example.com" className={inputCls} style={inputStyle} />
        <button type="button" onClick={run} disabled={busy} className="text-sm font-semibold px-5 rounded-xl disabled:opacity-50" style={{ background: "#2563EB", color: "#fff" }}>{busy ? "…" : "Look up"}</button>
      </div>
      {typeof res.error === "string" && <p className="mt-3 text-sm" style={{ color: "#EF4444" }}>{res.error}</p>}
      <div className="grid gap-2 mt-4">
        {TYPES.filter((t) => t in res).map((t) => (
          <div key={t} className="p-4 rounded-xl" style={box}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#3B82F6" }}>{t}</div>
            {typeof res[t] === "string" ? <p className="text-xs" style={{ color: "#EF4444" }}>{res[t] as string}</p>
              : (res[t] as Ans[]).length === 0 ? <p className="text-xs" style={{ color: "#5B6899" }}>No records</p>
              : (res[t] as Ans[]).map((a, i) => <p key={i} className="text-xs break-all" style={{ ...mono, color: "#CBD5F0" }}>{a.data} <span style={{ color: "#3A4570" }}>TTL {a.TTL}</span></p>)}
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
