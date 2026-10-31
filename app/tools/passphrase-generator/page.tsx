"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ToolShell, { box, btnStyle, mono } from "@/components/ToolShell";
import { WORDS } from "./words";

function pick(n: number) {
  const a = new Uint32Array(n); crypto.getRandomValues(a);
  return Array.from(a, (x) => WORDS[x % WORDS.length]);
}

export default function Page() {
  const [count, setCount] = useState(6);
  const [sep, setSep] = useState("-");
  const [caps, setCaps] = useState(true);
  const [num, setNum] = useState(true);
  const [phrase, setPhrase] = useState("");
  const [copied, setCopied] = useState(false);

  const gen = () => {
    let w = pick(count);
    if (caps) w = w.map((x) => x[0].toUpperCase() + x.slice(1));
    if (num) { const r = new Uint32Array(2); crypto.getRandomValues(r); w[r[0] % w.length] += String(r[1] % 100); }
    setPhrase(w.join(sep)); setCopied(false);
  };
  useEffect(gen, [count, sep, caps, num]); // eslint-disable-line react-hooks/exhaustive-deps

  const bits = Math.round(count * Math.log2(WORDS.length) + (num ? Math.log2(100) : 0));
  return (
    <ToolShell slug="passphrase-generator"
      intro={<p>A passphrase is several random words joined together — long enough to resist cracking, but far easier to type and remember than <code>x7#Qp!2v</code>. Words are drawn from a list of {WORDS.length} common English words using your browser&apos;s cryptographic random generator.</p>}
      howTo={[
        { h: "How strong is a passphrase?", p: <><p>Strength comes from how many words you pick and how big the word list is. Each word from a {WORDS.length}-word list adds about {Math.log2(WORDS.length).toFixed(1)} bits of entropy, so six words give roughly {Math.round(6 * Math.log2(WORDS.length))} bits — fine for online accounts that limit login attempts, especially with MFA. For a password manager master password or disk encryption, use seven words or more.</p><p>The words must be chosen randomly. A phrase you invent yourself, such as a song lyric or a favourite quote, is far weaker because attackers try those first.</p></> },
        { h: "When to use a passphrase vs a random password", p: <p>Use a passphrase for the few passwords you must type or remember: your password manager master password, your computer login, and your phone. For everything else, let a password manager create and store a random password — try our <Link href="/tools/password-generator" style={{ color: "#3B82F6" }}>password generator</Link>.</p> },
      ]}
      faq={[
        { q: "Are passphrases more secure than passwords?", a: "A long random passphrase can be as strong as or stronger than a short complex password, and it is easier to remember. What matters is total length and true randomness." },
        { q: "How many words should a passphrase have?", a: "With this word list, six random words is a sensible minimum for online accounts. Use seven or more for high-value secrets such as a password manager master password or disk encryption." },
        { q: "Is my passphrase sent anywhere?", a: "No. It is generated in your browser with crypto.getRandomValues and never transmitted or stored." },
      ]}>
      <div className="w-full px-5 py-4 rounded-xl text-lg break-all select-all mb-3" style={{ ...box, ...mono, color: "#EEF2FF", minHeight: "3.5rem" }}>{phrase}</div>
      <div className="flex gap-2 mb-6">
        <button type="button" onClick={gen} className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg" style={btnStyle}>↻ Generate new</button>
        <button type="button" onClick={async () => { await navigator.clipboard.writeText(phrase); setCopied(true); }} className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-lg" style={{ background: copied ? "#10B981" : "#1D2340", color: "#EEF2FF" }}>{copied ? "✓ Copied" : "Copy"}</button>
      </div>
      <div className="p-5 rounded-xl mb-4" style={box}>
        <div className="flex justify-between text-sm mb-2" style={{ color: "#CBD5F0" }}><span>Words</span><strong>{count}</strong></div>
        <input type="range" min={3} max={10} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm" style={{ color: "#8A94C0" }}>
        <label className="p-3 rounded-lg flex items-center gap-2" style={box}>Separator
          <select value={sep} onChange={(e) => setSep(e.target.value)} className="ml-auto rounded px-2 py-1" style={{ background: "#141833", color: "#EEF2FF" }}>
            <option value="-">-</option><option value=".">.</option><option value="_">_</option><option value=" ">space</option><option value="">none</option>
          </select></label>
        <label className="p-3 rounded-lg flex items-center gap-2 cursor-pointer" style={box}><input type="checkbox" checked={caps} onChange={(e) => setCaps(e.target.checked)} /> Capitalise words</label>
        <label className="col-span-2 p-3 rounded-lg flex items-center gap-2 cursor-pointer" style={box}><input type="checkbox" checked={num} onChange={(e) => setNum(e.target.checked)} /> Add a number to one word</label>
      </div>
      <p className="text-sm p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}>≈ {bits} bits of entropy</p>
    </ToolShell>
  );
}
