"use client";

import { useMemo, useState } from "react";
import ToolShell, { box, inputCls, inputStyle, mono } from "@/components/ToolShell";

function b64url(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "=";
  return new TextDecoder().decode(Uint8Array.from(atob(b), (c) => c.charCodeAt(0)));
}
const fmtTime = (n: unknown) => (typeof n === "number" ? new Date(n * 1000).toLocaleString() : "—");

export default function Page() {
  const [tok, setTok] = useState("");
  const res = useMemo(() => {
    const t = tok.trim(); if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2) return { error: "A JWT has three parts separated by dots." };
    try {
      const header = JSON.parse(b64url(parts[0])); const payload = JSON.parse(b64url(parts[1]));
      const warn: string[] = [];
      const alg = String(header.alg ?? "");
      if (!alg || alg.toLowerCase() === "none") warn.push("alg is 'none' — the token is unsigned and must never be accepted.");
      if (alg.startsWith("HS")) warn.push("HMAC (shared secret) signature: anyone with the secret can mint tokens. Keep the secret long and server-side.");
      if (!payload.exp) warn.push("No exp (expiry) claim — the token never expires.");
      else if (payload.exp * 1000 < Date.now()) warn.push("Token has expired.");
      if (parts[2] === undefined || parts[2] === "") warn.push("No signature part present.");
      return { header, payload, warn };
    } catch { return { error: "Could not decode — check the token was copied completely." }; }
  }, [tok]);
  return (
    <ToolShell slug="jwt-decoder"
      intro={<p>Paste a JSON Web Token to read its header and payload, see when it was issued and when it expires, and spot risky settings. Decoding happens in your browser — but treat real tokens like passwords and avoid pasting live production tokens into any website.</p>}
      privacy="Decoded locally — the token is never sent anywhere"
      howTo={[
        { h: "Decoding is not verifying", p: <p>Anyone can read a JWT&apos;s header and payload because they are only Base64URL-encoded. What makes a token trustworthy is its signature, which your server must verify with the correct key and an allow-list of algorithms. This tool does not verify signatures — it helps you inspect claims such as <code>sub</code>, <code>aud</code>, <code>iat</code> and <code>exp</code>.</p> },
      ]}
      faq={[
        { q: "Is it safe to paste a JWT here?", a: "The token is decoded only in your browser. Still, a valid token can grant access to an account, so prefer test or expired tokens and never share live ones." },
        { q: "Why is alg:none dangerous?", a: "It means the token is unsigned. A server that accepts it lets anyone forge tokens. Servers should reject 'none' and only accept the algorithms they expect." },
        { q: "Can I put secrets in a JWT payload?", a: "No. The payload is readable by anyone who has the token. Store only identifiers and claims, not passwords or personal data." },
      ]}>
      <textarea value={tok} onChange={(e) => setTok(e.target.value)} rows={4} placeholder="eyJhbGciOi…" className={inputCls} style={{ ...inputStyle, ...mono }} />
      {res && "error" in res && <p className="mt-3 text-sm" style={{ color: "#EF4444" }}>{res.error}</p>}
      {res && !("error" in res) && (
        <div className="mt-4 grid gap-3">
          {res.warn.map((w) => <p key={w} className="text-sm p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}>⚠ {w}</p>)}
          <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: "#8A94C0" }}>
            {[["Issued", fmtTime(res.payload.iat)], ["Not before", fmtTime(res.payload.nbf)], ["Expires", fmtTime(res.payload.exp)]].map(([k, v]) => <div key={k} className="p-3 rounded-lg" style={box}>{k}<br /><strong style={{ color: "#EEF2FF" }}>{v}</strong></div>)}
          </div>
          {[["Header", res.header], ["Payload", res.payload]].map(([k, v]) => (
            <div key={k as string} className="p-4 rounded-xl" style={box}>
              <div className="text-xs mb-2" style={{ color: "#5B6899" }}>{k as string}</div>
              <pre className="text-xs whitespace-pre-wrap break-all" style={{ ...mono, color: "#CBD5F0" }}>{JSON.stringify(v, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
