"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolShell, { box, inputCls, inputStyle, mono } from "@/components/ToolShell";

function unfold(raw: string) { return raw.replace(/\r\n/g, "\n").replace(/\n[ \t]+/g, " "); }
function headers(raw: string) {
  const out: [string, string][] = [];
  for (const line of unfold(raw).split("\n")) { const m = line.match(/^([A-Za-z0-9-]+):\s*(.*)$/); if (m) out.push([m[1].toLowerCase(), m[2]]); }
  return out;
}
const addr = (s = "") => (s.match(/<([^>]+)>/)?.[1] ?? s.match(/[\w.+-]+@[\w.-]+/)?.[0] ?? "").toLowerCase();
const dom = (a: string) => a.split("@")[1] ?? "";

export default function Page() {
  const [raw, setRaw] = useState("");
  const r = useMemo(() => {
    if (!raw.trim()) return null;
    const h = headers(raw); const get = (k: string) => h.filter(([n]) => n === k).map(([, v]) => v);
    const auth = get("authentication-results").join(" ").toLowerCase();
    const res = (k: string) => (auth.match(new RegExp(`${k}=(\\w+)`))?.[1] ?? "not found");
    const from = addr(get("from")[0]), reply = addr(get("reply-to")[0]), ret = addr(get("return-path")[0]);
    const flags: string[] = [];
    if (reply && dom(reply) !== dom(from)) flags.push(`Reply-To (${reply}) goes to a different domain than From (${from}).`);
    if (ret && dom(ret) && dom(ret) !== dom(from)) flags.push(`Return-Path domain (${dom(ret)}) differs from From domain (${dom(from)}) — common for mailing services, suspicious for personal mail.`);
    for (const k of ["spf", "dkim", "dmarc"]) { const v = res(k); if (v !== "pass" && v !== "not found") flags.push(`${k.toUpperCase()} result is "${v}".`); }
    const hops = get("received").reverse().map((v) => {
      const fromHost = v.match(/from\s+([^\s(;]+)/i)?.[1] ?? "?"; const by = v.match(/by\s+([^\s(;]+)/i)?.[1] ?? "?";
      const ip = v.match(/\[(\d{1,3}(?:\.\d{1,3}){3}|[0-9a-f:]+)\]/i)?.[1] ?? ""; const date = v.split(";").pop()?.trim() ?? "";
      return { fromHost, by, ip, date };
    });
    return { subject: get("subject")[0] ?? "", from, reply, ret, spf: res("spf"), dkim: res("dkim"), dmarc: res("dmarc"), flags, hops, mid: get("message-id")[0] ?? "" };
  }, [raw]);
  const badge = (v: string) => ({ color: v === "pass" ? "#10B981" : v === "not found" ? "#5B6899" : "#EF4444" });
  return (
    <ToolShell slug="email-header-analyzer"
      intro={<p>Paste the full headers of an email to see where it really came from: the servers it passed through, whether SPF, DKIM and DMARC passed, and whether the reply address quietly goes somewhere else. In Gmail use <em>Show original</em>; in Outlook use <em>View message source</em> or <em>Message details</em>.</p>}
      howTo={[
        { h: "What to look for", p: <><p><strong>DMARC fail or SPF fail</strong> on mail claiming to be from a bank, supplier or colleague is a strong sign of spoofing. <strong>A Reply-To on another domain</strong> is a classic invoice-fraud trick: the email looks like it is from your supplier, but your reply goes to the attacker.</p><p>For the message body itself, run it through our <Link href="/tools/phishing-email-analyzer" style={{ color: "#3B82F6" }}>phishing email analyzer</Link>.</p></> },
      ]}
      faq={[
        { q: "Can email headers be faked?", a: "Some can. The From line and Received lines added by the sender can be forged, but the results added by your own mail provider (Authentication-Results) and the top Received lines are reliable." },
        { q: "Is it safe to paste headers here?", a: "Headers are parsed in your browser and not sent anywhere. They can contain names, email addresses and IPs, so avoid sharing them publicly." },
        { q: "What does DMARC=pass mean?", a: "The message passed SPF or DKIM in a way that is aligned with the domain in the From address, so the sender is authorised by that domain." },
      ]}>
      <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={8} placeholder="Paste raw email headers here (Received:, From:, Authentication-Results: …)" className={inputCls} style={{ ...inputStyle, ...mono, fontSize: 12 }} />
      {r && (
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-3 gap-2">
            {(["spf", "dkim", "dmarc"] as const).map((k) => (
              <div key={k} className="p-3 rounded-xl text-center" style={box}>
                <div className="text-xs" style={{ color: "#5B6899" }}>{k.toUpperCase()}</div>
                <div className="font-bold" style={badge(r[k])}>{r[k]}</div>
              </div>
            ))}
          </div>
          {r.flags.length ? r.flags.map((f) => <p key={f} className="text-sm p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}>⚠ {f}</p>)
            : <p className="text-sm p-3 rounded-lg" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}>No header red flags found. Still check links and requests in the message itself.</p>}
          <div className="p-4 rounded-xl text-sm" style={box}>
            {[["Subject", r.subject], ["From", r.from], ["Reply-To", r.reply || "—"], ["Return-Path", r.ret || "—"], ["Message-ID", r.mid]].map(([k, v]) => (
              <p key={k} className="break-all" style={{ color: "#CBD5F0" }}><span style={{ color: "#5B6899" }}>{k}: </span>{v}</p>))}
          </div>
          {r.hops.length > 0 && (
            <div className="p-4 rounded-xl" style={box}>
              <div className="text-xs mb-2" style={{ color: "#5B6899" }}>Delivery path (first hop at top)</div>
              {r.hops.map((h, i) => <p key={i} className="text-xs break-all mb-1" style={{ ...mono, color: "#CBD5F0" }}>{i + 1}. {h.fromHost} → {h.by} {h.ip && <span style={{ color: "#EAB308" }}>[{h.ip}]</span>} <span style={{ color: "#3A4570" }}>{h.date}</span></p>)}
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
