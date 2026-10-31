"use client";

import { useState } from "react";
import ToolShell, { box, inputCls, inputStyle, mono } from "@/components/ToolShell";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");

export default function Page() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [out, setOut] = useState<Record<string, string>>({});
  const [compare, setCompare] = useState("");

  const run = async (data: ArrayBuffer) => {
    const r: Record<string, string> = {};
    for (const a of ALGOS) r[a] = hex(await crypto.subtle.digest(a, data));
    setOut(r);
  };
  const cmp = compare.trim().toLowerCase();
  const match = cmp ? Object.entries(out).find(([, v]) => v === cmp)?.[0] : undefined;

  return (
    <ToolShell slug="hash-generator"
      intro={<p>Create SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text or file. Use it to check that a download matches the checksum published by the vendor, so you know the file wasn&apos;t tampered with.</p>}
      howTo={[
        { h: "How to verify a download", p: <><p>Software vendors often publish a SHA-256 checksum next to the download link. Choose the downloaded file below, paste the published checksum into the compare box, and the tool tells you whether it matches. If it does not, delete the file and download it again from the official site.</p><p>Files are read locally by your browser; large files may take a few seconds.</p></> },
        { h: "Which algorithm should I use?", p: <p>Use SHA-256 or stronger. SHA-1 is shown only for compatibility with older checksums — it is no longer considered collision-resistant. MD5 is not offered for the same reason. Note that a fast hash like SHA-256 is not suitable for storing passwords; password storage needs a slow algorithm such as Argon2 or bcrypt.</p> },
      ]}
      faq={[
        { q: "Can a hash be reversed?", a: "No. A cryptographic hash is one-way. Short or common inputs can still be guessed by trying candidates, which is why passwords need slow, salted hashing." },
        { q: "Is my file uploaded?", a: "No. The file is read and hashed inside your browser using the Web Crypto API." },
        { q: "Why does my hash not match?", a: "Make sure you compare the same algorithm, that the file finished downloading, and that you copied the published checksum without spaces." },
      ]}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Type or paste text to hash…" className={inputCls} style={inputStyle} />
      <div className="flex flex-wrap gap-2 mt-3 mb-5">
        <button type="button" onClick={() => { setFileName(""); run(new TextEncoder().encode(text).buffer as ArrayBuffer); }} className="text-sm font-semibold px-4 py-2.5 rounded-lg" style={{ background: "#2563EB", color: "#fff" }}>Hash text</button>
        <label className="text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer" style={{ background: "#1D2340", color: "#EEF2FF" }}>
          Choose a file…<input type="file" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); run(await f.arrayBuffer()); } }} />
        </label>
        {fileName && <span className="text-xs self-center" style={{ color: "#5B6899" }}>{fileName}</span>}
      </div>
      {Object.keys(out).length > 0 && (
        <div className="grid gap-2 mb-5">
          {ALGOS.map((a) => (
            <div key={a} className="p-3 rounded-xl" style={{ ...box, borderColor: match === a ? "#10B981" : "#1D2340" }}>
              <div className="flex justify-between text-xs mb-1" style={{ color: "#5B6899" }}><span>{a}</span><button type="button" onClick={() => navigator.clipboard.writeText(out[a])} style={{ color: "#3B82F6" }}>Copy</button></div>
              <div className="text-xs break-all" style={{ ...mono, color: "#CBD5F0" }}>{out[a]}</div>
            </div>
          ))}
        </div>
      )}
      <input value={compare} onChange={(e) => setCompare(e.target.value)} placeholder="Paste a published checksum to compare (optional)" className={inputCls} style={inputStyle} />
      {cmp && Object.keys(out).length > 0 && (
        <p className="mt-3 text-sm font-semibold" style={{ color: match ? "#10B981" : "#EF4444" }}>{match ? `✓ Matches the ${match} hash` : "✗ No match — do not trust this file"}</p>
      )}
    </ToolShell>
  );
}
