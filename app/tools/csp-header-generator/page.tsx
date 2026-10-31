"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolShell, { box, inputStyle, mono } from "@/components/ToolShell";

const DIRS = [
  { k: "default-src", d: "'self'", help: "Fallback for everything not listed" },
  { k: "script-src", d: "'self'", help: "JavaScript sources (add analytics/CDN hosts)" },
  { k: "style-src", d: "'self'", help: "Stylesheets (add 'unsafe-inline' only if needed)" },
  { k: "img-src", d: "'self' data:", help: "Images" },
  { k: "font-src", d: "'self'", help: "Web fonts" },
  { k: "connect-src", d: "'self'", help: "fetch/XHR/WebSocket endpoints" },
  { k: "frame-src", d: "'none'", help: "Sites you embed in iframes" },
  { k: "object-src", d: "'none'", help: "Plugins — keep 'none'" },
  { k: "base-uri", d: "'self'", help: "Restricts <base> tag" },
  { k: "form-action", d: "'self'", help: "Where forms may submit" },
  { k: "frame-ancestors", d: "'none'", help: "Who may embed your site (clickjacking)" },
];

export default function Page() {
  const [vals, setVals] = useState<Record<string, string>>(Object.fromEntries(DIRS.map((x) => [x.k, x.d])));
  const [upgrade, setUpgrade] = useState(true);
  const [reportOnly, setReportOnly] = useState(true);
  const policy = useMemo(() => [...DIRS.filter((x) => vals[x.k].trim()).map((x) => `${x.k} ${vals[x.k].trim()}`), ...(upgrade ? ["upgrade-insecure-requests"] : [])].join("; "), [vals, upgrade]);
  const name = reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
  const outs = [
    ["HTTP header", `${name}: ${policy}`],
    ["Nginx", `add_header ${name} "${policy}" always;`],
    ["Apache", `Header always set ${name} "${policy}"`],
    ...(!reportOnly ? [["HTML meta tag", `<meta http-equiv="Content-Security-Policy" content="${policy.replace(/; ?frame-ancestors[^;]*/, "")}">`]] : []),
  ];
  return (
    <ToolShell slug="csp-header-generator" privacy={null}
      intro={<p>A Content-Security-Policy tells browsers which sources of scripts, styles, images and frames your site trusts, so injected scripts (XSS) can&apos;t run. Start from the safe defaults below, add the third-party hosts your site really uses, and copy the result.</p>}
      howTo={[
        { h: "Roll it out safely", p: <><p>Start in <strong>Report-Only</strong> mode: the browser logs violations in the developer console without blocking anything. Fix every legitimate source that shows up, then switch to enforcing mode. Avoid <code>&apos;unsafe-inline&apos;</code> and <code>&apos;unsafe-eval&apos;</code> in script-src where you can — they weaken most of the protection.</p><p>Check the live result with our <Link href="/tools/security-headers-checker" style={{ color: "#3B82F6" }}>security headers checker</Link>.</p></> },
      ]}
      faq={[
        { q: "Will a CSP break my website?", a: "It can if you forget a source your site uses, which is why you should test in Report-Only mode first." },
        { q: "Can I set frame-ancestors in a meta tag?", a: "No. frame-ancestors only works as an HTTP header, so it is removed from the meta-tag version." },
        { q: "Do I still need X-Frame-Options?", a: "frame-ancestors replaces it in modern browsers. Keeping X-Frame-Options: DENY as well is harmless for older ones." },
      ]}>
      <div className="grid gap-2 mb-4">
        {DIRS.map((x) => (
          <label key={x.k} className="p-3 rounded-xl" style={box}>
            <div className="flex justify-between text-xs mb-1"><span style={{ ...mono, color: "#EEF2FF" }}>{x.k}</span><span style={{ color: "#5B6899" }}>{x.help}</span></div>
            <input value={vals[x.k]} onChange={(e) => setVals({ ...vals, [x.k]: e.target.value })} className="w-full px-3 py-2 rounded-lg text-xs" style={{ ...inputStyle, ...mono }} />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-sm mb-4" style={{ color: "#8A94C0" }}>
        <label className="flex items-center gap-2"><input type="checkbox" checked={upgrade} onChange={(e) => setUpgrade(e.target.checked)} /> upgrade-insecure-requests</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={reportOnly} onChange={(e) => setReportOnly(e.target.checked)} /> Report-Only (test mode)</label>
      </div>
      {outs.map(([k, v]) => (
        <div key={k} className="p-4 rounded-xl mb-2" style={box}>
          <div className="flex justify-between text-xs mb-2" style={{ color: "#5B6899" }}><span>{k}</span><button type="button" onClick={() => navigator.clipboard.writeText(v)} style={{ color: "#3B82F6" }}>Copy</button></div>
          <pre className="text-xs whitespace-pre-wrap break-all" style={{ ...mono, color: "#CBD5F0" }}>{v}</pre>
        </div>
      ))}
    </ToolShell>
  );
}
