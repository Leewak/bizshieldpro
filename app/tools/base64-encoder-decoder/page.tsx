"use client";

import { useState } from "react";
import ToolShell, { inputCls, inputStyle, mono } from "@/components/ToolShell";

function enc(s: string, urlSafe: boolean) {
  const b = btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  return urlSafe ? b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b;
}
function dec(s: string) {
  let b = s.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  return new TextDecoder("utf-8", { fatal: false }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [err, setErr] = useState("");
  const go = (mode: "e" | "d") => {
    setErr("");
    try { setOutput(mode === "e" ? enc(input, urlSafe) : dec(input)); } catch { setOutput(""); setErr("That doesn't look like valid Base64."); }
  };
  return (
    <ToolShell slug="base64-encoder-decoder"
      intro={<p>Encode text to Base64 or decode Base64 back to readable text, with full UTF-8 support and a URL-safe option. Handy for reading encoded parts of suspicious emails, links and configuration files.</p>}
      howTo={[
        { h: "Base64 is encoding, not encryption", p: <p>Base64 just rewrites data using 64 safe characters so it can travel through email and URLs. Anyone can decode it — so never use it to hide passwords or secrets. Attackers sometimes use Base64 to disguise phishing links or scripts; decoding them here is a safe way to see what they contain without running anything.</p> },
      ]}
      faq={[
        { q: "Is Base64 secure?", a: "No. It is a reversible encoding that anyone can decode. Use proper encryption, such as our Text Encryption Tool, to protect secrets." },
        { q: "What is URL-safe Base64?", a: "A variant that replaces + and / with - and _ and drops = padding, so the result can be used safely in URLs and file names. JWTs use it." },
        { q: "Is my text sent to a server?", a: "No. Encoding and decoding happen in your browser." },
      ]}>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} placeholder="Paste text or Base64…" className={inputCls} style={{ ...inputStyle, ...mono }} />
      <div className="flex flex-wrap gap-2 my-3 items-center">
        <button type="button" onClick={() => go("e")} className="text-sm font-semibold px-4 py-2.5 rounded-lg" style={{ background: "#2563EB", color: "#fff" }}>Encode →</button>
        <button type="button" onClick={() => go("d")} className="text-sm font-semibold px-4 py-2.5 rounded-lg" style={{ background: "#1D2340", color: "#EEF2FF" }}>← Decode</button>
        <label className="text-sm flex items-center gap-2 ml-2" style={{ color: "#8A94C0" }}><input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} /> URL-safe</label>
      </div>
      {err && <p className="text-sm mb-2" style={{ color: "#EF4444" }}>{err}</p>}
      <textarea readOnly value={output} rows={5} placeholder="Result" className={inputCls} style={{ ...inputStyle, ...mono }} />
      {output && <button type="button" onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-xs" style={{ color: "#3B82F6" }}>Copy result</button>}
    </ToolShell>
  );
}
