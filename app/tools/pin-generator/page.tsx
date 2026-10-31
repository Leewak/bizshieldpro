"use client";

import { useEffect, useState } from "react";
import ToolShell, { box, btnStyle, mono } from "@/components/ToolShell";

const WEAK = new Set(["1234", "0000", "1111", "1212", "7777", "1004", "2000", "4444", "2222", "6969", "9999", "3333", "5555", "6666", "1122", "1313", "8888", "4321", "2001", "1010", "123456", "000000", "111111", "654321", "121212", "112233"]);

function isWeak(p: string) {
  if (WEAK.has(p)) return true;
  if (/^(\d)\1+$/.test(p)) return true; // all same digit
  const asc = "01234567890123456789", desc = "98765432109876543210";
  if (asc.includes(p) || desc.includes(p)) return true; // straight runs
  if (p.length === 4 && /^(19[4-9]\d|20[0-3]\d)$/.test(p)) return true; // looks like a year
  if (p.length >= 4 && p.slice(0, p.length / 2) === p.slice(p.length / 2)) return true; // repeated halves
  return false;
}

function makePin(len: number) {
  for (;;) {
    const a = new Uint32Array(len); crypto.getRandomValues(a);
    const p = Array.from(a, (x) => String(x % 10)).join("");
    if (!isWeak(p)) return p;
  }
}

export default function Page() {
  const [len, setLen] = useState(6);
  const [howMany, setHowMany] = useState(5);
  const [pins, setPins] = useState<string[]>([]);
  const gen = () => setPins(Array.from({ length: howMany }, () => makePin(len)));
  useEffect(gen, [len, howMany]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ToolShell slug="pin-generator"
      intro={<p>Generate random PIN codes for phones, alarm panels, door locks and card readers. Patterns people commonly choose — <code>1234</code>, <code>0000</code>, repeated digits, straight runs and years like <code>1987</code> — are automatically rejected.</p>}
      howTo={[
        { h: "Why random PINs matter", p: <p>Most people pick PINs from a small set of memorable patterns, so attackers try those first. Studies of leaked PIN data consistently show a handful of codes such as 1234 and 0000 cover a large share of real PINs. A random PIN removes that shortcut, so a guesser is left with brute force — which phones and banking apps block after a few wrong attempts.</p> },
        { h: "4 or 6 digits?", p: <p>A 4-digit PIN has 10,000 combinations; a 6-digit PIN has 1,000,000. Use 6 digits wherever the device allows it, especially for phones that unlock your email, banking and authenticator apps.</p> },
      ]}
      faq={[
        { q: "Is a 6-digit PIN safe?", a: "A random 6-digit PIN is a good choice for phones and apps that lock or wipe after several wrong attempts. Avoid patterns, dates and repeated digits." },
        { q: "Can I use these PINs for bank cards?", a: "Yes, but set them through your bank's official app or ATM. Never type a card PIN into a website." },
        { q: "Are the PINs generated securely?", a: "Yes. They use your browser's cryptographic random number generator and are never sent anywhere." },
      ]}>
      <div className="grid gap-2 mb-4">
        {pins.map((p, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3 rounded-xl" style={box}>
            <span className="text-2xl tracking-[0.3em]" style={{ ...mono, color: "#EEF2FF" }}>{p}</span>
            <button type="button" onClick={() => navigator.clipboard.writeText(p)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "#1D2340", color: "#CBD5F0" }}>Copy</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={gen} className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg mb-4" style={btnStyle}>↻ Generate new PINs</button>
      <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: "#8A94C0" }}>
        <label className="p-3 rounded-lg" style={box}>Digits: <strong style={{ color: "#EEF2FF" }}>{len}</strong>
          <input type="range" min={4} max={12} value={len} onChange={(e) => setLen(Number(e.target.value))} className="w-full mt-2" /></label>
        <label className="p-3 rounded-lg" style={box}>How many: <strong style={{ color: "#EEF2FF" }}>{howMany}</strong>
          <input type="range" min={1} max={10} value={howMany} onChange={(e) => setHowMany(Number(e.target.value))} className="w-full mt-2" /></label>
      </div>
    </ToolShell>
  );
}
