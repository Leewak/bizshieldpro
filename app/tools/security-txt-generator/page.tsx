"use client";

import { useMemo, useState } from "react";
import ToolShell, { box, inputCls, inputStyle, mono } from "@/components/ToolShell";

export default function Page() {
  const [contact, setContact] = useState("mailto:security@example.com");
  const [expires, setExpires] = useState(() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().slice(0, 10); });
  const [lang, setLang] = useState("en");
  const [canonical, setCanonical] = useState("https://example.com/.well-known/security.txt");
  const [policy, setPolicy] = useState("");
  const [ack, setAck] = useState("");
  const [enc, setEnc] = useState("");
  const txt = useMemo(() => [
    ...contact.split(/\n|,/).map((c) => c.trim()).filter(Boolean).map((c) => `Contact: ${c}`),
    `Expires: ${new Date(expires + "T23:59:59Z").toISOString().replace(".000", "")}`,
    enc && `Encryption: ${enc}`, ack && `Acknowledgments: ${ack}`, lang && `Preferred-Languages: ${lang}`,
    canonical && `Canonical: ${canonical}`, policy && `Policy: ${policy}`,
  ].filter(Boolean).join("\n") + "\n", [contact, expires, lang, canonical, policy, ack, enc]);
  const f = (label: string, v: string, set: (s: string) => void, ph = "") => (
    <label className="block mb-3 text-sm" style={{ color: "#8A94C0" }}>{label}
      <input value={v} onChange={(e) => set(e.target.value)} placeholder={ph} className={`${inputCls} mt-1`} style={inputStyle} /></label>);
  return (
    <ToolShell slug="security-txt-generator" privacy={null}
      intro={<p>security.txt is a small text file (RFC 9116) that tells security researchers how to report a vulnerability in your website. Without it, a well-meaning person who finds a problem may not know who to contact — or may give up.</p>}
      howTo={[
        { h: "Where to put the file", p: <><p>Save the output as <code>security.txt</code> and publish it at <code>https://yourdomain/.well-known/security.txt</code> (served as plain text over HTTPS). The <strong>Contact</strong> and <strong>Expires</strong> fields are required; set a reminder to update the expiry date before it passes.</p><p>Use a monitored mailbox or form for Contact, and decide in advance who triages reports.</p></> },
      ]}
      faq={[
        { q: "Is security.txt required?", a: "Not by law in most places, but it is a widely adopted standard and a cheap way to receive vulnerability reports instead of having them published or ignored." },
        { q: "What should Expires be?", a: "A date less than a year ahead is recommended, so stale contact details don't linger. Renew it regularly." },
        { q: "Should I sign the file?", a: "Optionally, with OpenPGP clear-signing, so researchers can verify it wasn't tampered with." },
      ]}>
      {f("Contact (mailto: or https:, one per line or comma-separated)", contact, setContact)}
      <label className="block mb-3 text-sm" style={{ color: "#8A94C0" }}>Expires
        <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={`${inputCls} mt-1`} style={inputStyle} /></label>
      {f("Preferred languages", lang, setLang, "en, de")}
      {f("Canonical URL", canonical, setCanonical)}
      {f("Policy URL (optional)", policy, setPolicy, "https://example.com/security-policy")}
      {f("Acknowledgments URL (optional)", ack, setAck, "https://example.com/hall-of-fame")}
      {f("Encryption key URL (optional)", enc, setEnc, "https://example.com/pgp-key.txt")}
      <div className="p-4 rounded-xl" style={box}>
        <div className="flex justify-between text-xs mb-2" style={{ color: "#5B6899" }}><span>/.well-known/security.txt</span>
          <span className="flex gap-3"><button type="button" onClick={() => navigator.clipboard.writeText(txt)} style={{ color: "#3B82F6" }}>Copy</button>
          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(txt)}`} download="security.txt" style={{ color: "#3B82F6" }}>Download</a></span></div>
        <pre className="text-xs whitespace-pre-wrap break-all" style={{ ...mono, color: "#CBD5F0" }}>{txt}</pre>
      </div>
    </ToolShell>
  );
}
